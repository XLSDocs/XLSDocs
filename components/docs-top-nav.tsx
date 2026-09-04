import Link from 'next/link';
import { GitHubIcon } from '@/components/github-icon';
import { NavSearchButton } from '@/components/home/nav-search-button';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import { gitConfig } from '@/lib/shared';

// A slim, desktop-only bar giving docs pages the same persistent
// site-wide links every other page has (HomeNav) instead of them being
// tucked away as a small vertical list at the top of the left sidebar.
//
// [grid-area:header] places this inside fumadocs' own CSS grid (see
// app/docs/layout.tsx) — a cell that spans only the content column, not
// the sidebar's. Rendering it as a plain sticky-top-0 bar instead would
// stretch it over the sidebar too, pushing the sidebar's own "Docs" title
// row down rather than letting it sit flush at the top like the
// reference layout this was modeled on.
//
// No logo here: the sidebar's own header (lib/layout.shared.tsx) already
// carries a "Docs" title in this same row, immediately to this bar's
// left — repeating the logo here would just be a second brand mark for
// no reason. Hidden below the md breakpoint since fumadocs' own mobile
// header (logo + sidebar drawer trigger, plus search and theme toggle
// inside the drawer) already covers the same ground on small screens.
// Search and the theme toggle DO duplicate controls the sidebar already
// has on desktop too — accepted deliberately since a second way to reach
// search/theme is a much softer, more common redundancy than a repeated
// logo would be.
const NAV_LINKS = [
  { href: '/functions', label: 'Functions' },
  { href: '/blog', label: 'Blog' },
  { href: '/tools/formula-builder', label: 'Formula Builder' },
  { href: '/pricing', label: 'Pricing' },
];

export function DocsTopNav() {
  return (
    <header className="sticky top-(--fd-docs-row-1) z-30 hidden h-12 items-center justify-between border-b border-fd-border bg-fd-background/80 px-4 backdrop-blur-lg [grid-area:header] md:flex">
      <nav className="flex items-center gap-6 text-sm text-fd-muted-foreground">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="transition-colors hover:text-fd-foreground">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <a
          href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="xlsdocs on GitHub"
          className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        >
          <GitHubIcon className="size-4" />
        </a>
        <ThemeSwitch mode="light-dark" />
        <NavSearchButton />
      </div>
    </header>
  );
}
