import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface RelatedLink {
  href: string;
  label: string;
}

/**
 * Every tool page was a dead end back to the docs/guides/blog content it's
 * directly relevant to — found during a 2026-11-21 cross-linking audit
 * (0 of 7 tools linked to any /docs or /blog page). This renders a small,
 * consistent "Related" footer so each tool point back at the reference
 * content someone landing on the tool directly (via search, nav, a shared
 * link) would otherwise have no path to.
 */
export function RelatedLinks({ links }: { links: RelatedLink[] }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-fd-border pt-6">
      <span className="text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
        Related
      </span>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="inline-flex items-center gap-1 rounded-full border border-fd-border px-3 py-1 text-xs font-medium text-fd-muted-foreground transition-colors hover:border-fd-primary/40 hover:text-fd-primary"
        >
          {l.label}
          <ArrowRight className="size-3" />
        </Link>
      ))}
    </div>
  );
}
