export default function getFragmentShader() {
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