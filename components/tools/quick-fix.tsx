'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Wrench, Loader2, Sparkle } from 'lucide-react';
import { ExcelCode } from '@/components/excel-code';
import { CodeRainBackground } from '@/components/shared/code-rain';

const MAX_LENGTH = 500;

const EXAMPLE_FORMULAS = [
  {
    category: '#N/A',
    formula: '=VLOOKUP(A2,B:C,2,FALSE)',
    context: 'Returns #N/A even though the value is clearly in column B',
  },
  {
    category: '#REF!',
    formula: '=VLOOKUP(A2,B:E,5,FALSE)',
    context: 'Returns #REF! after a column in the middle of the table was deleted',
  },
  {
    category: '#VALUE!',
    formula: '=SUMIFS(C:C,A:A,"West",B:B)',
    context: 'Returns #VALUE! — trying to sum sales in the West region for Q4',
  },
  {
    category: '#DIV/0!',
    formula: '=B2/C2',
    context: "Returns #DIV/0! on some rows where C2 hasn't been filled in yet",
  },
  {
    category: 'Wrong result',
    formula: '=IF(A2>10 AND A2<20,"Mid","Other")',
    context: 'Meant to check if a number is between 10 and 20',
  },
];

interface BreakdownItem {
  part: string;
  description: string;
}

interface Fix {
  input: string;
  formula: string;
  explanation: string;
  breakdown: BreakdownItem[];
}

interface QuickFixProps {
  initialIsSubscriber: boolean;
  billingEnabled: boolean;
  checkoutStatus: 'upgraded' | 'canceled' | null;
}

