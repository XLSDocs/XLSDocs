'use client';

import { useState, useMemo } from 'react';
import { MiniGrid } from './mini-grid';

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
    values: Record<string, string>;
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

  const result = useMemo(() => {
    const match = data[value.trim().toLowerCase()];
    return match ?? errorValue;
  }, [value, data, errorValue]);

  const found = result !== errorValue;
  const tryValues = Object.keys(data)
    .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
    .join(', ');

  return (
    <div className="not-prose rounded-xl border bg-fd-card overflow-hidden my-4">
      <div className="flex items-center gap-2 px-3.5 py-2 bg-fd-muted border-b text-[11px] font-mono uppercase tracking-wider text-fd-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-fd-primary" />
        {resolvedLabel}
      </div>
      <div className="p-4 flex flex-col gap-2">
        {grid && (
          <div className="mb-1">
            <MiniGrid cols={grid.cols} rowCount={grid.rowCount} values={grid.values} highlight={value} />
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
        <p className="pl-[118px] text-[11px] text-fd-muted-foreground">
          Edit the field above — try {tryValues}
        </p>
        <div className="grid grid-cols-[110px_1fr] items-center gap-2 border-t pt-2.5 mt-1">
          <span className="font-mono text-[10px] uppercase tracking-wide text-fd-muted-foreground">
            Result
          </span>
          <span className={`font-mono text-sm ${found ? 'text-fd-primary' : 'text-red-400'}`}>
            {result}
          </span>
        </div>
      </div>
    </div>
  );
}
