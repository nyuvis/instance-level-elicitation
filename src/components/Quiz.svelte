<script>
  import { createEventDispatcher } from 'svelte';
  import * as d3_array from "d3-array";
  import * as d3_all from "d3";

  const d3 = {...d3_all, ...d3_array};

  const dispatch = createEventDispatcher();
  const format = d3.format('.2');

  export let dataset;
  export let numberOfInstances;

  $: indices = d3.shuffle(d3.range(dataset.length)).slice(0, numberOfInstances);
  $: features = dataset.columns.filter(d => d !== 'label'
      && d !== 'prediction'
      && d !== 'confidence');
  $: labels = Array.from(new Set(dataset.map(d => d['label']))).sort();

  let index = 0;
  $: instance = dataset[indices[index]];

  let confidenceLabels = ['none', 'low', 'moderate', 'high'];

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

<div class="container">
  <div class="content">
    <div class="section">Instance {index + 1} of {numberOfInstances}.</div>

    <div class="section">
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

    {#if showQuestions}
      <div class="section">
        <div class="label">What is the class for this instance?</div>
        {#each labels as label}
          <label class="block">
            <input type="radio" bind:group={guess} value={label}>
            {label}
          </label>
        {/each}
      </div>

      <div class="section">
        <div class="label">What is your level of confidence that you chose the correct class?</div>
        <div class="confidence">
          {#each confidenceLabels as label, i}
            <div class="radio-option">
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

      <table>
        <thead>
          <th>Predictor</th>
          <th>Guess</th>
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
            <td>{format(instance['confidence'])}</td>
          </tr>
        </tbody>
      </table>

      <div class="section">
        {#if index < numberOfInstances - 1}
          <button on:click={onClickNext}>Next</button>
        {:else}
          <button on:click={onClickComplete}>Complete</button>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
  }

  .content {
    width: 600px;
    display: flex;
    flex-direction: column;
  }

  .block {
    display: block;
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

  .section {
    margin: 0.5em 0;
  }

  .radio-option {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    flex: 1;
  }

  .confidence {
    display: flex;
  }

  .label {
    margin-bottom: 0.5em;
  }
</style>