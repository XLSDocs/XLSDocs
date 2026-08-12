import { HomeNav } from '@/components/home/nav';
import { Footer } from '@/components/home/footer';
import { BlogIndex } from '@/components/blog/blog-index';
import { getBlogPosts, getBlogCategoriesInUse } from '@/lib/blog-source';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Practical, non-fluff writing on Excel, VBA, Python, and the tools around a spreadsheet.',
};

export default function BlogPage() {
  const posts = getBlogPosts().map(({ slug, title, description, date, category, author, readTime, featured }) => ({
    slug,
    title,
    description,
    date,
    category,
    author,
    readTime,
    featured,
  }));
  const categories = getBlogCategoriesInUse();

  return (
    <div className="flex min-h-screen flex-col">
      <HomeNav />
      <main className="flex-1">
        <BlogIndex posts={posts} categories={categories} />
      </main>
      <Footer />
    </div>
  );
}
