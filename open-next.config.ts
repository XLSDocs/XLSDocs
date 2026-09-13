import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache';

// Previously unset, which defaults to a no-op "dummy" cache (see
// resolveIncrementalCache in @opennextjs/cloudflare's config.js) — every
// single request, including repeat requests to the exact same already-
// prerendered page, was a full fresh Next.js render inside the Worker with
// zero caching at any layer (confirmed live: x-nextjs-cache: MISS on every
// request, no cf-cache-status header at all). Wiring up the KV-backed
// incremental cache (binding: NEXT_INC_CACHE_KV in wrangler.jsonc) lets
// OpenNext actually persist and reuse rendered output between requests,
// which is what Cache-Control: s-maxage on these responses was always
// assuming existed.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
