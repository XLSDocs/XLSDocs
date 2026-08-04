import { getPageImageUrl, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { appName } from '@/lib/shared';

export const revalidate = false;

const BRAND_GREEN = '#10b981';

// Satori (the OG image renderer) has no access to Tailwind/global.css — it
// only understands inline styles, so the real <Logo /> can't be reused here.
// This mirrors its 2x2 dot grid with inline styles instead.
function BrandIcon() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', width: 32, height: 32, gap: 4 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ width: 14, height: 14, borderRadius: 4, background: BRAND_GREEN }} />
      ))}
    </div>
  );
}

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    (
      <DefaultImage
        title={page.data.title}
        description={page.data.description}
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
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }));
}
