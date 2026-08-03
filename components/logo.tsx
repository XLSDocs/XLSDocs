/**
 * Ported from the original static site's `.logo`/`.brand-mark`/`.nav-grid`
 * (2×2 grid of "breathing" dots + "XLS" wordmark). Deliberately NOT a link
 * itself — every consumer (HomeNav, Fumadocs' `nav.title`) wraps it in
 * whatever link/button element fits that context, so this stays reusable.
 * `badge` is optional and separate from the mark (e.g. a "docs" pill on
 * docs/blog pages) rather than baked in, since it's contextual.
 */
export function Logo({ badge, className = '' }: { badge?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      <span className="grid h-6 w-6 grid-cols-2 gap-1" aria-hidden="true">
        <span className="xlsdocs-logo-dot" style={{ animationDelay: '0s' }} />
        <span className="xlsdocs-logo-dot" style={{ animationDelay: '1.5s' }} />
        <span className="xlsdocs-logo-dot" style={{ animationDelay: '3s' }} />
        <span className="xlsdocs-logo-dot" style={{ animationDelay: '4.5s' }} />
      </span>
      <span className="font-mono text-lg font-semibold tracking-tight text-fd-foreground">
        XLS
      </span>
      {badge && (
        <span className="rounded-full border border-fd-border px-1.5 py-0.5 font-mono text-[10px] text-fd-muted-foreground">
          {badge}
        </span>
      )}
    </span>
  );
}
