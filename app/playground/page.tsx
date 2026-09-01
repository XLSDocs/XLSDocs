import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FlaskConical } from 'lucide-react';
import { HomeNav } from '@/components/home/nav';
import { Footer } from '@/components/home/footer';

export const metadata: Metadata = {
  title: 'Playground',
  description:
    'Every interactive Try it example on xlsdocs.com in one place — real Excel formulas, live, no Excel required.',
  alternates: {
    canonical: '/playground',
  },
};

interface PlaygroundItem {
  fn: string;
  href: string;
  teaser: string;
}

interface PlaygroundCategory {
  name: string;
  items: PlaygroundItem[];
}

// Curated, not exhaustive — one representative pick per Try-it "shape"
// per category (grid highlight, schedule swap, scenario picker, error
// demo), rather than all 52 pages that currently have a widget. See
// each linked page's own Try it section for the full picture; this
// page's job is to hook interest, not catalog everything.
const CATEGORIES: PlaygroundCategory[] = [
  {
    name: 'Lookup',
    items: [
      {
        fn: 'ROW',
        href: '/docs/lookup/row#try-it',
        teaser: 'Point at any cell in the grid and watch ROW return its exact row number.',
      },
      {
        fn: 'OFFSET',
        href: '/docs/lookup/offset#try-it',
        teaser: 'Shift the row offset and watch the highlighted cell jump to a different row.',
      },
      {
        fn: 'XLOOKUP',
        href: '/docs/lookup/xlookup#try-it',
        teaser: 'Swap the lookup value and watch XLOOKUP find the matching price instantly.',
      },
      {
        fn: 'INDEX',
        href: '/docs/lookup/index#try-it',
        teaser: "Push the position past the array's edge and watch INDEX return #REF! instead of a value.",
      },
    ],
  },
  {
    name: 'Database',
    items: [
      {
        fn: 'DSUM',
        href: '/docs/database/dsum#try-it',
        teaser: "Change the region and watch DSUM total only that group's highlighted rows.",
      },
      {
        fn: 'DCOUNT',
        href: '/docs/database/dcount#try-it',
        teaser: 'Pick a region and watch DCOUNT tally just its matching rows, highlighted live.',
      },
      {
        fn: 'DGET',
        href: '/docs/database/dget#try-it',
        teaser: "Change the order ID and watch DGET pull that one row's exact amount.",
      },
    ],
  },
  {
    name: 'Financial',
    items: [
      {
        fn: 'PMT',
        href: '/docs/financial/pmt#try-it',
        teaser: "Switch the loan term and watch the first three months' interest-vs-principal split change completely.",
      },
      {
        fn: 'IPMT',
        href: '/docs/financial/ipmt#try-it',
        teaser: 'Jump to payment 360 and watch how little of it is still interest, compared to payment 1.',
      },
      {
        fn: 'NPV',
        href: '/docs/financial/npv#try-it',
        teaser: "Raise the discount rate and watch this 'profitable-looking' project actually lose money.",
      },
      {
        fn: 'IRR',
        href: '/docs/financial/irr#try-it',
        teaser: "Switch to the aggressive scenario and watch the same $50,000 investment's return swing from negative to nearly 15%.",
      },
    ],
  },
  {
    name: 'Info',
    items: [
      {
        fn: 'NA',
        href: '/docs/info/na#try-it',
        teaser: 'Drop NA() into the middle of a SUM and watch the whole total break — unlike a real 0.',
      },
      {
        fn: 'ISNA',
        href: '/docs/info/isna#try-it',
        teaser: 'Test a generic error and watch ISNA say FALSE, while ISERROR would say TRUE for the same input.',
      },
      {
        fn: 'ISLOGICAL',
        href: '/docs/info/islogical#try-it',
        teaser: 'Type the text "TRUE" and watch ISLOGICAL correctly call it FALSE — it\'s not a real boolean.',
      },
    ],
  },
  {
    name: 'Statistical',
    items: [
      {
        fn: 'RANK',
        href: '/docs/statistical/rank#try-it',
        teaser: 'Rank a tied score and watch the next distinct value skip straight to 3rd place.',
      },
      {
        fn: 'RANK.AVG',
        href: '/docs/statistical/rank-avg#try-it',
        teaser: 'Rank that same tied score here instead, and watch it land on 1.5 rather than 1.',
      },
      {
        fn: 'PERCENTILE.EXC',
        href: '/docs/statistical/percentile-exc#try-it',
        teaser: 'Push k to 0.9 and watch this exact call return #NUM! — a value PERCENTILE.INC accepts without complaint.',
      },
      {
        fn: 'MODE.MULT',
        href: '/docs/statistical/mode-mult#try-it',
        teaser: 'Pick the tied-modes dataset and watch MODE.MULT report both repeated values, not just the first.',
      },
    ],
  },
];

export default function PlaygroundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeNav />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-primary/30 bg-fd-primary/10 px-3 py-1 text-xs font-medium text-fd-primary">
            <FlaskConical className="size-3.5" />
            Interactive examples
          </span>
          <h1 className="mt-4 text-4xl font-normal md:text-5xl">
            Stop reading examples.{' '}
            <span className="font-serif text-fd-primary italic">Try them.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-fd-muted-foreground">
            Most Excel references show a formula and a result, and leave it
            at that. On the function pages below, the numbers are real
            inputs — change them and watch the actual result recalculate,
            right on the page, no Excel and no upload required.
          </p>

          <div className="mt-14 flex flex-col gap-14">
            {CATEGORIES.map((category) => (
              <section key={category.name}>
                <h2 className="text-xl font-medium">{category.name}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {category.items.map((item) => (
                    <Link
                      key={item.fn}
                      href={item.href}
                      className="group flex flex-col gap-2 rounded-xl border border-fd-border bg-fd-card p-4 transition-colors hover:border-fd-primary/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-medium text-fd-primary">
                          {item.fn}()
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-fd-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-fd-primary" />
                      </div>
                      <p className="text-sm text-fd-muted-foreground">{item.teaser}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-16 text-sm text-fd-muted-foreground">
            Every function page has its own "Try it" widget, not just the
            ones featured here — browse the{' '}
            <Link href="/functions" className="text-fd-primary hover:underline">
              full function index
            </Link>{' '}
            to find the rest.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
