import Link from 'next/link';
import { Logo } from '@/components/logo';
import { gitConfig } from '@/lib/shared';

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/functions', label: 'Functions' },
      { href: '/tools/formula-builder', label: 'Formula Builder' },
      { href: '/tools/quick-fix', label: 'Quick Fix' },
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
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
];

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.43-2.7 5.41-5.27 5.69.42.36.78 1.07.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

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
                <Link key={link.href} href={link.href} className="transition-colors hover:text-fd-foreground">
                  {link.label}
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
