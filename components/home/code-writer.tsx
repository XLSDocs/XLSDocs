'use client';

import { useEffect, useState } from 'react';
import { highlightLine } from '../excel-code';

const SPEEDS = { Slow: 90, Normal: 45, Fast: 20 } as const;
type Speed = keyof typeof SPEEDS;

// A small, hand-tuned tokenizer for the VBA/Python demo panels — not a
// real parser, just enough to color keywords/functions/strings/numbers
// consistently with the Excel highlighter's palette (see excel-code.tsx).
function highlightGeneric(
  line: string,
  { keywords, functions, commentPrefix }: { keywords: string[]; functions: string[]; commentPrefix: string },
) {
  if (line.trimStart().startsWith(commentPrefix)) {
    return [
      <span key={0} style={{ color: 'var(--excel-punct)', fontStyle: 'italic' }}>
        {line}
      </span>,
    ];
  }

  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  const isWordChar = (c: string | undefined) => !!c && /\w/.test(c);
  const push = (color: string, text: string, weight?: string) =>
    nodes.push(
      <span key={key++} style={{ color, fontWeight: weight }}>
        {text}
      </span>,
    );

  while (i < line.length) {
    const rest = line.slice(i);
    if (line[i] === '"') {
      const end = line.indexOf('"', i + 1);
      const str = end === -1 ? rest : line.slice(i, end + 1);
      push('var(--excel-string)', str);
      i += str.length;
      continue;
    }
    const fnMatch = functions.find((fn) => rest.startsWith(fn) && rest[fn.length] === '(');
    if (fnMatch) {
      push('var(--excel-fn)', fnMatch, '500');
      i += fnMatch.length;
      continue;
    }
    const kwMatch = keywords.find(
      (kw) => rest.startsWith(kw) && !isWordChar(rest[kw.length]) && !isWordChar(line[i - 1]),
    );
    if (kwMatch) {
      push('var(--excel-keyword)', kwMatch, '500');
      i += kwMatch.length;
      continue;
    }
    const numMatch = !isWordChar(line[i - 1]) ? rest.match(/^-?\d+(\.\d+)?/) : null;
    if (numMatch) {
      push('var(--excel-number)', numMatch[0]);
      i += numMatch[0].length;
      continue;
    }
    if ('()[]'.includes(line[i]) || '<>=!&,.;:'.includes(line[i])) {
      push('var(--excel-punct)', line[i]);
      i++;
      continue;
    }
    nodes.push(line[i]);
    i++;
  }
  return nodes;
}

const VBA_KEYWORDS = ['Set', 'For', 'To', 'Step', 'If', 'Then', 'End', 'Next', 'True', 'False'];
const VBA_FUNCTIONS = ['CountA'];
const PYTHON_KEYWORDS = ['import', 'as'];
const PYTHON_FUNCTIONS = ['read_excel', 'print'];

const PANELS = [
  {
    filename: 'dashboard.xlsx',
    badge: 'FORMULA',
    language: 'excel' as const,
    code: `// xlsdocs — XLOOKUP Examples
=XLOOKUP(D2, Products[Name], Products[Price])`,
  },
  {
    filename: 'automation.bas',
    badge: 'VBA',
    language: 'vba' as const,
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
    language: 'excel' as const,
    code: `ToQuarter = LAMBDA(d,
  CHOOSE(ROUNDUP(MONTH(d)/3, 0), "Q1", "Q2", "Q3", "Q4")
)`,
  },
  {
    filename: 'lookup.py',
    badge: 'PYTHON',
    language: 'python' as const,
    code: `import pandas as pd

df = pd.read_excel("dashboard.xlsx", sheet_name="Products")
price = df.loc[df["Name"] == "Widget A", "Price"].iloc[0]
print(price)`,
  },
];

function highlightPanelLine(line: string, language: 'excel' | 'vba' | 'python') {
  if (language === 'excel') return highlightLine(line);
  if (language === 'vba') {
    return highlightGeneric(line, { keywords: VBA_KEYWORDS, functions: VBA_FUNCTIONS, commentPrefix: "'" });
  }
  return highlightGeneric(line, { keywords: PYTHON_KEYWORDS, functions: PYTHON_FUNCTIONS, commentPrefix: '#' });
}

function TypingPanel({
  filename,
  badge,
  code,
  speed,
  language,
}: {
  filename: string;
  badge: string;
  code: string;
  speed: number;
  language: 'excel' | 'vba' | 'python';
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
              {highlightPanelLine(line, language)}
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
