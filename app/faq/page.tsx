import type { Metadata } from 'next';
import { HomeNav } from '@/components/home/nav';
import { Footer } from '@/components/home/footer';
import { Faq, type FaqItem } from '@/components/faq';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to common questions about xlsdocs.com — what it covers, how much it costs, and how to report an issue.',
  alternates: {
    canonical: '/faq',
  },
};

const faqs: FaqItem[] = [
  {
    question: 'Is xlsdocs.com free to use?',
    answer: 'Yes — every function page, the blog, and the AI Formula Builder are free, with no sign-up required.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No. Nothing on the site requires sign-up or a login.',
  },
  {
    question: 'Does xlsdocs cover VBA and Python, or just Excel formulas?',
    answer: 'All three. Every worksheet-function page shows the Excel formula alongside the equivalent VBA and Python (pandas) code, and there\'s a dedicated **VBA** section for functions that only exist in VBA, like `MsgBox` and `InputBox`.',
  },
  {
    question: 'What Excel versions does xlsdocs cover?',
    answer: 'Every function page has a compatibility table showing support across Excel 365, 2021, 2019, 2016, and Excel for the web. Newer functions — dynamic arrays, `XLOOKUP`, `LET`, `LAMBDA` — are clearly marked when they\'re 365-only.',
  },
  {
    question: 'What is the AI Formula Builder?',
    answer: 'A tool that turns a plain-English description of what you need into a working Excel formula, with a breakdown of what each part does. Free to use, no sign-up required.',
  },
  {
    question: 'Is xlsdocs affiliated with Microsoft?',
    answer: 'No — xlsdocs is an independent reference site, not affiliated with or endorsed by Microsoft.',
  },
  {
    question: 'I found an error, or a function that\'s missing — how do I report it?',
    answer: 'Every function page has "Edit this page" and "Report an issue" links that go straight to the source repository on GitHub — no account needed to view them, and a free GitHub account to submit a change or issue.',
  },
  {
    question: 'How often is new content added?',
    answer: 'Regularly — new functions, categories, and site improvements are tracked on the changelog page.',
  },
];

// FAQ answers are stored with markdown (`code`, **bold**) for on-page
// rendering, but FAQPage structured data wants plain text.
function stripMarkdown(text: string) {
  return text.replace(/[`*]/g, '');
}

export default function FaqPage() {
  const faqJsonLd = {
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
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HomeNav />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
          <h1 className="text-4xl font-normal md:text-5xl">
            <span className="font-serif text-fd-primary italic">FAQ</span>
          </h1>
          <p className="mt-4 text-fd-muted-foreground">
            Common questions about xlsdocs.com — what it covers, how much it
            costs, and how to report an issue.
          </p>
          <div className="mt-12">
            <Faq items={faqs} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
