export interface Template {
  slug: string;
  title: string;
  description: string;
  fileSize: string;
  /** The tutorial or guide page this template is built to accompany. */
  relatedHref: string;
  relatedLabel: string;
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
const templates: Template[] = [
  {
    slug: 'named-ranges-starter',
    title: 'Named ranges starter',
    description:
      'A workbook-scoped range, a worksheet-scoped range, and the classic OFFSET+COUNTA dynamic-named-range technique already set up — open Name Manager (Ctrl+F3) to see each one. The guide\'s modern #-spill alternative is explained inline rather than built in, to keep this file opening cleanly on every Excel version.',
    fileSize: '24 KB',
    relatedHref: '/docs/guides/use-named-ranges',
    relatedLabel: 'How to use named ranges',
  },
  {
    slug: 'pivottable-practice-data',
    title: 'PivotTable practice data',
    description:
      '180 rows of transactions spanning two calendar years — enough to build a PivotTable from scratch and reproduce the "grouping by Months without Years" mistake the guide warns about.',
    fileSize: '12 KB',
    relatedHref: '/docs/guides/group-dates-in-a-pivottable',
    relatedLabel: 'How to group dates in a PivotTable',
  },
  {
    slug: 'pareto-chart',
    title: 'Pareto chart',
    description:
      'The exact 9-cause dataset from the tutorial, pre-sorted by count, with a classic RANK tie-break and the locked-range cumulative-percentage formula — all classic formulas, so it opens cleanly on every Excel version. The live SORT/SCAN versions are in the article above.',
    fileSize: '8 KB',
    relatedHref: '/blog/build-a-pareto-chart-in-excel',
    relatedLabel: 'How to Build a Pareto Chart in Excel',
  },
  {
    slug: 'waterfall-chart',
    title: 'Waterfall chart',
    description:
      'The running-total, base, increase, decrease, and total formulas for the manual stacked-column technique, built from the tutorial\'s own Starting Cash → Ending Cash numbers.',
    fileSize: '8 KB',
    relatedHref: '/blog/build-a-waterfall-chart-in-excel',
    relatedLabel: 'How to Build a Waterfall Chart in Excel',
  },
  {
    slug: 'dynamic-dropdown',
    title: 'Self-updating dropdown',
    description:
      'A raw source list with duplicates and a dropdown wired to a classic auto-growing OFFSET+COUNTA range. The article\'s modern SORT(UNIQUE(...))+# version is explained inline, ready to try yourself on Excel 365.',
    fileSize: '8 KB',
    relatedHref: '/blog/dynamic-self-updating-dropdown-in-excel',
    relatedLabel: 'Build a Dropdown List That Updates Itself',
  },
];

export function getTemplates(): Template[] {
  return templates;
}
