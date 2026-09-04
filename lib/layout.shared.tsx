import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import { Logo } from '@/components/logo';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // DocsTopNav (app/docs/layout.tsx) already shows the logo in its own
      // persistent bar on desktop — this same title also renders inside the
      // sidebar's own header row (fumadocs' default), which would otherwise
      // duplicate it right below DocsTopNav's. md:hidden keeps the actual
      // logo for the mobile header only, where DocsTopNav itself is hidden
      // and this is the sole logo on the page. On desktop, where the
      // sidebar's header row would otherwise be empty (just the collapse
      // icon), a plain text label gives the sidebar its own identity —
      // matching the reference layout this was modeled on.
      title: (
        <>
          <span className="md:hidden">
            <Logo />
          </span>
          <span className="hidden text-fd-foreground md:inline">Docs</span>
        </>
      ),
    },
    links: [
      { text: 'Functions', url: '/functions' },
      { text: 'Blog', url: '/blog' },
      { text: 'Formula Builder', url: '/tools/formula-builder' },
      // Rendered last so it sits immediately above the category tree,
      // styled identically to a tree entry (fumadocs reuses the same
      // SidebarItem component for both) — a pinned, always-visible way
      // back to the docs landing page, highlighted like any other active
      // page when you're on it.
      { text: 'Docs Home', url: '/docs' },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
