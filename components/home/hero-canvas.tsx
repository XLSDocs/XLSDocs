'use client';

import { useEffect, useRef, type RefObject } from 'react';

const FN_NAMES = [
  'XLOOKUP', 'LAMBDA', 'SUMIFS', 'FILTER', 'INDEX', 'UNIQUE',
  'LET', 'SORT', 'XMATCH', 'TEXTAFTER', 'SEQUENCE', 'VSTACK',
];

const HPAL = [
  (a: number) => `rgba(0,120,60,${a})`,
  (a: number) => `rgba(0,160,80,${a})`,
  (a: number) => `rgba(0,200,100,${a})`,
  (a: number) => `rgba(0,220,130,${a})`,
  (a: number) => `rgba(100,240,170,${a})`,
  (a: number) => `rgba(200,255,230,${a})`,
];

const COL_W = 5;
const COL_GAP = 4;
const PANEL_GAP = 26;

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface Bar {
  y: number;
  h: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  colorT: number;
}
interface Column {
  x: number;
  bars: Bar[];
}
interface Scanner {
  x: number;
  dir: 1 | -1;
  speed: number;
  width: number;
  peak: number;
  tint: 'cold' | 'warm';
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  text: string;
  size: number;
}
interface Ripple {
  x: number;
  y: number;
  r: number;
  alpha: number;
  fn: string;
}

/**
 * Ported from the original static site's vanilla-JS hero canvas (see the
 * xlsdocs-original-hero-script memory note) — columns of bars reacting to
 * sweeping "scanner" beams, mouse proximity, click ripples, and drifting
 * formula-name particles. Mouse/click listeners attach to `containerRef`
 * (the whole hero section, not just the canvas) so hovering over the
 * headline/buttons still triggers the effect, matching the original.
 */
