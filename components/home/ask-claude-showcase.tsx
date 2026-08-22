import { Sparkles, Send } from 'lucide-react';

export function AskClaudeShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs tracking-wider text-fd-primary uppercase">
            On every function page
          </p>
          <h2 className="mt-2 text-3xl">
            Stuck on a formula?{' '}
            <span className="font-serif text-fd-primary italic">Ask Claude</span> right there
          </h2>
          <p className="mt-4 max-w-md text-fd-muted-foreground">
            Every function page has a Claude-powered chat built in — scoped
            to exactly what you're reading. Ask for a real-world example,
            what a specific error means, or how it compares to a similar
            function, without leaving the page or opening a new tab.
          </p>
          <p className="mt-4 text-sm text-fd-muted-foreground">
            Free, no sign-up — same as the rest of xlsdocs.
          </p>
        </div>

        <div className="gradient-border-card overflow-hidden rounded-xl">
          <div className="flex items-center gap-2 border-b border-fd-border px-4 py-3">
            <Sparkles className="size-3.5 text-fd-primary" />
            <span className="text-sm font-semibold">Ask Claude about XLOOKUP</span>
          </div>
          <div className="flex flex-col gap-3 p-4">
            <div className="self-end max-w-[85%] rounded-lg border border-fd-primary/20 bg-fd-primary/10 px-3 py-2 text-sm">
              Why does this return #N/A even though the value is in the table?
            </div>
            <div className="self-start max-w-[85%] rounded-lg bg-fd-muted px-3 py-2 text-sm text-fd-muted-foreground">
              Most likely a leading/trailing space, or the lookup array and
              return array aren't the same size — worth wrapping in{' '}
              <code className="rounded bg-fd-background px-1 py-0.5 text-xs">TRIM()</code>{' '}
              first to rule that out.
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-fd-border p-3">
            <div className="flex-1 rounded-md border border-fd-border bg-fd-muted px-3 py-2 text-sm text-fd-muted-foreground">
              Ask anything about XLOOKUP…
            </div>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-fd-primary text-fd-primary-foreground">
              <Send className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
