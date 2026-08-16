import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute, siteUrl } from '@/lib/shared';

export const runtime = 'experimental-edge';

const apexHost = new URL(siteUrl).host;

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

export default function middleware(request: NextRequest) {
  // www served identical content with no redirect, so Google was
  // splitting indexing/traffic signals across two properties even
  // though every page's own canonical tag already pointed at the
  // apex host — this makes that consolidation real at the HTTP level.
  // Note: request.nextUrl.host reflects the server's own bind address,
  // not the incoming Host header — read the header directly instead.
  if (request.headers.get('host') === `www.${apexHost}`) {
    const url = new URL(request.nextUrl.pathname + request.nextUrl.search, siteUrl);
    return NextResponse.redirect(url, 308);
  }

  const result = rewriteSuffix(request.nextUrl.pathname);
  if (result) {
    return NextResponse.rewrite(new URL(result, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(request.nextUrl.pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl), {
        // this URL has two representations, selected by `Accept`
        headers: { Vary: 'Accept' },
      });
    }
  }

  return NextResponse.next();
}
