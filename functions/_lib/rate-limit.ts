const DEFAULT_WINDOW_SECONDS = 60 * 60;

/**
 * Reuses the FEEDBACK KV namespace with a `ratelimit:` key prefix rather than
 * provisioning a dedicated namespace — same tradeoff as feedback counts: a
 * non-atomic read-modify-write, fine for a rough cap, not exact.
 */
export async function checkRateLimit(
  request: Request,
  feedbackKv: KVNamespace,
  routeKey: string,
  limit: number,
  identifier?: string,
  windowSeconds: number = DEFAULT_WINDOW_SECONDS,
): Promise<{ allowed: boolean }> {
  const id = identifier ?? request.headers.get('cf-connecting-ip') ?? 'unknown';
  const key = `ratelimit:${routeKey}:${id}`;

  const current = Number((await feedbackKv.get(key)) ?? '0');
  if (current >= limit) {
    return { allowed: false };
  }

  await feedbackKv.put(key, String(current + 1), { expirationTtl: windowSeconds });
  return { allowed: true };
}
