'use client';

import { useEffect, useRef, useState } from 'react';
import { List } from 'lucide-react';

export interface LegalTocItem {
  id: string;
  label: string;
}

/**
 * Sticky left-side "on this page" nav for long single-column legal pages
 * (Terms, Privacy) — these are plain TSX, not MDX, so headings get explicit
 * `id`s by hand rather than an auto-slug plugin. Deliberately left-side and
 * flat (h2-level only, no h3 nesting) to keep it simple; fumadocs' own docs
 * pages already have a right-side TOC, so this is a distinct pattern for a
 * distinct page type, not an attempt to reuse that component.
 */
export function LegalToc({ items }: { items: LegalTocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const suppressUntilRef = useRef(0);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressUntilRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  function handleClick(id: string) {
    // Set the active item immediately instead of waiting on the observer —
    // the browser's native scroll-to-anchor doesn't reliably land the
    // target inside the observer's "top band" (varies with section length
    // near the end of the page), which could otherwise leave a different,
    // stale section highlighted right after a click. Briefly suppress the
    // observer so it doesn't fight this while the scroll is still settling;
    // it resumes normal scroll-spy behavior as soon as the user scrolls
    // manually afterward.
    setActiveId(id);
    suppressUntilRef.current = Date.now() + 700;
  }

  return (
    <nav aria-label="On this page" className="sticky top-24 hidden w-52 shrink-0 self-start xl:block">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-medium tracking-wider text-fd-muted-foreground uppercase">
        <List className="size-3.5" />
        On this page
      </p>
      <ul className="flex flex-col gap-1 border-l border-fd-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={() => handleClick(item.id)}
              className={`-ml-px block border-l-2 py-1 pl-3 text-sm transition-colors ${
                activeId === item.id
                  ? 'border-fd-primary font-medium text-fd-primary'
                  : 'border-transparent text-fd-muted-foreground hover:text-fd-foreground'
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
