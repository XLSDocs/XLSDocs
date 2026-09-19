import { createMDX } from 'fumadocs-mdx/next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        // Every function's old standalone /examples page was merged into
        // its parent page as a "## Examples" section (2026-09) — send any
        // remaining external links/bookmarks straight to that anchor.
        source: '/docs/:category/:fn/examples',
        destination: '/docs/:category/:fn#examples',
        permanent: true,
      },
    ];
  },
};

initOpenNextCloudflareForDev();

export default withMDX(config);
