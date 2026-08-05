import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

const BRAND_GREEN = '#10b981';

// Same 2x2 "breathing dot" mark as components/logo.tsx and the OG image's
// BrandIcon, scaled down for a browser-tab favicon — Satori has no access to
// Tailwind/global.css so it's redrawn with inline styles, same as OG.
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexWrap: 'wrap', width: 32, height: 32, gap: 3 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: 13, height: 13, borderRadius: 3, background: BRAND_GREEN }} />
        ))}
      </div>
    ),
    size,
  );
}
