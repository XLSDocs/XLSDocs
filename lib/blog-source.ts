import { defineCollections } from 'fumadocs-mdx/macro';
import { z } from 'zod';

export const blogCategories = [
  'Excel',
  'VBA',
  'Python',
  'Power BI',
  'Web Dev',
  'Performance',
  'Tutorials',
] as const;

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  category: z.enum(blogCategories),
  author: z.string(),
  readTime: z.string(),
  featured: z.boolean().optional(),
});

export const blogPosts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: blogSchema,
});

export function getBlogPosts() {
  return blogPosts.entries
    .map((entry) => ({ ...entry, slug: entry.info.path.replace(/\.mdx$/, '') }))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getBlogPost(slug: string) {
  const entry = blogPosts.get(`${slug}.mdx`);
  if (!entry) return undefined;
  return { ...entry, slug };
}

export function getBlogCategoriesInUse() {
  return [...new Set(getBlogPosts().map((post) => post.category))];
}
