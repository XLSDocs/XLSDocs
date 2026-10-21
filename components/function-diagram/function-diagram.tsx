import type { ReactNode } from 'react';
import { diagrams } from '@/lib/diagrams';
import type { ArgColor, DiagramSpec } from '@/lib/diagrams/types';

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

const ROW_HDR = 40; // width of the row-number column
const COL_HDR = 28; // height of the column-letter row
const RH = 34; // row height
const DEFAULT_W = 110; // default column width
const MIN_W = 520; // below this the grid scrolls instead of shrinking

const colorVar = (c: ArgColor) => `var(--diag-${c})`;
const tint = (cssColor: string, pct: number) =>
  `color-mix(in oklab, ${cssColor} ${pct}%, transparent)`;

const PRIMARY = 'var(--color-fd-primary, #00bc7d)';
const BORDER = 'var(--color-fd-border, #e5e7eb)';
const MUTED = 'var(--color-fd-muted, #f4f4f5)';
const FG = 'var(--color-fd-foreground, #18181b)';
const MUTED_FG = 'var(--color-fd-muted-foreground, #71717a)';
const BG = 'var(--color-fd-card, #ffffff)';

function colToIndex(letters: string) {
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

function parseCell(ref: string) {
  const m = /^\$?([A-Z]+)\$?(\d+)$/.exec(ref.trim().toUpperCase());
  if (!m) throw new Error(`FunctionDiagram: invalid cell reference "${ref}"`);
  return { c: colToIndex(m[1]), r: Number(m[2]) };
}

function parseRange(ref: string) {
  const [a, b = a] = ref.split(':');
  const p = parseCell(a);
  const q = parseCell(b);
  return {
    c1: Math.min(p.c, q.c),
    c2: Math.max(p.c, q.c),
    r1: Math.min(p.r, q.r),
    r2: Math.max(p.r, q.r),
  };
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isNumeric = (v: string | number) =>
  typeof v === 'number' || /^-?[\d,]*\.?\d+%?$/.test(v.trim());

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

/** Colors each argument reference in the formula the same as its range. */
function ColoredFormula({ spec }: { spec: DiagramSpec }) {
  const refs = [...spec.args].sort((a, b) => b.ref.length - a.ref.length);
  const re = new RegExp(
    `(?<![A-Za-z0-9$:])(${refs.map((a) => escapeRe(a.ref)).join('|')})(?![0-9:])`,
    'g',
  );
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of spec.formula.matchAll(re)) {
    const arg = spec.args.find((a) => a.ref === m[1])!;
    if (m.index! > last) out.push(spec.formula.slice(last, m.index));
    out.push(
      <span key={m.index} style={{ color: colorVar(arg.color) }}>
        {m[1]}
      </span>,
    );
    last = m.index! + m[1].length;
  }
  if (last < spec.formula.length) out.push(spec.formula.slice(last));
  return <>{out}</>;
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      aria-hidden
      className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
      style={{ background: color, color: BG }}
    >
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function FunctionDiagram({ fn, spec: specProp }: { fn?: string; spec?: DiagramSpec }) {
  const spec = specProp ?? (fn ? diagrams[fn.toLowerCase()] : undefined);
  if (!spec) throw new Error(`FunctionDiagram: no diagram spec found for "${fn}"`);

  const widths = spec.columns.map((c) => c.width ?? DEFAULT_W);
  const nRows = spec.rows.length;
  const colX = (i: number) => ROW_HDR + widths.slice(0, i).reduce((a, b) => a + b, 0);
  const rowY = (r: number) => COL_HDR + (r - 1) * RH;
  const W = colX(widths.length);
  const H = rowY(nRows + 1) + 1;

  const box = (ref: string) => {
    const g = parseRange(ref);
    if (g.c2 >= widths.length || g.r2 > nRows)
      throw new Error(`FunctionDiagram: "${ref}" is outside the grid for ${spec.title}`);
    return {
      x: colX(g.c1),
      y: rowY(g.r1),
      w: colX(g.c2 + 1) - colX(g.c1),
      h: (g.r2 - g.r1 + 1) * RH,
    };
  };

  const resultBox = box(spec.result.ref);

  // A column with mostly numbers right-aligns, header included, like Excel tables.
  const colAlign = spec.columns.map((col, c) => {
    if (col.align) return col.align;
    const vals = spec.rows.slice(1).map((r) => r[c]).filter((v) => v !== null && v !== undefined && v !== '');
    const nums = vals.filter((v) => isNumeric(v!)).length;
    return vals.length > 0 && nums / vals.length > 0.5 ? 'right' : 'left';
  });
  const boldCells = new Set([spec.result.ref.toUpperCase()]);

  return (
    <figure className="fn-diagram not-prose my-6 rounded-xl border bg-fd-card p-4">
      {/* Formula bar */}
      <div className="mb-4 flex items-center gap-3 overflow-x-auto rounded-md border bg-fd-background px-3 py-2 font-mono text-sm">
        <span className="text-fd-muted-foreground">{spec.formulaCell}</span>
        <span className="h-5 w-px bg-fd-border" />
        <span className="font-serif italic text-fd-muted-foreground">fx</span>
        <code className="whitespace-nowrap text-fd-foreground">
          <ColoredFormula spec={spec} />
        </code>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={spec.title}
          className="block h-auto w-full"
          style={{ minWidth: Math.min(MIN_W, W), maxWidth: W }}
        >
          {/* surfaces */}
          <rect width={W} height={H} fill={BG} />
          <rect width={W} height={COL_HDR} fill={MUTED} />
          <rect y={COL_HDR} width={ROW_HDR} height={H - COL_HDR} fill={MUTED} />

          {/* argument fills */}
          {spec.args.map((a) => {
            const b = box(a.ref);
            return (
              <rect key={`f-${a.ref}`} x={b.x} y={b.y} width={b.w} height={b.h} fill={tint(colorVar(a.color), 14)} />
            );
          })}
          {spec.match && (() => {
            const b = box(spec.match);
            return <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={`color-mix(in oklab, var(--diag-match) var(--diag-match-strength, 38%), transparent)`} />;
          })()}
          <rect x={resultBox.x} y={resultBox.y} width={resultBox.w} height={resultBox.h} fill={tint(PRIMARY, 16)} />

          {/* gridlines */}
          {Array.from({ length: nRows + 1 }, (_, i) => (
            <line key={`h${i}`} x1={0} x2={W} y1={rowY(i + 1)} y2={rowY(i + 1)} stroke={BORDER} />
          ))}
          {widths.map((_, i) => (
            <line key={`v${i}`} x1={colX(i + 1)} x2={colX(i + 1)} y1={0} y2={H} stroke={BORDER} />
          ))}
          <line x1={ROW_HDR} x2={ROW_HDR} y1={0} y2={H} stroke={BORDER} />
          <rect x={0.5} y={0.5} width={W - 1} height={H - 1} fill="none" stroke={BORDER} />

          {/* headers */}
          {spec.columns.map((c, i) => (
            <text key={`ch${i}`} x={colX(i) + widths[i] / 2} y={19} textAnchor="middle" fontSize={12} fill={MUTED_FG}>
              {c.label ?? String.fromCharCode(65 + i)}
            </text>
          ))}
          {spec.rows.map((_, r) => (
            <text key={`rh${r}`} x={ROW_HDR / 2} y={rowY(r + 1) + 21} textAnchor="middle" fontSize={12} fill={MUTED_FG}>
              {r + 1}
            </text>
          ))}

          {/* range borders */}
          {spec.args.map((a) => {
            const b = box(a.ref);
            return (
              <rect key={`b-${a.ref}`} x={b.x} y={b.y} width={b.w} height={b.h}
                fill="none" stroke={colorVar(a.color)} strokeWidth={2} />
            );
          })}
          <rect x={resultBox.x} y={resultBox.y} width={resultBox.w} height={resultBox.h}
            fill="none" stroke={PRIMARY} strokeWidth={2.5} />

          {/* cell values */}
          {spec.rows.map((row, r) =>
            row.map((v, c) => {
              if (v === null || v === undefined || v === '') return null;
              const ref = `${String.fromCharCode(65 + c)}${r + 1}`;
              const align = spec.columns[c]?.align ?? (r === 0 ? colAlign[c] : isNumeric(v) ? 'right' : 'left');
              const x =
                align === 'right' ? colX(c) + widths[c] - 10
                : align === 'center' ? colX(c) + widths[c] / 2
                : colX(c) + 10;
              const bold = (spec.headerRow !== false && r === 0) || boldCells.has(ref);
              return (
                <text key={ref} x={x} y={rowY(r + 1) + 21}
                  textAnchor={align === 'right' ? 'end' : align === 'center' ? 'middle' : 'start'}
                  fontSize={13} fontWeight={bold ? 600 : 400} fill={FG}>
                  {String(v)}
                </text>
              );
            }),
          )}

          {/* flow arrow (source left of target) */}
          {spec.arrow && (() => {
            const s = box(spec.arrow.from);
            const t = box(spec.arrow.to);
            const sx = s.x + s.w + 4;
            const sy = s.y + s.h / 2;
            const tx = t.x + t.w / 2;
            const dash = { fill: 'none', stroke: PRIMARY, strokeWidth: 2 } as const;
            if (Math.abs(sy - (t.y + t.h / 2)) < 1) {
              const ex = t.x - 4;
              return (
                <g>
                  <path d={`M ${sx} ${sy} H ${ex}`} {...dash} strokeDasharray="5 4" />
                  <path d={`M ${ex - 8} ${sy - 6} L ${ex} ${sy} L ${ex - 8} ${sy + 6}`} {...dash} />
                </g>
              );
            }
            const up = t.y < s.y;
            const ey = up ? t.y + t.h + 4 : t.y - 4;
            const k = up ? -8 : 8;
            return (
              <g>
                <path d={`M ${sx} ${sy} H ${tx - 8} Q ${tx} ${sy} ${tx} ${sy + k} V ${ey}`} {...dash} strokeDasharray="5 4" />
                <path d={`M ${tx - 6} ${ey - k} L ${tx} ${ey} L ${tx + 6} ${ey - k}`} {...dash} />
              </g>
            );
          })()}

          {/* step badges */}
          {spec.args.map((a, i) => {
            const at = a.badgeAt ?? a.ref.split(':')[0];
            const b = box(at);
            const cx = a.badgeSide === 'left' ? b.x + 18 : b.x + b.w - 16;
            const cy = b.y + b.h / 2;
            return (
              <g key={`badge-${i}`} aria-hidden>
                <circle cx={cx} cy={cy} r={9} fill={colorVar(a.color)} />
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={BG}>
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <ol className="mt-4 space-y-2 text-sm">
        {spec.args.map((a, i) => (
          <li key={a.ref} className="grid grid-cols-[1.25rem_1fr] items-center gap-x-3 gap-y-0.5 sm:grid-cols-[1.25rem_9.5rem_1fr]">
            <Badge label={String(i + 1)} color={colorVar(a.color)} />
            <code className="font-mono" style={{ color: colorVar(a.color) }}>{a.name}</code>
            <span className="col-start-2 text-fd-foreground sm:col-start-3">{a.note}</span>
          </li>
        ))}
        <li className="grid grid-cols-[1.25rem_1fr] items-center gap-x-3 gap-y-0.5 sm:grid-cols-[1.25rem_9.5rem_1fr]">
          <Badge label="✓" color={PRIMARY} />
          <code className="font-mono" style={{ color: PRIMARY }}>result</code>
          <span className="col-start-2 text-fd-foreground sm:col-start-3">{spec.result.note}</span>
        </li>
      </ol>
    </figure>
  );
}
