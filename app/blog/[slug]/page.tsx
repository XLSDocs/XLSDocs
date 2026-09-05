import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBlogPost, getBlogPosts } from '@/lib/blog-source';
import { getMDXComponents } from '@/components/mdx';
import { PostNav } from '@/components/blog/post-nav';
import { PostToc } from '@/components/blog/post-toc';
import { Faq, type FaqItem } from '@/components/faq';
import { AskClaude } from '@/components/ask-claude';
import { Footer } from '@/components/home/footer';

// `date` is a plain 'YYYY-MM-DD' string with no time-of-day meaning —
// `new Date(date)` parses it as UTC midnight, so formatting it back out
// without pinning the timezone relies entirely on the server's own local
// timezone happening to already be UTC (true on Cloudflare Workers, so
// this "accidentally" displays correctly in production, but shows the
// previous day in local dev/preview on any machine set to a timezone
// west of UTC). This is a server component, so it can't cause a
// hydration mismatch the way the same unfixed pattern did in PostCard's
// formatDate — but pinning it explicitly here too removes the implicit
// dependency on the runtime's timezone rather than leaving it to chance.
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// FAQ answers are stored with markdown (`code`, **bold**) for on-page
// rendering, but FAQPage structured data wants plain text.
function stripMarkdown(text: string) {
  return text.replace(/[`*]/g, '');
}

export default async function BlogPostPage(props: PageProps<'/blog/[slug]'>) {
  const params = await props.params;
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const MDX = post.body;
  const faqs = post._exports?.faqs as FaqItem[] | undefined;
  const faqJsonLd = faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: stripMarkdown(faq.question),
          acceptedAnswer: {
            '@type': 'Answer',
            text: stripMarkdown(faq.answer),
          },
        })),
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <PostNav category={post.category} readTime={post.readTime} />
      <main className="flex-1">
        <div className="mx-auto flex max-w-5xl gap-10 px-6 py-12">
          <article className="prose min-w-0 flex-1">
            {faqJsonLd && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
              />
            )}
            <span className="not-prose font-mono text-xs uppercase tracking-wider text-fd-muted-foreground">
              {formatDate(post.date)} · {post.author}
            </span>
            <h1>{post.title}</h1>
            <p className="lead text-fd-muted-foreground">{post.description}</p>
            <div className="not-prose mb-6">
              <AskClaude pageTitle={post.title} />
            </div>
            <MDX components={getMDXComponents()} />
            {faqs && faqs.length > 0 && (
              <>
                <h2>FAQ</h2>
                <Faq items={faqs} />
              </>
            )}
          </article>
          <PostToc items={post.toc} />
        </div>
      </main>
      <Footer />
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
