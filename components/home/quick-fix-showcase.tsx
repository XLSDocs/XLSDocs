import { Wrench, ArrowRight } from 'lucide-react';
import { ExcelCode } from '@/components/excel-code';

export function QuickFixShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1 gradient-border-card overflow-hidden rounded-xl">
          <div className="flex items-center gap-2 border-b border-fd-border px-4 py-3">
            <Wrench className="size-3.5 text-fd-primary" />
            <span className="text-sm font-semibold">Quick Fix</span>
          </div>
          <div className="flex flex-col gap-3 p-4">
            <div>
              <span className="text-[10px] uppercase tracking-wide text-fd-muted-foreground">
                Pasted
              </span>
              <div className="mt-1.5">
                <ExcelCode>{'=VLOOKUP(A2,B:C,2,FALSE)  →  #N/A'}</ExcelCode>
              </div>
            </div>
            <div className="flex justify-center text-fd-muted-foreground">
              <ArrowRight className="size-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wide text-fd-primary">
                Fixed
              </span>
              <div className="mt-1.5">
                <ExcelCode>{'=VLOOKUP(TRIM(A2),B:C,2,FALSE)'}</ExcelCode>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="font-mono text-xs tracking-wider text-fd-primary uppercase">
            Broken formula? Paste it.
          </p>
          <h2 className="mt-2 text-3xl">
            <span className="font-serif text-fd-primary italic">Quick Fix</span> diagnoses it
            for you
          </h2>
          <p className="mt-4 max-w-md text-fd-muted-foreground">
            Paste a formula that's throwing an error or returning the wrong
            result, along with whatever it's doing wrong. Get back a
            corrected version and a plain-English explanation of what was
            actually broken — not just a generic error definition.
          </p>
          <p className="mt-4 text-sm text-fd-muted-foreground">
            Free to try, no sign-up — $5/mo for unlimited, same subscription
            as the Formula Builder.
          </p>
        </div>
      </div>
    </section>
  );
}
