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
    date: '2026-09-04',
    title: 'A category tab bar across the top of the docs',
    description:
      "Lookup & Logical, Math & Statistics, Text & Date, Financial & Database, and Arrays/VBA/Custom Functions are now one click away at the top of every docs page, alongside the full category tree in the sidebar and the same Functions/Blog/Formula Builder/Pricing links every other page has.",
    tags: ['Improvement'],
  },
  {
    date: '2026-09-03',
    title: 'A proper header for the docs sidebar, and a fixed collapse button',
    description:
      "The sidebar now has its own \"Docs\" title and a pinned Docs Home link above the category tree, plus fixed a real bug: collapsing the sidebar could hide the whole thing with no visible way to bring it back. It now collapses to a slim icon rail that reliably expands again.",
    tags: ['Improvement'],
  },
  {
    date: '2026-09-03',
    title: 'GitHub, search, and a theme toggle in the docs navbar',
    description:
      "The new docs navbar now carries the same GitHub link, Ctrl+K search, and light/dark toggle every other page has.",
    tags: ['Improvement'],
  },
  {
    date: '2026-09-03',
    title: 'A persistent navbar on docs pages',
    description:
      "Functions, Blog, Formula Builder, and Pricing are now always one click away while reading a function page, instead of being tucked into a scrollable sidebar list — the same navigation every other page on the site already had.",
    tags: ['Improvement'],
  },
  {
    date: '2026-09-03',
    title: 'Fixed Try it on YEAR, MONTH, DAY, and WEEKDAY',
    description:
      "These four pages' interactive examples were silently showing #N/A regardless of what you tried — a case-sensitivity bug in the shared widget that only affected pages using capitalized example values like \"January 15, 2027\". Fixed at the component level, so every page's example now works regardless of how its sample values are capitalized.",
    tags: ['Improvement'],
  },
  {
    date: '2026-09-03',
    title: 'HOUR, MINUTE, SECOND, TIME, DATEVALUE, TIMEVALUE, YEARFRAC, and WEEKNUM',
    description:
      "Eight new Date functions closing a real gap — the site had YEAR/MONTH/DAY but no time-of-day equivalents, and no way to convert date- or time-looking text into real values. YEARFRAC also picks up the same day-count basis convention used by ACCRINT and YIELD.",
    tags: ['New functions'],
  },
  {
    date: '2026-09-03',
    title: 'ABS, INT, MOD, POWER, SQRT, TRUNC, EVEN, ODD, and SIGN',
    description:
      "Nine basic Math functions that were missing entirely — found by auditing our full coverage against Microsoft's own function list. ABS and SQRT in particular are everyday-arithmetic staples; INT and TRUNC finally get their own pages explaining exactly where they disagree on negative numbers.",
    tags: ['New functions'],
  },
  {
    date: '2026-09-02',
    title: '"Ask AI about this" on every Try it example',
    description:
      "Every interactive Try it widget now has a one-click button that opens Ask AI pre-filled with the exact formula and result you were just looking at — not just the bare syntax, but what it actually returned.",
    tags: ['Feature'],
  },
  {
    date: '2026-09-02',
    title: 'A footer on every blog post',
    description:
      'Individual blog posts now end with the same footer every other page has, instead of stopping abruptly after the FAQ section.',
    tags: ['Improvement'],
  },
  {
    date: '2026-09-02',
    title: '4 new blog posts',
    description:
      "PMT vs IPMT vs PPMT, NPV vs IRR, RANK.EQ vs RANK.AVG, and ISNA vs ISERROR — four \"these look alike but aren't\" articles, each tied to a category that reached full Try it coverage this week.",
    tags: ['Feature'],
  },
  {
    date: '2026-09-02',
    title: 'ACCRINT and YIELD',
    description:
      "Two bond-math functions round out Financial to 14 pages: ACCRINT calculates the interest accrued on a bond between its issue date and settlement, and YIELD solves for a bond's annualized return from its market price, coupon rate, and time to maturity.",
    tags: ['New functions'],
  },
  {
    date: '2026-09-01',
    title: 'A Playground page — every interactive example in one place',
    description:
      "A new page collects 18 of the site's best Try it examples in one browsable hub, grouped by category, each one naming the exact thing to change and what to watch happen — not just a generic \"try it live\" label.",
    tags: ['Feature'],
  },
  {
    date: '2026-09-01',
    title: 'Interactive Try it examples for every Statistical function',
    description:
      "RANK, PERCENTILE, MODE, STDEV, VAR, and their modern .EQ/.AVG/.INC/.EXC/.SNGL/.MULT/.S/.P variants — all 15 Statistical functions now have a live, editable example, including one that reproduces PERCENTILE.EXC's own #NUM! boundary case on demand.",
    tags: ['Feature', 'Milestone'],
  },
  {
    date: '2026-09-01',
    title: 'Interactive Try it examples for every Info function',
    description:
      'ISBLANK, ISERROR, ISFORMULA, ISLOGICAL, ISNA, ISNUMBER, ISTEXT, and NA all have a live example now — including one that shows NA() breaking a SUM while a real 0 or blank cell doesn\'t.',
    tags: ['Feature', 'Milestone'],
  },
  {
    date: '2026-08-31',
    title: 'Interactive examples complete the Financial category',
    description:
      'IPMT, PPMT, NPV, IRR, XNPV, and XIRR now have live Try it widgets — some showing an actual amortization row, others a full cash-flow-to-present-value breakdown — bringing all 12 Financial functions to a working, editable example.',
    tags: ['Feature', 'Milestone'],
  },
  {
    date: '2026-08-31',
    title: 'A real amortization schedule on PMT and SLN, and matching rows on the Database functions',
    description:
      "PMT and SLN's Try it examples now show an actual multi-month schedule that changes with the selected loan term or asset life, and DSUM/DCOUNT/DGET highlight exactly which rows of a small dataset match the chosen criteria.",
    tags: ['Feature'],
  },
  {
    date: '2026-08-30',
    title: 'A sparkle icon that pre-fills Ask AI with the formula on screen',
    description:
      "Every Excel formula code block now has a small icon that opens Ask AI with a starter question about that exact formula already typed in, so asking about a formula doesn't mean retyping it first.",
    tags: ['Feature'],
  },
  {
    date: '2026-08-30',
    title: 'Try it grids for ROWS, COLUMNS, and OFFSET',
    description:
      "The live spreadsheet grid that debuted on ROW now covers its closest relatives too, including OFFSET's numeric row-shift mapped onto a highlighted cell in the grid.",
    tags: ['Feature'],
  },
  {
    date: '2026-08-29',
    title: 'A live spreadsheet grid, and clickable example buttons, on Try it widgets',
    description:
      "ROW's example now shows an actual mini spreadsheet with the referenced cell highlighted live, and every Try it widget across the site got clickable example buttons instead of requiring the value to be typed by hand.",
    tags: ['Feature', 'Milestone'],
  },
  {
    date: '2026-08-29',
    title: 'The last 7 Lookup functions get an interactive example',
    description:
      'ROW, ROWS, COLUMN, COLUMNS, INDIRECT, LOOKUP, and OFFSET now have a Try it widget, completing all 14 Lookup functions.',
    tags: ['Milestone'],
  },
  {
    date: '2026-08-29',
    title: 'Terms of Service, About, and Contact pages',
    description:
      "Three pages that didn't exist before — what xlsdocs.com is and how it stays accurate, the terms governing use of the site, and a real way to reach out with a question or bug report.",
    tags: ['Feature'],
  },
  {
    date: '2026-08-29',
    title: 'A redesigned footer, and a sticky table of contents on Terms and Privacy',
    description:
      "The footer's 11 links are now grouped into Product, Resources, and Company columns instead of one flat wrapping row, and Terms/Privacy both got a Clerk-style sticky \"On this page\" sidebar for jumping between sections.",
    tags: ['Improvement'],
  },
  {
    date: '2026-08-29',
    title: 'This site talks to AI agents directly',
    description:
      'A new homepage section explains /llms.txt and /llms-full.txt — every page on the site is published as clean, structured Markdown that AI tools can fetch directly, not just HTML for humans to read.',
    tags: ['Feature'],
  },
  {
    date: '2026-08-29',
    title: 'REGEXTEST, REGEXEXTRACT, and REGEXREPLACE',
    description:
      "Excel's native regex functions join the Text category — REGEXTEST checks whether a pattern matches, REGEXEXTRACT pulls out matching text (or specific capturing groups), and REGEXREPLACE can reorder text using those groups, not just swap it out. Rolling out to Microsoft 365 only for now — older perpetual versions return #NAME?.",
    tags: ['New functions'],
  },
  {
    date: '2026-08-29',
    title: 'Web functions: WEBSERVICE, FILTERXML, and ENCODEURL',
    description:
      "A new category for Excel's built-in HTTP client: WEBSERVICE fetches a URL's contents into a cell, FILTERXML pulls specific values out of an XML response with XPath, and ENCODEURL safely percent-encodes text for use inside a URL. Includes the not-obvious gotcha that none of the three work in Excel for the web, and all three silently fail on Mac.",
    tags: ['New functions'],
  },
  {
    date: '2026-08-29',
    title: 'Database functions: DSUM, DCOUNT, and DGET',
    description:
      "A new category covering Excel's original criteria-range functions — the same mechanic behind the classic Advanced Filter, predating SUMIFS/COUNTIFS and dynamic-array FILTER by decades. Still the cleanest way to combine independent OR conditions across multiple fields, and DGET's strict single-match requirement doubles as a duplicate-record check.",
    tags: ['New functions'],
  },
  {
    date: '2026-08-29',
    title: 'A dedicated pricing page',
    description:
      "The $5/mo subscription that unlocks unlimited AI Formula Builder, Quick Fix, and Ask AI now has one clear place to compare it against the free tier, instead of being scattered copy on each individual tool.",
    tags: ['Feature'],
  },
  {
    date: '2026-08-28',
    title: 'TOROW, TOCOL, CHOOSEROWS, and CHOOSECOLS',
    description:
      "Two more matched pairs round out Arrays: TOROW and TOCOL flatten a 2D range into a single row or column, and CHOOSEROWS/CHOOSECOLS pull out specific, non-contiguous rows or columns by number — including reordering or repeating them, not just picking a contiguous block.",
    tags: ['New functions'],
  },
  {
    date: '2026-08-28',
    title: 'CStr, Replace, and DateDiff',
    description:
      "Three more VBA functions, two of them genuine naming traps: VBA's Replace behaves like worksheet SUBSTITUTE, not worksheet REPLACE despite the shared name, and DateDiff counts calendar boundaries crossed rather than complete elapsed intervals the way worksheet DATEDIF does.",
    tags: ['New functions'],
  },
  {
    date: '2026-08-28',
    title: 'XIRR, XNPV, and SLN',
    description:
      "The realistic versions of IRR and NPV for cash flows that land on actual, irregular calendar dates instead of neat even periods — plus SLN, the simplest depreciation method, spreading an asset's cost evenly across its useful life.",
    tags: ['New functions'],
  },
  {
    date: '2026-08-27',
    title: 'Quick Fix — a tool for broken formulas',
    description:
      "Paste a broken or misbehaving Excel formula, plus the error it throws or the wrong result it returns, and get back a corrected version with an explanation of what was actually wrong. Shares the same free allowance and $5/mo subscription as the AI Formula Builder and Ask AI, not a third paywall.",
    tags: ['Feature'],
  },
  {
    date: '2026-08-25',
    title: 'ROW, ROWS, COLUMN, and COLUMNS',
    description:
      "Four Lookup & Reference functions that resolve a naming trap of their own: ROW/COLUMN return a position, ROWS/COLUMNS return a count — easy to mix up, and each pair gets its own page explaining the difference.",
    tags: ['New functions'],
  },
  {
    date: '2026-08-24',
    title: 'IsNull, IsEmpty, and IsNumeric',
    description:
      "Three more VBA functions, covering one of the language's classic gotchas: If x = Null Then never works (only IsNull does), Null and Empty are different special values, and an uninitialized Variant surprisingly counts as numeric.",
    tags: ['New functions'],
  },
  {
    date: '2026-08-24',
    title: 'ISLOGICAL, ISFORMULA, and NA',
    description:
      "Three more Info functions: ISLOGICAL tests for a genuine TRUE/FALSE (not text or a number standing in for one), ISFORMULA flags which cells actually calculate something, and NA deliberately creates a #N/A placeholder — useful for leaving a real gap in a chart instead of plotting a misleading zero.",
    tags: ['New functions'],
  },
  {
    date: '2026-08-24',
    title: 'BYROW, BYCOL, and MAKEARRAY',
    description:
      "Rounds out Custom Functions to 8 pages: BYROW and BYCOL apply a LAMBDA to a whole row or column at once instead of element by element, and MAKEARRAY builds a brand new array from a size and a rule — a multiplication table, an identity matrix, anything whose values depend on position.",
    tags: ['New functions', 'Milestone'],
  },
  {
    date: '2026-08-24',
    title: 'HSTACK, TAKE, and DROP',
    description:
      "VSTACK's horizontal counterpart, plus the pair for slicing an array by position — TAKE keeps the first or last N rows/columns, DROP removes them, both with a negative-number flip for counting from the end instead of the start.",
    tags: ['New functions'],
  },
  {
    date: '2026-08-24',
    title: 'MAP, REDUCE, and SCAN',
    description:
      'The functions that actually apply a LAMBDA across an array — transforming every element, collapsing an array to one accumulated value, or accumulating one while keeping every intermediate step.',
    tags: ['New functions'],
  },
  {
    date: '2026-08-23',
    title: 'Ask AI is now part of the same subscription',
    description:
      'Free visitors get 5 questions a day; the $5/mo subscription that unlocks the Formula Builder now covers unlimited Ask AI too — one plan, not a second paywall.',
    tags: ['Feature'],
  },
  {
    date: '2026-08-23',
    title: 'AI Formula Builder Pro — a $5/mo subscription',
    description:
      'Unlimited Formula Builder use for $5/mo, with a free tier that still works with no sign-up. Built on Stripe Checkout and a self-serve billing portal for managing or canceling anytime.',
    tags: ['Feature', 'Milestone'],
  },
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
      'New sections show every category at a glance with live function counts, and what the Ask AI panel looks like on a real page — both were previously invisible unless you\'d already found your way into the docs.',
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
