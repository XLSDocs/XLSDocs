import type { ArgColor } from '@/lib/diagrams/types';

export interface ParetoItem {
  label: string;
  value: number;
}

export interface ParetoBadge {
  /** Index into `items` this badge points at. */
  atIndex: number;
  color: ArgColor;
  note: string;
}

const colorVar = (c: ArgColor) => `var(--diag-${c})`;

const PRIMARY = 'var(--color-fd-primary, #00bc7d)';
const BORDER = 'var(--color-fd-border, #e5e7eb)';
const MUTED_FG = 'var(--color-fd-muted-foreground, #71717a)';
const FG = 'var(--color-fd-foreground, #18181b)';
const BG = 'var(--color-fd-card, #ffffff)';
const RED = colorVar('red');
const AMBER = colorVar('amber');

const MARGIN_L = 44;
const MARGIN_R = 48;
const MARGIN_T = 44;
const MARGIN_B = 58;
const BAR_W = 56;
const GAP = 18;
const PLOT_H = 230;

function niceAxisMax(max: number) {
  const step = max <= 50 ? 10 : max <= 100 ? 20 : 50;
  return Math.ceil(max / step) * step;
}

function Badge({ cx, cy, label, color }: { cx: number; cy: number; label: string; color: string }) {
  return (
    <g aria-hidden>
      <circle cx={cx} cy={cy} r={10} fill={color} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={BG}>
        {label}
      </text>
    </g>
  );
}

/**
 * A Pareto chart (sorted bars + cumulative-% line + 80% threshold) with
 * numbered callouts, for the "how it works" diagram inside a tutorial post.
 * `items` must already be in the display order the chart should use —
 * this component draws and computes cumulative % from that order, it
 * doesn't re-sort (a Pareto chart conventionally puts an "Other" bucket
 * last regardless of its own rank by value, which the author decides,
 * not something to infer automatically).
 */
export function ParetoChart({
  items,
  badges,
  threshold = 80,
}: {
  items: ParetoItem[];
  badges: ParetoBadge[];
  threshold?: number;
}) {
  const total = items.reduce((sum, i) => sum + i.value, 0);
  let running = 0;
  const points = items.map((item) => {
    running += item.value;
    return { ...item, percentOfTotal: (item.value / total) * 100, cumulativePercent: (running / total) * 100 };
  });

  const vitalFewIndex = points.findIndex((p) => p.cumulativePercent >= threshold);
  const axisMax = niceAxisMax(Math.max(...items.map((i) => i.value)));

  const plotW = items.length * BAR_W + (items.length - 1) * GAP;
  const W = MARGIN_L + plotW + MARGIN_R;
  const H = MARGIN_T + PLOT_H + MARGIN_B;

  const barX = (i: number) => MARGIN_L + i * (BAR_W + GAP);
  const barCenterX = (i: number) => barX(i) + BAR_W / 2;
  const valueY = (v: number) => MARGIN_T + PLOT_H * (1 - v / axisMax);
  const percentY = (p: number) => MARGIN_T + PLOT_H * (1 - p / 100);
  const thresholdY = percentY(threshold);

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${barCenterX(i)} ${percentY(p.cumulativePercent)}`).join(' ');

  return (
    <figure className="fn-diagram not-prose my-6 rounded-xl border bg-fd-card p-4">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Pareto chart of ticket volume by root cause, with cumulative percent"
          className="block h-auto w-full"
          style={{ minWidth: Math.min(560, W), maxWidth: W }}
        >
          {/* left axis (count) */}
          {[0, 0.5, 1].map((f) => {
            const y = MARGIN_T + PLOT_H * (1 - f);
            return (
              <g key={`l${f}`}>
                <line x1={MARGIN_L} x2={W - MARGIN_R} y1={y} y2={y} stroke={BORDER} />
                <text x={MARGIN_L - 8} y={y + 4} textAnchor="end" fontSize={11} fill={MUTED_FG}>
                  {Math.round(axisMax * f)}
                </text>
              </g>
            );
          })}
          {/* right axis (cumulative %) */}
          {[0, 50, 100].map((p) => (
            <text key={`r${p}`} x={W - MARGIN_R + 8} y={percentY(p) + 4} fontSize={11} fill={AMBER}>
              {p}%
            </text>
          ))}

          {/* 80% threshold */}
          <line
            x1={MARGIN_L}
            x2={W - MARGIN_R}
            y1={thresholdY}
            y2={thresholdY}
            stroke={RED}
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />

          {/* bars */}
          {points.map((p, i) => {
            const y = valueY(p.value);
            return (
              <g key={p.label}>
                <rect
                  x={barX(i)}
                  y={y}
                  width={BAR_W}
                  height={MARGIN_T + PLOT_H - y}
                  fill={i === vitalFewIndex ? AMBER : PRIMARY}
                  opacity={i <= vitalFewIndex ? 1 : 0.45}
                  rx={2}
                />
                <text x={barCenterX(i)} y={y - 8} textAnchor="middle" fontSize={11} fontWeight={600} fill={FG}>
                  {p.value}
                </text>
              </g>
            );
          })}

          {/* cumulative % line */}
          <path d={linePath} fill="none" stroke={AMBER} strokeWidth={2} />
          {points.map((p, i) => (
            <circle key={`pt${i}`} cx={barCenterX(i)} cy={percentY(p.cumulativePercent)} r={3} fill={AMBER} />
          ))}

          {/* vital-few crossing marker */}
          {vitalFewIndex >= 0 && (
            <line
              x1={barCenterX(vitalFewIndex)}
              x2={barCenterX(vitalFewIndex)}
              y1={percentY(points[vitalFewIndex].cumulativePercent)}
              y2={thresholdY}
              stroke={RED}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
          )}

          {/* category labels */}
          {points.map((p, i) => (
            <text
              key={`cat${i}`}
              x={barCenterX(i)}
              y={MARGIN_T + PLOT_H + 18}
              textAnchor="middle"
              fontSize={10.5}
              fill={MUTED_FG}
            >
              <tspan x={barCenterX(i)}>{p.label.split(' ').slice(0, Math.ceil(p.label.split(' ').length / 2)).join(' ')}</tspan>
              {p.label.includes(' ') && (
                <tspan x={barCenterX(i)} dy={13}>
                  {p.label.split(' ').slice(Math.ceil(p.label.split(' ').length / 2)).join(' ')}
                </tspan>
              )}
            </text>
          ))}

          {/* callout badges */}
          {badges.map((b, i) => {
            const barTop = valueY(points[b.atIndex].value);
            const lineTop = percentY(points[b.atIndex].cumulativePercent);
            const cy = Math.min(barTop, lineTop) - 18;
            return <Badge key={i} cx={barCenterX(b.atIndex)} cy={cy} label={String(i + 1)} color={colorVar(b.color)} />;
          })}
        </svg>
      </div>

      <ol className="mt-4 space-y-2 text-sm">
        {badges.map((b, i) => (
          <li key={i} className="grid grid-cols-[1.25rem_1fr] items-start gap-x-3 gap-y-0.5">
            <span
              aria-hidden
              className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
              style={{ background: colorVar(b.color), color: BG }}
            >
              {i + 1}
            </span>
            <span className="text-fd-foreground">{b.note}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
