import {  SphereGeometry } from 'https://unpkg.com/three/build/three.module.js';

self.onmessage = (event) => {
  if (event.data.type === 'tangents') {
    const geometry = new SphereGeometry(1, 250, 250)
    geometry.computeTangents();
    const tangent = geometry.attributes.tangent.array
    self.postMessage({type: 'tangents', object: tangent});
  } else if (event.data.type === 'position') {
    
  } 
};


function mod(x, y) {
  if (x.length) {
          if (y.length) return x.map(function (x, i) {
                  if (x === 0 || y[i] === 0) return 0
                  return x % y[i];
          });
          return x.map(function (x, i) {
                  if (x === 0 || y === 0) return 0
                  return x % y;
          });
  }
  return x % y;
}
function floor (x) {
  if (x.length) return x.map(floor);
  return Math.floor(x);
}
function fract (x) {
  if (x.length) return x.map(fract);
  return x - Math.floor(x);
}
function vec4 (x, y, z, w) {
  if (x == null) x = 0;
  if (y == null) y = x;
  if (z == null) z = y;
  if (w == null) w = z;
  return [x, y, z, w]
}
vec4.add = function add (out, a, b) {
                  out[0] = a[0] + b[0];
out[1] = a[1] + b[1];
out[2] = a[2] + b[2];
out[3] = a[3] + b[3];

                  return out;
          }
vec4.subtract = function subtract (out, a, b) {
                  out[0] = a[0] - b[0];
out[1] = a[1] - b[1];
out[2] = a[2] - b[2];
out[3] = a[3] - b[3];

                  return out;
          }
vec4.multiply = function multiply (out, a, b) {
                  out[0] = a[0] * b[0];
out[1] = a[1] * b[1];
out[2] = a[2] * b[2];
out[3] = a[3] * b[3];

                  return out;
          }
