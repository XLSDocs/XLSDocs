const FORMULAS = [
  '=UNIQUE(SORT(A2:A200))',
  '=TEXTAFTER(A2, "@")',
  '=TEXTBEFORE(A2, "@")',
  '=SEQUENCE(12, 1, 1, 1)',
  '=VSTACK(Sheet1!A1:C10, Sheet2!A1:C10)',
  '=XMATCH(D2, A:A, 0, -1)',
  '=COUNTIFS(A:A, "Active", B:B, ">500")',
  '=IFERROR(A2/B2, 0)',
  '=SORTBY(A2:A10, B2:B10)',
];

const STATS = [
  'AI formula builder',
  '2026–27 blog coverage',
  'Print-ready PDF export on all docs',
  'Mobile fully responsive',
  'Dark mode only — as it should be',
  '96 functions documented',
  '8 categories covered',
  'Excel 365 fully supported',
];

export function FormulaTicker() {
  const items = [
    ...FORMULAS.map((text) => ({ text, mono: true })),
    ...STATS.map((text) => ({ text, mono: false })),
  ];
  const looped = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-fd-border bg-fd-card/40 py-3">
      <div className="flex w-max animate-[xlsdocs-ticker_50s_linear_infinite] gap-8 text-sm whitespace-nowrap">
        {looped.map((item, i) => (
          <span
            key={i}
            className={
              item.mono
                ? 'shrink-0 font-mono text-fd-primary'
                : 'flex shrink-0 items-center gap-2 text-fd-muted-foreground'
            }
          >
            {!item.mono && <span className="size-1 rounded-full bg-fd-muted-foreground" />}
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
