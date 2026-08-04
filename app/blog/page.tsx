import { HomeNav } from '@/components/home/nav';
import { Footer } from '@/components/home/footer';
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
      <main className="flex-1">
        <BlogIndex posts={posts} categories={categories} />
      </main>
      <Footer />
    </div>
  );
}
