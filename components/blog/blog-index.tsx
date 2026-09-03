'use client';

import { useMemo, useRef, useState } from 'react';
import { HeroCanvas } from '@/components/home/hero-canvas';
import { PostCard } from './post-card';

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
  featured?: boolean;
}

export function BlogIndex({ posts, categories }: { posts: Post[]; categories: string[] }) {
  const [active, setActive] = useState('All');
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = useMemo(
    () => (active === 'All' ? posts : posts.filter((p) => p.category === active)),
    [posts, active],
  );

  const groups = useMemo(() => {
    const byYear = new Map<string, Post[]>();
    for (const post of filtered) {
      const year = new Date(post.date).getFullYear().toString();
      byYear.set(year, [...(byYear.get(year) ?? []), post]);
    }
    return [...byYear.entries()].sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [filtered]);

  const topicCount = categories.length;
  const earliestYear = useMemo(
    () => posts.reduce((min, p) => Math.min(min, new Date(p.date).getFullYear()), Infinity),
    [posts],
  );

  return (
    <>
      <section ref={sectionRef} className="relative overflow-hidden">
        <HeroCanvas containerRef={sectionRef} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
          <h1 className="text-4xl font-normal md:text-5xl">
            Writing about <span className="font-serif text-fd-primary italic">Excel</span>, data,
            and the web
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-fd-muted-foreground">
            Practical notes on formulas, VBA, Python, and the tools that sit around a spreadsheet.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8">
            <div>
              <div className="font-mono text-2xl text-fd-primary">{posts.length}</div>
              <div className="text-xs text-fd-muted-foreground">articles</div>
            </div>
            <div>
              <div className="font-mono text-2xl text-fd-primary">{topicCount}</div>
              <div className="text-xs text-fd-muted-foreground">topics</div>
            </div>
            <div>
              <div className="font-mono text-2xl text-fd-primary">est. {earliestYear}</div>
              <div className="text-xs text-fd-muted-foreground">writing here since</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10 flex flex-wrap gap-2">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                active === cat
                  ? 'border-fd-primary bg-fd-primary/10 text-fd-primary'
                  : 'border-fd-border text-fd-muted-foreground hover:bg-fd-card hover:text-fd-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-fd-muted-foreground">No articles in this topic yet.</p>
        )}

        {groups.map(([year, yearPosts]) => {
          // An explicit featured:true post wins the hero slot for its year;
          // otherwise fall back to the newest post of that year (yearPosts
          // is already newest-first, inherited from the sorted `posts` prop).
          const hero = yearPosts.find((p) => p.featured) ?? yearPosts[0];
          const rest = yearPosts.filter((p) => p !== hero);
          return (
            <section key={year} className="mb-14">
              <h2 className="mb-4 text-lg font-medium text-fd-muted-foreground">{year}</h2>
              <div className="mb-4">
                <PostCard {...hero} featured />
              </div>
              {rest.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <PostCard key={post.slug} {...post} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
