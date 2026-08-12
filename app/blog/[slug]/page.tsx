import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBlogPost, getBlogPosts } from '@/lib/blog-source';
import { getMDXComponents } from '@/components/mdx';
import { PostNav } from '@/components/blog/post-nav';
import { PostToc } from '@/components/blog/post-toc';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default async function BlogPostPage(props: PageProps<'/blog/[slug]'>) {
  const params = await props.params;
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const MDX = post.body;

  return (
    <div className="min-h-screen">
      <PostNav category={post.category} readTime={post.readTime} />
      <div className="mx-auto flex max-w-5xl gap-10 px-6 py-12">
        <article className="prose min-w-0 flex-1">
          <span className="not-prose font-mono text-xs uppercase tracking-wider text-fd-muted-foreground">
            {formatDate(post.date)} · {post.author}
          </span>
          <h1>{post.title}</h1>
          <p className="lead text-fd-muted-foreground">{post.description}</p>
          <MDX components={getMDXComponents()} />
        </article>
        <PostToc items={post.toc} />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const params = await props.params;
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}
