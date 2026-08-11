import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { DM_Mono } from 'next/font/google';
import Script from 'next/script';

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
});

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
