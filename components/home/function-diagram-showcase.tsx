import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FunctionDiagram } from '@/components/function-diagram/function-diagram';

export function FunctionDiagramShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="order-1 lg:order-2">
          <p className="font-mono text-xs tracking-wider text-fd-primary uppercase">
            On lookup function pages
          </p>
          <h2 className="mt-2 text-3xl">
            See exactly{' '}
            <span className="font-serif text-fd-primary italic">how</span>{' '}
            a formula finds its answer
          </h2>
          <p className="mt-4 max-w-md text-fd-muted-foreground">
            A color-coded diagram walks each argument straight from the
            formula bar to the cells it actually touches — no more
            guessing which range is which, or where a result came from.
          </p>
          <Link
            href="/docs/lookup/xlookup"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-fd-primary hover:underline"
          >
            See it on the XLOOKUP page
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="order-2 min-w-0 lg:order-1">
          <FunctionDiagram fn="xlookup" />
        </div>
      </div>
    </section>
  );
}
