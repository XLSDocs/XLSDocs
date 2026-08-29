import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { HomeNav } from '@/components/home/nav';
import { Footer } from '@/components/home/footer';
import { PricingButtons } from '@/components/pricing-buttons';
import { SUBSCRIBER_COOKIE, verifySubscriberCookie } from '@/lib/subscriber-cookie';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'xlsdocs.com is free to use. $5/mo unlocks unlimited use of the AI Formula Builder, Quick Fix, and Ask AI — one subscription, not three.',
  alternates: {
    canonical: '/pricing',
  },
};

const FREE_FEATURES = [
  'Every function, VBA, and Custom Function page',
  'The blog, in full',
  'AI Formula Builder — 15 free builds/hour',
  'Quick Fix — shares that same free allowance',
  'Ask AI — 5 free questions/day',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited AI Formula Builder',
  'Unlimited Quick Fix',
  'Unlimited Ask AI',
  'Cancel anytime, self-serve',
];

export default async function PricingPage() {
  const secret = process.env.COOKIE_SIGNING_SECRET;
  const raw = (await cookies()).get(SUBSCRIBER_COOKIE)?.value;
  const isSubscriber = Boolean(raw && secret && (await verifySubscriberCookie(raw, secret)));
  const billingEnabled = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);

  return (
    <div className="flex min-h-screen flex-col">
      <HomeNav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-4xl font-normal md:text-5xl">
            Simple <span className="font-serif text-fd-primary italic">pricing</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-fd-muted-foreground">
            The whole reference — every function, VBA, custom functions,
            the blog — is free, no sign-up required. One subscription
            unlocks unlimited use of all three AI tools.
          </p>

          <div className="mt-12 grid gap-6 text-left sm:grid-cols-2">
            <div className="rounded-xl border border-fd-border bg-fd-card p-6">
              <h2 className="text-lg font-medium">Free</h2>
              <p className="mt-1 text-3xl font-normal">
                $0<span className="text-sm text-fd-muted-foreground"> forever</span>
              </p>
              <ul className="mt-6 flex flex-col gap-3 text-sm">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-fd-muted-foreground" />
                    <span className="text-fd-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/functions"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-fd-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-muted"
              >
                Browse functions
              </Link>
            </div>

            <div className="gradient-border-card rounded-xl p-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium">Pro</h2>
                {isSubscriber && (
                  <span className="rounded-full border border-fd-primary/30 bg-fd-primary/10 px-2 py-0.5 font-mono text-[10px] text-fd-primary">
                    Current plan
                  </span>
                )}
              </div>
              <p className="mt-1 text-3xl font-normal">
                $5<span className="text-sm text-fd-muted-foreground"> /month</span>
              </p>
              <ul className="mt-6 flex flex-col gap-3 text-sm">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-fd-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <PricingButtons isSubscriber={isSubscriber} billingEnabled={billingEnabled} />
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm text-fd-muted-foreground">
            One subscription covers all three AI tools — not three
            separate charges. Questions about billing? Check the{' '}
            <Link href="/faq" className="underline decoration-dotted underline-offset-2 hover:text-fd-foreground">
              FAQ
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
