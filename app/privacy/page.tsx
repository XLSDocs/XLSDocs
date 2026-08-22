import type { Metadata } from 'next';
import { UserX, Cookie, Shield, Database } from 'lucide-react';
import { HomeNav } from '@/components/home/nav';
import { Footer } from '@/components/home/footer';
import { gitConfig, contactEmail } from '@/lib/shared';

const QUICK_FACTS = [
  {
    icon: UserX,
    text: 'No account or email required to use any tool on this site — the free tools are genuinely free, no signup.',
  },
  {
    icon: Cookie,
    text: 'Analytics is cookieless (Cloudflare Web Analytics) — no tracking, no cross-site profiles.',
  },
  {
    icon: Shield,
    text: 'No ads, no ad trackers, anywhere on this site. The only cookie set is for subscription status, and only if you subscribe.',
  },
  {
    icon: Database,
    text: 'Nothing is sold, rented, or shared with third parties for marketing — ever.',
  },
];

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What xlsdocs.com collects, why, and who it shares data with.',
  alternates: {
    canonical: '/privacy',
  },
};

const issuesUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/issues/new`;

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeNav />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="text-4xl font-normal md:text-5xl">
            <span className="font-serif text-fd-primary italic">Privacy</span> Policy
          </h1>
          <p className="mt-4 text-fd-muted-foreground">
            Last updated August 21, 2026. This describes what xlsdocs.com
            actually collects and does — not a generic template.
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
            <h2>The short version</h2>
            <p>
              xlsdocs.com doesn't require an account, doesn't sell data, and
              doesn't run ad tracking. What it does collect is described
              below, in plain terms.
            </p>

            <h2>What we collect</h2>
            <h3>Analytics</h3>
            <p>
              Page views and performance metrics via Cloudflare Web
              Analytics — a privacy-focused, cookie-free analytics tool that
              only counts real browser visits, not individual identity.
            </p>

            <h3>Page feedback</h3>
            <p>
              The thumbs up/down widget on function pages stores only an
              aggregate count per page (e.g. "12 up, 2 down") — not who
              voted, not when, not from where.
            </p>

            <h3>Rate limiting</h3>
            <p>
              To keep the free AI tools free for everyone, requests are
              counted per IP address for up to one hour, then automatically
              discarded. This is used only to enforce a fair usage limit,
              never to build a profile of you.
            </p>

            <h3>AI Formula Builder and Ask Claude prompts</h3>
            <p>
              What you type into either tool is sent to Anthropic's Claude
              API to generate a response. xlsdocs.com doesn't store your
              prompts or the formulas generated — once the response is sent
              back to your browser, nothing is retained server-side. Recent
              builds shown in the Formula Builder sidebar live only in your
              browser's memory for that session, not on any server.
            </p>

            <h3>Subscription status, if you subscribe</h3>
            <p>
              If you subscribe to the paid Formula Builder tier, a signed
              cookie recognizes your subscription so you're not shown the
              free-tier limit — it contains your Stripe customer ID, nothing
              else, and can't be read or modified outside our server. A
              record of your subscription status (active, canceled, etc.) is
              kept so access can be correctly granted or revoked.
              xlsdocs.com never receives or stores your card number or
              billing details — that's handled entirely by Stripe's own
              hosted checkout.
            </p>

            <h2>Who we share data with</h2>
            <p>
              Only the services that directly power the site, each only for
              their specific purpose:
            </p>
            <ul>
              <li>
                <strong>Cloudflare</strong> — hosting, analytics, and the
                storage behind rate limiting and feedback counts.
              </li>
              <li>
                <strong>Anthropic</strong> — processes prompts you submit to
                the AI Formula Builder or Ask Claude, in order to generate a
                response.
              </li>
              <li>
                <strong>Stripe</strong> — processes payment and billing
                information for subscribers, via their own hosted checkout.
              </li>
            </ul>
            <p>None of this data is sold, and none of it is used for advertising.</p>

            <h2>Cookies</h2>
            <p>
              xlsdocs.com doesn't use tracking or advertising cookies. The
              only cookie set is the signed subscription-status cookie
              described above, and only if you subscribe.
            </p>

            <h2>Your options</h2>
            <p>
              Since there's no account system, there's no dashboard to
              delete data from — rate-limit and feedback data are already
              anonymous and short-lived by design. For a privacy question or
              request, email{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. For a
              bug or a missing function,{' '}
              <a href={issuesUrl} target="_blank" rel="noreferrer noopener">
                open an issue on GitHub
              </a>{' '}
              instead.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              If what the site collects changes, this page will be updated
              to match — it's meant to describe actual current practice, not
              a fixed legal boilerplate.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
