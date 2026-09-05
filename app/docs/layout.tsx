import { source, getFunctionCatalog } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { LayoutTab } from 'fumadocs-ui/layouts/shared';
import { baseOptions } from '@/lib/layout.shared';

// Curated GROUPS of category folders — collapsing our 13 top-level
// categories into 5 tabs by content weight/relatedness, since one tab per
// category would crowd/wrap a navbar-style tab row. WHICH categories
// belong together is necessarily a hand-made decision — but each tab's
// LABEL and active-highlighting `urls` set are both derived below from
// the real category list (getFunctionCatalog()) and the real page list
// (source.getPages()), not hand-typed, so a category can never again
// silently go unnamed in a label the way "Lookup & Logical" (missing
// Info) and "Arrays, VBA & Custom" (missing Custom Functions and Web)
// both did before this fix — caught live on production 2026-09-04.
const TAB_GROUPS: { folders: string[]; landing: string }[] = [
  { folders: ['lookup', 'logical', 'info'], landing: '/docs/lookup' },
  { folders: ['math', 'statistical'], landing: '/docs/math' },
  { folders: ['text', 'date'], landing: '/docs/text' },
  { folders: ['financial', 'database'], landing: '/docs/financial' },
  { folders: ['arrays', 'vba', 'custom-functions', 'web'], landing: '/docs/arrays' },
];

// "A, B & C" — comma-separated with an ampersand before the last item,
// matching the site's existing tab-label style.
function joinTitles(titles: string[]) {
  if (titles.length <= 1) return titles.join('');
  return `${titles.slice(0, -1).join(', ')} & ${titles[titles.length - 1]}`;
}

function buildTabs(): LayoutTab[] {
  const pages = source.getPages();
  const titleBySlug = new Map(getFunctionCatalog().map((cat) => [cat.slug, cat.title]));

  return TAB_GROUPS.map((group) => {
    const urls = new Set(
      pages
        .filter((page) =>
          group.folders.some((folder) => page.url === `/docs/${folder}` || page.url.startsWith(`/docs/${folder}/`)),
        )
        .map((page) => page.url),
    );

    return {
      title: joinTitles(group.folders.map((folder) => titleBySlug.get(folder) ?? folder)),
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
