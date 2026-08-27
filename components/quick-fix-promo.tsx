import Link from 'next/link';
import { Wrench } from 'lucide-react';

export function QuickFixPromo() {
  return (
    <Link
      href="/tools/quick-fix"
      className="not-prose group my-6 flex items-center justify-between gap-3 rounded-lg border border-fd-border bg-fd-card px-4 py-3 text-sm transition-colors hover:border-fd-primary/50"
    >
      <span className="flex items-center gap-2">
        <Wrench className="size-4 shrink-0 text-fd-primary" />
        Formula throwing an error like this? Paste it into Quick Fix.
      </span>
      <span className="shrink-0 text-fd-primary underline decoration-dotted underline-offset-2 group-hover:opacity-80">
        Try it →
      </span>
    </Link>
  );
}
