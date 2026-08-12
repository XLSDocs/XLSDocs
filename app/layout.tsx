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

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={dmMono.variable} suppressHydrationWarning>
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
