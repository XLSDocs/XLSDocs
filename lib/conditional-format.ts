export type RuleType =
  | 'duplicates'
  | 'unique'
  | 'comparison'
  | 'textContains'
  | 'blank'
  | 'aboveAverage'
  | 'belowAverage'
  | 'topN'
  | 'bottomN'
  | 'overdue'
  | 'dueSoon'
  | 'weekend';

export type ComparisonOp = 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'between';

export interface ConditionalFormatOptions {
  ruleType: RuleType;
  // Normal mode: the data range to select and apply the rule to directly,
  // e.g. "A2:A20".
  range: string;
  // Whole-row mode: highlight every cell in a wider row range based on one
  // trigger column's condition — the classic "select the whole table,
  // =$C2=..." technique (column locked with $, row left relative).
  wholeRow: boolean;
  triggerColumn: string;
  applyRange: string;
  comparisonOp: ComparisonOp;
  value1: string;
  value2: string;
  textValue: string;
  n: number;
  dueSoonDays: number;
}

export const DEFAULT_CF_OPTIONS: ConditionalFormatOptions = {
  ruleType: 'duplicates',
  range: 'A2:A20',
  wholeRow: false,
  triggerColumn: 'C',
  applyRange: 'A2:E20',
  comparisonOp: 'gt',
  value1: '100',
  value2: '200',
  textValue: 'West',
  n: 5,
  dueSoonDays: 7,
};

interface ParsedRange {
  col: string;
  firstRow: number;
  lastRow: number;
}

function parseRange(range: string): ParsedRange | null {
  const [first, second] = range.split(':').map((s) => s.trim().toUpperCase());
  const m1 = /^([A-Z]+)(\d+)$/.exec(first ?? '');
  if (!m1) return null;
  const m2 = second ? /^([A-Z]+)(\d+)$/.exec(second) : null;
  return {
    col: m1[1],
    firstRow: Number(m1[2]),
    lastRow: m2 ? Number(m2[2]) : Number(m1[2]),
  };
}

export interface ConditionalFormatResult {
  formula: string;
  selectRange: string;
  note: string;
}

export function buildConditionalFormat(opts: ConditionalFormatOptions): ConditionalFormatResult | null {
  let cell: string; // the relative/mixed-reference cell the per-cell test is written against
  let selectRange: string;
  let dataAbs: string; // absolute data range, for COUNTIF/AVERAGE/LARGE/SMALL

  if (opts.wholeRow) {
    // The trigger column's own data is assumed to span the same rows as
    // whatever's selected to apply the highlight to — true for any normal
    // "select the table body, color the whole row" case, and avoids asking
    // for a second, redundant row span that could drift out of sync with
    // applyRange.
    const apply = parseRange(opts.applyRange);
    if (!apply) return null;
    const triggerCol = opts.triggerColumn.trim().toUpperCase() || apply.col;
    cell = `$${triggerCol}${apply.firstRow}`;
    selectRange = opts.applyRange;
    dataAbs = `$${triggerCol}$${apply.firstRow}:$${triggerCol}$${apply.lastRow}`;
  } else {
    const dataRange = parseRange(opts.range);
    if (!dataRange) return null;
    cell = `${dataRange.col}${dataRange.firstRow}`;
    selectRange = opts.range;
    dataAbs = `$${dataRange.col}$${dataRange.firstRow}:$${dataRange.col}$${dataRange.lastRow}`;
  }

  switch (opts.ruleType) {
    case 'duplicates':
      return {
        formula: `=COUNTIF(${dataAbs},${cell})>1`,
        selectRange,
        note: 'Flags every cell whose value appears more than once in the data range.',
      };
    case 'unique':
      return {
        formula: `=COUNTIF(${dataAbs},${cell})=1`,
        selectRange,
        note: 'Flags cells whose value appears exactly once in the data range.',
      };
    case 'comparison': {
      const v1 = opts.value1.trim() || '0';
      const v2 = opts.value2.trim() || '0';
      const expr =
        opts.comparisonOp === 'gt' ? `${cell}>${v1}`
        : opts.comparisonOp === 'gte' ? `${cell}>=${v1}`
        : opts.comparisonOp === 'lt' ? `${cell}<${v1}`
        : opts.comparisonOp === 'lte' ? `${cell}<=${v1}`
        : opts.comparisonOp === 'eq' ? `${cell}=${v1}`
        : `AND(${cell}>=${v1},${cell}<=${v2})`;
      return {
        formula: `=${expr}`,
        selectRange,
        note:
          opts.comparisonOp === 'between'
            ? `Flags values between ${v1} and ${v2}, inclusive.`
            : `Flags values that satisfy the condition against ${v1}.`,
      };
    }
    case 'textContains':
      return {
        formula: `=ISNUMBER(SEARCH("${opts.textValue.replace(/"/g, '""')}",${cell}))`,
        selectRange,
        note: 'Case-insensitive "contains" match — use EXACT() instead of SEARCH() if the match needs to be case-sensitive.',
      };
    case 'blank':
      return {
        formula: `=${cell}=""`,
        selectRange,
        note: 'Flags empty cells (and cells holding a formula that returns an empty string).',
      };
    case 'aboveAverage':
      return {
        formula: `=${cell}>AVERAGE(${dataAbs})`,
        selectRange,
        note: 'Flags values above the data range’s own average — recalculates if the data changes.',
      };
    case 'belowAverage':
      return {
        formula: `=${cell}<AVERAGE(${dataAbs})`,
        selectRange,
        note: 'Flags values below the data range’s own average — recalculates if the data changes.',
      };
    case 'topN':
      return {
        formula: `=${cell}>=LARGE(${dataAbs},${opts.n})`,
        selectRange,
        note: `Flags the top ${opts.n} value${opts.n === 1 ? '' : 's'} in the data range. Ties can flag more than ${opts.n} cells.`,
      };
    case 'bottomN':
      return {
        formula: `=${cell}<=SMALL(${dataAbs},${opts.n})`,
        selectRange,
        note: `Flags the bottom ${opts.n} value${opts.n === 1 ? '' : 's'} in the data range. Ties can flag more than ${opts.n} cells.`,
      };
    case 'overdue':
      return {
        formula: `=AND(${cell}<TODAY(),${cell}<>"")`,
        selectRange,
        note: 'Flags dates before today, ignoring blank cells so empty rows don’t light up.',
      };
    case 'dueSoon':
      return {
        formula: `=AND(${cell}>=TODAY(),${cell}<=TODAY()+${opts.dueSoonDays})`,
        selectRange,
        note: `Flags dates from today through the next ${opts.dueSoonDays} day${opts.dueSoonDays === 1 ? '' : 's'}.`,
      };
    case 'weekend':
      return {
        formula: `=WEEKDAY(${cell},2)>5`,
        selectRange,
        note: 'Flags Saturdays and Sundays — WEEKDAY(date,2) numbers Monday as 1, so 6/7 are the weekend.',
      };
  }
}
