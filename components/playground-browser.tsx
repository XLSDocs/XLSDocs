'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface PlaygroundItem {
  fn: string;
  href: string;
  teaser: string;
}

export interface PlaygroundCategory {
  name: string;
  items: PlaygroundItem[];
}

function PlaygroundCard({ item }: { item: PlaygroundItem }) {
  return (
    <Link
      href={item.href}
      className="group flex flex-col gap-2 rounded-xl border border-fd-border bg-fd-card p-4 transition-colors hover:border-fd-primary/40"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm font-medium text-fd-primary">{item.fn}()</span>
        <ArrowRight className="size-4 shrink-0 text-fd-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-fd-primary" />
      </div>
      <p className="text-sm text-fd-muted-foreground">{item.teaser}</p>
    </Link>
  );
}

// Search + category filter on top of a still-hand-curated list — the list
// itself keeps growing with every new content batch (9 categories and
// climbing), but a filterable/searchable browser means that growth never
// has to be fought with a cap or a pruning pass. Category pill labels are
// computed from the `categories` prop, not hardcoded, so a newly-added
// category shows up as a filter automatically.
export function PlaygroundBrowser({ categories }: { categories: PlaygroundCategory[] }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categoryNames = ['All', ...categories.map((c) => c.name)];
  const total = categories.reduce((sum, c) => sum + c.items.length, 0);

  const matchesQuery = (item: PlaygroundItem) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return item.fn.toLowerCase().includes(q) || item.teaser.toLowerCase().includes(q);
  };

  const filtered = categories
    .filter((c) => activeCategory === 'All' || c.name === activeCategory)
    .map((c) => ({ ...c, items: c.items.filter(matchesQuery) }))
    .filter((c) => c.items.length > 0);
  const shownCount = filtered.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fd-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search examples…"
            aria-label="Search interactive examples"
            className="w-full rounded-lg border border-fd-border bg-fd-background py-2 pr-8 pl-9 text-sm outline-none focus:border-fd-primary"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-fd-muted-foreground hover:text-fd-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {categoryNames.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setActiveCategory(name)}
              aria-pressed={activeCategory === name}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                activeCategory === name
                  ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground'
                  : 'border-fd-border text-fd-muted-foreground hover:border-fd-primary/50 hover:text-fd-foreground',
              )}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-8 text-sm text-fd-muted-foreground">
        Showing {shownCount} of {total} example{total === 1 ? '' : 's'}
      </p>

      <div className="flex flex-col gap-12">
        {filtered.map((category) => (
          <section key={category.name}>
            <h2 className="mb-4 text-xl font-medium">{category.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {category.items.map((item) => (
                <PlaygroundCard key={item.fn} item={item} />
              ))}
            </div>
          </section>
        ))}
        {shownCount === 0 && (
          <p className="py-12 text-center text-fd-muted-foreground">
            No examples match &quot;{query}&quot;
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''} — try a different search
            term{activeCategory !== 'All' ? ' or clear the category filter' : ''}.
          </p>
        )}
      </div>
    </>
  );
}
