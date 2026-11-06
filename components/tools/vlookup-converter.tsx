'use client';

import { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { convertVlookup } from '@/lib/vlookup-converter';

const EXAMPLES = [
  { label: 'Exact match', formula: '=VLOOKUP(A2, Sheet1!B2:D100, 3, FALSE)' },
  { label: 'Approximate match', formula: '=VLOOKUP(A2, B2:D100, 2, TRUE)' },
  { label: 'range_lookup omitted', formula: '=VLOOKUP(A2, B2:D100, 2)' },
];

function ResultBlock({ label, formula }: { label: string; formula: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      <div className="flex items-center justify-between border-b border-fd-border px-4 py-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-fd-muted-foreground">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md border border-fd-border px-2 py-1 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto px-4 py-3">
        <code className="whitespace-nowrap font-mono text-sm text-fd-primary">{formula}</code>
      </div>
    </div>
  );
}

export function VlookupConverter() {
  const [input, setInput] = useState('=VLOOKUP(A2, Sheet1!B2:D100, 3, FALSE)');

  const result = useMemo(() => convertVlookup(input), [input]);

  return (
    <div className="mx-auto max-w-4xl px-6 pt-16 pb-20">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border px-3 py-1 font-mono text-xs text-fd-muted-foreground">
          Runs in your browser
        </span>
        <h1 className="mt-6 text-4xl font-normal md:text-5xl">
          VLOOKUP <span className="font-serif text-fd-primary italic">→</span> XLOOKUP Converter
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-fd-muted-foreground">
          Paste an existing VLOOKUP formula and get the exact XLOOKUP (and
          INDEX/MATCH) equivalent — including the easy-to-miss default
          match-type behavior. Nothing here is sent anywhere.
        </p>
      </div>

      <div className="mx-auto mt-10 rounded-xl border border-fd-border bg-fd-card/80 p-3 text-left">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, 500))}
          placeholder="=VLOOKUP(A2, Sheet1!B2:D100, 3, FALSE)"
          rows={3}
          className="w-full resize-none bg-transparent font-mono text-sm outline-none placeholder:text-fd-muted-foreground"
          spellCheck={false}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => setInput(ex.formula)}
            className="rounded-full border border-fd-border bg-fd-card px-3 py-1.5 text-xs font-medium text-fd-muted-foreground transition-colors hover:border-fd-primary/50 hover:text-fd-foreground"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {'error' in result ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-amber-400">
            {result.error}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <ResultBlock label="XLOOKUP" formula={result.xlookup} />
            <ResultBlock label="INDEX / MATCH" formula={result.indexMatch} />
            {result.notes.length > 0 && (
              <div className="flex flex-col gap-2">
                {result.notes.map((note, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-amber-400"
                  >
                    {note}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-fd-border bg-fd-background p-4 text-sm text-fd-muted-foreground">
        <span className="font-medium text-fd-foreground">Scope: </span>
        this only converts a plain cell-range table_array (like{' '}
        <code className="font-mono text-fd-primary">B2:D100</code> or{' '}
        <code className="font-mono text-fd-primary">Sheet1!B:D</code>) with a
        literal col_index_num. A named range or Table reference (
        <code className="font-mono text-fd-primary">Table1[#All]</code>)
        doesn&apos;t show its column layout in the formula text itself, so
        those can&apos;t be converted automatically — the tool will say so
        rather than guess.
      </div>
    </div>
  );
}
