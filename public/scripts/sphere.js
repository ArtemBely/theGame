import {  
        Scene, 
        PerspectiveCamera,
        TextureLoader,
        SphereGeometry,
        ShaderMaterial,
        Mesh,
        WebGLRenderer,
        BufferAttribute,
        } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.148.0/three.module.min.js'

import getVertexShader from './vertexShader.js'
import getFragmentShader from './fragmentShader.js'

const canvas = document.querySelector('.webgl');

const scene = new Scene();

const displayWidth = (window.innerWidth > 1920) ? 3200 : (window.innerWidth > 768) ? 1920 : 1000                

let { width, height } = {
width: displayWidth,
height: window.innerHeight,
};

const camera = new PerspectiveCamera(75, width / height, 0.1, 100);
scene.add(camera);


const textureLoader = new TextureLoader();
const texture = textureLoader.load("public/images/Group 60.jpg");
textureLoader.setCrossOrigin('anonymous');

const geometry = new SphereGeometry(1, 280, 280);

let time = 0.2;

const uniforms = {
uTime: { value: time },
uDistortionFrequency: { value: 1 },
uDisplacementFrequency: { value: 3 },
uDisplacementStrngth: { value: 0.18 },
uSubdivision: {
value: {x: 280, y: 280},
},
uFresnelOffset: { value: -1.9 },
uFresnelMultiplier: { value: 3.587 },
uFresnelPower: { value: 1.3 },
uLightColor: { value: {x: 2.37, y: 2.25, z: 1.58, w:1.0} },
uLightAPosition: { value: {x: 1.0, y: 1.0, z: 0.0} },
uLightBPosition: { value: {x: -1.0, y: -5.5, z: 0.0} },
uTexture: { type: 't', value: texture },
viewMatrixCamera: { type: 'm4', value: camera.matrixWorldInverse },
projectionMatrixCamera: { type: 'm4', value: camera.projectionMatrix },
savedModelMatrix: { type: 'mat4', value:  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
};

if(window.Worker) {
  const worker = new Worker('./public/scripts/worker.js', {type: 'module'})
  worker.postMessage({ type: 'tangents' });
  worker.onmessage = (message) => {
    if(message.data.type === 'tangents') {
      geometry.setAttribute('tangent', new BufferAttribute(message.data.object, 4));
    } else if (message.data.type === 'texture') {
      
    }
  };  
} else {
  geometry.computeTangents();
}


const material = new ShaderMaterial({
uniforms: uniforms,
vertexShader: getVertexShader(),
fragmentShader: getFragmentShader(),
});

const sphere = new Mesh(geometry, material);

scene.add(sphere);
camera.position.z = 2.5;

const renderer = new WebGLRenderer({
canvas: canvas,
alpha: true,
antialias: true,
});
renderer.setSize(width, height);
window.addEventListener('resize', () => {
height = window.innerHeight;

camera.aspect = width / height;
camera.updateProjectionMatrix();
camera.updateMatrixWorld();
camera.updateWorldMatrix();

renderer.setSize(width, height);
});

function sphereZoom(anchor) {
  canvas.style.zIndex = 5;
  uniforms.uTime.value = 0.5; 
  if (gsap) {
    gsap.to(camera.position,
      {
        duration : 0.4,
        delay: 0.1,
        z : 1.15,
        ease: "power3.inOut",
        onComplete: () => {
          document.body.classList.remove("preview");
          document.querySelector('.firstScreen').classList.add('opened')
          if(anchor) {
            document.querySelector(anchor).scrollIntoView(
              {
               behavior: 'smooth',
               block: 'center'
              }
            )
          }
        }
      }
    )
  }
}

function stopableEventListener(item, e, callback) {
  item.addEventListener(e, callback); 
  return function () {
    item.removeEventListener(e, callback);
  }
}

const wheel = stopableEventListener(document, 'wheel', () => 
  {
   sphereZoom(); 
   wheel(); 
  }
);
const touch = stopableEventListener(document, 'touchend', (e) => 
  {
    let anchor;
    if(e.target.id === 'scroll-to-about') {
       anchor = '#about';
    } else if(e.target.id ==='long-link' || 'short-link') return;
    sphereZoom(anchor); 
    touch(); 
  }
);
const click = stopableEventListener(document.querySelector('#scroll-to-about'), 'click', () => 
  { 
    sphereZoom('#about'); 
    click(); 
  }
);


let requestID;

const loop = () => {
requestID = window.requestAnimationFrame(loop);
uniforms.uTime.value += 0.007;

if(!document.body.classList.contains("preview")) {
  disableLoop(requestID);
}

renderer.render(scene, camera);
};

function disableLoop(id) {
  window.cancelAnimationFrame(id);
  requestID = null;
}

loop();
