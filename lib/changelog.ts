export type ChangelogTag = 'New functions' | 'Feature' | 'Improvement' | 'Milestone';

export interface ChangelogEntry {
  date: string;
  title: string;
  description: string;
  tags: ChangelogTag[];
}

// Meaningful, user-facing updates only — internal refactors and one-off bug
// fixes don't belong here. Newest first; re-sorted defensively in getChangelog()
// so entry order in this file doesn't have to be kept perfectly chronological.
const entries: ChangelogEntry[] = [
  {
    date: '2026-08-10',
    title: 'SORT, SORTBY, and UNIQUE',
    description:
      'Three more dynamic array functions round out the Arrays category alongside FILTER — sorting a spilled range, sorting by a separate key array, and pulling distinct values live from a range.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-10',
    title: 'AND, OR, and NOT',
    description:
      'The core logical operators, closing out the Logical category — including the common gotcha where AND/OR collapse a whole range to one TRUE/FALSE instead of testing row-by-row inside FILTER or another array formula.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-10',
    title: 'SUMIF, COUNTIF, and AVERAGEIF',
    description:
      'The single-condition companions to SUMIFS, COUNTIFS, and AVERAGEIFS — including the argument-order gotcha between the two families (sum_range/average_range moves from last-and-optional to first-and-required).',
    tags: ['New functions'],
  },
  {
    date: '2026-08-07',
    title: 'NOW, EOMONTH, UPPER, LOWER, PROPER, and LEN',
    description:
      'Two more date functions rounding out the Date category, plus four text-casing and length functions closing out Text — 38 function pages live across 6 categories.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-07',
    title: 'DATE, TODAY, EDATE, and DATEDIF',
    description:
      'A new Date category covers the most common date-math functions — building a date from parts, getting today\'s date, shifting a date by months, and measuring the gap between two dates.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-07',
    title: 'Cleaner formula blocks and clearer breadcrumbs',
    description:
      'Long Excel formulas now wrap instead of forcing a horizontal scroll, and every function page shows a proper "Category > Function" trail instead of just the page name.',
    tags: ['Improvement'],
  },
  {
    date: '2026-08-06',
    title: 'A full Text category: 14 more functions',
    description:
      'CONCAT, LEFT, RIGHT, MID, TRIM, TEXT, TEXTJOIN, CLEAN, SUBSTITUTE, VALUE, FIND, SEARCH, REPLACE, and NUMBERVALUE — everything for building, extracting, cleaning, and formatting text.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-06',
    title: 'SWITCH, IFNA, AVERAGEIFS, and COUNTIFS',
    description:
      'Four more function pages, closing out every function that other pages already linked to as "coming soon."',
    tags: ['New functions'],
  },
  {
    date: '2026-08-06',
    title: 'Quick answers and richer parameter tables on every function page',
    description:
      'Each page now leads with a formula, key facts, and a migration path where one genuinely exists, plus a parameters table with required/optional badges and a copy button.',
    tags: ['Improvement'],
  },
  {
    date: '2026-08-06',
    title: 'Sitemap and search-engine crawling',
    description: 'Added a real sitemap and robots.txt, built from the same live function/blog data as the rest of the site.',
    tags: ['Improvement'],
  },
  {
    date: '2026-08-05',
    title: 'Row hover on tables, and a real favicon',
    description: 'Small polish: parameter tables highlight the row you\'re reading, and the browser tab now shows the real xlsdocs mark instead of a generic icon.',
    tags: ['Improvement'],
  },
  {
    date: '2026-08-05',
    title: 'Site-wide search, plus HLOOKUP, IFERROR, INDEX, MATCH, and IFS',
    description:
      'Search now covers the blog and marketing pages too, not just docs, and there’s a search button in the main nav so it’s reachable from anywhere. Five more function pages are live, closing out the most-linked-to "coming soon" references from existing pages.',
    tags: ['Feature', 'New functions'],
  },
  {
    date: '2026-08-05',
    title: 'FAQ answers now show up in search engines, with deeper reading links',
    description:
      'Function page FAQs are marked up as FAQPage structured data, so answers can surface directly in Google results. XLOOKUP, VLOOKUP, and FILTER now link out to related deep-dive articles on the blog.',
    tags: ['Feature'],
  },
  {
    date: '2026-08-04',
    title: 'Feedback, edit links, and last-updated dates on every function page',
    description:
      'Added a simple thumbs up/down widget, "Edit this page" and "Report an issue" links, and a last-updated date sourced from real commit history.',
    tags: ['Improvement'],
  },
  {
    date: '2026-08-04',
    title: 'Docs pages get a proper reading width',
    description:
      'Tightened the reading column to match reference docs sites, while letting the sidebar and table of contents reach the true edges of the page instead of floating in a centered block.',
    tags: ['Improvement'],
  },
  {
    date: '2026-08-04',
    title: 'Mobile navigation and a custom 404 page',
    description:
      'Added a proper mobile menu to the main nav, fixed a crowded search bar on small screens, and shipped an on-brand "#REF!" 404 page.',
    tags: ['Improvement'],
  },
  {
    date: '2026-08-03',
    title: 'VLOOKUP, SUMIFS, IF, and FILTER',
    description:
      'Four more function reference pages, each with syntax, parameters, common errors, an interactive preview, and working code in VBA and Python.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-03',
    title: 'AI Formula Builder',
    description:
      'Describe what you need in plain English and get back a working Excel formula with a plain-English breakdown of every part.',
    tags: ['Feature'],
  },
  {
    date: '2026-08-03',
    title: 'Blog launched',
    description:
      'Practical, non-fluff writing on Excel, VBA, Python, and the tools around a spreadsheet — grouped by year, with category filtering.',
    tags: ['Feature'],
  },
  {
    date: '2026-08-03',
    title: 'xlsdocs.com goes live',
    description: 'The site moved from local development onto real infrastructure for the first time.',
    tags: ['Milestone'],
  },
  {
    date: '2026-08-02',
    title: 'Function Index and home page',
    description:
      'A searchable, always-up-to-date index of every function on the site, plus a proper landing page introducing xlsdocs.',
    tags: ['Feature'],
  },
  {
    date: '2026-08-02',
    title: 'XLOOKUP — the first function page',
    description:
      'The template every future function page follows: syntax, parameters, common errors, an interactive preview, and version compatibility.',
    tags: ['New functions'],
  },
];

export function getChangelog(): ChangelogEntry[] {
  return [...entries].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
