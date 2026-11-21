import { createSearchAPI } from 'fumadocs-core/search/server';
import type { StructuredData } from 'fumadocs-core/mdx-plugins/remark-structure';
import { source } from '@/lib/source';
import { getBlogPosts } from '@/lib/blog-source';

export const revalidate = false;

function textIndex(content: string): StructuredData {
  return { headings: [], contents: [{ heading: undefined, content }] };
}

// Home/functions/formula-builder are plain React pages, not MDX, so they have
// no structuredData of their own — hand-written summaries stand in for it so
// they're still reachable from search, not just docs and blog content.
const marketingPages = [
  {
    id: '/',
    url: '/',
    title: 'xlsdocs.com — Excel function reference',
    description: 'Excel function reference, blog, and AI formula builder.',
    structuredData: textIndex(
      'Excel function reference, blog tutorials, and an AI-powered formula builder. Browse functions by category or ask AI to write a formula for you.',
    ),
  },
  {
    id: '/functions',
    url: '/functions',
    title: 'Function Index',
    description: 'Browse every Excel function by category.',
    structuredData: textIndex(
      'Browse the full Excel function reference by category: Lookup, Math, Logical, Arrays, and more. Search by name to jump straight to a function page.',
    ),
  },
  {
    id: '/pricing',
    url: '/pricing',
    title: 'Pricing',
    description: 'Free vs. Pro — what the $5/mo subscription unlocks.',
    structuredData: textIndex(
      'Pricing — xlsdocs.com is free to use. $5/mo unlocks unlimited use of the AI Formula Builder, Quick Fix, and Ask AI, one subscription covering all three tools.',
    ),
  },
  {
    id: '/playground',
    url: '/playground',
    title: 'Playground',
    description: 'Every interactive Try it example on xlsdocs.com in one place.',
    structuredData: textIndex(
      'Playground — a curated collection of interactive Excel formula examples across Lookup, Database, Financial, Info, and Statistical functions. Change the inputs and watch the result recalculate live.',
    ),
  },
  {
    id: '/tools/formula-builder',
    url: '/tools/formula-builder',
    title: 'AI Formula Builder',
    description: 'Describe what you need in plain English and get a working Excel formula.',
    structuredData: textIndex(
      'AI Formula Builder — describe what you need in plain English and AI writes the Excel formula for you, with a breakdown of each part.',
    ),
  },
  {
    id: '/tools/quick-fix',
    url: '/tools/quick-fix',
    title: 'Quick Fix',
    description: 'Paste a broken Excel formula and get back a corrected version.',
    structuredData: textIndex(
      'Quick Fix — paste a broken or misbehaving Excel formula, and AI diagnoses what\'s wrong and returns a corrected version with an explanation.',
    ),
  },
  {
    id: '/tools/vlookup-converter',
    url: '/tools/vlookup-converter',
    title: 'VLOOKUP → XLOOKUP Converter',
    description: 'Paste a real VLOOKUP, get back the exact XLOOKUP and INDEX/MATCH equivalent.',
    structuredData: textIndex(
      'VLOOKUP to XLOOKUP Converter — paste a real VLOOKUP formula and get back the exact XLOOKUP equivalent, plus the INDEX/MATCH version for older Excel.',
    ),
  },
  {
    id: '/tools/number-format-builder',
    url: '/tools/number-format-builder',
    title: 'Number Format Builder',
    description: 'Currency, percentage, accounting, or K/M scaling — built with a form, not memorized syntax.',
    structuredData: textIndex(
      'Number Format Builder — build a custom Excel number format code (currency, percentage, accounting, thousands/millions scaling) with a form instead of memorizing the syntax.',
    ),
  },
  {
    id: '/tools/conditional-format-builder',
    url: '/tools/conditional-format-builder',
    title: 'Conditional Format Builder',
    description: 'Duplicates, blanks, top/bottom N, overdue dates, and 10 more rule types.',
    structuredData: textIndex(
      'Conditional Format Builder — generate the exact rule and formula for highlighting duplicates, blanks, top/bottom N values, overdue dates, and more conditional formatting rule types.',
    ),
  },
  {
    id: '/tools/data-validation-builder',
    url: '/tools/data-validation-builder',
    title: 'Data Validation Builder',
    description: 'Dropdown lists, dependent dropdowns, range limits, and duplicate prevention.',
    structuredData: textIndex(
      'Data Validation Builder — build the exact Data Validation rule for a dropdown list, a dependent (cascading) dropdown, a numeric range limit, or duplicate prevention.',
    ),
  },
  {
    id: '/tools/large-file-viewer',
    url: '/tools/large-file-viewer',
    title: 'Large File Viewer',
    description: "Open a CSV or Parquet file bigger than Excel's own row limit.",
    structuredData: textIndex(
      "Large File Viewer — open and query a CSV or Parquet file larger than Excel's own 1,048,576-row limit, entirely in your browser.",
    ),
  },
  {
    id: '/templates',
    url: '/templates',
    title: 'Templates',
    description: 'Free, downloadable Excel workbooks matching the tutorials and guides on this site — no email required.',
    structuredData: textIndex(
      'Templates — free, downloadable Excel starter workbooks matching the tutorials and guides on this site, direct download with no email or signup required.',
    ),
  },
];

export const { staticGET: GET } = createSearchAPI('advanced', {
  indexes: () => {
    const docsIndexes = source.getPages().map((page) => ({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      structuredData: page.data.structuredData,
    }));

    const blogIndexes = getBlogPosts().map((post) => ({
      id: `/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      structuredData: post.structuredData,
    }));

    return [...docsIndexes, ...blogIndexes, ...marketingPages];
  },
});
