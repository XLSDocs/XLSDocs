'use client';

import type { TOCItemType } from 'fumadocs-core/toc';
import { TOCProvider, TOCScrollArea } from 'fumadocs-ui/components/toc';
import { TOCItem, TOCItems } from 'fumadocs-ui/components/toc/clerk';

export function PostToc({ items }: { items: TOCItemType[] }) {
  if (items.length === 0) return null;

  return (
    <TOCProvider toc={items}>
      <nav className="sticky top-28 hidden h-fit w-56 shrink-0 lg:block">
        <span className="text-[10px] tracking-wide text-fd-muted-foreground uppercase">On this page</span>
        <TOCScrollArea className="max-h-[calc(100vh-10rem)]">
          <TOCItems>
            {items.map((item) => (
              <TOCItem key={item.url} item={item} />
            ))}
          </TOCItems>
        </TOCScrollArea>
      </nav>
    </TOCProvider>
  );
}
