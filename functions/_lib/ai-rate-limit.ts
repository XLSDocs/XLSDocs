// Formula Builder, Quick Fix, and Ask AI share ONE combined free-tier pool
// and one subscriber pool — a single $5/mo subscription unlocks unlimited
// use of all three, so the free tier is capped the same way: one shared
// daily allowance, not three separate ones that add up to more than
// intended (an earlier version gave 5 shared Builder/Fix + 5 separate
// Ask AI = 10/day total, which undercut the incentive to subscribe).
//
// Centralized here rather than duplicated per-route because the three API
// routes must pass identical values to share one KV counter correctly, and
// the client-side Ask AI widget matches this exact message string to
// detect a rate-limit response — three independent copies of these values
// is exactly the kind of thing that silently drifts out of sync.
export const AI_TOOLS_ROUTE_KEY = 'ai-tools';
export const AI_TOOLS_ROUTE_KEY_SUB = 'ai-tools-sub';
export const AI_TOOLS_FREE_LIMIT = 5;
// Generous, but not fully unlimited — bounds worst-case Anthropic API cost
// from a leaked/shared cookie or a KV outage forcing fail-open, while being
// effectively unlimited for any real single subscriber's combined usage
// across all three tools.
export const AI_TOOLS_SUBSCRIBER_LIMIT = 300;
export const AI_TOOLS_WINDOW_SECONDS = 60 * 60 * 24;

export const AI_TOOLS_FREE_LIMIT_MESSAGE =
  "You've hit today's free limit for xlsdocs' AI tools — upgrade for unlimited, or try again tomorrow.";
export const AI_TOOLS_SUBSCRIBER_LIMIT_MESSAGE =
  "You've hit an unusually high usage spike — try again shortly.";
