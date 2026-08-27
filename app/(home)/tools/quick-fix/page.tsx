import { cookies } from 'next/headers';
import { QuickFix } from '@/components/tools/quick-fix';
import { SUBSCRIBER_COOKIE, verifySubscriberCookie } from '@/lib/subscriber-cookie';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Fix — Fix a Broken Excel Formula',
  description:
    'Paste a broken Excel formula and what it\'s doing wrong. Get back a corrected version with an explanation of what was actually broken.',
  alternates: {
    canonical: '/tools/quick-fix',
  },
};

interface QuickFixPageProps {
  searchParams: Promise<{ upgraded?: string; canceled?: string }>;
}

export default async function QuickFixPage({ searchParams }: QuickFixPageProps) {
  const params = await searchParams;

  const secret = process.env.COOKIE_SIGNING_SECRET;
  const raw = (await cookies()).get(SUBSCRIBER_COOKIE)?.value;
  const isSubscriber = Boolean(raw && secret && (await verifySubscriberCookie(raw, secret)));
  const billingEnabled = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);

  const checkoutStatus = params.upgraded ? 'upgraded' : params.canceled ? 'canceled' : null;

  return (
    <QuickFix
      initialIsSubscriber={isSubscriber}
      billingEnabled={billingEnabled}
      checkoutStatus={checkoutStatus}
    />
  );
}
