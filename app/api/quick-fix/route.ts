import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { checkSubscriber } from '@/lib/subscription';

// Shares the Formula Builder's own rate-limit pool and $5/mo subscription
// rather than a separate cap — same tool, same cost profile, just fixing a
// formula instead of writing one from scratch. A second pool would just
// double the effective free tier for no real reason.
const SUBSCRIBER_LIMIT = 300;
const FREE_LIMIT = 15;

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

export async function POST(req: NextRequest) {
  const subscriber = await checkSubscriber(req);
  const { allowed } = subscriber.isSubscriber
    ? await checkRateLimit(req, 'formula-builder-sub', SUBSCRIBER_LIMIT, subscriber.customerId)
    : await checkRateLimit(req, 'formula-builder', FREE_LIMIT);

  if (!allowed) {
    const message = subscriber.isSubscriber
      ? "You've hit an unusually high usage spike — try again shortly."
      : "You've hit the free limit for the AI formula tools this hour — upgrade for unlimited, or try again later.";
    const res = NextResponse.json({ error: message }, { status: 429 });
    if (subscriber.setCookieHeader) res.headers.append('Set-Cookie', subscriber.setCookieHeader);
    return res;
  }

  const { formula } = (await req.json()) as QuickFixRequestBody;

  if (typeof formula !== 'string' || !formula.trim()) {
    return NextResponse.json({ error: 'A formula is required.' }, { status: 400 });
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
        messages: [{ role: 'user', content: formula.slice(0, 500) }],
      }),
    });

    const data = (await res.json()) as AnthropicMessagesResponse;
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse a fix from the response.' }, { status: 500 });
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
