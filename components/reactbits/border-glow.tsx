'use client';

/**
 * BorderGlow — React Bits (https://reactbits.dev), ported for the NX docs.
 *
 * Pointer-proximity edge glow for the script catalog cards. Styles live in
 * app/global.css under "React Bits: BorderGlow" (Next.js only allows global
 * CSS imports from the root layout). Defaults are tuned to the NX palette:
 * hue-27 red glow, card surface background, 14px radius.
 */

import { useRef, useCallback, useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';

function parseHSL(hslStr: string) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 14, s: 75, l: 70 };
  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

function buildGlowVars(glowColor: string, intensity: number) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars: Record<string, string> = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] =
      `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = [
  '80% 55%',
  '69% 34%',
  '8% 6%',
  '41% 38%',
  '86% 85%',
  '82% 18%',
  '51% 4%',
];
const GRADIENT_KEYS = [
  '--gradient-one',
  '--gradient-two',
  '--gradient-three',
  '--gradient-four',
  '--gradient-five',
  '--gradient-six',
  '--gradient-seven',
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors: string[]) {
  const vars: Record<string, string> = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] =
      `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

export interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  /** How close (0-100) the pointer must be to the edge before the glow appears. */
  edgeSensitivity?: number;
  /** Glow color as "H S L" (e.g. "14 75 70"). */
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  /** How far the outer glow extends beyond the card, in px. */
  glowRadius?: number;
  glowIntensity?: number;
  /** Width of the directional cone mask, percent (5-45). */
  coneSpread?: number;
  /** Three hex colors for the mesh-gradient border. */
  colors?: [string, string, string] | string[];
  fillOpacity?: number;
}

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '14 75 70',
  backgroundColor = 'var(--color-fd-card)',
  borderRadius = 14,
  glowRadius = 32,
  glowIntensity = 0.9,
  coneSpread = 25,
  colors = ['#dc2626', '#ff8a70', '#7f1d1d'],
  fillOpacity = 0.35,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const getEdgeProximity = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const { width, height } = el.getBoundingClientRect();
      const cx = width / 2;
      const cy = height / 2;
      const dx = x - cx;
      const dy = y - cy;
      let kx = Infinity;
      let ky = Infinity;
      if (dx !== 0) kx = cx / Math.abs(dx);
      if (dy !== 0) ky = cy / Math.abs(dy);
      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    },
    [],
  );

  const getCursorAngle = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const { width, height } = el.getBoundingClientRect();
      const dx = x - width / 2;
      const dy = y - height / 2;
      if (dx === 0 && dy === 0) return 0;
      let degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (degrees < 0) degrees += 360;
      return degrees;
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const edge = getEdgeProximity(card, x, y);
      const angle = getCursorAngle(card, x, y);

      card.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
      card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    },
    [getEdgeProximity, getCursorAngle],
  );

  // Coarse pointers never hover; make sure a stray touch can't pin the glow on.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const reset = () => {
      card.style.setProperty('--edge-proximity', '0');
    };
    card.addEventListener('pointerleave', reset);
    return () => card.removeEventListener('pointerleave', reset);
  }, []);

  const glowVars = buildGlowVars(glowColor, glowIntensity);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`}
      style={
        {
          '--card-bg': backgroundColor,
          '--edge-sensitivity': edgeSensitivity,
          '--border-radius': `${borderRadius}px`,
          '--glow-padding': `${glowRadius}px`,
          '--cone-spread': coneSpread,
          '--fill-opacity': fillOpacity,
          ...glowVars,
          ...buildGradientVars(colors as string[]),
        } as CSSProperties
      }
    >
      <span className="edge-light" aria-hidden />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}
