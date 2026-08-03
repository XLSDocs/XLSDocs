'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';
import { Logo } from '@/components/logo';

export function PostNav({ category, readTime }: { category: string; readTime: string }) {
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard access denied — nothing actionable to do
    }
  }

  return (
    <div className="sticky top-0 z-40">
      <header className="border-b border-fd-border bg-fd-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            aria-label="xlsdocs.com home"
            className="inline-flex items-center transition-transform duration-200 hover:-translate-y-px"
          >
            <Logo badge="blog" />
          </Link>
          <div className="flex items-center gap-3 text-xs text-fd-muted-foreground">
            <span className="rounded-full border border-fd-border px-2.5 py-1 font-mono uppercase tracking-wider text-fd-primary">
              {category}
            </span>
            <span>{readTime}</span>
            <button
              onClick={share}
              aria-label="Copy link to this article"
              className="relative rounded-md p-1.5 transition-colors hover:bg-fd-card"
            >
              <Share2 className="size-4" />
              {copied && (
                <span className="absolute top-full right-0 mt-2 whitespace-nowrap rounded-md border border-fd-border bg-fd-card px-2.5 py-1 text-xs text-fd-muted-foreground shadow-sm">
                  Link copied
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <div className="h-[2px] w-full bg-fd-border">
        <div className="h-full bg-fd-primary transition-[width]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
