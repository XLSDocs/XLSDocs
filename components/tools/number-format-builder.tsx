'use client';

import { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import {
  buildFormatCode,
  formatPreviewValue,
  DEFAULT_OPTIONS,
  CURRENCY_SYMBOLS,
  PREVIEW_VALUES,
  type NumberFormatOptions,
  type FormatKind,
  type NegativeStyle,
  type ZeroStyle,
  type Scale,
} from '@/lib/number-format';

const KIND_LABELS: Record<FormatKind, string> = {
  number: 'Number',
  currency: 'Currency',
  percentage: 'Percentage',
  accounting: 'Accounting',
};

const NEGATIVE_LABELS: Record<NegativeStyle, string> = {
  minus: 'Minus sign',
  parentheses: 'Parentheses',
  red: 'Red text',
  redParentheses: 'Red + parentheses',
};

const ZERO_LABELS: Record<ZeroStyle, string> = {
  number: 'Show as number',
  dash: 'Show as dash (–)',
  hide: 'Hide (blank)',
};

const SCALE_LABELS: Record<Scale, string> = {
  none: 'None',
  thousands: 'Thousands (K)',
  millions: 'Millions (M)',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-fd-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function PillGroup<T extends string>({
  value,
  options,
  labels,
  onChange,
}: {
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt
              ? 'border-fd-primary bg-fd-primary/10 text-fd-primary'
              : 'border-fd-border bg-fd-card text-fd-muted-foreground hover:border-fd-primary/50 hover:text-fd-foreground'
          }`}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

function Select<T extends string>({
  value,
  options,
  labels,
  onChange,
}: {
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-lg border border-fd-border bg-fd-card px-3 py-2 text-sm outline-none focus:border-fd-primary"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {labels[opt]}
        </option>
      ))}
    </select>
  );
}

export function NumberFormatBuilder() {
  const [opts, setOpts] = useState<NumberFormatOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);

  function set<K extends keyof NumberFormatOptions>(key: K, value: NumberFormatOptions[K]) {
    setOpts((prev) => ({ ...prev, [key]: value }));
  }

  const code = useMemo(() => buildFormatCode(opts), [opts]);
  const previewValues = PREVIEW_VALUES[opts.kind];

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const isAccounting = opts.kind === 'accounting';
  const isCurrency = opts.kind === 'currency';
  const isPercentage = opts.kind === 'percentage';
  const isNumber = opts.kind === 'number';
  const showsCurrencySymbol = isCurrency || isAccounting;

  return (
    <div className="mx-auto max-w-6xl px-6 pt-16 pb-20">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border px-3 py-1 font-mono text-xs text-fd-muted-foreground">
          Runs in your browser
        </span>
        <h1 className="mt-6 text-4xl font-normal md:text-5xl">
          Number Format <span className="font-serif text-fd-primary italic">Code</span> Builder
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-fd-muted-foreground">
          Build an Excel custom number format code with a form instead of
          memorizing the syntax — currency, percentages, accounting columns,
          colored negatives, hidden zeros. Nothing here is sent anywhere.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-5 rounded-xl border border-fd-border bg-fd-card p-5">
          <Field label="Format type">
            <PillGroup
              value={opts.kind}
              options={['number', 'currency', 'percentage', 'accounting'] as const}
              labels={KIND_LABELS}
              onChange={(v) => set('kind', v)}
            />
          </Field>

          <Field label="Decimal places">
            <PillGroup
              value={String(opts.decimals) as '0' | '1' | '2' | '3' | '4'}
              options={['0', '1', '2', '3', '4'] as const}
              labels={{ '0': '0', '1': '1', '2': '2', '3': '3', '4': '4' }}
              onChange={(v) => set('decimals', Number(v))}
            />
          </Field>

          {showsCurrencySymbol && (
            <Field label="Currency symbol">
              <div className="flex flex-wrap gap-1.5">
                {CURRENCY_SYMBOLS.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => set('currencySymbol', sym)}
                    className={`size-9 rounded-lg border text-sm font-medium transition-colors ${
                      opts.currencySymbol === sym
                        ? 'border-fd-primary bg-fd-primary/10 text-fd-primary'
                        : 'border-fd-border bg-fd-background text-fd-muted-foreground hover:border-fd-primary/50'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
                {isAccounting && (
                  <button
                    type="button"
                    onClick={() => set('currencySymbol', '')}
                    className={`rounded-lg border px-3 text-xs font-medium transition-colors ${
                      opts.currencySymbol === ''
                        ? 'border-fd-primary bg-fd-primary/10 text-fd-primary'
                        : 'border-fd-border bg-fd-background text-fd-muted-foreground hover:border-fd-primary/50'
                    }`}
                  >
                    None
                  </button>
                )}
              </div>
            </Field>
          )}

          {isCurrency && (
            <Field label="Symbol position">
              <PillGroup
                value={opts.currencyPosition}
                options={['before', 'after'] as const}
                labels={{ before: 'Before ($1.00)', after: 'After (1.00$)' }}
                onChange={(v) => set('currencyPosition', v)}
              />
            </Field>
          )}

          {isNumber && (
            <Field label="Thousands separator">
              <PillGroup
                value={opts.thousands ? 'on' : 'off'}
                options={['on', 'off'] as const}
                labels={{ on: 'On (1,000)', off: 'Off (1000)' }}
                onChange={(v) => set('thousands', v === 'on')}
              />
            </Field>
          )}

          {!isPercentage && !isAccounting && (
            <Field label="Scale">
              <Select
                value={opts.scale}
                options={['none', 'thousands', 'millions'] as const}
                labels={SCALE_LABELS}
                onChange={(v) => set('scale', v)}
              />
              {opts.scale !== 'none' && (
                <p className="text-[11px] text-fd-muted-foreground">
                  Divides the displayed value and appends a literal
                  {opts.scale === 'thousands' ? ' "K"' : ' "M"'} — the
                  cell’s real value is unchanged.
                </p>
              )}
            </Field>
          )}

          {isNumber && opts.scale === 'none' && (
            <Field label="Unit suffix (optional)">
              <input
                value={opts.suffix}
                onChange={(e) => set('suffix', e.target.value.slice(0, 20))}
                placeholder="e.g. units, items, hrs"
                className="w-full rounded-lg border border-fd-border bg-fd-card px-3 py-2 text-sm outline-none placeholder:text-fd-muted-foreground focus:border-fd-primary"
              />
            </Field>
          )}

          {!isAccounting && (
            <Field label="Negative numbers">
              <Select
                value={opts.negativeStyle}
                options={['minus', 'parentheses', 'red', 'redParentheses'] as const}
                labels={NEGATIVE_LABELS}
                onChange={(v) => set('negativeStyle', v)}
              />
            </Field>
          )}
          {isAccounting && (
            <Field label="Negative numbers">
              <p className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-xs text-fd-muted-foreground">
                Always parentheses — that’s what makes it Accounting
                format, aligned in its own column.
              </p>
            </Field>
          )}

          <Field label="Zero values">
            <Select
              value={opts.zeroStyle}
              options={['number', 'dash', 'hide'] as const}
              labels={ZERO_LABELS}
              onChange={(v) => set('zeroStyle', v)}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-fd-border bg-fd-card p-5">
            <span className="text-[10px] font-mono uppercase tracking-wide text-fd-muted-foreground">
              Preview
            </span>
            <div className="mt-3 flex flex-col divide-y divide-fd-border">
              {previewValues.map((v) => {
                const { text, red } = formatPreviewValue(v, opts);
                return (
                  <div key={v} className="flex items-center justify-between py-2 text-sm">
                    <span className="font-mono text-xs text-fd-muted-foreground">
                      {opts.kind === 'percentage' ? v.toString() : v.toLocaleString('en-US')}
                    </span>
                    <span className={`font-mono ${red ? 'text-red-500' : 'text-fd-foreground'}`}>
                      {text || <span className="text-fd-muted-foreground">(blank)</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
            <div className="flex items-center justify-between border-b border-fd-border px-4 py-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-fd-muted-foreground">
                Format code
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
              <code className="whitespace-nowrap font-mono text-sm text-fd-primary">{code}</code>
            </div>
          </div>

          <div className="rounded-xl border border-fd-border bg-fd-background p-4 text-sm text-fd-muted-foreground">
            <span className="font-medium text-fd-foreground">To use it: </span>
            select the cells, press <code className="font-mono text-fd-primary">Ctrl+1</code>{' '}
            (or right-click → Format Cells), open the{' '}
            <span className="text-fd-foreground">Number</span> tab, choose{' '}
            <span className="text-fd-foreground">Custom</span>, and paste this code into the{' '}
            <span className="text-fd-foreground">Type</span> box.
          </div>
        </div>
      </div>
    </div>
  );
}
