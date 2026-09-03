import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/logo';
import { GitHubIcon } from '@/components/github-icon';
import { gitConfig } from '@/lib/shared';

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/functions', label: 'Functions' },
      { href: '/tools/formula-builder', label: 'Formula Builder' },
      { href: '/tools/quick-fix', label: 'Quick Fix' },
      { href: '/playground', label: 'Playground' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/docs', label: 'Docs' },
      { href: '/changelog', label: 'Changelog' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-fd-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-2xs text-sm text-fd-muted-foreground">
            The Excel reference built for the AI era.
          </p>
          <a
            href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="xlsdocs on GitHub"
            className="mt-4 inline-flex text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            <GitHubIcon className="size-4" />
          </a>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-medium tracking-wider text-fd-muted-foreground uppercase">
              {column.title}
            </p>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-fd-muted-foreground">
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex w-fit items-center gap-1 transition-colors hover:text-fd-foreground"
                >
                  {link.label}
                  <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>
      <div className="border-t border-fd-border px-6 py-4 text-center text-xs text-fd-muted-foreground">
        © {new Date().getFullYear()} xlsdocs.com
      </div>
    </footer>
  );
}
