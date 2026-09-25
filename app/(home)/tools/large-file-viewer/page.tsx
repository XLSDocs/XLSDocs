import { LargeFileViewerClient } from '@/components/tools/large-file-viewer-loader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Large File Viewer — Open CSV Files Too Big for Excel',
  description:
    "Open a CSV, TSV, or Parquet file bigger than Excel's 1,048,576-row limit and scroll or sort it instantly. Runs entirely in your browser — your file is never uploaded anywhere.",
  alternates: {
    canonical: '/tools/large-file-viewer',
  },
};

export default function LargeFileViewerPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border px-3 py-1 font-mono text-xs text-fd-muted-foreground">
          Runs in your browser
        </span>
        <h1 className="mt-6 text-4xl font-normal md:text-5xl">
          Open files <span className="font-serif text-fd-primary italic">Excel can&apos;t.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-fd-muted-foreground">
          Excel caps out at 1,048,576 rows per sheet. Drop a CSV, TSV, or
          Parquet file here instead — however large — and scroll or sort it
          instantly. Your file is read entirely in this browser tab; nothing
          is ever uploaded anywhere.
        </p>
      </div>

      <div className="mt-10 h-[70vh] min-h-[420px]">
        <LargeFileViewerClient />
      </div>
    </div>
  );
}
