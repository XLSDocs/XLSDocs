interface MiniGridProps {
  /** Column letters to display, left to right — e.g. ['A', 'B', 'C', 'D']. */
  cols: string[];
  /** How many rows to display, starting at row 1. */
  rowCount: number;
  /** Cell contents, keyed by lowercase reference (e.g. 'a5') — purely
   *  decorative flavor text, independent of whatever TryIt's own `data`
   *  computes as the function's result. */
  values: Record<string, string>;
  /** The current reference or range being tried, e.g. 'A5' or 'A1:C1' —
   *  every cell it covers gets highlighted. Cells outside the visible
   *  cols/rowCount window are silently not highlighted (the result still
   *  computes correctly; it just can't be shown on a small fixed grid). */
  highlight: string;
}

function parseRef(ref: string): { col: string; row: number } | null {
  const match = ref.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  return { col: match[1], row: Number(match[2]) };
}

/** A=1, B=2, ..., Z=26, AA=27, ... — Excel's actual column numbering. */
function colIndex(col: string): number {
  let n = 0;
  for (const ch of col) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n;
}

function getHighlightedCells(highlight: string, cols: string[], rowCount: number): Set<string> {
  const cells = new Set<string>();
  const [fromRef, toRef] = highlight.split(':').map((s) => s.trim());
  const from = parseRef(fromRef);
  if (!from) return cells;
  const to = toRef ? parseRef(toRef) : from;
  if (!to) return cells;

  const minCol = Math.min(colIndex(from.col), colIndex(to.col));
  const maxCol = Math.max(colIndex(from.col), colIndex(to.col));
  const minRow = Math.min(from.row, to.row);
  const maxRow = Math.max(from.row, to.row);

  for (const col of cols) {
    const ci = colIndex(col);
    if (ci < minCol || ci > maxCol) continue;
    for (let row = 1; row <= rowCount; row++) {
      if (row < minRow || row > maxRow) continue;
      cells.add(`${col}${row}`.toLowerCase());
    }
  }
  return cells;
}

export function MiniGrid({ cols, rowCount, values, highlight }: MiniGridProps) {
  const highlighted = getHighlightedCells(highlight, cols, rowCount);
  const rows = Array.from({ length: rowCount }, (_, i) => i + 1);

  return (
    <div className="overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full border-collapse text-center font-mono text-[11px]">
        <thead>
          <tr>
            <th className="w-7 border-r border-b border-fd-border bg-fd-muted p-1" />
            {cols.map((col) => (
              <th key={col} className="border-b border-fd-border bg-fd-muted p-1 text-fd-muted-foreground">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <td className="border-r border-fd-border bg-fd-muted p-1 text-fd-muted-foreground">{row}</td>
              {cols.map((col) => {
                const ref = `${col}${row}`.toLowerCase();
                const isHighlighted = highlighted.has(ref);
                return (
                  <td
                    key={col}
                    className={
                      isHighlighted
                        ? 'border border-fd-primary/50 bg-fd-primary/15 p-1 font-semibold text-fd-primary'
                        : 'border border-fd-border/50 p-1 text-fd-foreground'
                    }
                  >
                    {values[ref] ?? ''}
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
