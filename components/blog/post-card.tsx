import Link from 'next/link';
import { BookOpen, ChartColumn, FileCode, Sheet, Terminal, Zap, type LucideIcon } from 'lucide-react';

interface PostCardProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  // Optional going forward — new posts don't carry a byline. Older posts
  // keep whichever name they already shipped with; nothing needs backfilling.
  author?: string;
  readTime: string;
  featured?: boolean;
}

// `date` is a plain 'YYYY-MM-DD' string with no time-of-day meaning —
// `new Date(date)` parses it as UTC midnight, so formatting it back out
// in the viewer's local timezone silently shows the previous day for
// anyone west of UTC (i.e. almost every US visitor, against Cloudflare
// Workers' UTC server clock) — a guaranteed server/client text mismatch
// react hydration flags as a real error, not just a cosmetic one.
// Forcing the format itself to UTC keeps the displayed date identical to
// the literal string regardless of viewer timezone. Same fix already
// applied to components/changelog/changelog-list.tsx's formatDate —
// this one was missed when that one was written.
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// Same icon already used for the matching docs category where one exists
// (VBA → FileCode in content/docs/vba/meta.json) — unmapped categories
// fall back to BookOpen rather than guessing a new icon per post.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Excel: Sheet,
  VBA: FileCode,
  Python: Terminal,
  'Power BI': ChartColumn,
  Performance: Zap,
  Tutorials: BookOpen,
};

// A plain, icon-only header strip — not a second copy of the title/
// description. An earlier version reused the post's full 1200x630 OG
// share-image as a literal thumbnail here, which duplicated every title
// and description a second time (badly, since the image crops the title
// mid-word at card width) and nearly doubled the card's height for zero
// new information. This just signals "what kind of post is this" at a
// glance, the way the category pill already does in text.
function CategoryStrip({ category, featured }: { category: string; featured?: boolean }) {
  const Icon = CATEGORY_ICONS[category] ?? BookOpen;
  return (
    <div
      className={`flex items-center justify-center border-b border-fd-border bg-fd-primary/5 ${
        featured ? 'h-24' : 'h-16'
      }`}
    >
      <Icon className={`text-fd-primary/40 ${featured ? 'size-9' : 'size-6'}`} strokeWidth={1.5} />
    </div>
  );
}

export function PostCard({ slug, title, description, date, category, author, readTime, featured }: PostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-fd-border bg-fd-card transition-colors hover:border-fd-primary/50"
    >
      <CategoryStrip category={category} featured={featured} />
      <div
        className={`flex flex-1 flex-col justify-between gap-4 ${featured ? 'gap-6 p-6 md:p-8' : 'p-6'}`}
      >
        <div className="flex flex-col gap-3">
          <span className="w-fit rounded-full border border-fd-primary/20 bg-fd-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-fd-primary">
            {category}
          </span>
          <h3
            className={`font-normal text-fd-foreground transition-colors group-hover:text-fd-primary ${
              featured ? 'text-2xl md:text-3xl' : 'text-lg'
            }`}
          >
            {title}
          </h3>
          <p className={`text-fd-muted-foreground ${featured ? 'text-sm md:text-base' : 'text-sm line-clamp-2'}`}>
            {description}
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-fd-muted-foreground">
          {author && (
            <>
              <span>{author}</span>
              <span>·</span>
            </>
          )}
          <span>{readTime}</span>
          <span>·</span>
          <span>{formatDate(date)}</span>
        </div>
      </div>
    </Link>
  );
}
