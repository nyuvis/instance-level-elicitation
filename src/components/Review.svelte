<script>
  import { createEventDispatcher } from 'svelte';
  import * as d3_array from "d3-array";
  import * as d3_all from "d3";

  const d3 = {...d3_all, ...d3_array};

  const dispatch = createEventDispatcher();
  const format = d3.format('.2');

  export let results;

  function onClickRestart() {
    dispatch('complete');
  }
</script>

<div class="container">
  <div class="content">
    <div class="section">
      <button on:click={onClickRestart}>Restart</button>
    </div>
  </div>
</div>

<style>
  .section {
    margin: 0.5em 0;
  }
</style>
