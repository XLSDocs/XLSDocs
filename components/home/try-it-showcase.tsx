import { TryIt } from '@/components/try-it';

export function TryItShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs tracking-wider text-fd-primary uppercase">
            On every function page
          </p>
          <h2 className="mt-2 text-3xl">
            Don't just read the example —{' '}
            <span className="font-serif text-fd-primary italic">try it</span> yourself
          </h2>
          <p className="mt-4 max-w-md text-fd-muted-foreground">
            Type your own reference or value into a real, live example —
            right on the page, no Excel required — and watch the result
            recalculate instantly. Every function page has one.
          </p>
          <p className="mt-4 text-sm text-fd-muted-foreground">
            Completely free, unlimited — it's just math running in your
            browser, not an AI call.
          </p>
        </div>

        <div>
          <TryIt
            data={{ a5: '5', b10: '10', c1: '1', d8: '8' }}
            defaultValue="A5"
            label={'Live preview — =ROW({value})'}
            fieldLabel="reference"
            grid={{
              cols: ['A', 'B', 'C', 'D'],
              rowCount: 10,
              values: { a5: 'Apple', b10: '42', c1: 'SKU', d8: '99.99' },
            }}
          />
        </div>
      </div>
    </section>
  );
}
