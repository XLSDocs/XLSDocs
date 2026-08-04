'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThumbsUp, ThumbsDown, Pencil, Bug } from 'lucide-react';

type Vote = 'up' | 'down';

function storageKey(path: string) {
  return `xlsdocs-feedback:${path}`;
}

interface FeedbackProps {
  editUrl?: string;
  reportIssueUrl?: string;
}

export function Feedback({ editUrl, reportIssueUrl }: FeedbackProps = {}) {
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
    <div className="not-prose flex flex-col gap-3 border-t border-fd-border pt-4 text-sm">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-fd-muted-foreground">
          {voted ? 'Thanks for the feedback!' : 'Was this helpful?'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => vote('up')}
            disabled={Boolean(voted) || submitting}
            aria-label="This page was helpful"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              voted === 'up'
                ? 'border-fd-primary/40 bg-fd-primary/10 text-fd-primary'
                : 'text-fd-muted-foreground hover:bg-fd-muted disabled:opacity-40'
            }`}
          >
            <ThumbsUp className="size-4" />
            Yes
          </button>
          <button
            onClick={() => vote('down')}
            disabled={Boolean(voted) || submitting}
            aria-label="This page was not helpful"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              voted === 'down'
                ? 'border-fd-primary/40 bg-fd-primary/10 text-fd-primary'
                : 'text-fd-muted-foreground hover:bg-fd-muted disabled:opacity-40'
            }`}
          >
            <ThumbsDown className="size-4" />
            No
          </button>
        </div>
      </div>
      {(editUrl || reportIssueUrl) && (
        <div className="flex flex-col gap-2">
          {editUrl && (
            <a
              href={editUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex w-fit items-center gap-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              <Pencil className="size-3.5" />
              Edit this page
            </a>
          )}
          {reportIssueUrl && (
            <a
              href={reportIssueUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex w-fit items-center gap-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              <Bug className="size-3.5" />
              Report an issue
            </a>
          )}
        </div>
      )}
    </div>
  );
}
