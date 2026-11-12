import Link from 'next/link';
import { ArrowRightLeft, Hash, Palette, ListChecks, Sheet, type LucideIcon } from 'lucide-react';

export const TOOLS: { href: string; label: string; description: string; icon: LucideIcon }[] = [
  {
    href: '/tools/vlookup-converter',
    label: 'VLOOKUP → XLOOKUP Converter',
    description: 'Paste a real VLOOKUP, get back the exact XLOOKUP and INDEX/MATCH equivalent.',
    icon: ArrowRightLeft,
  },
  {
    href: '/tools/number-format-builder',
    label: 'Number Format Builder',
    description: 'Currency, percentage, accounting, or K/M scaling — built with a form, not memorized syntax.',
    icon: Hash,
  },
  {
    href: '/tools/conditional-format-builder',
    label: 'Conditional Format Builder',
    description: 'Duplicates, blanks, top/bottom N, overdue dates, and 10 more rule types.',
    icon: Palette,
  },
  {
    href: '/tools/data-validation-builder',
    label: 'Data Validation Builder',
    description: 'Dropdown lists, dependent dropdowns, range limits, and duplicate prevention.',
    icon: ListChecks,
  },
  {
    href: '/tools/large-file-viewer',
    label: 'Large File Viewer',
    description: "Open a CSV or Parquet file bigger than Excel's own row limit.",
    icon: Sheet,
  },
];

export function ToolsShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs tracking-wider text-fd-primary uppercase">
          No AI required
        </p>
        <h2 className="mt-2 text-3xl">
          Five tools that just <span className="font-serif text-fd-primary italic">build the formula</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-fd-muted-foreground">
          Fill in a form or paste what you have — these generate an exact,
          deterministic result every time, no model in the loop.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="category-card group relative rounded-xl bg-fd-card p-5 transition-transform duration-300 hover:-translate-y-1"
          >
            <tool.icon className="size-5 text-fd-primary" />
            <h3 className="mt-3 font-medium">{tool.label}</h3>
            <p className="mt-1 line-clamp-3 text-xs text-fd-muted-foreground">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
