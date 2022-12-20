import {  
        Scene, 
        PerspectiveCamera,
        TextureLoader,
        SphereGeometry,
        Vector2,
        Vector3,
        Vector4,
        Matrix4,
        ShaderMaterial,
        Mesh,
        WebGLRenderer,
        } from 'https://unpkg.com/three/build/three.module.js'

const img = new Image();
img.src = "./public/images/background.jpg";
img.onload = () => { 
const loader = document.querySelector('.load-wrap');
loader.classList.add('loaded')
}




// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new Scene();

/**

Sizes
*/
let { width, height } = {
width: window.innerWidth,
height: window.innerHeight,
};
/**

Camera
*/
const camera = new PerspectiveCamera(75, width / height, 0.1, 100);
scene.add(camera);
const viewMatrixCamera = camera.matrixWorldInverse
const projectionMatrixCamera = camera.projectionMatrix
const modelMatrixCamera = camera.matrixWorld
const projPosition = camera.position

// Load Texture
const textureLoader = new TextureLoader();
const texture = textureLoader.load("public/images/Group 60.jpeg");

/**

Object
*/
const geometry = new SphereGeometry(1, 512, 512);
geometry.computeTangents();
const uniforms = {
uTime: { value: 0.2 },
uDistortionFrequency: { value: 1 },
uDistortionStrngth: { value: 1.5 },
uDisplacementFrequency: { value: 3 },
uDisplacementStrngth: { value: 0.18 },
uSubdivision: {
value: new Vector2(geometry.parameters.widthSegments, geometry.parameters.heightSegments),
},
uFresnelOffset: { value: -2 },
uFresnelMultiplier: { value: 3.587 },
uFresnelPower: { value: 1.3 },
uLightColor: { value: new Vector4(2.37, 2.25, 1.58, 1.0) },
uLightAPosition: { value: new Vector3(1.0, 1.0, 0.0) },
uLightBPosition: { value: new Vector3(-1.0, -5.0, 0.0) },
uTexture: { type: 't', value: texture },
viewMatrixCamera: { type: 'm4', value: viewMatrixCamera },
projectionMatrixCamera: { type: 'm4', value: projectionMatrixCamera },
modelMatrixCamera: { type: 'mat4', value: modelMatrixCamera },
savedModelMatrix: { type: 'mat4', value: new Matrix4() },
projPosition: { type: 'v3', value: projPosition },
};

const material = new ShaderMaterial({
uniforms: uniforms,
vertexShader: getVertexShader(),
fragmentShader: getFragmentShader(),
});

const sphere = new Mesh(geometry, material);

scene.add(sphere);
camera.position.z = 2.5;

/**

Renderer
*/
const renderer = new WebGLRenderer({
canvas: canvas,
alpha: true,
antialias: true,
});
renderer.setSize(width, height);
window.addEventListener('resize', () => {
width = window.innerWidth;
height = window.innerHeight;

camera.aspect = width / height;
camera.updateProjectionMatrix();
camera.updateMatrixWorld();
camera.updateWorldMatrix();

renderer.setSize(width, height);
});

/**

Sphere zoom
*/
function sphereZoom() {
  canvas.style.zIndex = 5;
  gsap.to(camera.position,
  {
    duration : 0.4,
    delay: 0.1,
    z : 1.15,
    ease: "power3.inOut",
    onComplete: () => {
      document.body.classList.remove("preview");
      document.querySelector('.firstScreen').classList.add('opened')
    }
  }
  )
}
/**

/**

Click
*/
document.addEventListener('wheel', (event) => {
event.preventDefault();
event.stopPropagation();
sphereZoom();
});

/**

Touch start
*/
document.addEventListener('touchstart', (event) => {
event.preventDefault();
event.stopPropagation();
sphereZoom();
});
/**

Loop
*/
let requestID;

const loop = () => {
requestID = window.requestAnimationFrame(loop);
uniforms.uTime.value += 0.015;
uniforms.savedModelMatrix.value = sphere.matrixWorld;
uniforms.viewMatrixCamera.value = camera.matrixWorldInverse;
uniforms.projectionMatrixCamera.value = camera.projectionMatrix;
uniforms.modelMatrixCamera.value = camera.matrixWorld;
uniforms.projPosition.value = camera.position;

if(!document.body.classList.contains("preview")) {
  disableLoop(requestID);
}

renderer.render(scene, camera);
};

