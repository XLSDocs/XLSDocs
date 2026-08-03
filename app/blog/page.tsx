import { HomeNav } from '@/components/home/nav';
import { BlogIndex } from '@/components/blog/blog-index';
import { getBlogPosts, getBlogCategoriesInUse } from '@/lib/blog-source';

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
      <BlogIndex posts={posts} categories={categories} />
    </div>
  );
}
