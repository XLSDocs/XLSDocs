'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface FunctionNavProps {
  /** Whether this function has a companion `examples.mdx` page. Not every
   *  function does — several batches shipped without one — so the Examples
   *  tab is only rendered when it actually resolves to a real page instead
   *  of a live 404. Defaults to `true` so every existing `<FunctionNav />`
   *  call (written with no props) keeps its current behavior; the one place
   *  that actually passes `false` is app/docs/[[...slug]]/page.tsx's MDX
   *  component override, computed from the real content tree via
   *  `source.getPage`, not hand-maintained per page. */
  hasExamples?: boolean;
}

export function FunctionNav({ hasExamples = true }: FunctionNavProps) {
  const pathname = usePathname();

  const tabs = hasExamples
    ? [
        { slug: '', label: 'Overview' },
        { slug: 'examples', label: 'Examples' },
      ]
    : [{ slug: '', label: 'Overview' }];
  const subSlugs = new Set(tabs.filter((tab) => tab.slug).map((tab) => tab.slug));

  const segments = pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  const activeSlug = subSlugs.has(last) ? last : '';
  const base = activeSlug ? '/' + segments.slice(0, -1).join('/') : pathname;

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabRefs.current[activeSlug];
    const container = containerRef.current;
    if (el && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicator({ left: elRect.left - containerRect.left, width: elRect.width });
    }
  }, [activeSlug]);

  // No Examples page means there's nothing to switch between — a lone
  // "Overview" tab with an active-underline is a tab bar with no function,
  // not a degraded version of one.
  if (!hasExamples) return null;

  return (
    <div
      ref={containerRef}
      className="not-prose relative flex items-center gap-6 border-b mb-8 overflow-x-auto"
    >
      {tabs.map((tab) => {
        const href = tab.slug ? `${base}/${tab.slug}` : base;
        const isActive = tab.slug === activeSlug;
        return (
          <Link
            key={tab.slug}
            ref={(el) => {
              tabRefs.current[tab.slug] = el;
            }}
            href={href}
            className={`relative shrink-0 pb-3 text-sm font-medium transition-colors ${
              isActive
                ? 'text-fd-primary'
                : 'text-fd-muted-foreground hover:text-fd-foreground'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
      <span
        className="absolute bottom-0 h-[2px] bg-fd-primary transition-all duration-300 ease-out"
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  );
}
