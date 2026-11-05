import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import { Logo } from '@/components/logo';
import { GitHubIcon } from '@/components/github-icon';
import { Sparkles, Wrench, Hash, Palette, Sheet, ListChecks } from 'lucide-react';

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
      {
        type: 'menu',
        text: 'Tools',
        items: [
          {
            icon: <Sparkles />,
            text: 'AI Formula Builder',
            description: 'Describe what you need, get a working formula.',
            url: '/tools/formula-builder',
          },
          {
            icon: <Wrench />,
            text: 'Quick Fix',
            description: 'Paste a broken formula, get it corrected.',
            url: '/tools/quick-fix',
          },
          {
            icon: <Hash />,
            text: 'Number Format Builder',
            description: 'Build a custom number format code with a form.',
            url: '/tools/number-format-builder',
          },
          {
            icon: <Palette />,
            text: 'Conditional Format Builder',
            description: 'Generate the formula for a highlighting rule.',
            url: '/tools/conditional-format-builder',
          },
          {
            icon: <ListChecks />,
            text: 'Data Validation Builder',
            description: 'Dropdown lists, dependent dropdowns, and range limits.',
            url: '/tools/data-validation-builder',
          },
          {
            icon: <Sheet />,
            text: 'Large File Viewer',
            description: "Open CSV/Parquet files bigger than Excel's row limit.",
            url: '/tools/large-file-viewer',
          },
        ],
      },
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
