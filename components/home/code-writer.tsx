'use client';

import { useEffect, useState } from 'react';

const SPEEDS = { Slow: 90, Normal: 45, Fast: 20 } as const;
type Speed = keyof typeof SPEEDS;

const PANELS = [
  {
    filename: 'dashboard.xlsx',
    badge: 'FORMULA',
    code: `// xlsdocs — XLOOKUP Examples
=XLOOKUP(D2, Products[Name], Products[Price])`,
  },
  {
    filename: 'automation.bas',
    badge: 'VBA',
    code: `Set ws = ActiveSheet
Application.ScreenUpdating = False
For i = ws.UsedRange.Rows.Count To 1 Step -1
  If Application.CountA(ws.Rows(i)) = 0 Then
    ws.Rows(i).Delete
  End If
Next i`,
  },
  {
    filename: 'lambdas.xlam',
    badge: 'λ FUNC',
    code: `ToQuarter = LAMBDA(d,
  CHOOSE(ROUNDUP(MONTH(d)/3, 0), "Q1", "Q2", "Q3", "Q4")
)`,
  },
  {
    filename: 'lookup.py',
    badge: 'PYTHON',
    code: `import pandas as pd

df = pd.read_excel("dashboard.xlsx", sheet_name="Products")
price = df.loc[df["Name"] == "Widget A", "Price"].iloc[0]
print(price)`,
  },
];

function TypingPanel({
  filename,
  badge,
  code,
  speed,
}: {
  filename: string;
  badge: string;
  code: string;
  speed: number;
}) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);
    const interval = setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= code.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [code, speed]);

  const lines = code.slice(0, visibleChars).split('\n');

  return (
    <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2 border-b border-fd-border px-3 py-2">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-500/70" />
          <span className="size-2.5 rounded-full bg-yellow-500/70" />
          <span className="size-2.5 rounded-full bg-green-500/70" />
        </span>
        <span className="ml-1 flex-1 truncate font-mono text-xs text-fd-muted-foreground">
          {filename}
        </span>
        <span className="rounded-full border border-fd-border px-2 py-0.5 font-mono text-[10px] text-fd-muted-foreground">
          {badge}
        </span>
      </div>
      <div className="min-h-[180px] p-4 font-mono text-[13px] leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3">
            <span className="w-4 shrink-0 text-right text-fd-muted-foreground/50 select-none">
              {i + 1}
            </span>
            <span className="whitespace-pre-wrap">
              {line}
              {i === lines.length - 1 && visibleChars < code.length && (
                <span className="ml-px inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-fd-primary" />
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CodeWriterSection() {
  const [speed, setSpeed] = useState<Speed>('Normal');

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-xs tracking-wider text-fd-primary uppercase">
            Live code engine
          </p>
          <h2 className="text-3xl">
            Watch <span className="font-serif text-fd-primary italic">real formulas</span> write
            in real time
          </h2>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-fd-border p-1">
          {(Object.keys(SPEEDS) as Speed[]).map((label) => (
            <button
              key={label}
              onClick={() => setSpeed(label)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                speed === label
                  ? 'bg-fd-primary text-fd-primary-foreground'
                  : 'text-fd-muted-foreground hover:text-fd-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {PANELS.map((panel) => (
          <TypingPanel key={panel.filename} {...panel} speed={SPEEDS[speed]} />
        ))}
      </div>
    </section>
  );
}
