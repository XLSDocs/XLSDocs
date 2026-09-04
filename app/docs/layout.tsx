import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { LayoutTab } from 'fumadocs-ui/layouts/shared';
import { baseOptions } from '@/lib/layout.shared';

// Curated tab groups — our 13 top-level categories collapsed into 5 tabs
// by content weight/relatedness, rather than one tab per category (which
// would crowd/wrap a navbar-style tab row). Each tab's `urls` set is every
// actual page URL under its member folders, computed from the real page
// list below — so tab-active-highlighting works correctly without
// requiring any change to the underlying folder/URL structure. Modeled on
// pbidocs' own notebook migration (same pattern, same reasoning).
const TAB_GROUPS: { title: string; folders: string[]; landing: string }[] = [
  { title: 'Lookup, Logical & Info', folders: ['lookup', 'logical', 'info'], landing: '/docs/lookup' },
  { title: 'Math & Statistics', folders: ['math', 'statistical'], landing: '/docs/math' },
  { title: 'Text & Date', folders: ['text', 'date'], landing: '/docs/text' },
  { title: 'Financial & Database', folders: ['financial', 'database'], landing: '/docs/financial' },
  { title: 'Arrays, VBA, Custom & Web', folders: ['arrays', 'vba', 'custom-functions', 'web'], landing: '/docs/arrays' },
];

function buildTabs(): LayoutTab[] {
  const pages = source.getPages();

  return TAB_GROUPS.map((group) => {
    const urls = new Set(
      pages
        .filter((page) =>
          group.folders.some((folder) => page.url === `/docs/${folder}` || page.url.startsWith(`/docs/${folder}/`)),
        )
        .map((page) => page.url),
    );

    return {
      title: group.title,
      url: group.landing,
      urls,
    };
  });
}

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const { nav, ...rest } = baseOptions();

  return (
    <DocsLayout tree={source.getPageTree()} tabs={buildTabs()} tabMode="navbar" nav={nav} {...rest}>
      {children}
    </DocsLayout>
  );
}
