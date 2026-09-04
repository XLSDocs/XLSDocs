import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { DocsTopNav } from '@/components/docs-top-nav';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <>
      <DocsTopNav />
      <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
        {children}
      </DocsLayout>
    </>
  );
}
