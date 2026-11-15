import { ArrowRight, ChevronDown } from 'lucide-react';
import type { ArgColor } from '@/lib/diagrams/types';

export interface PipelineValue {
  text: string;
  /** Visually de-emphasized — e.g. a duplicate about to be dropped. */
  muted?: boolean;
}

export interface PipelineStage {
  label: string;
  color: ArgColor;
  values: PipelineValue[];
  /** 'dropdown' renders the values as a mock Data Validation list instead of a plain stack. */
  variant?: 'list' | 'dropdown';
}

export interface PipelineBadge {
  /** Index of the arrow this badge sits on — 0 is the arrow between stage 0 and stage 1. */
  afterIndex: number;
  color: ArgColor;
  note: string;
}

const colorVar = (c: ArgColor) => `var(--diag-${c})`;
const BG = 'var(--color-fd-card, #ffffff)';

function Stage({ stage }: { stage: PipelineStage }) {
  return (
    <div className="w-32 shrink-0 overflow-hidden rounded-lg border border-fd-border">
      <div
        className="truncate px-2 py-1.5 text-center font-mono text-[11px] font-semibold"
        style={{ background: `color-mix(in oklab, ${colorVar(stage.color)} 16%, transparent)`, color: colorVar(stage.color) }}
      >
        {stage.label}
      </div>
      <div className="space-y-1 bg-fd-background p-1.5">
        {stage.variant === 'dropdown' ? (
          <div className="rounded-md border border-fd-border bg-fd-card">
            <div className="flex items-center justify-between px-1.5 py-1 text-xs">
              <span className="text-fd-muted-foreground">Select...</span>
              <ChevronDown className="size-3 text-fd-muted-foreground" />
            </div>
            <div className="border-t border-fd-border">
              {stage.values.map((v, i) => (
                <div key={i} className="px-1.5 py-0.5 text-xs text-fd-foreground">
                  {v.text}
                </div>
              ))}
            </div>
          </div>
        ) : (
          stage.values.map((v, i) => (
            <div
              key={i}
              className={`rounded px-1.5 py-0.5 text-center text-xs ${
                v.muted ? 'text-fd-muted-foreground line-through opacity-50' : 'bg-fd-card text-fd-foreground'
              }`}
            >
              {v.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
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

/**
 * A horizontal pipeline of labeled stage boxes connected by arrows, for
 * tutorials that walk through a sequence of transformations (source data ->
 * formula -> formula -> end result) rather than a single chart. Plain HTML/
 * flexbox, not SVG — unlike ParetoChart/WaterfallChart, there's no numeric
 * geometry to compute here, just boxes in a row.
 */
export function PipelineDiagram({ stages, badges }: { stages: PipelineStage[]; badges: PipelineBadge[] }) {
  const badgeByArrow = new Map(badges.map((b, i) => [b.afterIndex, { ...b, number: i + 1 }]));

  return (
    <figure className="fn-diagram not-prose my-6 rounded-xl border bg-fd-card p-4">
      <div className="flex items-center gap-1 overflow-x-auto py-2">
        {stages.map((stage, i) => (
          <div key={i} className="flex items-center gap-1">
            <Stage stage={stage} />
            {i < stages.length - 1 && (
              <div className="flex shrink-0 flex-col items-center gap-1">
                {badgeByArrow.has(i) && (
                  <Badge label={String(badgeByArrow.get(i)!.number)} color={colorVar(badgeByArrow.get(i)!.color)} />
                )}
                <ArrowRight className="size-4 text-fd-muted-foreground" />
              </div>
            )}
          </div>
        ))}
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
