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
    date: '2026-08-23',
    title: 'NPER, PPMT, and IPMT',
    description:
      'Three more Financial functions round out the loan-amortization set alongside PMT — solving for the number of payments instead of the payment amount, and splitting any individual payment into its principal and interest portions.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-22',
    title: 'A better docs sidebar',
    description:
      'Every category is now visible and expandable at once, instead of hiding behind a single-category dropdown — and individual function entries no longer show a dead expand arrow that opened onto nothing.',
    tags: ['Improvement'],
  },
  {
    date: '2026-08-22',
    title: 'A clearer FAQ toggle',
    description: 'Question accordions now show a plain +/− instead of a rotating arrow, on every function page, the FAQ page, and blog posts.',
    tags: ['Improvement'],
  },
  {
    date: '2026-08-22',
    title: 'FAQs on blog posts, too',
    description:
      'Every post now ends with a few real questions and answers, marked up as FAQPage structured data so they can surface directly in Google results — the same treatment function pages already had.',
    tags: ['Feature'],
  },
  {
    date: '2026-08-22',
    title: 'A real contact email',
    description: 'contact@xlsdocs.com replaces GitHub issues as the way to reach us with privacy questions or general feedback.',
    tags: ['Improvement'],
  },
  {
    date: '2026-08-21',
    title: 'A homepage that actually explains the site',
    description:
      'New sections show every category at a glance with live function counts, and what the Ask Claude panel looks like on a real page — both were previously invisible unless you\'d already found your way into the docs.',
    tags: ['Feature'],
  },
  {
    date: '2026-08-21',
    title: 'A Privacy Policy page',
    description:
      'What we collect, what we don\'t, and how to reach us with questions — including a scannable quick-facts summary up top.',
    tags: ['Feature'],
  },
  {
    date: '2026-08-16',
    title: 'FAQ page',
    description:
      'Answers to common site-level questions — cost, sign-up, Excel version coverage, and how to report an issue — that didn\'t fit on any single function page.',
    tags: ['Feature'],
  },
  {
    date: '2026-08-16',
    title: 'A new Custom Functions category: LET and LAMBDA',
    description:
      'The two functions behind building reusable, custom Excel functions without VBA — including the LAMBDA the homepage\'s own live-code demo has shown since launch, finally with a real page.',
    tags: ['New functions', 'Milestone'],
  },
  {
    date: '2026-08-16',
    title: 'TEXTSPLIT',
    description:
      'Splits text into rows and/or columns as a live spilled array — the worksheet-formula counterpart to VBA\'s Split, and the last of the forward references from the last few batches.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-16',
    title: 'XMATCH, VSTACK, TEXTBEFORE, and TEXTAFTER',
    description:
      'Four modern dynamic-array and text functions — including the exact-by-default replacement for MATCH, a way to stack ranges into one live list, and delimiter-based text extraction that replaces the old LEFT/MID + FIND combinations.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-15',
    title: 'A new VBA section: MsgBox, InputBox, Format, InStr, and Split',
    description:
      'Built-in VBA functions get their own reference, separate from worksheet formulas — the same syntax/parameters/examples format, plus notes on where each one differs from its closest Excel formula equivalent.',
    tags: ['New functions', 'Milestone'],
  },
  {
    date: '2026-08-15',
    title: 'COUNTBLANK, WORKDAY.INTL, and NETWORKDAYS.INTL',
    description:
      'A dedicated blank-cell counter for Math, plus customizable-weekend versions of WORKDAY and NETWORKDAYS for businesses that don\'t run a standard Saturday/Sunday schedule.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-15',
    title: 'RANK.EQ, RANK.AVG, PERCENTILE.INC, and PERCENTILE.EXC',
    description:
      'Closes out the Statistical category\'s legacy-to-modern renames — plus RANK.AVG\'s genuinely different averaged tie-handling and PERCENTILE.EXC\'s stricter, sample-based percentile method.',
    tags: ['New functions', 'Milestone'],
  },
  {
    date: '2026-08-15',
    title: 'STDEV.S, STDEV.P, VAR.S, VAR.P, MODE.SNGL, and MODE.MULT',
    description:
      'The modern, explicitly-named sample and population variants of STDEV, VAR, and MODE — plus MODE.MULT, which returns every tied mode as a spilled array instead of just the first.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-15',
    title: 'A new Statistical category: STDEV, VAR, MODE, RANK, and PERCENTILE',
    description:
      'Five functions for measuring spread and relative standing, not just totals and averages — including the sample-vs-population distinction on STDEV/VAR and the tie-handling rules on RANK.',
    tags: ['New functions', 'Milestone'],
  },
  {
    date: '2026-08-14',
    title: 'CHOOSE, LOOKUP, OFFSET, and INDIRECT',
    description:
      'Rounds out the Lookup category with four more classics — picking a value by position, the original (and trickier) lookup function, and the two volatile reference-building functions worth understanding even when better alternatives exist.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-14',
    title: 'CEILING, FLOOR, EXACT, and CONCATENATE',
    description:
      'Rounding to an arbitrary step size (nickels, quarter-hours) instead of a digit count, the one built-in case-sensitive text comparison, and the legacy text-joining function CONCAT replaces.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-13',
    title: 'SUMPRODUCT, ROUND, ROUNDUP, ROUNDDOWN, SEQUENCE, and IRR',
    description:
      'SUMPRODUCT closes out the site\'s most-referenced missing function - the flexible tool behind weighted totals and OR-logic sums. Plus the three rounding functions, a dynamic array number generator, and the rate-of-return counterpart to NPV.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-13',
    title: 'MAXIFS, MINIFS, LARGE, SMALL, MEDIAN, and SUBTOTAL',
    description:
      'Six more Math functions — conditional max/min, ranking by position instead of just the extreme, the outlier-resistant middle value, and a filter-aware total that plain SUM can\'t do.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-11',
    title: 'YEAR, MONTH, DAY, WEEKDAY, NETWORKDAYS, and WORKDAY',
    description:
      'Six more Date functions — extracting date parts, finding the day of the week (including the Sunday-is-day-1 gotcha), and business-day math for real project deadlines and delivery estimates.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-11',
    title: 'A new Financial category: PMT, FV, PV, NPV, and RATE',
    description:
      'Loan payments, present and future value, and rate-of-return calculations — including the cash-flow sign convention that trips up almost everyone the first time, and the NPV timing gotcha around upfront investments.',
    tags: ['New functions', 'Milestone'],
  },
  {
    date: '2026-08-10',
    title: 'A new Info category: ISBLANK, ISNUMBER, ISTEXT, ISERROR, and ISNA',
    description:
      'Five type-testing functions, almost always used inside IF or NOT — including the ISERROR vs ISNA distinction (catch every error vs. just a missing lookup) and the ISBLANK gotcha where a formula returning "" still counts as non-blank.',
    tags: ['New functions', 'Milestone'],
  },
  {
    date: '2026-08-10',
    title: 'SUM, AVERAGE, COUNT, COUNTA, MAX, and MIN',
    description:
      'The most basic — and most-searched — Math functions on Excel, finally on the site: totals, means, counts, and extremes across a range, including the gotchas around blanks vs. zeros and text-formatted numbers.',
    tags: ['New functions'],
  },
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
