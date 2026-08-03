'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { HeroCanvas } from './hero-canvas';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <HeroCanvas containerRef={sectionRef} />
      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-24 pb-20 text-center md:pt-32">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border px-3 py-1 font-mono text-xs text-fd-muted-foreground">
            <span className="size-1.5 rounded-full bg-fd-primary" />
            EXCEL REFERENCE
          </span>
          <span className="rounded-full border border-fd-border px-3 py-1 font-mono text-xs text-fd-muted-foreground">
            Pro 2027
          </span>
        </div>
        <h1 className="text-balance text-5xl font-normal leading-[1.1] md:text-6xl">
          The Excel reference built for{' '}
          <span className="font-serif italic text-fd-primary">the AI era</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-fd-muted-foreground">
          Every function documented. An AI formula builder that actually
          works. The Excel reference site power users deserve.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/tools/formula-builder"
            className="rounded-full bg-fd-foreground px-5 py-2.5 text-sm font-medium text-fd-background transition-opacity hover:opacity-90"
          >
            Build a formula free
          </Link>
          <Link
            href="/functions"
            className="rounded-full border border-fd-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-card"
          >
            Browse functions
          </Link>
        </div>
        <p className="mt-6 text-xs text-fd-muted-foreground">
          Built by Excel power users · Free to use · No sign-up needed
        </p>
      </div>
    </section>
  );
}
