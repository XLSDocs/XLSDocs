import type { Env } from '../../_lib/types';
import { json } from '../../_lib/json';
import { getStripe } from '../../_lib/stripe';
import { checkSubscriber } from '../../_lib/subscription';

export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const stripe = getStripe(env.STRIPE_SECRET_KEY);
  const subscriber = await checkSubscriber(request, env.FEEDBACK, env.COOKIE_SIGNING_SECRET);

  if (!stripe || !subscriber.isSubscriber || !subscriber.customerId) {
    return json({ error: 'No active subscription found.' }, 401);
  }

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: subscriber.customerId,
      return_url: `${new URL(request.url).origin}/tools/formula-builder`,
    });
    return json({ url: portal.url }, 200);
  } catch {
    return json({ error: 'Could not open the billing portal.' }, 502);
  }
}
