import { NextRequest, NextResponse } from 'next/server';

interface AskClaudeRequestBody {
  messages: { role: 'user' | 'assistant'; content: string }[];
  pageTitle: string;
}

interface AnthropicMessagesResponse {
  error?: { message: string };
  content?: { type: string; text: string }[];
}

export async function POST(req: NextRequest) {
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
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: 'Failed to reach Claude API.' }, { status: 500 });
  }
}