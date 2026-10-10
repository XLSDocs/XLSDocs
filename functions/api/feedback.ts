import type { Env } from '../_lib/types';
import { json } from '../_lib/json';

interface FeedbackRequestBody {
  path: string;
  vote: 'up' | 'down';
}

interface FeedbackCounts {
  up: number;
  down: number;
}

export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { path, vote } = (await request.json()) as FeedbackRequestBody;

  if (typeof path !== 'string' || !path.startsWith('/') || (vote !== 'up' && vote !== 'down')) {
    return json({ error: 'Invalid feedback payload.' }, 400);
  }

  const key = `feedback:${path}`;

  const existing = (await env.FEEDBACK.get(key, 'json')) as FeedbackCounts | null;
  const counts: FeedbackCounts = existing ?? { up: 0, down: 0 };
  counts[vote] += 1;

  await env.FEEDBACK.put(key, JSON.stringify(counts));

  return json(counts, 200);
}
