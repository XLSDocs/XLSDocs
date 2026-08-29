import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { getBlogPosts } from '@/lib/blog-source';
import { siteUrl } from '@/lib/shared';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/functions`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/pricing`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/tools/formula-builder`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/tools/quick-fix`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/changelog`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${siteUrl}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const docsRoutes: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: `${siteUrl}${page.url}`,
    lastModified: page.data.lastModified,
    changeFrequency: 'monthly',
    priority: page.slugs.length === 2 ? 0.9 : 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...docsRoutes, ...blogRoutes];
}
