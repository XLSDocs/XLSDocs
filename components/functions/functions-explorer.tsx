'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { HeroCanvas } from '@/components/home/hero-canvas';
import type { FunctionCategory } from '@/lib/source';

type FilterMode = 'all' | '365';

export function FunctionsExplorer({ categories }: { categories: FunctionCategory[] }) {
  const [query, setQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const sectionRef = useRef<HTMLElement>(null);

  const totalFunctions = categories.reduce((sum, c) => sum + c.functions.length, 0);
  const total365Exclusive = categories.reduce(
    (sum, c) => sum + c.functions.filter((fn) => fn.is365Exclusive).length,
    0,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        functions: cat.functions.filter((fn) => {
          if (filterMode === '365' && !fn.is365Exclusive) return false;
          if (!q) return true;
          return (
            fn.title.toLowerCase().includes(q) ||
            (fn.description?.toLowerCase().includes(q) ?? false)
          );
        }),
      }))
      .filter((cat) => cat.functions.length > 0);
  }, [categories, query, filterMode]);

  const matchCount = filtered.reduce((sum, c) => sum + c.functions.length, 0);

  return (
    <>
      <section ref={sectionRef} className="relative overflow-hidden">
        <HeroCanvas containerRef={sectionRef} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
          <h1 className="text-4xl font-normal md:text-5xl">
            Excel <span className="font-serif text-fd-primary italic">Function</span> Reference
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-fd-muted-foreground">
            Every Excel function documented — syntax, parameters, examples, and
            compatibility.
          </p>
          <div className="relative mx-auto mt-8 max-w-xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search functions — try XLOOKUP, SUMIFS, IF..."
              className="w-full rounded-full border border-fd-border bg-fd-card/80 px-5 py-3 text-sm outline-none focus:border-fd-primary sm:pr-28"
            />
            <span className="mt-2 block text-center font-mono text-xs text-fd-muted-foreground sm:absolute sm:top-1/2 sm:right-4 sm:mt-0 sm:-translate-y-1/2 sm:text-right">
              {matchCount} function{matchCount === 1 ? '' : 's'}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              aria-pressed={filterMode === 'all'}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                filterMode === 'all'
                  ? 'border-fd-primary bg-fd-primary/10 text-fd-primary'
                  : 'border-fd-border text-fd-muted-foreground hover:border-fd-primary/50 hover:text-fd-foreground'
              }`}
            >
              All functions
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('365')}
              aria-pressed={filterMode === '365'}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                filterMode === '365'
                  ? 'border-fd-primary bg-fd-primary/10 text-fd-primary'
                  : 'border-fd-border text-fd-muted-foreground hover:border-fd-primary/50 hover:text-fd-foreground'
              }`}
            >
              Excel 365 exclusive
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8">
            <div>
              <div className="font-mono text-2xl text-fd-primary">{totalFunctions}</div>
              <div className="text-xs text-fd-muted-foreground">functions</div>
            </div>
            <div>
              <div className="font-mono text-2xl text-fd-primary">{categories.length}</div>
              <div className="text-xs text-fd-muted-foreground">categories</div>
            </div>
            <div>
              <div className="font-mono text-2xl text-fd-primary">{total365Exclusive}</div>
              <div className="text-xs text-fd-muted-foreground">365 exclusive</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-12">
        <aside className="hidden w-48 shrink-0 md:block">
          <div className="sticky top-24 flex flex-col gap-1">
            {categories.map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-card hover:text-fd-foreground"
              >
                {cat.title}
                <span className="font-mono text-xs">{cat.functions.length}</span>
              </a>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {filtered.length === 0 && (
            <p className="py-12 text-center text-fd-muted-foreground">
              {query ? (
                <>
                  No{filterMode === '365' ? ' Excel 365 exclusive' : ''} functions match &ldquo;
                  {query}&rdquo;.
                </>
              ) : (
                'No Excel 365 exclusive functions found.'
              )}
            </p>
          )}
          {filtered.map((cat) => (
            <section key={cat.slug} id={cat.slug} className="mb-12 scroll-mt-24">
              <h2 className="mb-4 text-lg font-medium">{cat.title}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cat.functions.map((fn) => (
                  <Link
                    key={fn.slug}
                    href={fn.url}
                    className="rounded-xl border border-fd-border bg-fd-card p-4 transition-colors hover:border-fd-primary/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-mono text-sm font-medium text-fd-primary">
                        {fn.title}
                      </div>
                      {fn.is365Exclusive && (
                        <span className="shrink-0 rounded-full border border-fd-primary/30 bg-fd-primary/10 px-2 py-0.5 text-[10px] font-medium text-fd-primary">
                          365
                        </span>
                      )}
                    </div>
                    {fn.description && (
                      <p className="mt-1.5 line-clamp-2 text-xs text-fd-muted-foreground">
                        {fn.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
