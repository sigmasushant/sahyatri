import { AdditiveBlending, Color, DoubleSide, NormalBlending, ShaderMaterial } from 'three';
import { sceneColors, type SceneColor } from '@/design-system/tokens';

/** Scene colours as linear three.js colours, derived from the design tokens. */
export function tokenColor(name: SceneColor): Color {
  return new Color(sceneColors[name]);
}

/* Points: soft glowing particles or crisp dots, sized in px at a view distance of 10 units. */

const pointsVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAlpha;
  uniform float uPixelRatio;
  uniform float uScale;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * uPixelRatio * uScale * (10.0 / max(0.001, -mvPosition.z));
    vColor = aColor;
    vAlpha = aAlpha;
  }
`;

const pointsFragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    #ifdef CRISP
      float a = 1.0 - smoothstep(0.34, 0.5, d);
    #else
      float a = pow(1.0 - smoothstep(0.0, 0.5, d), 2.2);
    #endif
    a *= vAlpha * uOpacity;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor, a);
    #include <colorspace_fragment>
  }
`;

export function createPointsMaterial({
  crisp = false,
  additive = !crisp,
  pixelRatio = 1,
}: { crisp?: boolean; additive?: boolean; pixelRatio?: number } = {}) {
  return new ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: pixelRatio },
      uScale: { value: 1 },
      uOpacity: { value: 1 },
    },
    vertexShader: pointsVertex,
    fragmentShader: pointsFragment,
    defines: crisp ? { CRISP: '' } : {},
    transparent: true,
    depthWrite: false,
    blending: additive ? AdditiveBlending : NormalBlending,
  });
}

/* Ribbon: a flat route strip with soft edges, a draw-on window and a travelling pulse. */

const ribbonVertex = /* glsl */ `
  attribute float aU;
  attribute float aV;
  varying float vU;
  varying float vV;
  void main() {
    vU = aU;
    vV = aV;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ribbonFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uStart;
  uniform float uEnd;
  uniform float uTime;
  uniform float uPulse;
  uniform float uPulseSpeed;
  uniform float uPulseCount;
  uniform float uHead;
  uniform float uSoftness;
  varying float vU;
  varying float vV;
  void main() {
    if (vU < uStart || vU > uEnd) discard;
    float across = 1.0 - abs(vV * 2.0 - 1.0);
    float body = smoothstep(0.0, uSoftness, across);
    float pulse = uPulse * pow(fract(vU * uPulseCount - uTime * uPulseSpeed), 10.0);
    float head = uHead * smoothstep(uEnd - 0.05, uEnd, vU);
    float a = body * uOpacity * (0.75 + pulse + head);
    gl_FragColor = vec4(uColor * (1.0 + 0.6 * (pulse + head)), clamp(a, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`;

export interface RibbonOptions {
  color: Color;
  opacity?: number;
  pulse?: number;
  pulseSpeed?: number;
  pulseCount?: number;
  head?: number;
  softness?: number;
  additive?: boolean;
}

export function createRibbonMaterial({
  color,
  opacity = 1,
  pulse = 0,
  pulseSpeed = 0.35,
  pulseCount = 3,
  head = 0,
  softness = 0.6,
  additive = true,
}: RibbonOptions) {
  return new ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uOpacity: { value: opacity },
      uStart: { value: 0 },
      uEnd: { value: 1 },
      uTime: { value: 0 },
      uPulse: { value: pulse },
      uPulseSpeed: { value: pulseSpeed },
      uPulseCount: { value: pulseCount },
      uHead: { value: head },
      uSoftness: { value: softness },
    },
    vertexShader: ribbonVertex,
    fragmentShader: ribbonFragment,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: additive ? AdditiveBlending : NormalBlending,
  });
}

/* Lines: many thin segments with per-vertex colour/alpha and an optional reveal window. */

const linesVertex = /* glsl */ `
  attribute vec3 aColor;
  attribute float aAlpha;
  #ifdef REVEAL
    attribute float aReveal;
    attribute float aT;
    uniform float uCount;
    varying float vT;
    varying float vGrow;
  #endif
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    #ifdef REVEAL
      vT = aT;
      vGrow = clamp(uCount - aReveal, 0.0, 1.0);
    #endif
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const linesFragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  #ifdef REVEAL
    varying float vT;
    varying float vGrow;
  #endif
  void main() {
    float a = vAlpha * uOpacity;
    #ifdef REVEAL
      if (vT > vGrow) discard;
      a *= smoothstep(0.0, 0.35, vGrow);
    #endif
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor, a);
    #include <colorspace_fragment>
  }
`;

export function createLinesMaterial({ reveal = false, additive = true } = {}) {
  return new ShaderMaterial({
    uniforms: { uOpacity: { value: 1 }, uCount: { value: 0 } },
    vertexShader: linesVertex,
    fragmentShader: linesFragment,
    defines: reveal ? { REVEAL: '' } : {},
    transparent: true,
    depthWrite: false,
    blending: additive ? AdditiveBlending : NormalBlending,
  });
}

/* Pulse ring: concentric rings expanding from the centre of a flat disc. */

const ringVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uOpacity;
  uniform float uWidth;
  uniform float uCore;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = 0.0;
    for (int i = 0; i < 3; i++) {
      float t = fract(uTime * uSpeed + float(i) / 3.0);
      a += smoothstep(uWidth, 0.0, abs(r - t)) * (1.0 - t) * (1.0 - t);
    }
    a += uCore * smoothstep(0.35, 0.0, r);
    a *= uOpacity;
    if (a < 0.004) discard;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

export function createPulseRingMaterial({ color, speed = 0.45, opacity = 0.8, width = 0.05, core = 0 }: {
  color: Color;
  speed?: number;
  opacity?: number;
  width?: number;
  core?: number;
}) {
  return new ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uOpacity: { value: opacity },
      uWidth: { value: width },
      uCore: { value: core },
    },
    vertexShader: ringVertex,
    fragmentShader: ringFragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
}

/* Protective field: a fresnel shell, brightest at its silhouette. */

const fieldVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vHeight;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mvPosition.xyz);
    vHeight = position.y;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fieldFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vHeight;
  void main() {
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.4);
    float band = 0.5 + 0.5 * sin(vHeight * 18.0 - uTime * 1.6);
    float a = uOpacity * (fresnel * 0.9 + band * 0.06);
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

export function createFieldMaterial({ color, opacity = 0.5 }: { color: Color; opacity?: number }) {
  return new ShaderMaterial({
    uniforms: { uColor: { value: color }, uOpacity: { value: opacity }, uTime: { value: 0 } },
    vertexShader: fieldVertex,
    fragmentShader: fieldFragment,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: AdditiveBlending,
  });
}
