<script>
  import Setup from './Setup.svelte';
  import Quiz from './Quiz.svelte';
  import Review from './Review.svelte';

  let states = {
    SETUP: 0,
    QUIZ: 1,
    REVIEW: 2,
  }

  let state = states.SETUP;

  let numberOfInstances;
  let dataset;
  let results;

  function setupComplete(event) {
    ({numberOfInstances, dataset} = event.detail);
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

{#if state === states.SETUP}
  <Setup on:complete={setupComplete}/>
{:else if state === states.QUIZ}
  <Quiz {dataset} {numberOfInstances} on:complete={quizComplete}/>
{:else}
  <Review {results} on:complete={reviewComplete}/>
{/if}