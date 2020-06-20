<script>
  import { createEventDispatcher } from 'svelte';

  import * as d3_array from "d3-array";
  import * as d3_all from "d3";

  const d3 = {...d3_all, ...d3_array};

  const dispatch = createEventDispatcher();

  export let confidenceScale;
  export let results;

  function onClickRestart() {
    dispatch('complete');
  }
</script>

<div class="container">
  <div class="content">
    <div class="section">
      <h2>Review</h2>
    </div>

    <div class="section">
      <button on:click={onClickRestart}>Restart</button>
    </div>

    <div class="section results">
      <table>
        <thead class="left-align">
          <th>Order</th>
          <th>Ground Truth</th>
          <th>Your Prediction</th>
          <th>Your Confidence</th>
          <th>Model Prediction</th>
          <th>Model Confidence</th>
        </thead>

        <tbody>
          {#each results as {instance, guess, confidence}, i}
            <tr>
              <td>{i + 1}</td>
              <td>{instance['label']}</td>
              <td>{guess}</td>
              <td>{confidence}</td>
              <td>{instance['prediction']}</td>
              <td>{confidenceScale(instance['confidence'])}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  .container {
    height: 100vh;
    display: flex;
    justify-content: center;
  }

  .content {
    display: flex;
    flex-direction: column;
  }

  .section {
    margin: 0.5em 0;
  }

  .results {
    flex: 1 1 1px;
    overflow-y: scroll;
  }

  table {
    position: relative;
  }

  /* https://stackoverflow.com/a/58563703 */
  th {
    font-weight: 500;
    position: sticky;
    top: 0;
    background: white;
  }

  table {
    border-spacing: 1em 0;
  }

  .left-align {
    text-align: left;
  }
</style>
