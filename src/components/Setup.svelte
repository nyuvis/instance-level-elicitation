<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import * as d3 from "d3";

  const dispatch = createEventDispatcher();

  const samplingStrategies = [
    'Least confidence',
    'Mixed confidence',
    'Random',
  ];

  let datasets = [];
  let selectedDemoDataset;
  let selectedSamplingStrategy;
  let numberOfInstances = 1;

  function onBegin() {
    d3.csv(selectedDemoDataset.path, d3.autoType).then(data => {
      data.labels = Array.from(new Set(data.map(d => d['label']))).sort();
      data.type = selectedDemoDataset.type;

      dispatch('complete', {
        dataset: data,
        numberOfInstances: Math.min(Math.max(1, numberOfInstances), data.length),
        samplingStrategy: selectedSamplingStrategy,
      });
    })
  }

  onMount(async () => {
    d3.csv('../datasets/datasets.csv').then(d => {
      datasets = d;
      selectedDemoDataset = datasets[0];
    });
  });
</script>

<div class="content">
  <h1>Instance-level Elicitation</h1>
  <h2>Setup</h2>

  <div class="section">
    <label for="dataset-selector">Dataset</label>
    <select id="dataset-selector" name="dataset-selector" bind:value={selectedDemoDataset}>
      {#each datasets as dataset}
        <option value={dataset}>{dataset.name}</option>
      {/each}
    </select>
  </div>

  <div class="section">
    <label for="sampling-selector">Sampling Strategy</label>
    <select id="sampling-selector" name="sampling-selector" bind:value={selectedSamplingStrategy}>
      {#each samplingStrategies as strategy}
        <option value={strategy}>{strategy}</option>
      {/each}
    </select>
  </div>

  <div class="section">
    <label for="number-of-instances">Number of instances</label>
    <input type="number" min="1"
      name="number-of-instances" id="number-of-instances"
      bind:value={numberOfInstances}
    >
  </div>

  <div class="section">
    <button on:click={onBegin}>Begin</button>
  </div>
</div>

<style>
  h1 {
    margin-top: 0;
  }

  label {
    display: block;
  }
</style>