import {  SphereGeometry } from 'https://unpkg.com/three/build/three.module.js';

self.onmessage = (event) => {
  if (event.data.type === 'tangents') {
    const geometry = new SphereGeometry(1, 250, 250)
    geometry.computeTangents();
    const tangent = geometry.attributes.tangent.array
    self.postMessage({type: 'tangents', object: tangent});
  } 
};
