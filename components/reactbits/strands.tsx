'use client';

/**
 * Strands — React Bits (https://reactbits.dev), ported for the NX docs.
 *
 * Changes from upstream:
 * - TypeScript, canvas styles applied inline (no companion CSS file).
 * - `prefers-reduced-motion: reduce` renders a single static frame and
 *   never starts the animation loop.
 * - Container-driven resize via ResizeObserver instead of window resize.
 */

import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

const MAX_STRANDS = 12;
const MAX_COLORS = 8;

const VERT = /* glsl */ `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;

out vec4 fragColor;

const float PI = 3.14159265;

vec3 spectrum(float t) {
  return 0.5 + 0.5 * cos(2.0 * PI * (t + vec3(0.00, 0.33, 0.67)));
}

vec3 samplePalette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int idx = int(floor(scaled));
  float blend = fract(scaled);
  int nextIdx = idx + 1;
  if (nextIdx >= uColorCount) nextIdx = 0;
  return mix(uColors[idx], uColors[nextIdx], blend);
}

vec3 strandColor(float t) {
  if (uColorCount > 0) return samplePalette(t);
  return spectrum(t);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);

  float e = 0.06 + uIntensity * 0.94;
  // Envelope over screen-width-normalized x (±0.5) instead of height-
  // normalized uv.x: the ribbon spans ~75% of any viewport and the cosine
  // never leaves its first lobe, so wide aspect ratios can't repeat it.
  float ex = (gl_FragCoord.x - 0.5 * uResolution.x) / max(uResolution.x, 1.0);
  float env = pow(max(cos(ex * PI * 1.3), 0.0), uTaper);

  vec3 col = vec3(0.0);

  for (int i = 0; i < ${MAX_STRANDS}; i++) {
    if (i >= uStrandCount) break;

    float fi = float(i);
    float ph = fi * 1.7 * uSpread;
    float freq = (2.0 + fi * 0.35) * uWaviness;
    float spd = 1.4 + fi * 1.2;

    float tt = uTime * uSpeed;
    float w = sin(uv.x * freq + tt * spd + ph) * 0.60
            + sin(uv.x * freq * 1.1 - tt * spd * 0.7 + ph * 1.7) * 0.40;

    float amp = (0.1 + 0.02 * e) * env * uAmplitude;
    float y = w * amp;

    float d = abs(uv.y - y);
    float thick = (0.001 + 0.05 * e) * (0.35 + env) * uThickness;
    float g = thick / (d + thick * 0.45);
    g = g * g;

    float h = fi / float(uStrandCount) + uv.x * 0.30 + uTime * 0.04 + uHueShift;
    col += strandColor(h) * g * env;
  }

  col *= 0.45 + 0.7 * e;
  col = 1.0 - exp(-col * uGlow);

  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(gray), col, uSaturation), 0.0);

  float lum = max(max(col.r, col.g), col.b);
  float alpha = clamp(lum, 0.0, 1.0) * uOpacity;

  fragColor = vec4(col * uOpacity, alpha);
}
`;

const buildPalette = (colors: string[]): [number, number, number][] => {
  const filled = colors && colors.length ? colors : ['#ffffff'];
  const padded: [number, number, number][] = [];
  for (let i = 0; i < MAX_COLORS; i++) {
    const hex = filled[i] ?? filled[filled.length - 1];
    const c = new Color(hex);
    padded.push([c.r, c.g, c.b]);
  }
  return padded;
};

export interface StrandsProps {
  colors?: string[];
  count?: number;
  speed?: number;
  amplitude?: number;
  waviness?: number;
  thickness?: number;
  glow?: number;
  taper?: number;
  spread?: number;
  hueShift?: number;
  intensity?: number;
  saturation?: number;
  opacity?: number;
  scale?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Strands({
  colors = ['#7f1d1d', '#dc2626', '#ff8a70'],
  count = 3,
  speed = 0.5,
  amplitude = 1,
  waviness = 1,
  thickness = 0.7,
  glow = 2.6,
  taper = 3,
  spread = 1,
  hueShift = 0,
  intensity = 0.6,
  saturation = 1,
  opacity = 1,
  scale = 1.5,
  className = '',
  style,
}: StrandsProps) {
  const propsRef = useRef<Required<Omit<StrandsProps, 'className' | 'style'>>>(
    null!,
  );
  propsRef.current = {
    colors,
    count,
    speed,
    amplitude,
    waviness,
    thickness,
    glow,
    taper,
    spread,
    hueShift,
    intensity,
    saturation,
    opacity,
    scale,
  };

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';
    gl.canvas.style.display = 'block';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const current = propsRef.current;
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uColors: { value: buildPalette(current.colors) },
        uColorCount: { value: Math.min(current.colors.length, MAX_COLORS) },
        uStrandCount: { value: Math.min(current.count, MAX_STRANDS) },
        uSpeed: { value: current.speed },
        uAmplitude: { value: current.amplitude },
        uWaviness: { value: current.waviness },
        uThickness: { value: current.thickness },
        uGlow: { value: current.glow },
        uTaper: { value: current.taper },
        uSpread: { value: current.spread },
        uHueShift: { value: current.hueShift },
        uIntensity: { value: current.intensity },
        uOpacity: { value: current.opacity },
        uScale: { value: current.scale },
        uSaturation: { value: current.saturation },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    const syncUniforms = (t: number) => {
      const p = propsRef.current;
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uColors.value = buildPalette(p.colors);
      program.uniforms.uColorCount.value = Math.min(p.colors.length, MAX_COLORS);
      program.uniforms.uStrandCount.value = Math.min(
        Math.max(Math.round(p.count), 1),
        MAX_STRANDS,
      );
      program.uniforms.uSpeed.value = p.speed;
      program.uniforms.uAmplitude.value = p.amplitude;
      program.uniforms.uWaviness.value = p.waviness;
      program.uniforms.uThickness.value = p.thickness;
      program.uniforms.uGlow.value = p.glow;
      program.uniforms.uTaper.value = p.taper;
      program.uniforms.uSpread.value = p.spread;
      program.uniforms.uHueShift.value = p.hueShift;
      program.uniforms.uIntensity.value = p.intensity;
      program.uniforms.uOpacity.value = p.opacity;
      program.uniforms.uScale.value = p.scale;
      program.uniforms.uSaturation.value = p.saturation;
    };

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
      if (reducedMotion) {
        syncUniforms(0);
        renderer.render({ scene: mesh });
      }
    }
    const ro = new ResizeObserver(resize);
    ro.observe(ctn);
    resize();

    let animateId = 0;
    if (reducedMotion) {
      // One still frame; no loop.
      syncUniforms(0);
      renderer.render({ scene: mesh });
    } else {
      const update = (t: number) => {
        animateId = requestAnimationFrame(update);
        syncUniforms(t);
        renderer.render({ scene: mesh });
      };
      animateId = requestAnimationFrame(update);
    }

    return () => {
      cancelAnimationFrame(animateId);
      ro.disconnect();
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ctnDom}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent',
        ...style,
      }}
    />
  );
}
