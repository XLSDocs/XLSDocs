export interface TemplatePreview {
  headers: string[];
  rows: (string | number)[][];
  /** [row, col] pairs (0-indexed into `rows`) rendered as formula text in a distinct style. */
  formulaCells?: [number, number][];
}

export interface Template {
  slug: string;
  title: string;
  description: string;
  fileSize: string;
  /** The tutorial or guide page this template is built to accompany. */
  relatedHref: string;
  relatedLabel: string;
  /** A few real rows/formulas from the actual file, for a thumbnail preview. */
  preview: TemplatePreview;
}

// Generated once via a one-off script using exceljs (see package.json
// devDependencies — not imported by any app/component code, only used to
// author these static files) and committed as plain binary assets under
// public/templates/. No backend or API route involved: the site is a
// static export, so these are served exactly like any other static file.
//
// Deliberately built with classic, pre-2007 formulas only (no SORT, UNIQUE,
// SCAN, LAMBDA, RANK.EQ, etc.) — those newer functions have to be stored in
// the file internally with an `_xlfn.` prefix that exceljs doesn't add, and
// shipping one without it corrupts the file (confirmed live: Excel's "we
// found a problem with some content" repair dialog on the first version of
// this file). Where a template's whole point is a newer function (the
// dropdown's SORT(UNIQUE())+# technique), the file instead uses a classic
// equivalent and a text note pointing back to the article for the modern
// version, rather than risk it again.
//
// Each `preview` below is real data pulled straight from the actual
// generated file (not invented for display) — kept in sync by hand since
// the generator script lives in the session scratchpad, not this repo.
const templates: Template[] = [
  {
    slug: 'named-ranges-starter',
    title: 'Named ranges starter',
    description:
      'A workbook-scoped range, a worksheet-scoped range, and the classic OFFSET+COUNTA dynamic-named-range technique already set up — open Name Manager (Ctrl+F3) to see each one. The guide\'s modern #-spill alternative is explained inline rather than built in, to keep this file opening cleanly on every Excel version.',
    fileSize: '24 KB',
    relatedHref: '/docs/guides/use-named-ranges',
    relatedLabel: 'How to use named ranges',
    preview: {
      headers: ['Month', 'Sales'],
      rows: [
        ['Jan', 4200],
        ['Feb', 3900],
        ['Total', '=SUM(Sales)'],
      ],
      formulaCells: [[2, 1]],
    },
  },
  {
    slug: 'pivottable-practice-data',
    title: 'PivotTable practice data',
    description:
      '180 rows of transactions spanning two calendar years — enough to build a PivotTable from scratch and reproduce the "grouping by Months without Years" mistake the guide warns about.',
    fileSize: '12 KB',
    relatedHref: '/docs/guides/group-dates-in-a-pivottable',
    relatedLabel: 'How to group dates in a PivotTable',
    preview: {
      headers: ['Date', 'Region', 'Product', 'Amount'],
      rows: [
        ['2026-11-14', 'North', 'Widget D', 3508.64],
        ['2027-02-15', 'North', 'Widget C', 801.53],
        ['2026-01-27', 'West', 'Widget B', 4985.31],
      ],
    },
  },
  {
    slug: 'pareto-chart',
    title: 'Pareto chart',
    description:
      'The exact 9-cause dataset from the tutorial, pre-sorted by count, with a classic RANK tie-break and the locked-range cumulative-percentage formula — all classic formulas, so it opens cleanly on every Excel version. The live SORT/SCAN versions are in the article above.',
    fileSize: '8 KB',
    relatedHref: '/blog/build-a-pareto-chart-in-excel',
    relatedLabel: 'How to Build a Pareto Chart in Excel',
    preview: {
      headers: ['Cause', 'Tickets', 'Rank'],
      rows: [
        ['Login failures', 70, '=RANK(B4,$B$4:$B$12,0)'],
        ['Slow page loads', 48, 2],
        ['Billing errors', 30, 3],
      ],
      formulaCells: [[0, 2]],
    },
  },
  {
    slug: 'waterfall-chart',
    title: 'Waterfall chart',
    description:
      'The running-total, base, increase, decrease, and total formulas for the manual stacked-column technique, built from the tutorial\'s own Starting Cash → Ending Cash numbers.',
    fileSize: '8 KB',
    relatedHref: '/blog/build-a-waterfall-chart-in-excel',
    relatedLabel: 'How to Build a Waterfall Chart in Excel',
    preview: {
      headers: ['Label', 'Value', 'Running Total'],
      rows: [
        ['Starting Cash', 50, '=SUM($B$4:B4)'],
        ['Revenue', 120, 170],
        ['COGS', -45, 125],
      ],
      formulaCells: [[0, 2]],
    },
  },
  {
    slug: 'dynamic-dropdown',
    title: 'Self-updating dropdown',
    description:
      'A raw source list with duplicates and a dropdown wired to a classic auto-growing OFFSET+COUNTA range. The article\'s modern SORT(UNIQUE(...))+# version is explained inline, ready to try yourself on Excel 365.',
    fileSize: '8 KB',
    relatedHref: '/blog/dynamic-self-updating-dropdown-in-excel',
    relatedLabel: 'Build a Dropdown List That Updates Itself',
    preview: {
      headers: ['Region (raw)', 'Dropdown source'],
      rows: [
        ['West', '=OFFSET($A$4,0,0,COUNTA($A:$A)-1,1)'],
        ['East', ''],
        ['West', ''],
      ],
      formulaCells: [[0, 1]],
    },
  },
  {
    slug: 'count-cells-that-meet-a-condition',
    title: 'Count cells that meet a condition',
    description:
      '15 sample orders with COUNTIF (single condition) and COUNTIFS (two conditions) already built, side by side.',
    fileSize: '8 KB',
    relatedHref: '/docs/guides/count-cells-that-meet-a-condition',
    relatedLabel: 'How to count cells that meet a condition',
    preview: {
      headers: ['Region', 'Amount'],
      rows: [
        ['West', 420],
        ['East', 180],
        ['Count "West"', '=COUNTIF(A4:A18,"West")'],
      ],
      formulaCells: [[2, 1]],
    },
  },
  {
    slug: 'sum-cells-that-meet-a-condition',
    title: 'Sum cells that meet a condition',
    description:
      '15 sample orders with SUMIF (single condition) and SUMIFS (two conditions) already built, showing the argument-order difference between them.',
    fileSize: '8 KB',
    relatedHref: '/docs/guides/sum-cells-that-meet-a-condition',
    relatedLabel: 'How to sum cells that meet a condition',
    preview: {
      headers: ['Region', 'Status', 'Amount'],
      rows: [
        ['West', 'Paid', 420],
        ['East', 'Unpaid', 180],
        ['Total "West"', '', '=SUMIF(A4:A18,"West",C4:C18)'],
      ],
      formulaCells: [[2, 2]],
    },
  },
  {
    slug: 'lookup-with-multiple-criteria',
    title: 'Lookup with multiple criteria',
    description:
      'A 12-row price list with the INDEX/MATCH boolean-array formula already built — change the product or region inputs and watch it find the matching price.',
    fileSize: '8 KB',
    relatedHref: '/docs/guides/lookup-with-multiple-criteria',
    relatedLabel: 'How to look up a value using multiple criteria',
    preview: {
      headers: ['Product', 'Region', 'Price'],
      rows: [
        ['Widget A', 'West', 12.5],
        ['Widget A', 'East', 13.0],
        ['Price (B, East)', '', '=INDEX(C4:C15,MATCH(1,…))'],
      ],
      formulaCells: [[2, 2]],
    },
  },
  {
    slug: 'remove-duplicate-values',
    title: 'Remove duplicate values',
    description:
      'A 15-row customer list with a COUNTIF-based "times repeated" column already built, to flag duplicates before deciding how to handle them.',
    fileSize: '8 KB',
    relatedHref: '/docs/guides/remove-duplicate-values',
    relatedLabel: 'How to remove duplicate values',
    preview: {
      headers: ['Customer', 'Times in list'],
      rows: [
        ['Acme Corp', '=COUNTIF($A$4:$A$18,A4)'],
        ['Beta LLC', 3],
        ['Acme Corp', 2],
      ],
      formulaCells: [[0, 1]],
    },
  },
  {
    slug: 'compare-two-lists-for-differences',
    title: 'Compare two lists for differences',
    description:
      'Two 10-item lists with a dragged-down COUNTIF flag formula already built on each side, showing exactly what\'s missing from the other.',
    fileSize: '8 KB',
    relatedHref: '/docs/guides/compare-two-lists-for-differences',
    relatedLabel: 'How to compare two lists for differences',
    preview: {
      headers: ['List A', 'In List B?'],
      rows: [
        ['Apple', '=IF(COUNTIF($C$4:$C$13,A4)=0,"Missing","Found")'],
        ['Banana', 'Found'],
        ['Cherry', 'Found'],
      ],
      formulaCells: [[0, 1]],
    },
  },
  {
    slug: 'combine-text-from-multiple-cells',
    title: 'Combine text from multiple cells',
    description:
      '10 first/last name pairs with the & operator and CONCATENATE already built side by side, both producing the same combined result.',
    fileSize: '8 KB',
    relatedHref: '/docs/guides/combine-text-from-multiple-cells',
    relatedLabel: 'How to combine text from multiple cells',
    preview: {
      headers: ['First', 'Last', 'Combined'],
      rows: [
        ['John', 'Smith', '=A4&" "&B4'],
        ['Maria', 'Garcia', 'Maria Garcia'],
        ['Wei', 'Chen', 'Wei Chen'],
      ],
      formulaCells: [[0, 2]],
    },
  },
  {
    slug: 'split-text-into-columns',
    title: 'Split text into columns',
    description:
      '10 "Last, First" combined names with the manual LEFT/MID/FIND splitting formulas already built — works on every Excel version.',
    fileSize: '8 KB',
    relatedHref: '/docs/guides/split-text-into-columns',
    relatedLabel: 'How to split text into columns',
    preview: {
      headers: ['Combined', 'Last', 'First'],
      rows: [
        ['Smith, John', '=LEFT(A4,FIND(",",A4)-1)', '=TRIM(MID(A4,FIND(",",A4)+1,100))'],
        ['Garcia, Maria', 'Garcia', 'Maria'],
      ],
      formulaCells: [
        [0, 1],
        [0, 2],
      ],
    },
  },
  {
    slug: 'convert-text-to-numbers',
    title: 'Convert text to real numbers',
    description:
      '10 numbers stored as text, with ISNUMBER, VALUE, and the *1 coercion trick already built side by side so you can see each one fix it.',
    fileSize: '8 KB',
    relatedHref: '/docs/guides/convert-text-to-numbers',
    relatedLabel: 'How to convert text to real numbers',
    preview: {
      headers: ['Text', 'ISNUMBER', 'VALUE'],
      rows: [
        ['1234', '=ISNUMBER(A4)', '=VALUE(A4)'],
        ['1,234.56', 'FALSE', 1234.56],
      ],
      formulaCells: [
        [0, 1],
        [0, 2],
      ],
    },
  },
];

export function getTemplates(): Template[] {
  return templates;
}