export function QuickFix({ initialIsSubscriber, billingEnabled, checkoutStatus }: QuickFixProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimited, setRateLimited] = useState(false);
  const [result, setResult] = useState<Fix | null>(null);
  const [recent, setRecent] = useState<Fix[]>([]);
  const [upgrading, setUpgrading] = useState(false);
  const [billingError, setBillingError] = useState('');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const isSubscriber = initialIsSubscriber;

  async function fix(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError('');
    setRateLimited(false);

    try {
      const res = await fetch('/api/quick-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formula: trimmed }),
      });
      const data = (await res.json()) as {
        error?: string;
        formula?: string;
        explanation?: string;
        breakdown?: BreakdownItem[];
      };
      if (data.error) {
        setError(data.error);
        setRateLimited(res.status === 429);
      } else {
        const fixResult: Fix = {
          input: trimmed,
          formula: data.formula ?? '',
          explanation: data.explanation ?? '',
          breakdown: data.breakdown ?? [],
        };
        setResult(fixResult);
        setRecent((prev) => [fixResult, ...prev.filter((f) => f.input !== trimmed)].slice(0, 8));
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function startCheckout() {
    if (upgrading) return;
    setUpgrading(true);
    setBillingError('');
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setBillingError(data.error ?? 'Could not start checkout.');
        setUpgrading(false);
      }
    } catch {
      setBillingError('Could not start checkout.');
      setUpgrading(false);
    }
  }

  async function openBillingPortal() {
    if (upgrading) return;
    setUpgrading(true);
    setBillingError('');
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setBillingError(data.error ?? 'Could not open the billing portal.');
        setUpgrading(false);
      }
    } catch {
      setBillingError('Could not open the billing portal.');
      setUpgrading(false);
    }
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-60">
        <CodeRainBackground />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-20 pb-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border px-3 py-1 font-mono text-xs text-fd-muted-foreground">
            <Wrench className="size-3 text-fd-primary" />
            AI-powered
          </span>
          {isSubscriber && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-primary/30 bg-fd-primary/10 px-3 py-1 font-mono text-xs text-fd-primary">
              <Sparkle className="size-3" />
              Unlimited
            </span>
          )}
        </div>
        <h1 className="mt-6 text-4xl font-normal md:text-5xl">
          Quick <span className="font-serif text-fd-primary italic">Fix</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-fd-muted-foreground">
          Paste a broken formula and whatever it's doing wrong. Get back a
          corrected version — with an explanation of what was actually
          broken.
        </p>

        {checkoutStatus && !bannerDismissed && (
          <div
            className={`mx-auto mt-4 flex max-w-lg items-center justify-between gap-3 rounded-lg border px-4 py-2 text-sm ${
              checkoutStatus === 'upgraded'
                ? 'border-fd-primary/30 bg-fd-primary/10 text-fd-primary'
                : 'border-fd-border bg-fd-card text-fd-muted-foreground'
            }`}
          >
            <span>
              {checkoutStatus === 'upgraded'
                ? "You're upgraded — unlimited fixes unlocked."
                : 'Checkout canceled — no charge was made.'}
            </span>
            <button
              onClick={() => setBannerDismissed(true)}
              className="shrink-0 text-xs underline decoration-dotted underline-offset-2 hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}

        {billingEnabled && (
          <div className="mt-4">
            {isSubscriber ? (
              <button
                onClick={openBillingPortal}
                disabled={upgrading}
                className="text-xs text-fd-muted-foreground underline decoration-dotted underline-offset-2 hover:text-fd-foreground disabled:opacity-50"
              >
                {upgrading ? 'Opening…' : 'Manage subscription'}
              </button>
            ) : (
              <button
                onClick={startCheckout}
                disabled={upgrading}
                className="inline-flex items-center gap-1.5 rounded-full border border-fd-primary/30 bg-fd-primary/10 px-4 py-1.5 text-sm font-medium text-fd-primary transition-colors hover:bg-fd-primary/20 disabled:opacity-50"
              >
                {upgrading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkle className="size-3.5" />}
                Upgrade — $5/mo for unlimited
              </button>
            )}
            {billingError && <p className="mt-2 text-xs text-red-400">{billingError}</p>}
          </div>
        )}

        <div className="mx-auto mt-8 rounded-xl border border-fd-border bg-fd-card/80 p-3 text-left">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) fix(input);
            }}
            placeholder={'e.g. =VLOOKUP(A2,B:C,2,FALSE) — returns #N/A even though the value is in column B'}
            rows={3}
            className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-fd-muted-foreground"
          />
          <div className="flex items-center justify-between border-t border-fd-border pt-2">
            <span className="font-mono text-xs text-fd-muted-foreground">
              {input.length}/{MAX_LENGTH}
            </span>
            <button
              onClick={() => fix(input)}
              disabled={loading || !input.trim()}
              className="flex items-center gap-1.5 rounded-full bg-fd-primary px-4 py-1.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-3.5 animate-spin" /> : null}
              {loading ? 'Fixing…' : 'Fix formula →'}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <p className="text-sm text-red-400">{error}</p>
            {rateLimited && billingEnabled && !isSubscriber && (
              <button
                onClick={startCheckout}
                disabled={upgrading}
                className="text-sm font-medium text-fd-primary underline decoration-dotted underline-offset-2 hover:opacity-80 disabled:opacity-50"
              >
                Upgrade for unlimited →
              </button>
            )}
          </div>
        )}
        <p className="mt-4 text-xs text-fd-muted-foreground">
          Building a formula from scratch instead?{' '}
          <Link href="/tools/formula-builder" className="underline decoration-dotted underline-offset-2 hover:text-fd-foreground">
            Try the AI Formula Builder
          </Link>
          .
        </p>
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl gap-8 px-6 pb-20">
        <div className="min-w-0 flex-1">
          {result && (
            <div className="not-prose mb-10 rounded-xl border border-fd-border bg-fd-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-fd-muted-foreground">
                <span className="size-1.5 rounded-full bg-fd-primary" />
                Fixed
              </div>
              <div className="px-4 pt-3">
                <ExcelCode>{result.formula}</ExcelCode>
              </div>
              {result.explanation && (
                <p className="px-4 pt-1 pb-3 text-sm text-fd-muted-foreground">{result.explanation}</p>
              )}
              {result.breakdown.length > 0 && (
                <div className="border-t border-fd-border px-4 py-3">
                  <span className="text-[10px] uppercase tracking-wide text-fd-muted-foreground">
                    What changed
                  </span>
                  <div className="mt-2 flex flex-col gap-2">
                    {result.breakdown.map((item, i) => (
                      <div key={i} className="grid grid-cols-[minmax(0,140px)_1fr] gap-3 text-sm">
                        <code className="font-mono text-xs text-fd-primary">{item.part}</code>
                        <span className="text-fd-muted-foreground">{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <h2 className="mb-4 text-lg font-medium">Try an example</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {EXAMPLE_FORMULAS.map((ex) => (
              <button
                key={ex.category}
                onClick={() => {
                  const combined = `${ex.formula} — ${ex.context}`;
                  setInput(combined);
                  fix(combined);
                }}
                className="rounded-xl border border-fd-border bg-fd-card p-4 text-left transition-colors hover:border-fd-primary/50"
              >
                <div className="font-mono text-[11px] uppercase tracking-wider text-fd-primary">
                  {ex.category}
                </div>
                <p className="mt-1.5 font-mono text-xs text-fd-foreground">{ex.formula}</p>
                <p className="mt-1 text-sm text-fd-muted-foreground">{ex.context}</p>
              </button>
            ))}
          </div>
        </div>

        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24">
            <span className="text-[10px] uppercase tracking-wide text-fd-muted-foreground">
              Recent fixes
            </span>
            <div className="mt-2 flex flex-col gap-1.5">
              {recent.length === 0 && (
                <p className="text-xs text-fd-muted-foreground">
                  Your fixes this session will show up here.
                </p>
              )}
              {recent.map((f, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(f.input);
                    setResult(f);
                  }}
                  className="rounded-md border border-fd-border px-3 py-2 text-left text-xs transition-colors hover:bg-fd-card"
                >
                  <div className="truncate text-fd-muted-foreground">{f.input}</div>
                  <div className="mt-0.5 truncate font-mono text-fd-primary">{f.formula}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
