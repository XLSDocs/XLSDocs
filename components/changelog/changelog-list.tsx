import type { ChangelogEntry, ChangelogTag } from '@/lib/changelog';

const TAG_STYLES: Record<ChangelogTag, string> = {
  'New functions': 'border-fd-primary/30 bg-fd-primary/10 text-fd-primary',
  Feature: 'border-fd-border bg-fd-card text-fd-foreground',
  Improvement: 'border-fd-border text-fd-muted-foreground',
  Milestone: 'border-fd-border text-fd-muted-foreground',
};

// entry.date is a plain 'YYYY-MM-DD' string with no time-of-day meaning —
// `new Date(date)` parses it as UTC midnight, so formatting it back out in
// the viewer's local timezone silently shows the previous day for anyone
// west of UTC. Forcing the format itself to UTC keeps the displayed date
// identical to the literal string, regardless of viewer timezone.
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function ChangelogList({ entries }: { entries: ChangelogEntry[] }) {
  return (
    <ol className="relative space-y-10 border-l border-fd-border pl-8">
      {entries.map((entry, i) => (
        <li key={i} className="relative">
          <span className="absolute top-1.5 -left-[calc(2rem+4.5px)] size-2 rounded-full bg-fd-primary" />
          <time className="font-mono text-xs text-fd-muted-foreground">{formatDate(entry.date)}</time>
          <h2 className="mt-1 text-lg font-medium">{entry.title}</h2>
          <p className="mt-1.5 text-sm text-fd-muted-foreground">{entry.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-2.5 py-0.5 text-xs ${TAG_STYLES[tag]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
