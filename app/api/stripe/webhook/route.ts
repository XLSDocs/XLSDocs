import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getStripe } from '@/lib/stripe';

// Only the subscription lifecycle events — Stripe already folds payment
// failures/retries into the subscription's own `status` field, so there's
// no need to separately handle invoice/payment events too.
const HANDLED_PREFIX = 'customer.subscription.';

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  // Live and test mode each sign with their own secret, even for the same
  // endpoint URL — try both rather than forcing a single mode to work.
  const webhookSecrets = [process.env.STRIPE_WEBHOOK_SECRET, process.env.STRIPE_WEBHOOK_SECRET_TEST].filter(
    (secret): secret is string => !!secret,
  );
  if (!stripe || webhookSecrets.length === 0) {
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 503 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  // Signature verification needs the raw, untouched body — must not call
  // req.json() first.
  const payload = await req.text();

  let event: Stripe.Event | undefined;
  for (const webhookSecret of webhookSecrets) {
    try {
      event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        webhookSecret,
        undefined,
        Stripe.createSubtleCryptoProvider(),
      );
      break;
    } catch {
      // Try the next secret before giving up.
    }
  }
  if (!event) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  if (event.type.startsWith(HANDLED_PREFIX)) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id;

    try {
      const { env } = await getCloudflareContext({ async: true });
      await env.FEEDBACK.put(
        `sub:${customerId}`,
        JSON.stringify({
          customerId,
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.items.data[0]?.current_period_end ?? null,
          updatedAt: Math.floor(Date.now() / 1000),
        }),
      );
    } catch {
      // Non-2xx here is deliberate — it tells Stripe to retry with backoff,
      // covering a transient KV error without us building retry logic.
      return NextResponse.json({ error: 'Failed to record subscription state.' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
