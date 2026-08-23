import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { checkSubscriber } from '@/lib/subscription';

// Same subscription that unlocks the Formula Builder also covers Ask Claude —
// one $5/mo tier, not a second paywall. Free tier is a daily cap, not hourly:
// an hourly reset let anyone dodge it by just waiting, which undermined the
// point of capping it at all.
const SUBSCRIBER_LIMIT = 200;
const FREE_LIMIT = 5;
const DAY_SECONDS = 60 * 60 * 24;

interface AskClaudeRequestBody {
  messages: { role: 'user' | 'assistant'; content: string }[];
  pageTitle: string;
}

interface AnthropicMessagesResponse {
  error?: { message: string };
  content?: { type: string; text: string }[];
}

export async function POST(req: NextRequest) {
  const subscriber = await checkSubscriber(req);
  const { allowed } = subscriber.isSubscriber
    ? await checkRateLimit(req, 'ask-claude-sub', SUBSCRIBER_LIMIT, subscriber.customerId)
    : await checkRateLimit(req, 'ask-claude', FREE_LIMIT, undefined, DAY_SECONDS);

  if (!allowed) {
    const message = subscriber.isSubscriber
      ? "You've hit an unusually high usage spike — try again shortly."
      : "You've hit the free limit for Ask Claude today — upgrade for unlimited, or try again tomorrow.";
    const res = NextResponse.json({ error: message }, { status: 429 });
    if (subscriber.setCookieHeader) res.headers.append('Set-Cookie', subscriber.setCookieHeader);
    return res;
  }

  const { messages, pageTitle } = (await req.json()) as AskClaudeRequestBody;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured on the server.' },
      { status: 500 },
    );
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
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const reply = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? '';
    const successRes = NextResponse.json({ reply });
    if (subscriber.setCookieHeader) successRes.headers.append('Set-Cookie', subscriber.setCookieHeader);
    return successRes;
  } catch {
    return NextResponse.json({ error: 'Failed to reach Claude API.' }, { status: 500 });
  }
}