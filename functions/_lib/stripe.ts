import Stripe from 'stripe';

let cachedStripe: Stripe | null = null;
let cachedKey: string | undefined;

// Returns null (never throws) when Stripe isn't configured yet, so every
// caller can degrade to "billing not available" instead of the whole site
// breaking before a Stripe account exists.
export function getStripe(secretKey: string | undefined): Stripe | null {
  if (!secretKey) return null;

  if (!cachedStripe || cachedKey !== secretKey) {
    // Cloudflare Pages Functions has no Node `http` module — Stripe's SDK
    // needs to be told to use the Fetch API instead, per Stripe/Cloudflare's
    // own documented Workers integration.
    cachedStripe = new Stripe(secretKey, { httpClient: Stripe.createFetchHttpClient() });
    cachedKey = secretKey;
  }
  return cachedStripe;
}
