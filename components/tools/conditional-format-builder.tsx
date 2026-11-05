'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Copy, Check } from 'lucide-react';
import {
  buildConditionalFormat,
  DEFAULT_CF_OPTIONS,
  type ConditionalFormatOptions,
  type RuleType,
  type ComparisonOp,
} from '@/lib/conditional-format';
import { Field, PillGroup, Select, TextInput } from '@/components/tools/form-controls';

const RULE_GROUPS: { label: string; rules: RuleType[] }[] = [
  { label: 'Values', rules: ['duplicates', 'unique', 'comparison', 'textContains', 'blank', 'isFormula'] },
  { label: 'Ranking', rules: ['aboveAverage', 'belowAverage', 'topN', 'bottomN'] },
  { label: 'Dates', rules: ['overdue', 'dueSoon', 'weekend'] },
  { label: 'Layout', rules: ['alternateRows'] },
];

const RULE_LABELS: Record<RuleType, string> = {
  duplicates: 'Duplicate values',
  unique: 'Unique values',
  comparison: 'Compare to a value',
  textContains: 'Contains text',
  blank: 'Blank cells',
  isFormula: 'Contains a formula',
  aboveAverage: 'Above average',
  belowAverage: 'Below average',
  topN: 'Top N values',
  bottomN: 'Bottom N values',
  overdue: 'Overdue dates',
  dueSoon: 'Due soon',
  weekend: 'Weekends',
  alternateRows: 'Alternate rows (zebra stripes)',
};

const COMPARISON_LABELS: Record<ComparisonOp, string> = {
  gt: 'Greater than',
  gte: 'Greater than or equal to',
  lt: 'Less than',
  lte: 'Less than or equal to',
  eq: 'Equal to',
  between: 'Between',
};

