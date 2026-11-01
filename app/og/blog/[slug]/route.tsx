import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { getBlogPost, getBlogPosts } from '@/lib/blog-source';
import { appName } from '@/lib/shared';

export const revalidate = false;

const BRAND_GREEN = '#10b981';

// Satori (the OG image renderer) has no access to Tailwind/global.css — it
// only understands inline styles, so the real <Logo /> can't be reused here.
// This mirrors its 2x2 dot grid with inline styles instead. Duplicated from
// app/og/docs/[...slug]/route.tsx rather than shared, since that file's own
// version is co-located with its one caller and extracting a shared
// component for two small, identical uses isn't worth the indirection yet.
function BrandIcon() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', width: 32, height: 32, gap: 4 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ width: 14, height: 14, borderRadius: 4, background: BRAND_GREEN }} />
      ))}
    </div>
  );
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug.replace(/\.png$/, ''));
  if (!post) notFound();

  return new ImageResponse(
    (
      <DefaultImage
        title={post.title}
        description={post.description}
        site={appName}
        icon={<BrandIcon />}
        primaryColor={BRAND_GREEN}
        primaryTextColor={BRAND_GREEN}
      />
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: `${post.slug}.png` }));
}
