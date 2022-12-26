import { WebGLRenderer } from 'https://unpkg.com/three/build/three.module.js';

function webWorkerRender(data) {
  const {canvas} = data
  const renderer = new WebGLRenderer({canvas})
  renderer.render(scene, camera)
}

self.onmessage = (event) => {
  webWorkerRender(event.data)
};