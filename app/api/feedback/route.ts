import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

interface FeedbackRequestBody {
  path: string;
  vote: 'up' | 'down';
}

interface FeedbackCounts {
  up: number;
  down: number;
}

export async function POST(req: NextRequest) {
  const { path, vote } = (await req.json()) as FeedbackRequestBody;

  if (typeof path !== 'string' || !path.startsWith('/') || (vote !== 'up' && vote !== 'down')) {
    return NextResponse.json({ error: 'Invalid feedback payload.' }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });
  const key = `feedback:${path}`;

  const existing = (await env.FEEDBACK.get(key, 'json')) as FeedbackCounts | null;
  const counts: FeedbackCounts = existing ?? { up: 0, down: 0 };
  counts[vote] += 1;

  await env.FEEDBACK.put(key, JSON.stringify(counts));

  return NextResponse.json(counts);
}
