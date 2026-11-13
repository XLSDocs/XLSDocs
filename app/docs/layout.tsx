import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { LayoutTab } from 'fumadocs-ui/layouts/shared';
import { baseOptions } from '@/lib/layout.shared';

// Curated GROUPS of category folders — collapsing our 14 top-level
// categories into 6 tabs by content weight/relatedness, since one tab per
// category would crowd/wrap a navbar-style tab row. WHICH categories
// belong together is necessarily a hand-made decision — but each tab's
// LABEL and active-highlighting `urls` set are both derived below from
// the real page list (source.getPages()), not hand-typed, so a category
// can never again silently go unnamed in a label the way "Lookup &
// Logical" (missing Info) and "Arrays, VBA & Custom" (missing Custom
// Functions and Web) both did before an earlier fix — caught live on
// production 2026-09-04. A category still has to be added to TAB_GROUPS
// by hand when it's created, though — this derivation only prevents a
// category that's IN some group from getting mislabeled, not a whole
// category being left out of every group (caught again for `errors`,
// 2026-11-13 — same bug class, see lib/source.ts's getFunctionCatalog()
// comment for why `errors` also needs its own exclusion there).
const TAB_GROUPS: { folders: string[]; landing: string }[] = [
  { folders: ['lookup', 'logical', 'info'], landing: '/docs/lookup' },
  { folders: ['math', 'statistical'], landing: '/docs/math' },
  { folders: ['text', 'date'], landing: '/docs/text' },
  { folders: ['financial', 'database'], landing: '/docs/financial' },
  { folders: ['arrays', 'vba', 'custom-functions', 'web'], landing: '/docs/arrays' },
  // Its own tab rather than folded into one of the groups above — Errors
  // isn't a function category (see the comment on getFunctionCatalog() in
  // lib/source.ts), so grouping it under e.g. "Lookup, Logical, Info &
  // Errors" would mislabel a tab that's actually about functions.
  { folders: ['errors'], landing: '/docs/errors' },
];

// "A, B & C" — comma-separated with an ampersand before the last item,
// matching the site's existing tab-label style.
function joinTitles(titles: string[]) {
  if (titles.length <= 1) return titles.join('');
  return `${titles.slice(0, -1).join(', ')} & ${titles[titles.length - 1]}`;
}

function buildTabs(): LayoutTab[] {
  const pages = source.getPages();
  // Built from the raw page list, not getFunctionCatalog() — that function
  // deliberately excludes the `errors` category (it's not a function
  // category), which would otherwise leave this tab's label falling back
  // to the raw lowercase slug "errors" instead of its real title.
  const titleBySlug = new Map(
    pages.filter((p) => p.slugs.length === 1).map((p) => [p.slugs[0], p.data.title]),
  );

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
