import type { ArgColor } from '@/lib/diagrams/types';

export interface WaterfallItem {
  label: string;
  value: number;
  /** "total" bars are anchored at zero; "delta" bars float from the running total. */
  type: 'total' | 'delta';
}

export interface WaterfallBadge {
  atIndex: number;
  color: ArgColor;
  note: string;
}

const colorVar = (c: ArgColor) => `var(--diag-${c})`;

const BORDER = 'var(--color-fd-border, #e5e7eb)';
const MUTED_FG = 'var(--color-fd-muted-foreground, #71717a)';
const FG = 'var(--color-fd-foreground, #18181b)';
const BG = 'var(--color-fd-card, #ffffff)';
const TOTAL = colorVar('blue');
const POSITIVE = colorVar('teal');
const NEGATIVE = colorVar('red');

const MARGIN_L = 44;
const MARGIN_R = 16;
const MARGIN_T = 60;
const MARGIN_B = 58;
const BAR_W = 64;
const GAP = 22;
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
 * A waterfall chart: "total" bars anchored at zero, "delta" bars floating
 * between running-total checkpoints, connected by dashed guide lines. Unlike
 * ParetoChart's bars (always anchored at zero), these bars can start and end
 * anywhere on the axis — the geometry here is "running total before" to
 * "running total after", not "zero" to "value".
 */
export function WaterfallChart({ items, badges }: { items: WaterfallItem[]; badges: WaterfallBadge[] }) {
  let running = 0;
  const bars = items.map((item) => {
    const before = running;
    if (item.type === 'total') {
      running = item.value;
      return { ...item, base: 0, top: item.value, before, after: item.value };
    }
    running = before + item.value;
    return { ...item, base: before, top: running, before, after: running };
  });

  const axisMax = niceAxisMax(Math.max(...bars.map((b) => Math.max(b.base, b.top))));

  const plotW = items.length * BAR_W + (items.length - 1) * GAP;
  const W = MARGIN_L + plotW + MARGIN_R;
  const H = MARGIN_T + PLOT_H + MARGIN_B;

  const barX = (i: number) => MARGIN_L + i * (BAR_W + GAP);
  const barCenterX = (i: number) => barX(i) + BAR_W / 2;
  const valueY = (v: number) => MARGIN_T + PLOT_H * (1 - v / axisMax);

  return (
    <figure className="fn-diagram not-prose my-6 rounded-xl border bg-fd-card p-4">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Waterfall chart from starting cash to ending cash"
          className="block h-auto w-full"
          style={{ minWidth: Math.min(560, W), maxWidth: W }}
        >
          {/* left axis */}
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

          {/* connector guides */}
          {bars.slice(0, -1).map((b, i) => (
            <line
              key={`conn${i}`}
              x1={barX(i) + BAR_W}
              x2={barX(i + 1)}
              y1={valueY(b.top)}
              y2={valueY(b.top)}
              stroke={MUTED_FG}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          ))}

          {/* bars */}
          {bars.map((b, i) => {
            const top = Math.max(b.base, b.top);
            const bottom = Math.min(b.base, b.top);
            const y = valueY(top);
            const height = Math.max(valueY(bottom) - y, 1);
            const color = b.type === 'total' ? TOTAL : b.value >= 0 ? POSITIVE : NEGATIVE;
            return (
              <g key={b.label}>
                <rect x={barX(i)} y={y} width={BAR_W} height={height} fill={color} rx={2} />
                <text x={barCenterX(i)} y={y - 8} textAnchor="middle" fontSize={11} fontWeight={600} fill={FG}>
                  {b.type === 'delta' && b.value > 0 ? `+${b.value}` : b.value}
                </text>
              </g>
            );
          })}

          {/* category labels */}
          {bars.map((b, i) => {
            const words = b.label.split(' ');
            const mid = Math.ceil(words.length / 2);
            return (
              <text
                key={`cat${i}`}
                x={barCenterX(i)}
                y={MARGIN_T + PLOT_H + 18}
                textAnchor="middle"
                fontSize={10.5}
                fill={MUTED_FG}
              >
                <tspan x={barCenterX(i)}>{words.slice(0, mid).join(' ')}</tspan>
                {words.length > 1 && (
                  <tspan x={barCenterX(i)} dy={13}>
                    {words.slice(mid).join(' ')}
                  </tspan>
                )}
              </text>
            );
          })}

          {/* callout badges */}
          {badges.map((bdg, i) => {
            const b = bars[bdg.atIndex];
            const topY = valueY(Math.max(b.base, b.top));
            // 34px clears the value label (drawn at topY - 8, ~11px tall) with
            // room to spare — tuned against a real render, not assumed from
            // the numbers alone (an earlier 18px offset visibly collided).
            return <Badge key={i} cx={barCenterX(bdg.atIndex)} cy={topY - 34} label={String(i + 1)} color={colorVar(bdg.color)} />;
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
