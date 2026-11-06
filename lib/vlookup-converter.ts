export interface ConvertResult {
  xlookup: string;
  indexMatch: string;
  notes: string[];
}

export interface ConvertError {
  error: string;
}

// Splits a formula's top-level comma-separated arguments, respecting
// nested parentheses and quoted strings (a naive `.split(',')` breaks on
// anything like `VLOOKUP(A2&","&B2, ...)` or a nested function call).
function splitArgs(inner: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let inQuote = false;
  let current = '';
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (inQuote) {
      current += ch;
      if (ch === '"') inQuote = false;
      continue;
    }
    if (ch === '"') {
      inQuote = true;
      current += ch;
    } else if (ch === '(') {
      depth++;
      current += ch;
    } else if (ch === ')') {
      depth--;
      current += ch;
    } else if (ch === ',' && depth === 0) {
      args.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) args.push(current.trim());
  return args;
}

// A plain A1-style range, optionally sheet-qualified and/or $-locked —
// deliberately narrow. A named range or a structured Table reference
// (Table1[#All], Sales[@Price]) has no column layout visible in its own
// text, so there's no reliable way to split it into "first column" /
// "Nth column" without actually reading the workbook — rejected rather
// than guessed.
const RANGE_RE = /^((?:'[^']+'|[A-Za-z0-9_]+)!)?\$?([A-Z]{1,3})\$?(\d+):\$?([A-Z]{1,3})\$?(\d+)$/i;

function colToIndex(letters: string): number {
  let n = 0;
  for (const ch of letters.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n;
}

function indexToCol(n: number): string {
  let s = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

interface ParsedRange {
  sheetPrefix: string;
  col1: string;
  row1: string;
  col2: string;
  row2: string;
}

function parseRange(ref: string): ParsedRange | null {
  const m = RANGE_RE.exec(ref.trim());
  if (!m) return null;
  return { sheetPrefix: m[1] ?? '', col1: m[2], row1: m[3], col2: m[4], row2: m[5] };
}

function extractCall(formula: string, name: string): string | null {
  const re = new RegExp(`${name}\\s*\\(`, 'i');
  const m = re.exec(formula);
  if (!m) return null;
  const start = m.index + m[0].length;
  let depth = 1;
  let i = start;
  let inQuote = false;
  for (; i < formula.length; i++) {
    const ch = formula[i];
    if (inQuote) {
      if (ch === '"') inQuote = false;
      continue;
    }
    if (ch === '"') inQuote = true;
    else if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) return null;
  return formula.slice(start, i);
}

export function convertVlookup(input: string): ConvertResult | ConvertError {
  const trimmed = input.trim().replace(/^=/, '');
  const inner = extractCall(trimmed, 'VLOOKUP');
  if (inner === null) {
    return { error: 'Couldn’t find a VLOOKUP(...) call — paste the full formula, e.g. =VLOOKUP(A2, Sheet1!B:D, 3, FALSE).' };
  }

  const args = splitArgs(inner);
  if (args.length < 3) {
    return { error: `VLOOKUP needs at least 3 arguments (lookup_value, table_array, col_index_num) — found ${args.length}.` };
  }

  const [lookupValue, tableArray, colIndexRaw, rangeLookupRaw] = args;

  const colIndexNum = Number(colIndexRaw.trim());
  if (!Number.isInteger(colIndexNum) || colIndexNum < 1) {
    return { error: `col_index_num must be a literal positive whole number — got "${colIndexRaw.trim()}". If it's a formula (e.g. MATCH(...)), convert it by hand first.` };
  }

  const range = parseRange(tableArray);
  if (!range) {
    return {
      error: `table_array ("${tableArray.trim()}") isn’t a plain cell range (like A2:D100 or Sheet1!B:D) — a named range or Table reference (Table1[...]) doesn't show its column layout in the text itself, so this can't be converted automatically. Rewrite table_array as a literal range first.`,
    };
  }

  const firstCol = colToIndex(range.col1);
  const lastCol = colToIndex(range.col2);
  const width = lastCol - firstCol + 1;
  if (colIndexNum > width) {
    return { error: `col_index_num is ${colIndexNum}, but table_array only spans ${width} column${width === 1 ? '' : 's'} (${range.col1}:${range.col2}).` };
  }

  const targetCol = indexToCol(firstCol + colIndexNum - 1);
  const lookupArray = `${range.sheetPrefix}${range.col1}${range.row1}:${range.col1}${range.row2}`;
  const returnArray = `${range.sheetPrefix}${targetCol}${range.row1}:${targetCol}${range.row2}`;

  const notes: string[] = [];
  const rangeLookup = rangeLookupRaw?.trim().toUpperCase();
  // VLOOKUP's 4th argument defaults to TRUE (approximate match) when
  // OMITTED ENTIRELY — a well-documented but easy-to-forget surprise.
  // Only a literal FALSE/0 means exact match; anything else, including
  // nothing at all, is approximate.
  const isApproximate = rangeLookup !== 'FALSE' && rangeLookup !== '0';
  let matchModeArg = '';
  if (isApproximate) {
    matchModeArg = ', , -1';
    if (rangeLookupRaw === undefined) {
      notes.push('range_lookup was omitted — VLOOKUP defaults that to TRUE (approximate match), not exact, which is easy to miss. Converted as approximate (XLOOKUP match_mode -1); if the original formula actually relied on exact matching, this is wrong.');
    } else if (rangeLookup === 'TRUE' || rangeLookup === '1') {
      notes.push('VLOOKUP’s approximate match (TRUE) — "largest value ≤ lookup_value" in sorted data — maps to XLOOKUP’s match_mode -1, not the default 0.');
    } else {
      notes.push(`range_lookup ("${rangeLookupRaw.trim()}") isn't a literal TRUE/FALSE — treated as approximate match (VLOOKUP's own fallback for anything non-FALSE). Double-check this is what was intended.`);
    }
  }

  const xlookup = `=XLOOKUP(${lookupValue}, ${lookupArray}, ${returnArray}${matchModeArg})`;
  const indexMatch = `=INDEX(${returnArray}, MATCH(${lookupValue}, ${lookupArray}, ${isApproximate ? '1' : '0'}))`;

  if (colIndexNum === 1) {
    notes.push('col_index_num is 1, so VLOOKUP was just returning the lookup column itself — unusual, but converted as-written.');
  }

  return { xlookup, indexMatch, notes };
}
