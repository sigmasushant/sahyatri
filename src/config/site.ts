/**
 * Site-wide facts. Anything that is not known yet is `null`/empty and the UI hides it —
 * the site never invents store links, social accounts, metrics or addresses.
 */
export const siteConfig = {
  name: 'Sahyatri',
  tagline: 'Move together.',
  title: 'Smarter shared mobility',
  description:
    'Find trusted rides, share empty seats and move through cities with intelligent, verified shared mobility.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  locale: 'en_IN',
  /** Store listings. `null` until the app is published; CTAs fall back to early access. */
  appStores: {
    ios: null as string | null,
    android: null as string | null,
  },
  /** Official social profiles only. Leave empty rather than guessing handles. */
  social: [] as { label: 'Instagram' | 'LinkedIn' | 'X' | 'YouTube'; href: string }[],
  /** Emergency number shown in safety copy. */
  emergencyNumber: '112',
} as const;

export const appIsLive = Boolean(siteConfig.appStores.ios || siteConfig.appStores.android);

export function absoluteUrl(path = '/'): string {
  return `${siteConfig.url}${path === '/' ? '' : path}`;
}
