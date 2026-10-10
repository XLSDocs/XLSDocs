import type { Env } from '../_lib/types';
import { json } from '../_lib/json';
import { checkSubscriber } from '../_lib/subscription';

// Static export has no server component, so the 3 pages that used to read
// the subscriber cookie via next/headers' cookies() at request time
// (pricing, formula-builder, quick-fix) now fetch this on mount instead.
export async function onRequestGet({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const subscriber = await checkSubscriber(request, env.FEEDBACK, env.COOKIE_SIGNING_SECRET);
  const billingEnabled = Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_ID);

  return json(
    { isSubscriber: subscriber.isSubscriber, billingEnabled },
    200,
    subscriber.setCookieHeader,
  );
}
