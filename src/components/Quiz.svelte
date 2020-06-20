<script>
  import { createEventDispatcher } from 'svelte';
  import * as d3_array from "d3-array";
  import * as d3_all from "d3";

  import { sample } from '../sampling.js';

  const d3 = {...d3_all, ...d3_array};

  const dispatch = createEventDispatcher();

  export let dataset;
  export let numberOfInstances;
  export let samplingStrategy;
  export let confidenceScale;

  $: indices = sample(dataset, samplingStrategy, numberOfInstances);

  $: features = dataset.columns.filter(d => d !== 'label'
      && d !== 'prediction'
      && d !== 'confidence');

  let index = 0;
  $: instance = dataset[indices[index]];

  let guess = null;
  let confidence = null;

  let showQuestions = true;

  $: canSubmit = guess !== null && confidence !== null;

  let results = [];

  function onSubmitAnswers() {
    showQuestions = false;
  }

  function addResult() {
    results.push({
      instance,
      guess,
      confidence
    });
  }

  function onClickNext() {
    addResult();
    index +=1;
    guess = null;
    confidence = null;
    showQuestions = true;
  }

  function onClickComplete() {
    addResult();
    dispatch('complete', {
      results
    });
  }
</script>

<div class="content">
  <div class="section">Instance {index + 1} of {numberOfInstances}:</div>
  {#if dataset.type === "text"}
    <div class="section instance text">
      {instance['text']}
    </div>
  {:else}
    <div class="section instance">
      <table>
        <thead>
          <th>Feature</th>
          <th>Value</th>
        </thead>
        <tbody>
          {#each features as feature}
            <tr>
              <td>{feature}</td>
              <td class={isNaN(instance[feature]) ? "left-align" : "right-align"}>
                {instance[feature]}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  {#if showQuestions}
    <div class="section">
      <div class="label">What is the class for this instance?</div>
      {#each dataset.labels as label, i}
        <div class="radio-horizontal">
          <input type="radio" name="class-{i}" id="class-{i}" bind:group={guess} value={label}>
          <label for="class-{i}">{label}</label>
        </div>
      {/each}
    </div>

    <div class="section">
      <div class="label">What is your level of confidence that you chose the correct class?</div>
      <div class="confidence">
        {#each confidenceScale.range() as label, i}
          <div class="radio-vertical">
            <input type="radio" name="confidence-{i}" id="confidence-{i}"
              bind:group={confidence} value={label}>
            <label for="confidence-{i}">{label}</label>
          </div>
        {/each}
      </div>
    </div>

    <div class="section">
      <button disabled={!canSubmit} on:click={onSubmitAnswers}>Submit</button>
    </div>
  {:else}
    <div class="section">Ground truth: {instance['label']}</div>

    <div class="section">
      <table>
        <thead>
          <th>Predictor</th>
          <th>Prediction</th>
          <th>Confidence</th>
        </thead>
        <tbody class="left-align">
          <tr>
            <td>You</td>
            <td>{guess}</td>
            <td>{confidence}</td>
          </tr>
          <tr>
            <td>ML model</td>
            <td>{instance['prediction']}</td>
            <td>{confidenceScale(instance['confidence'])}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      {#if index < numberOfInstances - 1}
        <button on:click={onClickNext}>Next</button>
      {:else}
        <button on:click={onClickComplete}>Complete</button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    width: 40em;
    max-width: 40em;
  }

  .instance {
    overflow-y: auto;
    min-height: 0px;
  }

  .content > .section {
    margin-top: 0;
  }

  .text {
    line-height: 1.3;
  }

  table {
    border-spacing: 1em 0;
  }

  th {
    font-weight: 500;
    text-align: left;
  }

  .left-align {
    text-align: left;
  }

  .right-align {
    text-align: right;
  }

  .radio-horizontal {
    display: flex;
    align-items: center;
  }

  .radio-horizontal > input[type="radio"] {
    margin-top: 0;
  }

  .radio-vertical {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex: 1;
  }

  .radio-vertical > input[type="radio"] {
    margin: 0;
  }

  .confidence {
    display: flex;
  }

  .label {
    margin-bottom: 0.5em;
  }
</style>