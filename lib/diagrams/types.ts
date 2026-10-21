export type ArgColor = 'blue' | 'red' | 'purple' | 'amber' | 'teal' | 'pink';

export interface DiagramArg {
  /** Parameter name as shown in the syntax line, e.g. "lookup_value". */
  name: string;
  /** Cell or range, written exactly as it appears in `formula`, e.g. "A2:A7". */
  ref: string;
  color: ArgColor;
  /** One sentence for the legend. */
  note: string;
  /** Cell that gets the numbered badge. Defaults to the first cell of `ref`. */
  badgeAt?: string;
  /** Put the badge on the left for right-aligned (numeric) cells. Default "right". */
  badgeSide?: 'left' | 'right';
}

export interface DiagramSpec {
  /** Used as the accessible label for the grid, e.g. "XLOOKUP finds Widget and returns its price". */
  title: string;
  formula: string;
  /** Cell shown in the name box, normally the result cell. */
  formulaCell: string;
  /** One entry per column, A first. `label` defaults to the column letter. */
  columns: { label?: string; width?: number; align?: 'left' | 'right' | 'center' }[];
  /** Sheet values, row 1 first. Use null or "" for empty cells. */
  rows: (string | number | null)[][];
  /** Bold row 1 as headers. Default true. */
  headerRow?: boolean;
  args: DiagramArg[];
  /** Optional range to highlight as the matched row, e.g. "A4:C4". */
  match?: string;
  result: { ref: string; note: string };
  /** Optional dashed arrow; `from` must be left of `to`. */
  arrow?: { from: string; to: string };
}
