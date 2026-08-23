import { getCloudflareContext } from '@opennextjs/cloudflare';

const WINDOW_SECONDS = 60 * 60;

/**
 * Reuses the FEEDBACK KV namespace with a `ratelimit:` key prefix rather than
 * provisioning a dedicated namespace — same tradeoff as feedback counts: a
 * non-atomic read-modify-write, fine for a rough per-hour cap, not exact.
 */
export async function checkRateLimit(
  request: Request,
  routeKey: string,
  limit: number,
  identifier?: string,
): Promise<{ allowed: boolean }> {
  const id = identifier ?? request.headers.get('cf-connecting-ip') ?? 'unknown';
  const { env } = await getCloudflareContext({ async: true });
  const key = `ratelimit:${routeKey}:${id}`;

  const current = Number((await env.FEEDBACK.get(key)) ?? '0');
  if (current >= limit) {
    return { allowed: false };
  }

  await env.FEEDBACK.put(key, String(current + 1), { expirationTtl: WINDOW_SECONDS });
  return { allowed: true };
}
