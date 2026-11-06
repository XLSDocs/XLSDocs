import Link from 'next/link';
import { Logo } from '@/components/logo';
import { MobileNav } from './mobile-nav';
import { NavSearchButton } from './nav-search-button';
import { ToolsMenu } from './tools-menu';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';

const NAV_LINKS = [
  { href: '/functions', label: 'Functions' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

// Mobile has no hover dropdown — list every tool individually instead.
const MOBILE_LINKS = [
  { href: '/functions', label: 'Functions' },
  { href: '/blog', label: 'Blog' },
  { href: '/tools/formula-builder', label: 'AI Formula Builder' },
  { href: '/tools/quick-fix', label: 'Quick Fix' },
  { href: '/tools/vlookup-converter', label: 'VLOOKUP to XLOOKUP Converter' },
  { href: '/tools/number-format-builder', label: 'Number Format Builder' },
  { href: '/tools/conditional-format-builder', label: 'Conditional Format Builder' },
  { href: '/tools/data-validation-builder', label: 'Data Validation Builder' },
  { href: '/tools/large-file-viewer', label: 'Large File Viewer' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function HomeNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-fd-border bg-fd-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            aria-label="xlsdocs.com home"
            className="inline-flex items-center transition-transform duration-200 hover:-translate-y-px"
          >
            <Logo />
          </Link>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-fd-muted-foreground md:flex">
          <Link href={NAV_LINKS[0].href} className="transition-colors hover:text-fd-foreground">
            {NAV_LINKS[0].label}
          </Link>
          <Link href={NAV_LINKS[1].href} className="transition-colors hover:text-fd-foreground">
            {NAV_LINKS[1].label}
          </Link>
          <ToolsMenu />
          <Link href={NAV_LINKS[2].href} className="transition-colors hover:text-fd-foreground">
            {NAV_LINKS[2].label}
          </Link>
          <Link href={NAV_LINKS[3].href} className="transition-colors hover:text-fd-foreground">
            {NAV_LINKS[3].label}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeSwitch mode="light-dark" />
          <NavSearchButton />
          <Link
            href="/docs"
            className="hidden rounded-full bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Try for free →
          </Link>
          <MobileNav links={MOBILE_LINKS} />
        </div>
      </div>
    </header>
  );
}
