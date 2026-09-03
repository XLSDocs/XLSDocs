import Link from 'next/link';
import { Logo } from '@/components/logo';

// A slim, desktop-only bar sitting above fumadocs' own DocsLayout, giving
// docs pages the same persistent site-wide links every other page has
// (HomeNav) instead of them being tucked away as a small vertical list at
// the top of the left sidebar. Deliberately doesn't duplicate search or
// the theme toggle — DocsLayout's own sidebar already has both. Hidden
// below the md breakpoint since fumadocs' own mobile header (logo + sidebar
// drawer trigger) already covers the same ground on small screens, where
// stacking two headers would waste scarce vertical space.
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
    </header>
  );
}
