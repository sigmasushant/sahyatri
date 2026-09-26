import { buildContentSecurityPolicy, buildSecurityHeaders } from '../security';

describe('security headers', () => {
  it('locks production CSP to our own origin', () => {
    const csp = buildContentSecurityPolicy(false);
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain('upgrade-insecure-requests');
    expect(csp).not.toContain('unsafe-eval');
    expect(csp).not.toMatch(/https?:\/\//);
  });

  it('only relaxes eval and websockets in development', () => {
    const csp = buildContentSecurityPolicy(true);
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toContain('ws:');
    expect(csp).not.toContain('upgrade-insecure-requests');
  });

  it('sends HSTS, nosniff, framing and permissions headers in production', () => {
    const headers = Object.fromEntries(buildSecurityHeaders(false).map((h) => [h.key, h.value]));
    expect(headers['Strict-Transport-Security']).toMatch(/max-age=\d+/);
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(headers['Permissions-Policy']).toContain('camera=()');
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
  });
});
