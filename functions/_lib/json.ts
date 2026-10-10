export function json(body: unknown, status: number, setCookie?: string): Response {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (setCookie) headers['Set-Cookie'] = setCookie;
  return new Response(JSON.stringify(body), { status, headers });
}
