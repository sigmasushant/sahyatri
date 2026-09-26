import type { NextConfig } from 'next';
import { buildSecurityHeaders } from './src/config/security';

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  // This app lives inside a larger folder with its own lockfile; pin the workspace root here.
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Only ship the icons/components that are actually imported.
    optimizePackageImports: ['lucide-react', '@react-three/drei'],
    // Most visitors to a launch site are first-time visitors, and our CSS is small: inline it
    // to remove the render-blocking stylesheet request.
    inlineCss: true,
  },
  async headers() {
    return [{ source: '/:path*', headers: buildSecurityHeaders(isDev) }];
  },
};

export default nextConfig;
