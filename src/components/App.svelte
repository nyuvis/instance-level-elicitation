<script>
  import Setup from './Setup.svelte';
  import Quiz from './Quiz.svelte';
  import Review from './Review.svelte';

  import { scaleQuantize } from "d3-scale";
  import { extent } from "d3-array";

  const states = {
    SETUP: 0,
    QUIZ: 1,
    REVIEW: 2,
  };

  const confidenceScale = scaleQuantize()
    .range(['none', 'low', 'moderate', 'high']);

  let state = states.SETUP;

  let numberOfInstances;
  let dataset;
  let samplingStrategy;
  let results;

  function setupComplete(event) {
    ({numberOfInstances, dataset, samplingStrategy} = event.detail);
    confidenceScale.domain([1 / dataset.labels.length, 1]);
    state = states.QUIZ;
  }

  function quizComplete(event) {
    results = event.detail.results;
    state = states.REVIEW;
  }

  function reviewComplete(event) {
    state = states.SETUP;
  }
</script>

<div class="container">
  {#if state === states.SETUP}
    <Setup on:complete={setupComplete}/>
  {:else if state === states.QUIZ}
    <Quiz {dataset} {numberOfInstances} {samplingStrategy} {confidenceScale} on:complete={quizComplete}/>
  {:else}
    <Review {results} {confidenceScale} on:complete={reviewComplete}/>
  {/if}
</div>

<style>
  .container {
    width: 100vw;
    height: 100vh;

    padding: 3em;
    box-sizing: border-box;

    display: flex;
    justify-content: center;
  }
</style>