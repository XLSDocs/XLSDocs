'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

type Vote = 'up' | 'down';

function storageKey(path: string) {
  return `xlsdocs-feedback:${path}`;
}

export function Feedback() {
  const pathname = usePathname();
  const [voted, setVoted] = useState<Vote | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey(pathname));
    setVoted(stored === 'up' || stored === 'down' ? stored : null);
  }, [pathname]);

  async function vote(choice: Vote) {
    if (voted || submitting) return;
    setSubmitting(true);
    setVoted(choice);
    window.localStorage.setItem(storageKey(pathname), choice);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname, vote: choice }),
      });
    } catch {
      // best-effort — the local "already voted" state still sticks either way
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="not-prose flex items-center gap-3 rounded-xl border bg-fd-card px-4 py-3 text-sm">
      <span className="text-fd-muted-foreground">
        {voted ? 'Thanks for the feedback!' : 'Was this page helpful?'}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => vote('up')}
          disabled={Boolean(voted) || submitting}
          aria-label="This page was helpful"
          className={`rounded-md border p-1.5 transition-colors ${
            voted === 'up'
              ? 'border-fd-primary/40 bg-fd-primary/10 text-fd-primary'
              : 'text-fd-muted-foreground hover:bg-fd-muted disabled:opacity-40'
          }`}
        >
          <ThumbsUp className="size-4" />
        </button>
        <button
          onClick={() => vote('down')}
          disabled={Boolean(voted) || submitting}
          aria-label="This page was not helpful"
          className={`rounded-md border p-1.5 transition-colors ${
            voted === 'down'
              ? 'border-fd-primary/40 bg-fd-primary/10 text-fd-primary'
              : 'text-fd-muted-foreground hover:bg-fd-muted disabled:opacity-40'
          }`}
        >
          <ThumbsDown className="size-4" />
        </button>
      </div>
    </div>
  );
}
