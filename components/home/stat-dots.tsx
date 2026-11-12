'use client';

import { useEffect, useRef, useState } from 'react';
import { textToDotGrid } from '@/lib/dot-matrix';

const COLS = 22;
const ROWS = 10;
const INTERVAL_MS = 3500;
const HALO_RADIUS = 6; // cells — how far the glow falloff reaches past the glyph itself

export interface Stat {
  value: string;
  caption: string;
}

// Deterministic pseudo-random in [0, 1), seeded by index — gives every dot
// a stable, varied twinkle timing without a client/server hydration mismatch
// the way Math.random() in render would.
function seeded(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function StatDots({ stats }: { stats: Stat[] }) {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (stats.length < 2 || reducedMotion) return;
    const id = setInterval(() => setActive((a) => (a + 1) % stats.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [stats.length, reducedMotion]);

  // Cursor-follow spotlight — written straight to the DOM via CSS custom
  // properties instead of React state, so moving the mouse never triggers
  // a re-render of all ~220 dots.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = gridRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    el.style.setProperty('--spot-opacity', '1');
  };
  const handleMouseLeave = () => {
    gridRef.current?.style.setProperty('--spot-opacity', '0');
  };

  const stat = stats[active];
  const glyphGrid = textToDotGrid(stat.value, ROWS);
  const width = glyphGrid[0]?.length ?? 0;
  const colOffset = Math.floor((COLS - width) / 2);

  const lit = new Set<string>();
  const litCells: [number, number][] = [];
  glyphGrid.forEach((row, r) =>
    row.forEach((on, c) => {
      if (on) {
        lit.add(`${r}-${c + colOffset}`);
        litCells.push([r, c + colOffset]);
      }
    }),
  );

  // Distance from every off dot to the nearest lit cell — drives a soft glow
  // halo around the glyph, like light bleeding into the surrounding grid,
  // instead of a flat on/off grid with a plain gray backdrop.
  const nearestLitDistance = (r: number, c: number) => {
    let min = Infinity;
    for (const [lr, lc] of litCells) {
      const d = Math.hypot(r - lr, c - lc);
      if (d < min) min = d;
      if (min <= 1) break;
    }
    return min;
  };

  return (
    <div>
      <div
        ref={gridRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative grid gap-[3px] overflow-hidden rounded-md"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        role="img"
        aria-label={`${stat.value} ${stat.caption}`}
      >
        {/* Spotlight overlay — brightens whatever background dots sit under the cursor */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: 'var(--spot-opacity, 0)',
            background:
              'radial-gradient(120px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, var(--color-fd-primary) 65%, transparent), transparent 70%)',
          }}
        />

        {Array.from({ length: ROWS * COLS }, (_, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const on = lit.has(`${r}-${c}`);
          const dist = on ? 0 : nearestLitDistance(r, c);
          // Glow falls off from ~0.4 right next to the glyph down to a dim 0.05 floor.
          const glowBase = on ? 1 : Math.max(0.05, 0.42 - (dist / HALO_RADIUS) * 0.37);
          const twinkleStyle =
            !on && !reducedMotion
              ? {
                  animationName: 'xlsdocs-dot-twinkle',
                  animationDuration: `${2.4 + seeded(i) * 2.6}s`,
                  animationTimingFunction: 'ease-in-out',
                  animationDelay: `${seeded(i * 7.3) * -5}s`,
                  animationIterationCount: 'infinite',
                  ['--twinkle-min' as string]: String(Math.max(0.04, glowBase - 0.06)),
                  ['--twinkle-max' as string]: String(Math.min(0.6, glowBase + 0.1)),
                }
              : undefined;
          return (
            <span
              key={i}
              aria-hidden
              className="aspect-square rounded-[2px] transition-[opacity,box-shadow] duration-500"
              style={{
                background: 'var(--color-fd-primary)',
                opacity: on || reducedMotion ? glowBase : undefined,
                boxShadow: on ? '0 0 6px var(--color-fd-primary)' : undefined,
                ...twinkleStyle,
              }}
            />
          );
        })}
      </div>

      <p className="mt-5 text-center text-sm text-fd-muted-foreground">
        <span className="font-semibold text-fd-foreground">{stat.value}</span> {stat.caption}
      </p>

      {stats.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {stats.map((s, i) => (
            <button
              key={s.value + s.caption}
              type="button"
              aria-label={`Show "${s.value} ${s.caption}"`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-5 bg-fd-primary' : 'w-1.5 bg-fd-border'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
