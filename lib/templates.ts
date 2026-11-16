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
const templates: Template[] = [
  {
    slug: 'named-ranges-starter',
    title: 'Named ranges starter',
    description:
      'A workbook-scoped range, a worksheet-scoped range, and both dynamic-named-range techniques (the classic OFFSET+COUNTA formula and the modern # spill operator) already set up — open Name Manager (Ctrl+F3) to see each one.',
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
      'The exact 9-cause dataset from the tutorial, with the RANK.EQ tie-break, the SORT, and the SCAN-based cumulative-percentage formula already built.',
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
      'A raw source list with duplicates, the SORT(UNIQUE(...)) helper formula, and a Data Validation list already wired to its spill range with #.',
    fileSize: '8 KB',
    relatedHref: '/blog/dynamic-self-updating-dropdown-in-excel',
    relatedLabel: 'Build a Dropdown List That Updates Itself',
  },
];

export function getTemplates(): Template[] {
  return templates;
}
