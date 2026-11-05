import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { appName } from '@/lib/shared';

export const revalidate = false;

const BRAND_GREEN = '#10b981';

// Satori (the OG image renderer) has no access to Tailwind/global.css — it
// only understands inline styles, so the real <Logo /> can't be reused here.
// This mirrors its 2x2 dot grid with inline styles instead. Duplicated from
// the docs/blog OG routes rather than shared, same reasoning as those: each
// is co-located with its one caller, not worth the indirection for three
// small, identical uses.
function BrandIcon() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', width: 32, height: 32, gap: 4 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ width: 14, height: 14, borderRadius: 4, background: BRAND_GREEN }} />
      ))}
    </div>
  );
}

export async function GET() {
  return new ImageResponse(
    (
      <DefaultImage
        title="The Excel reference built for the AI era"
        description="Every function documented, plus an AI formula builder built in."
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
