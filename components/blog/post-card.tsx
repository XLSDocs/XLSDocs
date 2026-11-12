import Link from 'next/link';

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

// The per-post OG image (`/og/blog/[slug]/route.tsx`) is statically generated
// for every post at build time via its own `generateStaticParams` — reusing
// it here as the card thumbnail means zero new image-generation code or
// assets, just an <img> pointed at a route that already exists and is
// already correctly branded.
function thumbnailSrc(slug: string) {
  return `/og/blog/${slug}.png`;
}

export function PostCard({ slug, title, description, date, category, author, readTime, featured }: PostCardProps) {
  if (featured) {
    return (
      <Link
        href={`/blog/${slug}`}
        className="group grid overflow-hidden rounded-xl border border-fd-border bg-fd-card transition-colors hover:border-fd-primary/50 md:grid-cols-[1.1fr_1fr]"
      >
        <img
          src={thumbnailSrc(slug)}
          alt=""
          width={1200}
          height={630}
          loading="lazy"
          className="aspect-[1200/630] w-full object-cover md:aspect-auto md:h-full"
        />
        <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
          <span className="w-fit rounded-full border border-fd-primary/20 bg-fd-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-fd-primary">
            {category}
          </span>
          <h3 className="text-2xl font-normal text-fd-foreground transition-colors group-hover:text-fd-primary md:text-3xl">
            {title}
          </h3>
          <p className="text-sm text-fd-muted-foreground md:text-base">{description}</p>
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

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-fd-border bg-fd-card transition-colors hover:border-fd-primary/50"
    >
      <img
        src={thumbnailSrc(slug)}
        alt=""
        width={1200}
        height={630}
        loading="lazy"
        className="aspect-[1200/630] w-full object-cover"
      />
      <div className="flex flex-1 flex-col justify-between gap-4 p-6">
        <div className="flex flex-col gap-3">
          <span className="w-fit rounded-full border border-fd-primary/20 bg-fd-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-fd-primary">
            {category}
          </span>
          <h3 className="text-lg font-normal text-fd-foreground transition-colors group-hover:text-fd-primary">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm text-fd-muted-foreground">{description}</p>
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
