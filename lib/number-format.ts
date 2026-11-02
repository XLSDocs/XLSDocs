export type FormatKind = 'number' | 'currency' | 'percentage' | 'accounting';
export type NegativeStyle = 'minus' | 'parentheses' | 'red' | 'redParentheses';
export type ZeroStyle = 'number' | 'dash' | 'hide';
export type Scale = 'none' | 'thousands' | 'millions';

export const CURRENCY_SYMBOLS = ['$', '€', '£', '¥', '₹'] as const;

export interface NumberFormatOptions {
  kind: FormatKind;
  decimals: number;
  thousands: boolean;
  scale: Scale;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  negativeStyle: NegativeStyle;
  zeroStyle: ZeroStyle;
  suffix: string;
}

export const DEFAULT_OPTIONS: NumberFormatOptions = {
  kind: 'number',
  decimals: 2,
  thousands: true,
  scale: 'none',
  currencySymbol: '$',
  currencyPosition: 'before',
  negativeStyle: 'minus',
  zeroStyle: 'number',
  suffix: '',
};

function quoteLiteral(text: string): string {
  return `"${text.replace(/"/g, '\\"')}"`;
}

function numberCore(decimals: number, thousands: boolean): string {
  const intPart = thousands ? '#,##0' : '0';
  return decimals > 0 ? `${intPart}.${'0'.repeat(decimals)}` : intPart;
}

function scaleSuffix(scale: Scale): { commas: string; label: string } {
  if (scale === 'thousands') return { commas: ',', label: 'K' };
  if (scale === 'millions') return { commas: ',,', label: 'M' };
  return { commas: '', label: '' };
}

// Real Excel built-in Accounting format, e.g. for 2 decimals with a $ symbol:
// _($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)
// `_(`/`_)` reserve the width of "(" / ")" so positive values align with
// parenthesized negatives; `*` repeats the following space to push the
// symbol to the cell's left edge and the number to the right. Confirmed
// against Microsoft's own documented syntax and several independent
// references before shipping — this gets pasted straight into Excel, so it
// has to be exact, not an approximation.
function buildAccounting(decimals: number, symbol: string, zeroStyle: ZeroStyle): string {
  const core = numberCore(decimals, true);
  const symbolPrefix = symbol ? `${quoteLiteral(symbol)}* ` : '* ';

  const positive = `_(${symbolPrefix}${core}_)`;
  const negative = `_(${symbolPrefix}(${core})`;
  const zeroDash = decimals > 0 ? `${quoteLiteral('-')}${'?'.repeat(decimals)}` : quoteLiteral('-');
  const zero =
    zeroStyle === 'hide' ? `_(${symbolPrefix}_)`
    : zeroStyle === 'number' ? `_(${symbolPrefix}${core}_)`
    : `_(${symbolPrefix}${zeroDash}_)`;
  const text = '_(@_)';

  return [positive, negative, zero, text].join(';');
}

function negativeSection(body: string, style: NegativeStyle): string {
  switch (style) {
    case 'minus':
      return `-${body}`;
    case 'parentheses':
      return `(${body})`;
    case 'red':
      return `[Red]-${body}`;
    case 'redParentheses':
      return `[Red](${body})`;
  }
}

export function buildFormatCode(opts: NumberFormatOptions): string {
  if (opts.kind === 'accounting') {
    return buildAccounting(opts.decimals, opts.currencySymbol, opts.zeroStyle);
  }

  const thousands = opts.kind === 'currency' ? true : opts.thousands;
  const scale = opts.kind === 'percentage' ? 'none' : opts.scale;
  const { commas, label } = scaleSuffix(scale);
  const core = numberCore(opts.decimals, thousands) + commas;

  let body = core;
  if (opts.kind === 'currency') {
    body =
      opts.currencyPosition === 'before'
        ? `${quoteLiteral(opts.currencySymbol)}${core}`
        : `${core} ${quoteLiteral(opts.currencySymbol)}`;
  } else if (opts.kind === 'percentage') {
    body = `${core}%`;
  } else if (scale !== 'none') {
    body = `${core}${quoteLiteral(label)}`;
  } else if (opts.suffix.trim()) {
    body = `${core} ${quoteLiteral(opts.suffix.trim())}`;
  }

  const sections = [body, negativeSection(body, opts.negativeStyle)];
  if (opts.zeroStyle === 'dash') sections.push(quoteLiteral('-'));
  else if (opts.zeroStyle === 'hide') sections.push('');

  return sections.join(';');
}

export interface PreviewResult {
  text: string;
  red: boolean;
}

/**
 * Computes what a sample value would actually display as, directly from the
 * same structured options buildFormatCode() uses — not by re-parsing the
 * generated code string. Keeps the preview trustworthy without needing a
 * general Excel-format-code interpreter.
 */
export function formatPreviewValue(value: number, opts: NumberFormatOptions): PreviewResult {
  // Accounting's zero section keeps the symbol/alignment prefix even on the
  // dash row (real Excel: `_($* "-"??_)`) — every other kind's zero section
  // is just a bare "-", no symbol, matching buildFormatCode()'s plain
  // `"-"` 3rd section.
  if (value === 0 && opts.kind === 'accounting') {
    if (opts.zeroStyle === 'hide') return { text: opts.currencySymbol ? `${opts.currencySymbol}  ` : '', red: false };
    if (opts.zeroStyle === 'dash') return { text: opts.currencySymbol ? `${opts.currencySymbol}  -` : '-', red: false };
  } else if (value === 0) {
    if (opts.zeroStyle === 'hide') return { text: '', red: false };
    if (opts.zeroStyle === 'dash') return { text: '-', red: false };
  }

  const isNegative = value < 0;
  let n = Math.abs(value);
  if (opts.kind === 'percentage') n *= 100;

  const thousands = opts.kind === 'accounting' || opts.kind === 'currency' ? true : opts.thousands;
  const scale = opts.kind === 'percentage' || opts.kind === 'accounting' ? 'none' : opts.scale;
  if (scale === 'thousands') n /= 1000;
  if (scale === 'millions') n /= 1_000_000;

  const numStr = n.toLocaleString('en-US', {
    minimumFractionDigits: opts.decimals,
    maximumFractionDigits: opts.decimals,
    useGrouping: thousands,
  });

  let body = numStr;
  if (opts.kind === 'currency') {
    body = opts.currencyPosition === 'before' ? `${opts.currencySymbol}${numStr}` : `${numStr} ${opts.currencySymbol}`;
  } else if (opts.kind === 'percentage') {
    body = `${numStr}%`;
  } else if (opts.kind === 'accounting') {
    body = opts.currencySymbol ? `${opts.currencySymbol}  ${numStr}` : numStr;
  } else if (opts.kind === 'number') {
    if (scale !== 'none') body = `${numStr}${scaleSuffix(opts.scale).label}`;
    else if (opts.suffix.trim()) body = `${numStr} ${opts.suffix.trim()}`;
  }

  if (!isNegative) return { text: body, red: false };

  const style = opts.kind === 'accounting' ? 'parentheses' : opts.negativeStyle;
  const red = style === 'red' || style === 'redParentheses';
  const text = style === 'parentheses' || style === 'redParentheses' ? `(${body})` : `-${body}`;
  return { text, red };
}

export const PREVIEW_VALUES: Record<FormatKind, number[]> = {
  number: [1234567.891, 42.5, -1234.56, 0],
  currency: [1234567.891, 42.5, -1234.56, 0],
  accounting: [1234567.891, 42.5, -1234.56, 0],
  percentage: [0.1234, 0.5, -0.082, 0],
};
