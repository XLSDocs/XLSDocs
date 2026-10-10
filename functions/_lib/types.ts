export interface Env {
  FEEDBACK: KVNamespace;
  COOKIE_SIGNING_SECRET?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_WEBHOOK_SECRET_TEST?: string;
  STRIPE_PRICE_ID?: string;
  ANTHROPIC_API_KEY?: string;
}
