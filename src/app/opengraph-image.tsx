import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';
import { palette } from '@/design-system/tokens';

export const alt = `${siteConfig.name} — ${siteConfig.tagline} Intelligent shared mobility.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Social card generated at build time from the brand tokens. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: palette.midnight[950],
          color: palette.frost,
          position: 'relative',
        }}
      >
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: 'absolute', left: 0, top: 0 }}>
          <path d="M520 470 C 700 420, 760 300, 900 280 S 1100 220, 1180 150" fill="none" stroke={palette.midnight[500]} strokeWidth="2" />
          <path d="M600 560 C 760 520, 820 420, 980 400 S 1120 380, 1200 330" fill="none" stroke={palette.midnight[500]} strokeWidth="2" />
          <path d="M560 360 C 720 360, 820 300, 940 300 S 1080 330, 1160 290" fill="none" stroke={palette.lime[400]} strokeWidth="5" strokeLinecap="round" />
          <path d="M700 470 C 780 420, 820 360, 860 318" fill="none" stroke={palette.cyan[400]} strokeWidth="4" strokeLinecap="round" />
          <circle cx="560" cy="360" r="9" fill={palette.frost} />
          <circle cx="1160" cy="290" r="11" fill={palette.lime[400]} />
          <circle cx="860" cy="318" r="22" fill="none" stroke={palette.frost} strokeWidth="2" opacity="0.7" />
          <circle cx="700" cy="470" r="8" fill={palette.cyan[400]} />
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 48 48">
            <rect width="48" height="48" rx="14" fill={palette.lime[400]} />
            <path d="M13 34c0-6.5 4.5-8.6 11-9.6S35 21 35 14" fill="none" stroke={palette.midnight[900]} strokeWidth="3.6" strokeLinecap="round" />
            <circle cx="13" cy="34.5" r="4.4" fill={palette.midnight[900]} />
            <circle cx="35" cy="13.5" r="4.4" fill={palette.midnight[900]} />
          </svg>
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1.5 }}>sahyatri</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>Move together.</div>
          <div style={{ fontSize: 34, color: palette.slate[300], maxWidth: 640 }}>
            Trusted rides and shared seats, matched intelligently.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
