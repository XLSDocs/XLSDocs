import { getPageImageUrl, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  PageLastUpdate,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import { AskClaude } from '@/components/ask-claude';
import { Feedback } from '@/components/feedback';
import type { FaqItem } from '@/components/faq';
import { VersionBadges, type CompatibilityItem } from '@/components/version-badges';
import { CategoryBreadcrumb } from '@/components/category-breadcrumb';

// FAQ answers are stored with markdown (`code`, **bold**) for on-page rendering,
// but FAQPage structured data wants plain text.
function stripMarkdown(text: string) {
  return text.replace(/[`*]/g, '');
}

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`;
  const reportIssueUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/issues/new?title=${encodeURIComponent(`Docs issue: ${page.data.title}`)}&body=${encodeURIComponent(`Page: https://xlsdocs.com${page.url}\n\nWhat's wrong:`)}`;

  const categorySlug = page.slugs[0];
  const functionSlug = page.slugs[1];
  const categoryPage = categorySlug ? source.getPage([categorySlug]) : undefined;
  const functionPage = categorySlug && functionSlug ? source.getPage([categorySlug, functionSlug]) : undefined;

  const faqs = page.data._exports?.faqs as FaqItem[] | undefined;
  const compatibility = page.data._exports?.compatibility as CompatibilityItem[] | undefined;
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
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      breadcrumb={{ enabled: false }}
      tableOfContent={{ enabled: true, footer: <Feedback editUrl={githubUrl} reportIssueUrl={reportIssueUrl} /> }}
    >
      {categoryPage && (
        <CategoryBreadcrumb
          category={{ title: categoryPage.data.title, url: categoryPage.url }}
          fn={functionPage ? { title: functionPage.data.title, url: functionPage.url } : undefined}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <DocsTitle>{page.data.title}</DocsTitle>
      {compatibility && <VersionBadges items={compatibility} />}
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      {page.data.lastModified && <PageLastUpdate date={page.data.lastModified} />}
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
         <AskClaude pageTitle={page.data.title} />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      {/* The TOC sidebar (and its Feedback footer above) is hidden below Tailwind's
          xl breakpoint, so this duplicate covers everything from mobile through
          small laptops — never shown alongside the sidebar version. */}
      <div className="not-prose xl:hidden">
        <Feedback editUrl={githubUrl} reportIssueUrl={reportIssueUrl} />
      </div>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
