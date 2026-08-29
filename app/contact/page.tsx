import type { Metadata } from 'next';
import { Mail, CreditCard, Bug } from 'lucide-react';
import { HomeNav } from '@/components/home/nav';
import { Footer } from '@/components/home/footer';
import { gitConfig, contactEmail } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with xlsdocs.com — general questions, billing issues, or a content error to report.',
  alternates: {
    canonical: '/contact',
  },
};

const issuesUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/issues/new`;

const REASONS = [
  {
    icon: Mail,
    title: 'General questions',
    description: "Anything not covered by the FAQ — feedback, a question about a tool, or anything else.",
  },
  {
    icon: CreditCard,
    title: 'Billing or subscription issues',
    description: 'A charge that looks wrong, trouble accessing the billing portal, or Pro access not matching your subscription.',
  },
  {
    icon: Bug,
    title: 'A content error or bug',
    description: 'A wrong formula example, an outdated claim, or something broken on the site.',
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeNav />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="text-4xl font-normal md:text-5xl">
            <span className="font-serif text-fd-primary italic">Contact</span> us
          </h1>
          <p className="mt-4 text-fd-muted-foreground">
            There's no support ticket system here — just a real inbox that
            gets checked.
          </p>

          <div className="gradient-border-card mt-8 rounded-xl p-6">
            <p className="text-sm text-fd-muted-foreground">Email</p>
            <a
              href={`mailto:${contactEmail}`}
              className="mt-1 block text-lg font-semibold text-fd-primary hover:underline"
            >
              {contactEmail}
            </a>
          </div>

          <div className="mt-10 flex flex-col gap-6">
            {REASONS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-fd-primary" />
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm text-fd-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-fd-muted-foreground">
            For a content error specifically, every docs page also has a
            "Report an issue" link at the bottom that opens a pre-filled{' '}
            <a
              href={issuesUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-fd-primary underline decoration-dotted underline-offset-2 hover:text-fd-foreground"
            >
              GitHub issue
            </a>{' '}
            — either path works.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