function abs (x) {
  if (x.length) return x.map(abs);
  return Math.abs(x);
}
function step (edge, x) {
  if (!x && !edge) return 0
  if (x.length) {
          if (edge.length) return x.map(function (x, i) {
                  return step(edge[i], x);
          });
          return x.map(function (x, i) {
                  return step(edge, x);
          });
  }

  return x < edge ? 0.0 : 1.0;
}
function dot (x, y) {
  var sum = 0;
  for (var i = 0; i < x.length; i++) {
          sum += x[i]*y[i];
  }
  return sum;
}
function mix (x, y, a) {
  if (x.length) {
          if (a.length) return x.map(function (x, i) {
                  return mix(x, y[i], a[i]);
          });
          return x.map(function (x, i) {
                  return mix(x, y[i], a);
          });
  }

  return x * (1.0 - a) + y * a;
}
function permute (x) {
  x = x.slice();
  return mod([((x[0] * 34.0) + 1.0) * x[0], ((x[1] * 34.0) + 1.0) * x[1], ((x[2] * 34.0) + 1.0) * x[2], ((x[3] * 34.0) + 1.0) * x[3]], 289.0);
};
function taylorInvSqrt (r) {
  r = r.slice();
  return [1.79284291400159 - 0.85373472095314 * r[0], 1.79284291400159 - 0.85373472095314 * r[1], 1.79284291400159 - 0.85373472095314 * r[2], 1.79284291400159 - 0.85373472095314 * r[3]];
};
function fade (t) {
  t = t.slice();
  return [((t[0] * t[0]) * t[0]) * (t[0] * (t[0] * 6.0 - 15.0) + 10.0), ((t[1] * t[1]) * t[1]) * (t[1] * (t[1] * 6.0 - 15.0) + 10.0), ((t[2] * t[2]) * t[2]) * (t[2] * (t[2] * 6.0 - 15.0) + 10.0), ((t[3] * t[3]) * t[3]) * (t[3] * (t[3] * 6.0 - 15.0) + 10.0)];
};
function perlin4d (P) {
  P = P.slice();
  var Pi0 = floor(P);
  var Pi1 = [Pi0[0] + 1.0, Pi0[1] + 1.0, Pi0[2] + 1.0, Pi0[3] + 1.0];
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  var Pf0 = fract(P);
  var Pf1 = [Pf0[0] - 1.0, Pf0[1] - 1.0, Pf0[2] - 1.0, Pf0[3] - 1.0];
  var ix = [Pi0[0], Pi1[0], Pi0[0], Pi1[0]];
  var iy = [Pi0[1], Pi0[1], Pi1[1], Pi1[1]];
  var iz0 = [Pi0[2], Pi0[2], Pi0[2], Pi0[2]];
  var iz1 = [Pi1[2], Pi1[2], Pi1[2], Pi1[2]];
  var iw0 = [Pi0[3], Pi0[3], Pi0[3], Pi0[3]];
  var iw1 = [Pi1[3], Pi1[3], Pi1[3], Pi1[3]];
  var ixy = permute(vec4.add([], permute(ix), iy));
  var ixy0 = permute([ixy[0] + iz0[0], ixy[1] + iz0[1], ixy[2] + iz0[2], ixy[3] + iz0[3]]);
  var ixy1 = permute([ixy[0] + iz1[0], ixy[1] + iz1[1], ixy[2] + iz1[2], ixy[3] + iz1[3]]);
  var ixy00 = permute([ixy0[0] + iw0[0], ixy0[1] + iw0[1], ixy0[2] + iw0[2], ixy0[3] + iw0[3]]);
  var ixy01 = permute([ixy0[0] + iw1[0], ixy0[1] + iw1[1], ixy0[2] + iw1[2], ixy0[3] + iw1[3]]);
  var ixy10 = permute([ixy1[0] + iw0[0], ixy1[1] + iw0[1], ixy1[2] + iw0[2], ixy1[3] + iw0[3]]);
  var ixy11 = permute([ixy1[0] + iw1[0], ixy1[1] + iw1[1], ixy1[2] + iw1[2], ixy1[3] + iw1[3]]);
  var gx00 = [ixy00[0] / 7.0, ixy00[1] / 7.0, ixy00[2] / 7.0, ixy00[3] / 7.0];
  var gy00 = floor(gx00).map(function (_) {return _ / 7.0;});
  var gz00 = floor(gy00).map(function (_) {return _ / 6.0;});
  gx00 = fract(gx00).map(function (_) {return _ - 0.5;});
  gy00 = fract(gy00).map(function (_) {return _ - 0.5;});
  gz00 = fract(gz00).map(function (_) {return _ - 0.5;});
  var gw00 = vec4.subtract([], vec4.subtract([], vec4.subtract([], [0.75, 0.75, 0.75, 0.75], abs(gx00)), abs(gy00)), abs(gz00));     
  var sw00 = step(gw00, [0, 0, 0, 0]);
  gx00 = vec4.subtract([], gx00, vec4.multiply([], sw00, (step(0.0, gx00).map(function (_) {return _ - 0.5;}))));
  gy00 = vec4.subtract([], gy00, vec4.multiply([], sw00, (step(0.0, gy00).map(function (_) {return _ - 0.5;}))));
  var gx01 = [ixy01[0] / 7.0, ixy01[1] / 7.0, ixy01[2] / 7.0, ixy01[3] / 7.0];
  var gy01 = floor(gx01).map(function (_) {return _ / 7.0;});
  var gz01 = floor(gy01).map(function (_) {return _ / 6.0;});
  gx01 = fract(gx01).map(function (_) {return _ - 0.5;});
  gy01 = fract(gy01).map(function (_) {return _ - 0.5;});
  gz01 = fract(gz01).map(function (_) {return _ - 0.5;});
  var gw01 = vec4.subtract([], vec4.subtract([], vec4.subtract([], [0.75, 0.75, 0.75, 0.75], abs(gx01)), abs(gy01)), abs(gz01));     
  var sw01 = step(gw01, [0, 0, 0, 0]);
  gx01 = vec4.subtract([], gx01, vec4.multiply([], sw01, (step(0.0, gx01).map(function (_) {return _ - 0.5;}))));
  gy01 = vec4.subtract([], gy01, vec4.multiply([], sw01, (step(0.0, gy01).map(function (_) {return _ - 0.5;}))));
  var gx10 = [ixy10[0] / 7.0, ixy10[1] / 7.0, ixy10[2] / 7.0, ixy10[3] / 7.0];
  var gy10 = floor(gx10).map(function (_) {return _ / 7.0;});
  var gz10 = floor(gy10).map(function (_) {return _ / 6.0;});
  gx10 = fract(gx10).map(function (_) {return _ - 0.5;});
  gy10 = fract(gy10).map(function (_) {return _ - 0.5;});
  gz10 = fract(gz10).map(function (_) {return _ - 0.5;});
  var gw10 = vec4.subtract([], vec4.subtract([], vec4.subtract([], [0.75, 0.75, 0.75, 0.75], abs(gx10)), abs(gy10)), abs(gz10));     
  var sw10 = step(gw10, [0, 0, 0, 0]);
  gx10 = vec4.subtract([], gx10, vec4.multiply([], sw10, (step(0.0, gx10).map(function (_) {return _ - 0.5;}))));
  gy10 = vec4.subtract([], gy10, vec4.multiply([], sw10, (step(0.0, gy10).map(function (_) {return _ - 0.5;}))));
  var gx11 = [ixy11[0] / 7.0, ixy11[1] / 7.0, ixy11[2] / 7.0, ixy11[3] / 7.0];
  var gy11 = floor(gx11).map(function (_) {return _ / 7.0;});
  var gz11 = floor(gy11).map(function (_) {return _ / 6.0;});
  gx11 = fract(gx11).map(function (_) {return _ - 0.5;});
  gy11 = fract(gy11).map(function (_) {return _ - 0.5;});
  gz11 = fract(gz11).map(function (_) {return _ - 0.5;});
  var gw11 = vec4.subtract([], vec4.subtract([], vec4.subtract([], [0.75, 0.75, 0.75, 0.75], abs(gx11)), abs(gy11)), abs(gz11));     
  var sw11 = step(gw11, [0, 0, 0, 0]);
  gx11 = vec4.subtract([], gx11, vec4.multiply([], sw11, (step(0.0, gx11).map(function (_) {return _ - 0.5;}))));
  gy11 = vec4.subtract([], gy11, vec4.multiply([], sw11, (step(0.0, gy11).map(function (_) {return _ - 0.5;}))));
  var g0000 = [gx00[0], gy00[0], gz00[0], gw00[0]];
  var g1000 = [gx00[1], gy00[1], gz00[1], gw00[1]];
  var g0100 = [gx00[2], gy00[2], gz00[2], gw00[2]];
  var g1100 = [gx00[3], gy00[3], gz00[3], gw00[3]];
  var g0010 = [gx10[0], gy10[0], gz10[0], gw10[0]];
  var g1010 = [gx10[1], gy10[1], gz10[1], gw10[1]];
  var g0110 = [gx10[2], gy10[2], gz10[2], gw10[2]];
  var g1110 = [gx10[3], gy10[3], gz10[3], gw10[3]];
  var g0001 = [gx01[0], gy01[0], gz01[0], gw01[0]];
  var g1001 = [gx01[1], gy01[1], gz01[1], gw01[1]];
  var g0101 = [gx01[2], gy01[2], gz01[2], gw01[2]];
  var g1101 = [gx01[3], gy01[3], gz01[3], gw01[3]];
  var g0011 = [gx11[0], gy11[0], gz11[0], gw11[0]];
  var g1011 = [gx11[1], gy11[1], gz11[1], gw11[1]];
  var g0111 = [gx11[2], gy11[2], gz11[2], gw11[2]];
  var g1111 = [gx11[3], gy11[3], gz11[3], gw11[3]];
  var norm00 = taylorInvSqrt([dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)]);
  g0000 = [g0000[0] * norm00[0], g0000[1] * norm00[0], g0000[2] * norm00[0], g0000[3] * norm00[0]];
  g0100 = [g0100[0] * norm00[1], g0100[1] * norm00[1], g0100[2] * norm00[1], g0100[3] * norm00[1]];
  g1000 = [g1000[0] * norm00[2], g1000[1] * norm00[2], g1000[2] * norm00[2], g1000[3] * norm00[2]];
  g1100 = [g1100[0] * norm00[3], g1100[1] * norm00[3], g1100[2] * norm00[3], g1100[3] * norm00[3]];
  var norm01 = taylorInvSqrt([dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)]);
  g0001 = [g0001[0] * norm01[0], g0001[1] * norm01[0], g0001[2] * norm01[0], g0001[3] * norm01[0]];
  g0101 = [g0101[0] * norm01[1], g0101[1] * norm01[1], g0101[2] * norm01[1], g0101[3] * norm01[1]];
  g1001 = [g1001[0] * norm01[2], g1001[1] * norm01[2], g1001[2] * norm01[2], g1001[3] * norm01[2]];
  g1101 = [g1101[0] * norm01[3], g1101[1] * norm01[3], g1101[2] * norm01[3], g1101[3] * norm01[3]];
  var norm10 = taylorInvSqrt([dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)]);
  g0010 = [g0010[0] * norm10[0], g0010[1] * norm10[0], g0010[2] * norm10[0], g0010[3] * norm10[0]];
  g0110 = [g0110[0] * norm10[1], g0110[1] * norm10[1], g0110[2] * norm10[1], g0110[3] * norm10[1]];
  g1010 = [g1010[0] * norm10[2], g1010[1] * norm10[2], g1010[2] * norm10[2], g1010[3] * norm10[2]];
  g1110 = [g1110[0] * norm10[3], g1110[1] * norm10[3], g1110[2] * norm10[3], g1110[3] * norm10[3]];
  var norm11 = taylorInvSqrt([dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)]);
  g0011 = [g0011[0] * norm11[0], g0011[1] * norm11[0], g0011[2] * norm11[0], g0011[3] * norm11[0]];
  g0111 = [g0111[0] * norm11[1], g0111[1] * norm11[1], g0111[2] * norm11[1], g0111[3] * norm11[1]];
  g1011 = [g1011[0] * norm11[2], g1011[1] * norm11[2], g1011[2] * norm11[2], g1011[3] * norm11[2]];
  g1111 = [g1111[0] * norm11[3], g1111[1] * norm11[3], g1111[2] * norm11[3], g1111[3] * norm11[3]];
  var n0000 = dot(g0000, Pf0);
  var n1000 = dot(g1000, [Pf1[0], Pf0[1], Pf0[2], Pf0[3]]);
  var n0100 = dot(g0100, [Pf0[0], Pf1[1], Pf0[2], Pf0[3]]);
  var n1100 = dot(g1100, [Pf1[0], Pf1[1], Pf0[2], Pf0[3]])
  var n0010 = dot(g0010, [Pf0[0], Pf0[1], Pf1[2], Pf0[3]]);
  var n1010 = dot(g1010, [Pf1[0], Pf0[1], Pf1[2], Pf0[3]]);
  var n0110 = dot(g0110, [Pf0[0], Pf1[1], Pf1[2], Pf0[3]]);
  var n1110 = dot(g1110, [Pf1[0], Pf1[1], Pf1[2], Pf0[3]]);
  var n0001 = dot(g0001, [Pf0[0], Pf0[1], Pf0[2], Pf1[3]]);
  var n1001 = dot(g1001, [Pf1[0], Pf0[1], Pf0[2], Pf1[3]]);
  var n0101 = dot(g0101, [Pf0[0], Pf1[1], Pf0[2], Pf1[3]]);
  var n1101 = dot(g1101, [Pf1[0], Pf1[1], Pf0[2], Pf1[3]]);
  var n0011 = dot(g0011, [Pf0[0], Pf0[1], Pf1[2], Pf1[3]]);
  var n1011 = dot(g1011, [Pf1[0], Pf0[1], Pf1[2], Pf1[3]]);
  var n0111 = dot(g0111, [Pf0[0], Pf1[1], Pf1[2], Pf1[3]]);
  var n1111 = dot(g1111, Pf1);
  var fade_xyzw = fade(Pf0);
  var n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw[3]);
  var n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), 1.1);
  var n_zw = mix(n_0w, n_1w, fade_xyzw[2]);
  var n_yzw = mix([n_zw[0], n_zw[1]], [n_zw[2], n_zw[3]], fade_xyzw[1]);
  var n_xyzw = mix(n_yzw[0], n_yzw[1], fade_xyzw[0]);

  return 2.2 * n_xyzw;
};