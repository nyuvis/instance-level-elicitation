import * as d3_array from "d3-array";
import * as d3_all from "d3";

const d3 = {...d3_all, ...d3_array,};

export { sample };


function sample(dataset, samplingStrategy, numberOfInstances) {
  if (samplingStrategy === 'Least confidence') {
    return leastConfidenceSampling(dataset, numberOfInstances);
  } else if (samplingStrategy === 'Random') {
    return randomSampling(dataset, numberOfInstances);
  } else if (samplingStrategy === 'Mixed confidence') {
    return mixedConfidenceSampling(dataset, numberOfInstances);
  } else {
    return mixedConfidenceSampling(dataset, numberOfInstances);
  }
}


function mixedConfidenceSampling(dataset, numberOfInstances) {
  const data = Array.from(d3.zip(d3.range(dataset.length), dataset),
      ([index, instance]) => ({ index, instance }))
    .sort((a, b) => d3.ascending(a.instance['confidence'], b.instance['confidence']));

  const numLow = Math.ceil(numberOfInstances / 2);
  const numHigh = numberOfInstances - numLow;

  const low = data.slice(0, numLow);
  const high = data.slice(-numHigh);

  const indices = low.concat(high).map(d => d.index);

  return d3.shuffle(indices);
}


function leastConfidenceSampling(dataset, numberOfInstances) {
  const data = Array.from(d3.zip(d3.range(dataset.length), dataset),
    ([index, instance]) => ({ index, instance }));

  const indices = data.sort((a, b) => d3.ascending(a.instance['confidence'], b.instance['confidence']))
    .slice(0, numberOfInstances)
    .map(d => d.index);

  return d3.shuffle(indices);
}


function randomSampling(dataset, numberOfInstances) {
  return d3.shuffle(d3.range(dataset.length)).slice(0, numberOfInstances);
}