import Stripe from 'stripe';
import type { Env } from '../../_lib/types';
import { json } from '../../_lib/json';
import { getStripe } from '../../_lib/stripe';

// Only the subscription lifecycle events — Stripe already folds payment
// failures/retries into the subscription's own `status` field, so there's
// no need to separately handle invoice/payment events too.
const HANDLED_PREFIX = 'customer.subscription.';

export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const stripe = getStripe(env.STRIPE_SECRET_KEY);
  // Live and test mode each sign with their own secret, even for the same
  // endpoint URL — try both rather than forcing a single mode to work.
  const webhookSecrets = [env.STRIPE_WEBHOOK_SECRET, env.STRIPE_WEBHOOK_SECRET_TEST].filter(
    (secret): secret is string => !!secret,
  );
  if (!stripe || webhookSecrets.length === 0) {
    return json({ error: 'Webhook not configured.' }, 503);
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return json({ error: 'Missing signature.' }, 400);
  }

  // Signature verification needs the raw, untouched body — must not call
  // request.json() first.
  const payload = await request.text();

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
    return json({ error: 'Invalid signature.' }, 400);
  }

  if (event.type.startsWith(HANDLED_PREFIX)) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id;

    try {
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
      return json({ error: 'Failed to record subscription state.' }, 500);
    }
  }

  return json({ received: true }, 200);
}
