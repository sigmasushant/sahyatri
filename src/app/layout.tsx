import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { OfflineNotice } from '@/components/layout/OfflineNotice';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SkipLink } from '@/components/layout/SkipLink';
import { SiteHeader } from '@/components/navigation/SiteHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';
import { createTokenStylesheet } from '@/design-system/css-variables';
import { palette } from '@/design-system/tokens';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import '@/styles/globals.css';

const manrope = localFont({
  src: './fonts/Manrope-Latin-Variable.woff2',
  variable: '--font-manrope',
  weight: '200 800',
  display: 'swap',
  preload: true,
});

const tokenStylesheet = createTokenStylesheet();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.title} | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: '/',
    title: `${siteConfig.title} | ${siteConfig.name}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.title} | ${siteConfig.name}`,
    description: siteConfig.description,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: palette.midnight[950],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={manrope.variable}>
      <head>
        <style id="design-tokens" dangerouslySetInnerHTML={{ __html: tokenStylesheet }} />
      </head>
      <body>
        <SkipLink />
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <OfflineNotice />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
