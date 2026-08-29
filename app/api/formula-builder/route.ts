import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { checkSubscriber } from '@/lib/subscription';
import {
  AI_TOOLS_ROUTE_KEY,
  AI_TOOLS_ROUTE_KEY_SUB,
  AI_TOOLS_FREE_LIMIT,
  AI_TOOLS_SUBSCRIBER_LIMIT,
  AI_TOOLS_WINDOW_SECONDS,
  AI_TOOLS_FREE_LIMIT_MESSAGE,
  AI_TOOLS_SUBSCRIBER_LIMIT_MESSAGE,
} from '@/lib/ai-rate-limit';

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

export async function POST(req: NextRequest) {
  const subscriber = await checkSubscriber(req);
  const { allowed } = subscriber.isSubscriber
    ? await checkRateLimit(req, AI_TOOLS_ROUTE_KEY_SUB, AI_TOOLS_SUBSCRIBER_LIMIT, subscriber.customerId)
    : await checkRateLimit(req, AI_TOOLS_ROUTE_KEY, AI_TOOLS_FREE_LIMIT, undefined, AI_TOOLS_WINDOW_SECONDS);

  if (!allowed) {
    const message = subscriber.isSubscriber
      ? AI_TOOLS_SUBSCRIBER_LIMIT_MESSAGE
      : AI_TOOLS_FREE_LIMIT_MESSAGE;
    const res = NextResponse.json({ error: message }, { status: 429 });
    if (subscriber.setCookieHeader) res.headers.append('Set-Cookie', subscriber.setCookieHeader);
    return res;
  }

  const { prompt } = (await req.json()) as FormulaBuilderRequestBody;

  if (typeof prompt !== 'string' || !prompt.trim()) {
    return NextResponse.json({ error: 'A prompt is required.' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured on the server.' },
      { status: 500 },
    );
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
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse a formula from the response.' }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (typeof parsed.formula !== 'string' || !Array.isArray(parsed.breakdown)) {
      return NextResponse.json({ error: 'Malformed response from the AI.' }, { status: 500 });
    }

    const successRes = NextResponse.json({
      formula: parsed.formula,
      explanation: parsed.explanation ?? '',
      breakdown: parsed.breakdown,
    });
    if (subscriber.setCookieHeader) successRes.headers.append('Set-Cookie', subscriber.setCookieHeader);
    return successRes;
  } catch {
    return NextResponse.json({ error: 'Failed to reach the AI service.' }, { status: 500 });
  }
}
