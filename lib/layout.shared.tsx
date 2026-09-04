import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import { Logo } from '@/components/logo';
import { GitHubIcon } from '@/components/github-icon';

// Used by app/docs/layout.tsx's notebook DocsLayout. Unlike the classic
// `docs` layout (which needed a hand-built DocsTopNav plus grid/z-index
// CSS to get a persistent desktop header beside the sidebar without it
// stacking on top of things), `notebook` handles this natively: its
// sidebar shows `nav.title` in its own header row unconditionally, while
// the same title in the *top* header only shows on mobile or once the
// sidebar is collapsed (nav.mode defaults to "auto") — so a plain <Logo />
// here, with no manual md:hidden wrapping, lands in exactly the right
// places on its own. `links` renders in the top header AND, redundantly,
// in the sidebar — but notebook already scopes that duplicate to
// `lg:hidden` by itself, so no custom CSS is needed to avoid it on desktop
// either. This mirrors pbidocs' own notebook migration.
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
    },
    links: [
      { text: 'Functions', url: '/functions' },
      { text: 'Blog', url: '/blog' },
      { text: 'Formula Builder', url: '/tools/formula-builder' },
      { text: 'Pricing', url: '/pricing' },
      { text: 'Docs', url: '/docs' },
      {
        type: 'icon',
        label: 'GitHub',
        text: 'GitHub',
        icon: <GitHubIcon />,
        url: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
        external: true,
      },
    ],
  };
}
