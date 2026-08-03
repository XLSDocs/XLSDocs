import Link from 'next/link';

interface PostCardProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
  featured?: boolean;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function PostCard({ slug, title, description, date, category, author, readTime, featured }: PostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className={`group flex flex-col justify-between rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-primary/50 ${
        featured ? 'gap-6' : 'gap-4'
      }`}
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
        <span>{author}</span>
        <span>·</span>
        <span>{readTime}</span>
        <span>·</span>
        <span>{formatDate(date)}</span>
      </div>
    </Link>
  );
}
