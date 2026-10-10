import type { Env } from '../_lib/types';
import { json } from '../_lib/json';
import { getStripe } from '../_lib/stripe';

export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const stripe = getStripe(env.STRIPE_SECRET_KEY);
  const priceId = env.STRIPE_PRICE_ID;

  if (!stripe || !priceId) {
    return json({ error: 'Upgrades are not available yet.' }, 503);
  }

  // Origin header, not a hardcoded site URL — otherwise local/preview testing
  // redirects back to production after a real Stripe payment instead of
  // wherever the checkout was actually started from.
  const origin = request.headers.get('origin') ?? new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/tools/formula-builder?canceled=1`,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return json({ error: 'Could not start checkout.' }, 502);
    }

    return json({ url: session.url }, 200);
  } catch {
    return json({ error: 'Could not start checkout.' }, 502);
  }
}
