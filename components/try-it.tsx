'use client';

import { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { MiniGrid } from './mini-grid';
import { requestAskAIAboutSnippet } from '@/lib/ask-ai-events';

interface TryItProps {
  data: Record<string, string>;
  defaultValue?: string;
  /** Use the literal token `{value}` anywhere in the string to have it
   *  swapped for the current input value — labels can't be functions
   *  since this renders as a Client Component and MDX bodies are
   *  Server Components; functions can't cross that boundary as props. */
  label?: string;
  fieldLabel?: string;
  /** Shown in place of the default `#N/A` when the input doesn't match —
   *  lets a function whose real behavior is "replace the error with a
   *  fallback" (e.g. IFERROR) demo that fallback honestly instead of
   *  always showing the raw unwrapped error. */
  errorValue?: string;
  /** Optional mini spreadsheet shown above the input, for functions where
   *  seeing an actual cell/range highlighted makes the demo click (ROW,
   *  COLUMN, OFFSET, and the like) — skipped entirely for functions where
   *  a fake grid wouldn't add anything (most value-lookup demos). */
  grid?: {
    cols: string[];
    rowCount: number;
    /** Static grid content, used as-is (optionally with `highlightMap`
     *  picking out which cells to highlight) — the common case for
     *  functions whose argument is literally a reference (ROW, COLUMN,
     *  OFFSET, DSUM's criteria value). Ignored when `rowsByInput` is set. */
    values?: Record<string, string>;
    /** Maps the raw input value to the cell/range reference to highlight —
     *  for a function whose argument isn't itself a reference (OFFSET's
     *  numeric row offset, say). Plain data, not a function, since this
     *  is a Client Component and MDX bodies are Server Components — same
     *  reason `label` can't be a function either. Falls back to
     *  highlighting `value` directly when omitted, which covers the
     *  common case (ROW, COLUMN, ROWS, COLUMNS all take a real reference
     *  as their argument already). */
    highlightMap?: Record<string, string>;
    /** For functions with no natural "which cell" story (PMT, SLN) but a
     *  real "what does this actually look like" one instead — swaps the
     *  grid's entire content per selected example (e.g. the first few
     *  months of an amortization schedule, which differs by loan term).
     *  Every possible input needs its own precomputed table here since,
     *  again, this can't be a function — keyed the same way as `data`.
     *  No highlighting in this mode; the whole table is the point. */
    rowsByInput?: Record<string, Record<string, string>>;
  };
}

export function TryIt({
  data,
  defaultValue = '',
  label = 'Live preview',
  fieldLabel = 'lookup_value',
  errorValue = '#N/A',
  grid,
}: TryItProps) {
  const [value, setValue] = useState(defaultValue);
  const resolvedLabel = label.includes('{value}') ? label.replaceAll('{value}', value) : label;
  const normalizedValue = value.trim().toLowerCase();

  // Every lookup below matches on a lowercased key, but `data`/`grid.*`
  // are hand-authored MDX props — nothing enforces that their keys are
  // already lowercase (several pages write capitalized keys like
  // 'January 15, 2027', matching their own defaultValue exactly). Without
  // normalizing here too, that literal-cased key silently never matches
  // the lowercased lookup, and the widget shows the error state
  // unconditionally. Normalizing the data itself — not just the typed
  // value — makes every key casing work, instead of relying on every
  // future page remembering an undocumented lowercase-only convention.
  const normalizeEntries = (obj: Record<string, string>) => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj)) out[k.trim().toLowerCase()] = v;
    return out;
  };
  const normalizedData = useMemo(() => normalizeEntries(data), [data]);
  const normalizedRowsByInput = useMemo(() => {
    if (!grid?.rowsByInput) return undefined;
    const out: Record<string, Record<string, string>> = {};
    for (const [k, v] of Object.entries(grid.rowsByInput)) out[k.trim().toLowerCase()] = v;
    return out;
  }, [grid?.rowsByInput]);
  const normalizedHighlightMap = useMemo(
    () => (grid?.highlightMap ? normalizeEntries(grid.highlightMap) : undefined),
    [grid?.highlightMap],
  );

  const result = useMemo(() => {
    const match = normalizedData[normalizedValue];
    return match ?? errorValue;
  }, [normalizedValue, normalizedData, errorValue]);

  const found = result !== errorValue;

  // resolvedLabel is always "Live preview — <formula>" by convention across
  // every page that uses TryIt — strip that prefix so what's left is just
  // the formula. AskClaude's shared snippet handler (see ask-claude.tsx)
  // already prepends "Explain this formula:" to whatever snippet it's
  // given, so this stays a plain "<formula> returns <result>" fragment
  // rather than a full sentence — matching the same convention ExcelCode's
  // sparkle button already uses, not a competing one.
  const formulaPart = resolvedLabel.replace(/^Live preview\s*—\s*/, '');
  const askAISnippet = `${formulaPart} returns ${result}`;

  // Cell/range references (e.g. "a5", "a1:c1") display fully uppercase,
  // matching Excel's own convention — capitalizing only the first letter
  // would leave a range like "a1:a5" as "A1:a5". Anything else (a plain
  // word like "apple" or "west") just gets its first letter capitalized.
  const isReference = (key: string) => /^[a-z]+\d+(:[a-z]+\d+)?$/.test(key);
  const displayLabel = (key: string) =>
    isReference(key) ? key.toUpperCase() : key.charAt(0).toUpperCase() + key.slice(1);

  const isTryValueActive = (key: string) => normalizedValue === key.trim().toLowerCase();

  return (
    <div className="not-prose rounded-xl border bg-fd-card overflow-hidden my-4">
      <div className="flex items-center gap-2 px-3.5 py-2 bg-fd-muted border-b text-[11px] font-mono uppercase tracking-wider text-fd-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-fd-primary" />
        {resolvedLabel}
      </div>
      <div className="p-4 flex flex-col gap-2">
        {grid && (
          <div className="mb-1">
            <MiniGrid
              cols={grid.cols}
              rowCount={grid.rowCount}
              values={normalizedRowsByInput ? (normalizedRowsByInput[normalizedValue] ?? {}) : (grid.values ?? {})}
              highlight={
                normalizedRowsByInput
                  ? ''
                  : normalizedHighlightMap
                    ? (normalizedHighlightMap[normalizedValue] ?? '')
                    : value
              }
            />
          </div>
        )}
        <div className="grid grid-cols-[110px_1fr] items-center gap-2">
          <span className="font-mono text-xs text-fd-primary">{fieldLabel}</span>
          <input
            className="bg-fd-muted border rounded px-2.5 py-1.5 font-mono text-xs outline-none focus:border-fd-primary"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5 pl-[118px] text-[11px] text-fd-muted-foreground">
          <span>Try:</span>
          {Object.keys(data).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setValue(displayLabel(key))}
              className={`rounded border px-1.5 py-0.5 font-mono text-[10px] transition-colors ${
                isTryValueActive(key)
                  ? 'border-fd-primary/50 bg-fd-primary/15 text-fd-primary'
                  : 'border-fd-border bg-fd-muted text-fd-muted-foreground hover:border-fd-primary/40 hover:text-fd-primary'
              }`}
            >
              {displayLabel(key)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-[110px_1fr] items-center gap-2 border-t pt-2.5 mt-1">
          <span className="font-mono text-[10px] uppercase tracking-wide text-fd-muted-foreground">
            Result
          </span>
          <span className={`font-mono text-sm ${found ? 'text-fd-primary' : 'text-red-400'}`}>
            {result}
          </span>
        </div>
        <button
          type="button"
          onClick={() => requestAskAIAboutSnippet(askAISnippet)}
          className="inline-flex w-fit items-center gap-1.5 text-xs text-fd-muted-foreground transition-colors hover:text-fd-primary"
        >
          <Sparkles className="size-3.5" />
          Ask AI about this
        </button>
      </div>
    </div>
  );
}
