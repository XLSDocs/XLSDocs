import Link from 'next/link';
import { Logo } from '@/components/logo';
import { MobileNav } from './mobile-nav';

const NAV_LINKS = [
  { href: '/functions', label: 'Functions' },
  { href: '/blog', label: 'Blog' },
  { href: '/tools/formula-builder', label: 'Formula Builder' },
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
          <span className="rounded-full border border-fd-border px-2 py-0.5 font-mono text-[11px] text-fd-muted-foreground">
            2027
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-fd-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-fd-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/docs"
            className="rounded-full bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Try for free →
          </Link>
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
