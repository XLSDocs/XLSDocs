import Link from 'next/link';
import { Logo } from '@/components/logo';
import { GitHubIcon } from '@/components/github-icon';
import { NavSearchButton } from '@/components/home/nav-search-button';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import { gitConfig } from '@/lib/shared';

// A slim, desktop-only bar sitting above fumadocs' own DocsLayout, giving
// docs pages the same persistent site-wide links every other page has
// (HomeNav) instead of them being tucked away as a small vertical list at
// the top of the left sidebar. Hidden below the md breakpoint since
// fumadocs' own mobile header (logo + sidebar drawer trigger, plus search
// and theme toggle inside the drawer) already covers the same ground on
// small screens, where stacking two headers would waste scarce vertical
// space. Search and the theme toggle DO duplicate controls the sidebar
// already has on desktop too — accepted deliberately (unlike the logo,
// which visibly stacked right on top of itself) since a second way to
// reach search/theme is a much softer, more common redundancy, and
// matches the reference layout this was modeled on.
const NAV_LINKS = [
  { href: '/functions', label: 'Functions' },
  { href: '/blog', label: 'Blog' },
  { href: '/tools/formula-builder', label: 'Formula Builder' },
  { href: '/pricing', label: 'Pricing' },
];

export function DocsTopNav() {
  return (
    <header className="sticky top-0 z-50 hidden h-12 items-center justify-between border-b border-fd-border bg-fd-background/80 px-6 backdrop-blur-lg md:flex">
      <Link
        href="/"
        aria-label="xlsdocs.com home"
        className="inline-flex items-center transition-transform duration-200 hover:-translate-y-px"
      >
        <Logo />
      </Link>
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
