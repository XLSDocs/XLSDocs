'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { HeroCanvas } from '@/components/home/hero-canvas';
import type { FunctionCategory } from '@/lib/source';

export function FunctionsExplorer({ categories }: { categories: FunctionCategory[] }) {
  const [query, setQuery] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  const totalFunctions = categories.reduce((sum, c) => sum + c.functions.length, 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories
      .map((cat) => ({
        ...cat,
        functions: cat.functions.filter(
          (fn) =>
            fn.title.toLowerCase().includes(q) ||
            (fn.description?.toLowerCase().includes(q) ?? false),
        ),
      }))
      .filter((cat) => cat.functions.length > 0);
  }, [categories, query]);

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
              className="w-full rounded-full border border-fd-border bg-fd-card/80 px-5 py-3 pr-28 text-sm outline-none focus:border-fd-primary"
            />
            <span className="absolute top-1/2 right-4 -translate-y-1/2 font-mono text-xs text-fd-muted-foreground">
              {matchCount} function{matchCount === 1 ? '' : 's'}
            </span>
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
              No functions match &ldquo;{query}&rdquo;.
            </p>
          )}
          {filtered.map((cat) => (
            <section key={cat.slug} id={cat.slug} className="mb-12 scroll-mt-24">
              <h2 className="mb-4 text-lg font-medium">{cat.title}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cat.functions.map((fn) => (
                  <Link
                    key={fn.slug}
                    href={fn.url}
                    className="rounded-xl border border-fd-border bg-fd-card p-4 transition-colors hover:border-fd-primary/50"
                  >
                    <div className="font-mono text-sm font-medium text-fd-primary">
                      {fn.title}
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
