import type { Env } from '../_lib/types';
import { json } from '../_lib/json';
import { checkRateLimit } from '../_lib/rate-limit';
import { checkSubscriber } from '../_lib/subscription';
import {
  AI_TOOLS_ROUTE_KEY,
  AI_TOOLS_ROUTE_KEY_SUB,
  AI_TOOLS_FREE_LIMIT,
  AI_TOOLS_SUBSCRIBER_LIMIT,
  AI_TOOLS_WINDOW_SECONDS,
  AI_TOOLS_FREE_LIMIT_MESSAGE,
  AI_TOOLS_SUBSCRIBER_LIMIT_MESSAGE,
} from '../_lib/ai-rate-limit';

// Shares the same pool as Formula Builder and Ask AI, via the constants in
// _lib/ai-rate-limit.ts — one $5/mo subscription unlocks unlimited use of
// all three, so the free tier is one combined allowance too, not a second
// one that would double it for no real reason.

const SYSTEM_PROMPT = `You are an Excel formula debugging expert. The user will paste a broken or misbehaving Excel formula, usually along with the error it throws or the wrong result it returns. Diagnose the actual problem and respond with a corrected formula.

Respond with ONLY a JSON object (no markdown fences, no prose outside the JSON) matching this shape:
{
  "formula": "=THE_CORRECTED_FORMULA(...)",
  "explanation": "One or two sentences on what was actually wrong.",
  "breakdown": [
    { "part": "a specific change made to fix it", "description": "why this change fixes the problem" }
  ]
}

If the formula the user pasted is already correct, say so in "explanation" and return it unchanged in "formula" with an empty "breakdown" array. Keep the breakdown to the meaningful changes only, not a character-by-character diff.`;

interface QuickFixRequestBody {
  formula: string;
}

interface AnthropicMessagesResponse {
  error?: { message: string };
  content?: { type: string; text: string }[];
}

export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const subscriber = await checkSubscriber(request, env.FEEDBACK, env.COOKIE_SIGNING_SECRET);
  const { allowed } = subscriber.isSubscriber
    ? await checkRateLimit(request, env.FEEDBACK, AI_TOOLS_ROUTE_KEY_SUB, AI_TOOLS_SUBSCRIBER_LIMIT, subscriber.customerId)
    : await checkRateLimit(request, env.FEEDBACK, AI_TOOLS_ROUTE_KEY, AI_TOOLS_FREE_LIMIT, undefined, AI_TOOLS_WINDOW_SECONDS);

  if (!allowed) {
    const message = subscriber.isSubscriber ? AI_TOOLS_SUBSCRIBER_LIMIT_MESSAGE : AI_TOOLS_FREE_LIMIT_MESSAGE;
    return json({ error: message }, 429, subscriber.setCookieHeader);
  }

  const { formula } = (await request.json()) as QuickFixRequestBody;

  if (typeof formula !== 'string' || !formula.trim()) {
    return json({ error: 'A formula is required.' }, 400);
  }

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' }, 500);
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: formula.slice(0, 500) }],
      }),
    });

    const data = (await res.json()) as AnthropicMessagesResponse;
    if (data.error) {
      return json({ error: data.error.message }, 500);
    }

    const text = data.content?.find((b) => b.type === 'text')?.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return json({ error: 'Could not parse a fix from the response.' }, 500);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (typeof parsed.formula !== 'string' || !Array.isArray(parsed.breakdown)) {
      return json({ error: 'Malformed response from the AI.' }, 500);
    }

    return json(
      {
        formula: parsed.formula,
        explanation: parsed.explanation ?? '',
        breakdown: parsed.breakdown,
      },
      200,
      subscriber.setCookieHeader,
    );
  } catch {
    return json({ error: 'Failed to reach the AI service.' }, 500);
  }
}
