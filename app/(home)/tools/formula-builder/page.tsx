import { cookies } from 'next/headers';
import { FormulaBuilder } from '@/components/tools/formula-builder';
import { SUBSCRIBER_COOKIE, verifySubscriberCookie } from '@/lib/subscriber-cookie';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Formula Builder',
  description:
    'Describe what you need in plain English and get back a working Excel formula, with a breakdown of every part.',
  alternates: {
    canonical: '/tools/formula-builder',
  },
};

interface FormulaBuilderPageProps {
  searchParams: Promise<{ upgraded?: string; canceled?: string }>;
}

export default async function FormulaBuilderPage({ searchParams }: FormulaBuilderPageProps) {
  const params = await searchParams;

  const secret = process.env.COOKIE_SIGNING_SECRET;
  const raw = (await cookies()).get(SUBSCRIBER_COOKIE)?.value;
  const isSubscriber = Boolean(raw && secret && (await verifySubscriberCookie(raw, secret)));
  const billingEnabled = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);

  const checkoutStatus = params.upgraded ? 'upgraded' : params.canceled ? 'canceled' : null;

  return (
    <FormulaBuilder
      initialIsSubscriber={isSubscriber}
      billingEnabled={billingEnabled}
      checkoutStatus={checkoutStatus}
    />
  );
}
