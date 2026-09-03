import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import { Logo } from '@/components/logo';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // DocsTopNav (app/docs/layout.tsx) already shows the logo in its own
      // persistent bar on desktop — this same title also renders inside the
      // sidebar's own header row (fumadocs' default), which would otherwise
      // duplicate it right below DocsTopNav's. md:hidden keeps it for the
      // mobile header only, where DocsTopNav itself is hidden and this is
      // the sole logo on the page.
      title: (
        <span className="md:hidden">
          <Logo />
        </span>
      ),
    },
    links: [
      { text: 'Functions', url: '/functions' },
      { text: 'Blog', url: '/blog' },
      { text: 'Formula Builder', url: '/tools/formula-builder' },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
