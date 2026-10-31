import { getBlogPosts } from '@/lib/blog-source';
import { siteUrl } from '@/lib/shared';

export const revalidate = false;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET() {
  const posts = getBlogPosts();

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>xlsdocs blog</title>
    <link>${siteUrl}/blog</link>
    <description>Excel, VBA, and Python tips from the xlsdocs team.</description>
    <language>en-us</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
