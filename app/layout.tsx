import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { DM_Mono } from 'next/font/google';
import Script from 'next/script';
import type { Metadata } from 'next';

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://xlsdocs.com'),
  title: {
    default: 'xlsdocs.com — Excel Function Reference',
    template: '%s | xlsdocs.com',
  },
  description:
    'Every Excel function documented — syntax, examples, and an AI formula builder built in. The Excel reference site power users deserve.',
  verification: {
    other: {
      'msvalidate.01': 'D7B9EC9B5210AB7F934CCCC1C1B95DFF',
    },
  },
};

// next-themes' anti-flash-of-wrong-theme script (rendered inside
// <RootProvider> below) is built by calling .toString() on a real function
// at render time, then inlining that source into a plain, synchronous
// <script> tag — deliberately so it runs during raw HTML parsing, before
// any JS bundle loads, which is the whole point of an anti-FOUC script.
// OpenNext's esbuild server bundling injects __name(fn, "name") naming
// calls into function bodies it compiles — including that function — but
// the helper those calls depend on only exists in the *server* bundle's
// scope, not in the extracted string shipped to the browser. Result: every
// page threw "ReferenceError: __name is not defined" partway through that
// script, meaning the part that actually sets the theme class before
// paint never ran.
//
// next/script's beforeInteractive strategy looks like the fix, but it
// isn't one here: those scripts are queued as part of Next's own client
// bundle metadata and only get inserted once that bundle starts running —
// which is after next-themes' raw, literal <script> tag has already
// parsed and executed. A real fix needs a plain <script> that's also
// literally present earlier in the served HTML, so it runs during the
// same initial parse pass, before next-themes' tag is ever reached.
const nameShim = `window.__name=window.__name||function(e,n){return Object.defineProperty(e,"name",{value:n,configurable:true})};`;

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={dmMono.variable} suppressHydrationWarning>
      <head>
        <script id="name-shim" dangerouslySetInnerHTML={{ __html: nameShim }} />
      </head>
      <body className="flex flex-col min-h-screen font-sans">
        <RootProvider>{children}</RootProvider>
        <Script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "d8caa48a2ecf4d4e864140da1ed313b5"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
