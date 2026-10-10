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

// Shares the same pool as Formula Builder and Quick Fix, via the constants
// in _lib/ai-rate-limit.ts — one $5/mo subscription unlocks unlimited use of
// all three, so the free tier is one combined daily allowance, not three
// separate ones that add up to more than intended.

interface AskClaudeRequestBody {
  messages: { role: 'user' | 'assistant'; content: string }[];
  pageTitle: string;
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

  const { messages, pageTitle } = (await request.json()) as AskClaudeRequestBody;

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' }, 500);
  }

  const systemPrompt = `You are a concise Excel formula expert helping a user who is reading the xlsdocs.com documentation page for the "${pageTitle}" function. Keep answers short, practical, and specific to Excel. Use backticks for formulas and function names.`;

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
        max_tokens: 600,
        system: systemPrompt,
        messages,
      }),
    });

    const data = (await res.json()) as AnthropicMessagesResponse;
    if (data.error) {
      return json({ error: data.error.message }, 500);
    }

    const reply = data.content?.find((b) => b.type === 'text')?.text ?? '';
    return json({ reply }, 200, subscriber.setCookieHeader);
  } catch {
    return json({ error: 'Failed to reach the AI service.' }, 500);
  }
}
