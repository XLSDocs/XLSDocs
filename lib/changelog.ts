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
