import Link from 'next/link';
import { Lock } from 'lucide-react';

export function FreeSection({ functionCount }: { functionCount: number }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
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
            to read, and all 5 generators are free to use as often as you
            like — no account, no trial clock. The tools run in your
            browser, so nothing you paste ever leaves it.
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

        <div className="gradient-border-card rounded-xl p-8">
          <div className="grid grid-cols-2 divide-x divide-fd-border text-center">
            <div className="px-4">
              <div className="font-serif text-4xl text-fd-primary italic">{functionCount}</div>
              <p className="mt-2 text-sm text-fd-muted-foreground">
                functions documented, free to read
              </p>
            </div>
            <div className="px-4">
              <div className="font-serif text-4xl text-fd-primary italic">5</div>
              <p className="mt-2 text-sm text-fd-muted-foreground">
                generators, free and unlimited
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
