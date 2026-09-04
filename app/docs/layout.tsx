import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { DocsTopNav } from '@/components/docs-top-nav';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      {/* DocsTopNav must be a sibling of {children} here, not a wrapper
          outside <DocsLayout>, so its [grid-area:header] class lands it in
          fumadocs' own CSS grid — a cell that only spans the content
          column, not the sidebar's. That keeps the sidebar's own "Docs"
          title flush at the very top instead of pushed down under a bar
          that visually stretched over it. */}
      <DocsTopNav />
      {children}
    </DocsLayout>
  );
}
