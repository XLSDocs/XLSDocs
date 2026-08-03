'use client';

import { useEffect, useRef } from 'react';

const RAIN_TOKENS = [
  '=XLOOKUP', 'FILTER(', 'LET(', 'MAX', 'MIN', '∑', '→', 'TRUE', 'FALSE',
  '=', '()', '{}', 'LAMBDA', 'UNIQUE', 'SORT', '#REF', '#N/A', '>=', '<=',
  'B2', 'A1', 'C:C', 'Q4', 'FY27', 'VSTACK', 'XMATCH',
];

interface RainColumn {
  x: number;
  y: number;
  speed: number;
  alpha: number;
  char: string;
  timer: number;
  interval: number;
}

function pick() {
  return RAIN_TOKENS[Math.floor(Math.random() * RAIN_TOKENS.length)];
}

/**
 * Calmer, non-interactive counterpart to `HeroCanvas` — a low-opacity
 * Matrix-style column of falling formula tokens, meant to sit behind real
 * content/UI (Formula Builder, docs landing) rather than a marketing hero.
 * Ported from the original static site's `#rain-canvas` script (see the
 * xlsdocs-original-hero-script memory note).
 */
export function CodeRainBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols: RainColumn[] = [];
    let rafId = 0;

    function init() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
      cols = [];
      const count = Math.floor(canvas!.width / 22);
      for (let i = 0; i < count; i++) {
        cols.push({
          x: i * 22,
          y: Math.random() * canvas!.height,
          speed: 0.25 + Math.random() * 0.5,
          alpha: 0.04 + Math.random() * 0.1,
          char: pick(),
          timer: 0,
          interval: 60 + Math.floor(Math.random() * 120),
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const col of cols) {
        col.y += col.speed;
        if (col.y > canvas!.height + 20) {
          col.y = -20;
          col.char = pick();
          col.alpha = 0.04 + Math.random() * 0.1;
        }
        col.timer++;
        if (col.timer > col.interval) {
          col.timer = 0;
          col.char = pick();
        }
        ctx!.font = '10px DM Mono, monospace';
        ctx!.fillStyle = `rgba(0,220,130,${col.alpha})`;
        ctx!.fillText(col.char, col.x, col.y);
      }
      rafId = requestAnimationFrame(draw);
    }

    init();
    rafId = requestAnimationFrame(draw);
    window.addEventListener('resize', init);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', init);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`h-full w-full ${className}`} />;
}
