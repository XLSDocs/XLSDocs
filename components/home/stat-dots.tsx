'use client';

import { useEffect, useState } from 'react';
import { textToDotGrid } from '@/lib/dot-matrix';

const COLS = 22;
const ROWS = 10;
const INTERVAL_MS = 3500;

export interface Stat {
  value: string;
  caption: string;
}

export function StatDots({ stats }: { stats: Stat[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (stats.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % stats.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [stats.length]);

  const stat = stats[active];
  const glyphGrid = textToDotGrid(stat.value, ROWS);
  const width = glyphGrid[0]?.length ?? 0;
  const colOffset = Math.floor((COLS - width) / 2);

  const lit = new Set<string>();
  glyphGrid.forEach((row, r) =>
    row.forEach((on, c) => {
      if (on) lit.add(`${r}-${c + colOffset}`);
    }),
  );

  return (
    <div>
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        role="img"
        aria-label={`${stat.value} ${stat.caption}`}
      >
        {Array.from({ length: ROWS * COLS }, (_, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const on = lit.has(`${r}-${c}`);
          return (
            <span
              key={i}
              aria-hidden
              className="aspect-square rounded-[2px] transition-colors duration-500"
              style={{
                background: on ? 'var(--color-fd-primary)' : 'var(--color-fd-muted-foreground)',
                opacity: on ? 1 : 0.18,
                boxShadow: on ? '0 0 6px var(--color-fd-primary)' : undefined,
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
