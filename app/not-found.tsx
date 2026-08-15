import Link from 'next/link';
import { Logo } from '@/components/logo';
import { CodeRainBackground } from '@/components/shared/code-rain';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <CodeRainBackground />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <Link href="/" aria-label="xlsdocs.com home" className="mb-8 inline-flex items-center">
          <Logo />
        </Link>

        <h1 className="font-mono text-6xl text-fd-primary md:text-7xl">#REF!</h1>
        <p className="mt-4 text-lg text-fd-foreground">This page doesn&apos;t exist — the reference is broken.</p>
        <p className="mt-2 max-w-sm text-sm text-fd-muted-foreground">
          The link might be outdated, or the page may have moved. Try one of these instead.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Back to home
          </Link>
          <Link
            href="/functions"
            className="rounded-full border border-fd-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-card"
          >
            Browse functions
          </Link>
          <Link
            href="/docs"
            className="rounded-full border border-fd-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-card"
          >
            Read the docs
          </Link>
        </div>
      </div>
    </div>
  );
}
