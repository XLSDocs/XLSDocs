import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';

interface Crumb {
  title: string;
  url: string;
}

/**
 * Replaces Fumadocs' default breadcrumb (fumadocs-ui/layouts/docs/page),
 * which shows only the current page name here — our categories are `root:
 * true` tabs, and Fumadocs' breadcrumb logic resets the trail at every
 * category-root boundary, so it never surfaces "Lookup" for a function page.
 * Built from the same category/function data as getFunctionCatalog() instead
 * of the page tree, and styled to match the original component exactly.
 */
export function CategoryBreadcrumb({ category, fn }: { category?: Crumb; fn?: Crumb }) {
  if (!category) return null;

  const items = fn ? [category, fn] : [category];

  return (
    <div className="flex items-center gap-1.5 text-sm text-fd-muted-foreground">
      {items.map((item, i) => (
        <Fragment key={item.url}>
          {i !== 0 && <ChevronRight className="size-3.5 shrink-0" />}
          <Link
            href={item.url}
            className={`truncate transition-opacity hover:opacity-80 ${
              i === items.length - 1 ? 'text-fd-primary font-medium' : ''
            }`}
          >
            {item.title}
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
