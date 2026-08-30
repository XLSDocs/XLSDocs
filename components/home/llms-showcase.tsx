import { Bot } from 'lucide-react';

// A real, verified excerpt of what /llms.txt actually returns — not a
// mockup. Kept short and hand-picked for readability, not regenerated
// from the live route, so it needs a manual glance if the index format
// or category list changes meaningfully.
const LLMS_TXT_EXCERPT = `# Docs

- [Documentation](/docs): The Excel function reference — syntax,
  parameters, examples, and compatibility for every function.
- Lookup
  - [XLOOKUP](/docs/lookup/xlookup): Search any direction and
    return matching values.
  - [VLOOKUP](/docs/lookup/vlookup): Look up a value in the first
    column of a table.
  ...`;

export function LlmsShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs tracking-wider text-fd-primary uppercase">
            Built for the AI era, literally
          </p>
          <h2 className="mt-2 text-3xl">
            This site talks to{' '}
            <span className="font-serif text-fd-primary italic">AI agents</span> directly
          </h2>
          <p className="mt-4 max-w-md text-fd-muted-foreground">
            Every page is published as clean, structured Markdown — not
            just for humans to read, but for AI tools and agents to fetch
            directly, with no scraping or HTML-stripping required.
          </p>
          <ul className="mt-4 flex flex-col gap-1.5 text-sm text-fd-muted-foreground">
            <li>
              <a href="/llms.txt" className="text-fd-primary hover:underline">
                /llms.txt
              </a>{' '}
              — an index of every page on the site
            </li>
            <li>
              <a href="/llms-full.txt" className="text-fd-primary hover:underline">
                /llms-full.txt
              </a>{' '}
              — the entire reference in one file
            </li>
            <li>Every page's raw Markdown, at its own URL</li>
          </ul>
        </div>

        <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
          <div className="flex items-center gap-2 border-b border-fd-border px-3 py-2">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-500/70" />
              <span className="size-2.5 rounded-full bg-yellow-500/70" />
              <span className="size-2.5 rounded-full bg-green-500/70" />
            </span>
            <Bot className="ml-1 size-3.5 text-fd-muted-foreground" />
            <span className="flex-1 truncate font-mono text-xs text-fd-muted-foreground">
              xlsdocs.com/llms.txt
            </span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-fd-muted-foreground">
            {LLMS_TXT_EXCERPT}
          </pre>
        </div>
      </div>
    </section>
  );
}
