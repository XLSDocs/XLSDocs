import type { Env } from '../../_lib/types';
import { getStripe } from '../../_lib/stripe';
import { signSubscriberCookie, buildSetCookie } from '../../_lib/subscriber-cookie';

// This route IS the Stripe Checkout success_url. Any failure here falls
// through to a plain redirect with no cookie set — never a 500 on a
// payment-success path; worst case the payer lands back at the free tier.
export async function onRequestGet({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
  const stripe = getStripe(env.STRIPE_SECRET_KEY);
  const secret = env.COOKIE_SIGNING_SECRET;

  const fallbackUrl = `${url.origin}/tools/formula-builder`;

  if (!sessionId || !stripe || !secret) {
    return Response.redirect(fallbackUrl, 302);
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;

    if (session.status !== 'complete' || !customerId) {
      return Response.redirect(fallbackUrl, 302);
    }

    const token = await signSubscriberCookie(customerId, secret);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${fallbackUrl}?upgraded=1`,
        'Set-Cookie': buildSetCookie(token),
      },
    });
  } catch {
    return Response.redirect(fallbackUrl, 302);
  }
}
