import { createSearchAPI } from 'fumadocs-core/search/server';
import type { StructuredData } from 'fumadocs-core/mdx-plugins/remark-structure';
import { source } from '@/lib/source';
import { getBlogPosts } from '@/lib/blog-source';

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
];

export const { GET } = createSearchAPI('advanced', {
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
