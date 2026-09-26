import { ImageResponse } from 'next/og';
import { palette } from '@/design-system/tokens';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: palette.lime[400] }}>
        <svg width="180" height="180" viewBox="0 0 48 48">
          <path d="M13 34c0-6.5 4.5-8.6 11-9.6S35 21 35 14" fill="none" stroke={palette.midnight[900]} strokeWidth="3.6" strokeLinecap="round" />
          <circle cx="13" cy="34.5" r="4.4" fill={palette.midnight[900]} />
          <circle cx="35" cy="13.5" r="4.4" fill={palette.midnight[900]} />
        </svg>
      </div>
    ),
    size,
  );
}
