/**
 * HTTP security headers for every route.
 *
 * CSP note: statically generated pages cannot carry per-request nonces, and Next.js
 * bootstraps hydration with inline scripts, so `script-src` allows 'unsafe-inline'.
 * Everything else is locked to our own origin. If the site later renders user data or
 * needs a stricter policy, switch to the nonce-based setup in `proxy.ts` described in
 * docs/07-release-checklists.md (it makes pages dynamically rendered).
 */
export function buildContentSecurityPolicy(isDev: boolean): string {
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", ...(isDev ? ['ws:'] : [])],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
    'media-src': ["'self'"],
    'frame-src': ["'none'"],
    'frame-ancestors': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  };

  const policy = Object.entries(directives).map(([name, values]) => `${name} ${values.join(' ')}`);
  if (!isDev) policy.push('upgrade-insecure-requests');
  return policy.join('; ');
}

export function buildSecurityHeaders(isDev: boolean): { key: string; value: string }[] {
  const headers = [
    { key: 'Content-Security-Policy', value: buildContentSecurityPolicy(isDev) },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
    },
  ];
  if (!isDev) {
    headers.push({ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' });
  }
  return headers;
}
