import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

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

    const data = await res.json();
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
      return NextResponse.json({ error: 'Malformed response from Claude.' }, { status: 500 });
    }

    return NextResponse.json({
      formula: parsed.formula,
      explanation: parsed.explanation ?? '',
      breakdown: parsed.breakdown,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to reach Claude API.' }, { status: 500 });
  }
}
