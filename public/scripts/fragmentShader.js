export default function getFragmentShader() {
  return `
  uniform sampler2D uTexture;
  uniform vec4 uLightColor;
  
  varying float vFresnel;
    varying float vLightAIntensity;
  varying float vLightBIntensity;
  varying vec2 vUv;
  varying vec4 vColor;
  
  void main() {

    vec4 color = texture2D(uTexture, vUv);

    color = mix(color, uLightColor, vLightAIntensity * vFresnel * 1.5);
    color = mix(color, uLightColor, vLightBIntensity * vFresnel * 1.5);
    color = mix(color, vec4(1.0), clamp(pow(max(0.0, vFresnel - 0.8), 3.0), 0.0, 1.0));
    
    gl_FragColor = color;
  }
  `;
  }