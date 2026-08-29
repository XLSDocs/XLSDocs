import type { Metadata } from 'next';
import { HomeNav } from '@/components/home/nav';
import { Footer } from '@/components/home/footer';
import { gitConfig, contactEmail } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'About',
  description: 'What xlsdocs.com is, why it exists, and how it stays accurate.',
  alternates: {
    canonical: '/about',
  },
};

const issuesUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/issues/new`;
const repoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeNav />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="text-4xl font-normal md:text-5xl">
            <span className="font-serif text-fd-primary italic">About</span> xlsdocs.com
          </h1>
          <p className="mt-4 text-fd-muted-foreground">
            The Excel reference built for the AI era.
          </p>

          <article className="prose mt-10">
            <h2>Why this exists</h2>
            <p>
              Most Excel help online is either an ad-cluttered blog post
              from a decade ago or a forum thread that trails off before
              the actual answer. xlsdocs.com is a straightforward
              alternative: every worksheet function, VBA function, and
              Custom Function explained the same way — syntax, parameters,
              a real return value, the errors people actually hit, and
              working examples — with the Excel formula, the VBA
              equivalent, and the Python (pandas) equivalent shown
              side by side.
            </p>
            <p>
              It's built for how people actually look things up now: fast
              search, clean pages that both humans and AI assistants can
              read directly, and answers that don't make you scroll past a
              life story to find a formula.
            </p>

            <h2>What's free, what's paid</h2>
            <p>
              The entire reference — every function page, VBA, Custom
              Functions, and the blog — is free with no account or
              sign-up. Three AI tools sit on top of that free content: the{' '}
              <a href="/tools/formula-builder">AI Formula Builder</a>{' '}
              (describe what you need, get a formula), Quick Fix (paste a
              broken formula, get it corrected), and Ask AI (a quick
              question, answered right on the page you're reading). Each
              has a free daily allowance; $5/mo unlocks unlimited use of
              all three. Details on the <a href="/pricing">pricing page</a>.
            </p>

            <h2>Accuracy, and how content stays that way</h2>
            <p>
              Every technical claim on a function page — what a function
              actually returns, which errors it throws and why, which
              Excel versions support it — is meant to be verified, not
              just plausible-sounding. The source content lives in a{' '}
              <a href={repoUrl} target="_blank" rel="noreferrer noopener">
                public GitHub repository
              </a>
              , and every function page links directly to "Edit this page"
              and "Report an issue." If something's wrong or missing,{' '}
              <a href={issuesUrl} target="_blank" rel="noreferrer noopener">
                open an issue
              </a>{' '}
              — that's the fastest way to get it fixed.
            </p>

            <h2>Not affiliated with Microsoft</h2>
            <p>
              xlsdocs.com is an independent site. It isn't affiliated with,
              endorsed by, or sponsored by Microsoft — it's simply a
              reference for Excel, the product.
            </p>

            <h2>Get in touch</h2>
            <p>
              Questions, feedback, or a function that's missing? Email{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>, or{' '}
              <a href={issuesUrl} target="_blank" rel="noreferrer noopener">
                open an issue on GitHub
              </a>
              .
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