function disableLoop(id) {
  window.cancelAnimationFrame(id)
}

loop();


function getFragmentShader() {
return `
precision mediump float;

uniform sampler2D uTexture;
uniform vec4 uLightColor;

varying vec4 vWorldPosition;
varying vec4 vTexCoords;
varying float vFresnel;
varying float vLightAIntensity;
varying float vLightBIntensity;

void main() {
vec2 uv = (vTexCoords.xy / vTexCoords.w) * 0.5 + 0.5;

  vec4 color = texture2D(uTexture, uv);

  color = mix(color, uLightColor, vLightAIntensity * vFresnel * 1.5);
  color = mix(color, uLightColor, vLightBIntensity * vFresnel * 1.5);
  color = mix(color, vec4(1.0), clamp(pow(max(0.0, vFresnel - 0.8), 3.0), 0.0, 1.0));

  gl_FragColor = color;
}
`;
}

function getVertexShader() {
return `
#define M_PI 3.1415926535897932384626433832795

uniform mat4 savedModelMatrix;

uniform float uTime;

uniform float uDisplacementStrngth;
uniform float uDisplacementFrequency;
uniform float uDistortionFrequency;
uniform float uDistortionStrngth;

uniform vec4 uLightColor;
uniform vec3 uLightAPosition;
uniform vec3 uLightBPosition;
uniform vec2 uSubdivision;

uniform vec3 uOffset;

uniform float uFresnelOffset;
uniform float uFresnelMultiplier;
uniform float uFresnelPower;

attribute vec4 tangent;

varying vec3 vNormal;
varying float vPerlinStrength;
varying vec2 vUv;
varying float vFresnel;
varying float vLightAIntensity;
varying float vLightBIntensity;

uniform mat4 viewMatrixCamera;
uniform mat4 projectionMatrixCamera;
uniform mat4 modelMatrixCamera;

varying vec4 vWorldPosition;
varying vec4 vTexCoords;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec4 fade(vec4 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float perlin4d(vec4 P){
vec4 Pi0 = floor(P); // Integer part for indexing
vec4 Pi1 = Pi0 + 1.0; // Integer part + 1
Pi0 = mod(Pi0, 289.0);
Pi1 = mod(Pi1, 289.0);
vec4 Pf0 = fract(P); // Fractional part for interpolation
vec4 Pf1 = Pf0 - 1.0; // Fractional part - 1.0
vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
vec4 iy = vec4(Pi0.yy, Pi1.yy);
vec4 iz0 = vec4(Pi0.zzzz);
vec4 iz1 = vec4(Pi1.zzzz);
vec4 iw0 = vec4(Pi0.wwww);
vec4 iw1 = vec4(Pi1.wwww);

vec4 ixy = permute(permute(ix) + iy);
vec4 ixy0 = permute(ixy + iz0);
vec4 ixy1 = permute(ixy + iz1);
vec4 ixy00 = permute(ixy0 + iw0);
vec4 ixy01 = permute(ixy0 + iw1);
vec4 ixy10 = permute(ixy1 + iw0);
vec4 ixy11 = permute(ixy1 + iw1);

vec4 gx00 = ixy00 / 7.0;
vec4 gy00 = floor(gx00) / 7.0;
vec4 gz00 = floor(gy00) / 6.0;
gx00 = fract(gx00) - 0.5;
gy00 = fract(gy00) - 0.5;
gz00 = fract(gz00) - 0.5;
vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
vec4 sw00 = step(gw00, vec4(0.0));
gx00 -= sw00 * (step(0.0, gx00) - 0.5);
gy00 -= sw00 * (step(0.0, gy00) - 0.5);

vec4 gx01 = ixy01 / 7.0;
vec4 gy01 = floor(gx01) / 7.0;
vec4 gz01 = floor(gy01) / 6.0;
gx01 = fract(gx01) - 0.5;
gy01 = fract(gy01) - 0.5;
gz01 = fract(gz01) - 0.5;
vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
vec4 sw01 = step(gw01, vec4(0.0));
gx01 -= sw01 * (step(0.0, gx01) - 0.5);
gy01 -= sw01 * (step(0.0, gy01) - 0.5);

vec4 gx10 = ixy10 / 7.0;
vec4 gy10 = floor(gx10) / 7.0;
vec4 gz10 = floor(gy10) / 6.0;
gx10 = fract(gx10) - 0.5;
gy10 = fract(gy10) - 0.5;
gz10 = fract(gz10) - 0.5;
vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
vec4 sw10 = step(gw10, vec4(0.0));
gx10 -= sw10 * (step(0.0, gx10) - 0.5);
gy10 -= sw10 * (step(0.0, gy10) - 0.5);

vec4 gx11 = ixy11 / 7.0;
vec4 gy11 = floor(gx11) / 7.0;
vec4 gz11 = floor(gy11) / 6.0;
gx11 = fract(gx11) - 0.5;
gy11 = fract(gy11) - 0.5;
gz11 = fract(gz11) - 0.5;
vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
vec4 sw11 = step(gw11, vec4(0.0));
gx11 -= sw11 * (step(0.0, gx11) - 0.5);
gy11 -= sw11 * (step(0.0, gy11) - 0.5);

vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);

vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
g0000 *= norm00.x;
g0100 *= norm00.y;
g1000 *= norm00.z;
g1100 *= norm00.w;

vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
g0001 *= norm01.x;
g0101 *= norm01.y;
g1001 *= norm01.z;
g1101 *= norm01.w;

vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
g0010 *= norm10.x;
g0110 *= norm10.y;
g1010 *= norm10.z;
g1110 *= norm10.w;

vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
g0011 *= norm11.x;
g0111 *= norm11.y;
g1011 *= norm11.z;
g1111 *= norm11.w;

float n0000 = dot(g0000, Pf0);
float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
float n1111 = dot(g1111, Pf1);

vec4 fade_xyzw = fade(Pf0);
vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
return 2.2 * n_xyzw;
}


vec3 getDisplacedPosition(vec3 _position) {
vec3 displacementPosition = _position;

displacementPosition += perlin4d(vec4(displacementPosition * uDistortionFrequency, uTime * 0.4)) * uDisplacementStrngth;

float perlinStrength = perlin4d(vec4(displacementPosition * uDisplacementFrequency, uTime * 0.4)) * uDisplacementStrngth;

vec3 displacedPosition = _position;
displacedPosition += perlinStrength * normalize(_position) * uDisplacementStrngth;

return displacedPosition;
}

void main() {

//position
vec3 displacedPosition = getDisplacedPosition(position);
vec4 viewPosition = viewMatrix * vec4(displacedPosition, 1.0);
vec4 projectedPosition = projectionMatrix * viewPosition;
gl_Position = projectedPosition;

// Bi tangents
float distanceA = (M_PI * 2.0) / uSubdivision.x;
float distanceB = M_PI / uSubdivision.x;

vec3 biTangent = cross(normal, tangent.xyz);

vec3 positionA = position + tangent.xyz * distanceA;
vec3 displacedPositionA = getDisplacedPosition(positionA);

vec3 positionB = position + biTangent.xyz * distanceB;
vec3 displacedPositionB = getDisplacedPosition(positionB);

vec3 computedNormal = cross(displacedPositionA - displacedPosition.xyz, displacedPositionB - displacedPosition.xyz);
computedNormal = normalize(computedNormal);


// Fresnel
vec3 viewDirection = normalize(displacedPosition.xyz - cameraPosition);
float fresnel = uFresnelOffset + (1.0 + dot(viewDirection, computedNormal)) * uFresnelMultiplier;
fresnel = pow(max(0.0, fresnel), uFresnelPower);

//Color

float lightAIntensity = max(0.0, dot(computedNormal.xyz, normalize(- uLightAPosition)));
float lightBIntensity = max(0.0, dot(computedNormal.xyz, normalize(- uLightBPosition)));

vWorldPosition = savedModelMatrix * vec4(position, 1.0);
vTexCoords = projectionMatrixCamera * viewMatrixCamera * vWorldPosition;
vFresnel = fresnel;
vLightAIntensity = lightAIntensity;
vLightBIntensity = lightBIntensity;
}
`;
}
