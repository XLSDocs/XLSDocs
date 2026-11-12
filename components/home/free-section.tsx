import Link from 'next/link';
import { Lock } from 'lucide-react';
import { StatDots } from './stat-dots';
import { TOOLS } from './tools-showcase';

export function FreeSection({
  functionCount,
  categoryCount,
}: {
  functionCount: number;
  categoryCount: number;
}) {
  const stats = [
    { value: String(functionCount), caption: 'functions, VBA calls, and LAMBDAs documented' },
    { value: String(TOOLS.length), caption: 'generators, free and unlimited' },
    { value: String(categoryCount), caption: 'categories, from Math to Custom Functions' },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border px-3 py-1 text-xs font-medium text-fd-muted-foreground">
            <Lock className="size-3" />
            No paywall on the reference
          </span>
          <h2 className="mt-4 text-3xl">
            Free <span className="font-serif text-fd-primary italic">from day one</span>
          </h2>
          <p className="mt-4 max-w-md text-fd-muted-foreground">
            Every function page, tutorial, and how-it-works diagram is free
            to read, and all {TOOLS.length} generators are free to use as
            often as you like — no account, no trial clock. The tools run
            in your browser, so nothing you paste ever leaves it.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="rounded-full bg-fd-foreground px-5 py-2.5 text-sm font-medium text-fd-background transition-opacity hover:opacity-90"
            >
              Browse the docs
            </Link>
            <Link
              href="/tools/vlookup-converter"
              className="rounded-full border border-fd-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-card"
            >
              Try a free tool
            </Link>
          </div>
        </div>

        <div className="gradient-border-card rounded-xl p-6">
          <StatDots stats={stats} />
        </div>
      </div>
    </section>
  );
}
