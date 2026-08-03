'use client';

import { useEffect, useState } from 'react';
import type { TOCItemType } from 'fumadocs-core/toc';

export function PostToc({ items }: { items: TOCItemType[] }) {
  const [active, setActive] = useState('');

  useEffect(() => {
    function onScroll() {
      let current = '';
      for (const item of items) {
        const el = document.getElementById(item.url.slice(1));
        if (el && el.getBoundingClientRect().top < 120) {
          current = item.url;
        }
      }
      setActive(current);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-28 hidden h-fit w-56 shrink-0 lg:block">
      <span className="text-[10px] tracking-wide text-fd-muted-foreground uppercase">On this page</span>
      <ul className="mt-3 flex flex-col gap-2 border-l border-fd-border pl-4 text-sm">
        {items.map((item) => (
          <li key={item.url} style={{ paddingLeft: (item.depth - 2) * 12 }}>
            <a
              href={item.url}
              className={`block transition-colors ${
                active === item.url
                  ? 'text-fd-primary'
                  : 'text-fd-muted-foreground hover:text-fd-foreground'
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