export function ConditionalFormatBuilder() {
  const [opts, setOpts] = useState<ConditionalFormatOptions>(DEFAULT_CF_OPTIONS);
  const [copied, setCopied] = useState(false);

  function set<K extends keyof ConditionalFormatOptions>(key: K, value: ConditionalFormatOptions[K]) {
    setOpts((prev) => ({ ...prev, [key]: value }));
  }

  const result = useMemo(() => buildConditionalFormat(opts), [opts]);

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const needsComparisonValues = opts.ruleType === 'comparison';
  const needsText = opts.ruleType === 'textContains';
  const needsN = opts.ruleType === 'topN' || opts.ruleType === 'bottomN';
  const needsDueSoon = opts.ruleType === 'dueSoon';

  return (
    <div className="mx-auto max-w-6xl px-6 pt-16 pb-20">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border px-3 py-1 font-mono text-xs text-fd-muted-foreground">
          Runs in your browser
        </span>
        <h1 className="mt-6 text-4xl font-normal md:text-5xl">
          Conditional Format <span className="font-serif text-fd-primary italic">Formula</span> Builder
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-fd-muted-foreground">
          Highlight duplicates, overdue dates, top values, or an entire row
          based on one column — without hand-writing the formula.
          Nothing here is sent anywhere.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-5 rounded-xl border border-fd-border bg-fd-card p-5">
          {RULE_GROUPS.map((group) => (
            <Field key={group.label} label={group.label}>
              <PillGroup
                value={opts.ruleType}
                options={group.rules}
                labels={RULE_LABELS}
                onChange={(v) => set('ruleType', v)}
              />
            </Field>
          ))}

          {needsComparisonValues && (
            <Field label="Condition">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select
                  value={opts.comparisonOp}
                  options={['gt', 'gte', 'lt', 'lte', 'eq', 'between'] as const}
                  labels={COMPARISON_LABELS}
                  onChange={(v) => set('comparisonOp', v)}
                />
                <TextInput value={opts.value1} onChange={(v) => set('value1', v)} placeholder="100" />
                {opts.comparisonOp === 'between' && (
                  <TextInput value={opts.value2} onChange={(v) => set('value2', v)} placeholder="200" />
                )}
              </div>
            </Field>
          )}

          {needsText && (
            <Field label="Text to match">
              <TextInput value={opts.textValue} onChange={(v) => set('textValue', v)} placeholder="West" maxLength={60} />
            </Field>
          )}

          {needsN && (
            <Field label={opts.ruleType === 'topN' ? 'How many top values' : 'How many bottom values'}>
              <TextInput
                value={String(opts.n)}
                onChange={(v) => set('n', Math.max(1, Number(v.replace(/\D/g, '')) || 1))}
                placeholder="5"
              />
            </Field>
          )}

          {needsDueSoon && (
            <Field label="Days ahead counted as “soon”">
              <TextInput
                value={String(opts.dueSoonDays)}
                onChange={(v) => set('dueSoonDays', Math.max(1, Number(v.replace(/\D/g, '')) || 1))}
                placeholder="7"
              />
            </Field>
          )}

          <Field label="Highlight">
            <PillGroup
              value={opts.wholeRow ? 'row' : 'cell'}
              options={['cell', 'row'] as const}
              labels={{ cell: 'Just the matching cell', row: 'The whole row' }}
              onChange={(v) => set('wholeRow', v === 'row')}
            />
          </Field>

          {!opts.wholeRow && (
            <Field label="Data range">
              <TextInput value={opts.range} onChange={(v) => set('range', v)} placeholder="A2:A20" />
            </Field>
          )}

          {opts.wholeRow && (
            <>
              <Field label="Column holding the condition">
                <TextInput
                  value={opts.triggerColumn}
                  onChange={(v) => set('triggerColumn', v.replace(/[^A-Za-z]/g, '').toUpperCase())}
                  placeholder="C"
                />
              </Field>
              <Field label="Range to apply the highlight to">
                <TextInput value={opts.applyRange} onChange={(v) => set('applyRange', v)} placeholder="A2:E20" />
              </Field>
            </>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
            <div className="flex items-center justify-between border-b border-fd-border px-4 py-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-fd-muted-foreground">
                Formula
              </span>
              <button
                onClick={handleCopy}
                disabled={!result}
                className="flex items-center gap-1.5 rounded-md border border-fd-border px-2 py-1 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground disabled:opacity-50"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="overflow-x-auto px-4 py-3">
              {result ? (
                <code className="whitespace-nowrap font-mono text-sm text-fd-primary">{result.formula}</code>
              ) : (
                <span className="text-sm text-fd-muted-foreground">
                  Enter a valid range (e.g. A2:A20) to generate a formula.
                </span>
              )}
            </div>
          </div>

          {result && (
            <p className="rounded-xl border border-fd-border bg-fd-background p-4 text-sm text-fd-muted-foreground">
              {result.note}
            </p>
          )}

          <div className="rounded-xl border border-fd-border bg-fd-background p-4 text-sm text-fd-muted-foreground">
            <span className="font-medium text-fd-foreground">To use it: </span>
            select{' '}
            <code className="font-mono text-fd-primary">{result?.selectRange ?? opts.range}</code>, go to{' '}
            <span className="text-fd-foreground">Home → Conditional Formatting → New Rule</span>, choose{' '}
            <span className="text-fd-foreground">Use a formula to determine which cells to format</span>, paste
            the formula above, then pick a format and click OK.
          </div>

          <p className="text-xs text-fd-muted-foreground">
            Formatting the numbers themselves instead of highlighting them?{' '}
            <Link
              href="/tools/number-format-builder"
              className="underline decoration-dotted underline-offset-2 hover:text-fd-foreground"
            >
              Try the Number Format Builder
            </Link>
            . Restricting what can be typed in instead of coloring it?{' '}
            <Link
              href="/tools/data-validation-builder"
              className="underline decoration-dotted underline-offset-2 hover:text-fd-foreground"
            >
              Try the Data Validation Builder
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
