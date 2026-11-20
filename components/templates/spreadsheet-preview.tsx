import type { TemplatePreview } from '@/lib/templates';

const COL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * A small, real excerpt of a template's actual cells — not a stock image —
 * styled like a spreadsheet grid (column letters, row numbers) with any
 * formula cells shown as their literal formula text in the brand color,
 * instead of a computed value, so it reads as "this is a working formula"
 * at a glance.
 */
export function SpreadsheetPreview({ headers, rows, formulaCells = [] }: TemplatePreview) {
  const isFormulaCell = (r: number, c: number) => formulaCells.some(([fr, fc]) => fr === r && fc === c);

  return (
    <div className="not-prose overflow-hidden rounded-lg border border-fd-border">
      <table className="w-full table-fixed border-collapse text-[11px]">
        <thead>
          <tr>
            <th className="w-5 border-r border-b border-fd-border bg-fd-muted/60" />
            {headers.map((_, c) => (
              <th
                key={c}
                className="border-r border-b border-fd-border bg-fd-muted/60 px-1.5 py-0.5 text-center font-mono text-[9px] font-normal text-fd-muted-foreground last:border-r-0"
              >
                {COL_LETTERS[c] ?? ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-r border-b border-fd-border bg-fd-muted/60 text-center font-mono text-[9px] text-fd-muted-foreground">
              1
            </td>
            {headers.map((h, c) => (
              <td
                key={c}
                className="truncate border-r border-b border-fd-border bg-fd-primary/10 px-1.5 py-1 font-medium text-fd-foreground last:border-r-0"
              >
                {h}
              </td>
            ))}
          </tr>
          {rows.map((row, r) => (
            <tr key={r}>
              <td className="border-r border-b border-fd-border bg-fd-muted/60 text-center font-mono text-[9px] text-fd-muted-foreground">
                {r + 2}
              </td>
              {headers.map((_, c) => {
                const cell = row[c] ?? '';
                const formula = isFormulaCell(r, c);
                return (
                  <td
                    key={c}
                    className={`truncate border-r border-b border-fd-border px-1.5 py-1 last:border-r-0 ${
                      formula ? 'font-mono text-fd-primary' : 'text-fd-muted-foreground'
                    }`}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
