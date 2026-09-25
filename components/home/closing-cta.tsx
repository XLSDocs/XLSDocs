import Link from 'next/link';

/**
 * A second, lower-key CTA prompt near the bottom of the homepage — for
 * anyone who scrolled all the way through Categories/CodeWriter/TryIt/
 * AskClaude/QuickFix/Llms without converting on the hero's own buttons.
 * Deliberately reuses the hero's exact two links/labels rather than
 * inventing new copy, since the point is a second chance at the same
 * action, not a different pitch.
 */
export function ClosingCta() {
  return (
    <section className="border-t border-fd-border bg-fd-card/40">
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <span className="font-mono text-xs tracking-wider text-fd-muted-foreground uppercase">
          Get started
        </span>
        <h2 className="mt-3 text-3xl font-normal md:text-4xl">
          Stop searching. <span className="font-serif text-fd-primary italic">Start writing.</span>
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/tools/formula-builder"
            className="rounded-full bg-fd-foreground px-5 py-2.5 text-sm font-medium text-fd-background transition-opacity hover:opacity-90"
          >
            Build a formula free
          </Link>
          <Link
            href="/functions"
            className="rounded-full border border-fd-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-card"
          >
            Browse functions
          </Link>
        </div>
      </div>
    </section>
  );
}