export function HeroCanvas({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const tip = tipRef.current;
    if (!container || !canvas || !tip) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols: Column[] = [];
    let scanners: Scanner[] = [];
    let particles: Particle[] = [];
    let ripples: Ripple[] = [];
    let mouseX = -999;
    let mouseY = -999;
    let lastFn = 0;
    let ht = 0;
    let rafId = 0;
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    }

    function buildCols() {
      const W = canvas!.width;
      const H = canvas!.height;
      cols = [];
      let x = 0;
      while (x < W) {
        const n = Math.floor(rnd(4, 13));
        for (let i = 0; i < n; i++) {
          const nb = Math.floor(rnd(2, 6));
          const bars: Bar[] = [];
          for (let b = 0; b < nb; b++) {
            const h = rnd(H * 0.06, H * 0.72);
            bars.push({
              y: rnd(0, H - h),
              h,
              baseAlpha: rnd(0.05, 0.2),
              phase: rnd(0, Math.PI * 2),
              speed: rnd(0.003, 0.016),
              colorT:
                Math.random() < 0.1
                  ? Math.floor(rnd(4, 6))
                  : Math.random() < 0.28
                    ? Math.floor(rnd(2, 4))
                    : Math.floor(rnd(0, 2)),
            });
          }
          cols.push({ x, bars });
          x += COL_W + COL_GAP;
        }
        x += PANEL_GAP;
      }
    }

    function spawnScanner() {
      const W = canvas!.width;
      const fromLeft = Math.random() > 0.25;
      scanners.push({
        x: fromLeft ? -220 : W + 220,
        dir: fromLeft ? 1 : -1,
        speed: rnd(1.1, 2.6),
        width: rnd(90, 260),
        peak: rnd(1.4, 3.2),
        tint: Math.random() < 0.15 ? 'cold' : 'warm',
      });
    }

    function spawnParticle() {
      const W = canvas!.width;
      const H = canvas!.height;
      particles.push({
        x: rnd(W * 0.3, W),
        y: rnd(H * 0.1, H * 0.85),
        vx: rnd(-0.15, 0.15),
        vy: rnd(-0.3, -0.08),
        alpha: rnd(0.08, 0.22),
        life: 0,
        text: '=' + FN_NAMES[Math.floor(rnd(0, FN_NAMES.length))] + '()',
        size: Math.random() < 0.3 ? 10 : 9,
      });
    }

    resize();
    buildCols();
    spawnScanner();
    timers.push(setTimeout(spawnScanner, 1400));
    timers.push(setTimeout(spawnScanner, 3000));
    const scannerInterval = setInterval(() => {
      if (scanners.length < 4) spawnScanner();
    }, 1600);
    for (let i = 0; i < 8; i++) timers.push(setTimeout(spawnParticle, i * 400));
    const particleInterval = setInterval(() => {
      if (particles.length < 12) spawnParticle();
    }, 1200);

    function handleResize() {
      resize();
      buildCols();
    }
    function handleMouseMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
      tip!.style.left = e.clientX + 14 + 'px';
      tip!.style.top = e.clientY - 24 + 'px';
      tip!.style.opacity = '1';
      tip!.textContent = '=' + FN_NAMES[lastFn % FN_NAMES.length] + '(...)';
    }
    function handleMouseLeave() {
      mouseX = -999;
      mouseY = -999;
      tip!.style.opacity = '0';
    }
    function handleClick(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      ripples.push({
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        r: 0,
        alpha: 0.5,
        fn: FN_NAMES[lastFn++ % FN_NAMES.length],
      });
      spawnScanner();
    }

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);

    function loop() {
      const W = canvas!.width;
      const H = canvas!.height;
      ctx!.clearRect(0, 0, W, H);
      ht += 0.012;
      // Vignette base color: near-black blends into the dark page background;
      // in light mode that same near-opaque black instead sits as a stark
      // patch on top of an otherwise white page, so it needs its own,
      // near-white base to blend in the same way. Checked live each frame
      // (cheap) so toggling the theme mid-session updates it immediately.
      const isDark = document.documentElement.classList.contains('dark');
      const vignetteRgb = isDark ? '10,10,10' : '245,245,245';

      for (let i = scanners.length - 1; i >= 0; i--) {
        const s = scanners[i];
        s.x += s.speed * s.dir;
        if (s.dir > 0 ? s.x > W + 320 : s.x < -320) scanners.splice(i, 1);
      }

      for (const col of cols) {
        for (const bar of col.bars) {
          const pulse = 0.5 + 0.5 * Math.sin(ht * bar.speed * 55 + bar.phase);
          let sb = 0;
          for (const s of scanners) {
            const d = Math.abs(col.x - s.x);
            if (d < s.width) {
              const f = 1 - d / s.width;
              sb += f * f * (3 - 2 * f) * s.peak;
            }
          }
          const md = Math.abs(col.x - mouseX);
          if (md < 90) {
            const mf = 1 - md / 90;
            sb += mf * mf * 1.8;
          }
          const a = Math.min(1, bar.baseAlpha * (0.55 + 0.45 * pulse) * (1 + sb));
          let cT = bar.colorT;
          if (sb > 0.8) cT = Math.min(5, cT + Math.floor(sb * 1.4));
          else if (sb > 0.3) cT = Math.min(4, cT + 1);
          const cf = HPAL[cT];
          const y = bar.y;
          const h = bar.h;
          const gr = ctx!.createLinearGradient(0, y, 0, y + h);
          gr.addColorStop(0, cf(0));
          gr.addColorStop(0.15, cf(a * 0.5));
          gr.addColorStop(0.45, cf(a));
          gr.addColorStop(0.75, cf(a * 0.65));
          gr.addColorStop(1, cf(0));
          ctx!.fillStyle = gr;
          ctx!.fillRect(col.x, y, COL_W, h);

          if (cT >= 4 || sb > 0.5) {
            const ca = Math.min(0.88, a * 0.7);
            const cg = ctx!.createLinearGradient(0, y, 0, y + h);
            cg.addColorStop(0, 'rgba(255,255,255,0)');
            cg.addColorStop(0.38, `rgba(255,255,255,${ca * 0.35})`);
            cg.addColorStop(0.5, `rgba(255,255,255,${ca})`);
            cg.addColorStop(0.62, `rgba(255,255,255,${ca * 0.35})`);
            cg.addColorStop(1, 'rgba(255,255,255,0)');
            ctx!.fillStyle = cg;
            ctx!.fillRect(col.x + COL_W * 0.3, y, COL_W * 0.4, h);
          }
        }
      }

      for (const s of scanners) {
        if (s.x < -s.width * 2 || s.x > W + s.width * 2) continue;
        const g1 = s.tint === 'cold' ? 200 : 220;
        const b1 = s.tint === 'cold' ? 130 : 80;
        const beam = ctx!.createRadialGradient(s.x, H * 0.44, 0, s.x, H * 0.44, s.width * 1.15);
        beam.addColorStop(0, `rgba(0,${g1},${b1},0.05)`);
        beam.addColorStop(0.5, `rgba(0,${g1},${b1},0.02)`);
        beam.addColorStop(1, `rgba(0,${g1},${b1},0)`);
        ctx!.fillStyle = beam;
        ctx!.fillRect(s.x - s.width * 1.6, 0, s.width * 3.2, H);
      }

      if (mouseX > 0) {
        const mg = ctx!.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 110);
        mg.addColorStop(0, 'rgba(0,220,130,0.07)');
        mg.addColorStop(0.5, 'rgba(0,220,130,0.025)');
        mg.addColorStop(1, 'rgba(0,220,130,0)');
        ctx!.fillStyle = mg;
        ctx!.beginPath();
        ctx!.arc(mouseX, mouseY, 110, 0, Math.PI * 2);
        ctx!.fill();
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 3.5;
        rp.alpha *= 0.95;
        if (rp.alpha < 0.01) {
          ripples.splice(i, 1);
          continue;
        }
        ctx!.beginPath();
        ctx!.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(0,220,130,${rp.alpha})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
        if (rp.r < 60) {
          ctx!.font = '11px DM Mono, monospace';
          ctx!.fillStyle = `rgba(0,220,130,${rp.alpha * 1.5})`;
          ctx!.textAlign = 'center';
          ctx!.fillText('=' + rp.fn + '()', rp.x, rp.y - rp.r - 6);
          ctx!.textAlign = 'left';
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 0.008;
        p.x += p.vx;
        p.y += p.vy;
        const a = p.alpha * (1 - Math.min(1, p.life * 1.2));
        if (a < 0.005) {
          particles.splice(i, 1);
          continue;
        }
        ctx!.font = `${p.size}px DM Mono, monospace`;
        ctx!.fillStyle = `rgba(0,200,100,${a})`;
        ctx!.fillText(p.text, p.x, p.y);
      }

      const vL = ctx!.createLinearGradient(0, 0, W * 0.46, 0);
      vL.addColorStop(0, `rgba(${vignetteRgb},0.93)`);
      vL.addColorStop(0.36, `rgba(${vignetteRgb},0.26)`);
      vL.addColorStop(1, `rgba(${vignetteRgb},0)`);
      ctx!.fillStyle = vL;
      ctx!.fillRect(0, 0, W, H);

      const vB = ctx!.createLinearGradient(0, H * 0.6, 0, H);
      vB.addColorStop(0, `rgba(${vignetteRgb},0)`);
      vB.addColorStop(1, `rgba(${vignetteRgb},0.55)`);
      ctx!.fillStyle = vB;
      ctx!.fillRect(0, 0, W, H);

      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(scannerInterval);
      clearInterval(particleInterval);
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
    };
  }, [containerRef]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" />
      <span
        ref={tipRef}
        className="pointer-events-none fixed z-50 rounded-md border border-fd-border bg-fd-popover px-2 py-1 font-mono text-xs text-fd-primary opacity-0 transition-opacity"
      />
    </div>
  );
}
