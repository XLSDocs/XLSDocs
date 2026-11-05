'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Copy, Check } from 'lucide-react';
import {
  buildDataValidation,
  DEFAULT_DV_OPTIONS,
  type DataValidationOptions,
  type RuleType,
} from '@/lib/data-validation';
import { Field, PillGroup, TextInput } from '@/components/tools/form-controls';

const RULE_GROUPS: { label: string; rules: RuleType[] }[] = [
  { label: 'Dropdown lists', rules: ['dropdownList', 'dropdownRange', 'dependentDropdown'] },
  { label: 'Numbers & dates', rules: ['wholeNumber', 'decimal', 'dateRange'] },
  { label: 'Text & custom', rules: ['textLength', 'preventDuplicates'] },
];

const RULE_LABELS: Record<RuleType, string> = {
  dropdownList: 'Dropdown (typed list)',
  dropdownRange: 'Dropdown (from a range)',
  dependentDropdown: 'Dependent dropdown',
  wholeNumber: 'Whole number range',
  decimal: 'Decimal range',
  dateRange: 'Date range',
  textLength: 'Max text length',
  preventDuplicates: 'Prevent duplicates',
};

export function DataValidationBuilder() {
  const [opts, setOpts] = useState<DataValidationOptions>(DEFAULT_DV_OPTIONS);
  const [copied, setCopied] = useState(false);

  function set<K extends keyof DataValidationOptions>(key: K, value: DataValidationOptions[K]) {
    setOpts((prev) => ({ ...prev, [key]: value }));
  }

  const result = useMemo(() => buildDataValidation(opts), [opts]);

  function handleCopy() {
    if (!result) return;
    const text = result.fields.map((f) => `${f.label}: ${f.value}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const r = opts.ruleType;

  return (
    <div className="mx-auto max-w-6xl px-6 pt-16 pb-20">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border px-3 py-1 font-mono text-xs text-fd-muted-foreground">
          Runs in your browser
        </span>
        <h1 className="mt-6 text-4xl font-normal md:text-5xl">
          Data Validation <span className="font-serif text-fd-primary italic">Rule</span> Builder
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-fd-muted-foreground">
          Dropdown lists, dependent dropdowns, number and date limits,
          duplicate prevention — the exact Data Validation settings to
          enter, without guessing the dialog. Nothing here is sent anywhere.
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

          {r === 'dropdownList' && (
            <Field label="List items (comma-separated)">
              <TextInput value={opts.listItems} onChange={(v) => set('listItems', v)} placeholder="Yes, No, Maybe" maxLength={200} />
            </Field>
          )}

          {r === 'dropdownRange' && (
            <Field label="Range holding the list">
              <TextInput value={opts.listRange} onChange={(v) => set('listRange', v)} placeholder="Lists!$A$2:$A$10" />
            </Field>
          )}

          {r === 'dependentDropdown' && (
            <Field label="Trigger cell (holds the category)">
              <TextInput
                value={opts.triggerCell}
                onChange={(v) => set('triggerCell', v)}
                placeholder="B2"
              />
            </Field>
          )}

          {(r === 'wholeNumber' || r === 'decimal') && (
            <Field label="Range">
              <div className="flex gap-2">
                <TextInput value={opts.min} onChange={(v) => set('min', v)} placeholder="Min" />
                <TextInput value={opts.max} onChange={(v) => set('max', v)} placeholder="Max" />
              </div>
            </Field>
          )}

          {r === 'dateRange' && (
            <Field label="Date range">
              <div className="flex gap-2">
                <TextInput value={opts.startDate} onChange={(v) => set('startDate', v)} placeholder="1/1/2027" />
                <TextInput value={opts.endDate} onChange={(v) => set('endDate', v)} placeholder="12/31/2027" />
              </div>
            </Field>
          )}

          {r === 'textLength' && (
            <Field label="Maximum characters">
              <TextInput
                value={opts.maxLength}
                onChange={(v) => set('maxLength', v.replace(/\D/g, ''))}
                placeholder="50"
              />
            </Field>
          )}

          {r === 'preventDuplicates' && (
            <Field label="Range to check for duplicates">
              <TextInput value={opts.range} onChange={(v) => set('range', v)} placeholder="A2:A100" />
            </Field>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
            <div className="flex items-center justify-between border-b border-fd-border px-4 py-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-fd-muted-foreground">
                Data Validation settings
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
            {result ? (
              <div className="flex flex-col divide-y divide-fd-border px-4">
                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-fd-muted-foreground">Allow</span>
                  <code className="font-mono text-fd-primary">{result.allow}</code>
                </div>
                {result.fields.map((f) => (
                  <div key={f.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                    <span className="shrink-0 text-fd-muted-foreground">{f.label}</span>
                    <code className="truncate font-mono text-fd-primary">{f.value}</code>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-fd-muted-foreground">
                Fill in the fields on the left to generate the settings.
              </div>
            )}
          </div>

          {result && (
            <p className="rounded-xl border border-fd-border bg-fd-background p-4 text-sm text-fd-muted-foreground">
              {result.note}
            </p>
          )}

          <div className="rounded-xl border border-fd-border bg-fd-background p-4 text-sm text-fd-muted-foreground">
            <span className="font-medium text-fd-foreground">To use it: </span>
            select the cell(s), go to{' '}
            <span className="text-fd-foreground">Data → Data Validation</span>, set{' '}
            <span className="text-fd-foreground">Allow</span> to the value above, and fill in the
            remaining fields exactly as shown.
          </div>

          <p className="text-xs text-fd-muted-foreground">
            Want to highlight cells instead of restricting what goes in them?{' '}
            <Link
              href="/tools/conditional-format-builder"
              className="underline decoration-dotted underline-offset-2 hover:text-fd-foreground"
            >
              Try the Conditional Format Builder
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
