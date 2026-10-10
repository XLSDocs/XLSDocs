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

const SYSTEM_PROMPT = `You are an Excel formula expert. The user will describe, in plain English, a spreadsheet task. Respond with the exact Excel formula that accomplishes it, plus a breakdown of each part.

Respond with ONLY a JSON object (no markdown fences, no prose outside the JSON) matching this shape:
{
  "formula": "=THE_FORMULA(...)",
  "explanation": "One or two sentences on what the formula does and when to use it.",
  "breakdown": [
    { "part": "a piece of the formula, e.g. a function name or argument", "description": "what that piece does" }
  ]
}

Keep the breakdown to the meaningful parts only (function names, key arguments) — not every character. Use a realistic, idiomatic Excel formula referencing plausible cell ranges (e.g. A2:A100, B2).`;

interface FormulaBuilderRequestBody {
  prompt: string;
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

  const { prompt } = (await request.json()) as FormulaBuilderRequestBody;

  if (typeof prompt !== 'string' || !prompt.trim()) {
    return json({ error: 'A prompt is required.' }, 400);
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
        messages: [{ role: 'user', content: prompt.slice(0, 400) }],
      }),
    });

    const data = (await res.json()) as AnthropicMessagesResponse;
    if (data.error) {
      return json({ error: data.error.message }, 500);
    }

    const text = data.content?.find((b) => b.type === 'text')?.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return json({ error: 'Could not parse a formula from the response.' }, 500);
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
