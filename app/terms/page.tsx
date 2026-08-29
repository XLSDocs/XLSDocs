import type { Metadata } from 'next';
import { Bot, RefreshCw, Scale, Users } from 'lucide-react';
import { HomeNav } from '@/components/home/nav';
import { Footer } from '@/components/home/footer';
import { LegalToc, type LegalTocItem } from '@/components/legal-toc';
import { gitConfig, contactEmail } from '@/lib/shared';

const TOC: LegalTocItem[] = [
  { id: 'acceptance-of-these-terms', label: 'Acceptance of these terms' },
  { id: 'the-free-content', label: 'The free content' },
  { id: 'the-ai-tools', label: 'The AI tools' },
  { id: 'subscriptions-and-billing', label: 'Subscriptions and billing' },
  { id: 'acceptable-use', label: 'Acceptable use' },
  { id: 'no-warranty', label: 'No warranty' },
  { id: 'limitation-of-liability', label: 'Limitation of liability' },
  { id: 'termination', label: 'Termination' },
  { id: 'changes-to-these-terms', label: 'Changes to these terms' },
  { id: 'governing-law', label: 'Governing law' },
  { id: 'contact', label: 'Contact' },
];

const QUICK_FACTS = [
  {
    icon: Bot,
    text: 'Formulas and answers from the AI tools are AI-generated and can be wrong — always check them before relying on them in a real spreadsheet.',
  },
  {
    icon: RefreshCw,
    text: 'Cancel the $5/mo subscription anytime, self-serve — access continues through the period you already paid for, with no partial refund.',
  },
  {
    icon: Users,
    text: 'No account is required to use the free parts of the site, but these terms still apply to your use of it.',
  },
  {
    icon: Scale,
    text: 'These terms are governed by the laws of the State of Iowa, USA.',
  },
];

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern using xlsdocs.com, including the AI tools and the $5/mo subscription.',
  alternates: {
    canonical: '/terms',
  },
};

const issuesUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/issues/new`;

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeNav />
      <main className="flex-1">
        <div className="mx-auto flex max-w-4xl gap-12 px-6 py-16">
          <LegalToc items={TOC} />
          <div className="min-w-0 max-w-2xl flex-1">
            <h1 className="text-4xl font-normal md:text-5xl">
              <span className="font-serif text-fd-primary italic">Terms</span> of Service
            </h1>
            <p className="mt-4 text-fd-muted-foreground">
              Last updated August 29, 2026. Plain language describing how
              xlsdocs.com actually works — not boilerplate copied from
              somewhere else.
            </p>

            <div className="gradient-border-card mt-8 grid gap-x-8 gap-y-5 rounded-xl p-6 sm:grid-cols-2">
              {QUICK_FACTS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-fd-primary" />
                  <p className="text-sm text-fd-muted-foreground">{text}</p>
                </div>
              ))}
            </div>

            <article className="prose mt-10">
              <h2 id="acceptance-of-these-terms" className="scroll-mt-24">Acceptance of these terms</h2>
              <p>
                By using xlsdocs.com — browsing the reference content, using
                the AI Formula Builder, Quick Fix, or Ask AI, or subscribing
                to the paid tier — you agree to these terms. If you don't
                agree, the reasonable option is to stop using the site.
              </p>

              <h2 id="the-free-content" className="scroll-mt-24">The free content</h2>
              <p>
                Every function, VBA, and Custom Function reference page, and
                the blog, are free to use with no account or sign-up. The
                formulas and code examples shown are meant to be copied into
                your own spreadsheets and projects — that's the point of
                publishing them.
              </p>
              <p>
                xlsdocs.com is independent and not affiliated with or
                endorsed by Microsoft. Content is reviewed for accuracy, but
                is provided for reference — it isn't a substitute for
                Microsoft's own official documentation, and it's provided
                without a warranty that every page is error-free. If you spot
                a mistake,{' '}
                <a href={issuesUrl} target="_blank" rel="noreferrer noopener">
                  open an issue on GitHub
                </a>
                .
              </p>

              <h2 id="the-ai-tools" className="scroll-mt-24">The AI tools</h2>
              <p>
                The AI Formula Builder, Quick Fix, and Ask AI generate
                formulas and answers using an AI model. They're a starting
                point, not a guarantee: AI-generated output can be
                plausible-looking and still wrong, especially for anything
                unusual or business-critical. Always check a generated
                formula's result before relying on it — the same way you'd
                check a formula you wrote yourself.
              </p>
              <p>
                A free daily allowance is shared across all three AI tools
                combined, reset once per day. $5/mo removes that limit for
                unlimited use of all three. Using automated tools, scripts,
                or multiple accounts to get around the free-tier limit isn't
                permitted.
              </p>

              <h2 id="subscriptions-and-billing" className="scroll-mt-24">Subscriptions and billing</h2>
              <p>
                The $5/mo subscription is billed monthly through Stripe and
                renews automatically until canceled. Cancel anytime,
                self-serve, from the billing portal linked on the{' '}
                <a href="/pricing">pricing page</a> — no email or phone call
                needed. Canceling stops the subscription from renewing;
                access continues through the end of the period already paid
                for, and that period isn't prorated or refunded.
              </p>
              <p>
                xlsdocs.com never sees or stores your card details — Stripe
                handles checkout and billing entirely. See the{' '}
                <a href="/privacy">Privacy Policy</a> for what's stored about
                a subscription (a signed cookie and a status record — no
                billing details).
              </p>

              <h2 id="acceptable-use" className="scroll-mt-24">Acceptable use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>
                  Use the site or its AI tools for anything illegal, or to
                  generate content intended to harm, deceive, or defraud
                  someone.
                </li>
                <li>
                  Attempt to bypass, automate around, or abuse the rate
                  limits protecting the free tools.
                </li>
                <li>
                  Scrape or republish the site's content at scale in a way
                  that impersonates xlsdocs.com or misrepresents its source.
                </li>
                <li>
                  Interfere with the site's normal operation — attempting to
                  overload, disrupt, or gain unauthorized access to it or its
                  infrastructure.
                </li>
              </ul>

              <h2 id="no-warranty" className="scroll-mt-24">No warranty</h2>
              <p>
                xlsdocs.com is provided "as is" and "as available," without
                warranties of any kind, express or implied — including any
                implied warranty of merchantability, fitness for a particular
                purpose, or that the site or its AI tools will be
                uninterrupted, error-free, or accurate. You're responsible
                for verifying any formula, code, or answer before relying on
                it, especially in a spreadsheet used for business, financial,
                or other consequential decisions.
              </p>

              <h2 id="limitation-of-liability" className="scroll-mt-24">Limitation of liability</h2>
              <p>
                To the fullest extent permitted by law, xlsdocs.com isn't
                liable for any indirect, incidental, or consequential damages
                arising from your use of the site or its AI tools — including
                losses resulting from a formula or answer that turned out to
                be incorrect. Where liability can't be fully excluded, it's
                limited to the amount you paid xlsdocs.com in the 12 months
                before the claim, if any.
              </p>

              <h2 id="termination" className="scroll-mt-24">Termination</h2>
              <p>
                Access to the AI tools or a subscription can be suspended or
                terminated for a violation of these terms, abuse of the free
                tier, or fraudulent billing activity. The free reference
                content otherwise remains open to everyone.
              </p>

              <h2 id="changes-to-these-terms" className="scroll-mt-24">Changes to these terms</h2>
              <p>
                These terms may be updated as the site changes — a new AI
                tool, a pricing change, or a clarification. The "last
                updated" date at the top of this page reflects the most
                recent change. Continuing to use the site after an update
                means you accept the revised terms.
              </p>

              <h2 id="governing-law" className="scroll-mt-24">Governing law</h2>
              <p>
                These terms are governed by the laws of the State of Iowa,
                USA, without regard to its conflict-of-law principles.
              </p>

              <h2 id="contact" className="scroll-mt-24">Contact</h2>
              <p>
                Questions about these terms? Email{' '}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
              </p>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
