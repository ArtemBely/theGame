import { SphereGeometry } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.148.0/three.module.min.js';

self.onmessage = (event) => {
  if (event.data.type === 'tangents') {
    const geometry = new SphereGeometry(1, 280, 280)
    geometry.computeTangents();
    const tangent = geometry.attributes.tangent.array
    self.postMessage({type: 'tangents', object: tangent});
  } 
};
