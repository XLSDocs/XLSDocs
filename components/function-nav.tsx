'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const TABS = [
  { slug: '', label: 'Overview' },
  { slug: 'examples', label: 'Examples' },
];

const SUB_SLUGS = new Set(TABS.filter((tab) => tab.slug).map((tab) => tab.slug));

export function FunctionNav() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  const activeSlug = SUB_SLUGS.has(last) ? last : '';
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

  return (
    <div
      ref={containerRef}
      className="not-prose relative flex items-center gap-6 border-b mb-8 overflow-x-auto"
    >
      {TABS.map((tab) => {
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
