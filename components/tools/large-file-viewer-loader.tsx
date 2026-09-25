'use client';

/**
 * `next/dynamic`'s `ssr: false` option can't be passed directly from a
 * Server Component (app/(home)/tools/large-file-viewer/page.tsx needs to
 * stay a Server Component so it can export `metadata`) — it has to be
 * called from a Client Component. This file is that thin boundary: the
 * page imports LargeFileViewerClient from here instead of calling
 * `dynamic()` itself.
 *
 * The real component (./large-file-viewer, which imports @duckdb/duckdb-wasm
 * at module scope) is only ever fetched and executed in the browser -
 * ssr: false skips it entirely during the build and on the Cloudflare
 * Worker, and the dynamic import means its (sizeable) JS isn't even part
 * of any other page's bundle.
 */

import dynamic from 'next/dynamic';

export const LargeFileViewerClient = dynamic(
  () => import('./large-file-viewer').then((mod) => mod.LargeFileViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-xl border border-fd-border bg-fd-card text-sm text-fd-muted-foreground">
        Loading viewer…
      </div>
    ),
  },
);
