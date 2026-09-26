import { POST } from '@/app/api/early-access/route';

const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://www.example.com/api/early-access', {
    method: 'POST',
    headers: { 'content-type': 'application/json', host: 'www.example.com', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

describe('early access endpoint', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('accepts a valid submission', async () => {
    const response = await POST(request({ email: 'asha@example.com', role: 'passenger' }));
    expect(response.status).toBe(202);
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('returns field errors for invalid input', async () => {
    const response = await POST(request({ email: 'nope', role: 'passenger' }));
    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.fields.email).toMatch(/valid email/i);
  });

  it('rejects cross-site posts, non-JSON and oversized bodies', async () => {
    expect((await POST(request({}, { origin: 'https://evil.example' }))).status).toBe(403);
    expect((await POST(request('email=a', { 'content-type': 'application/x-www-form-urlencoded' }))).status).toBe(415);
    expect((await POST(request('{not json'))).status).toBe(400);
    expect((await POST(request({ email: 'a@b.co', role: 'both', city: 'x'.repeat(20_000) }))).status).toBe(413);
  });

  it('silently drops honeypot submissions without forwarding them', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchSpy);
    vi.stubEnv('EARLY_ACCESS_WEBHOOK_URL', 'https://hooks.example.com/early-access');
    const response = await POST(request({ email: 'bot@example.com', role: 'both', website: '' }));
    expect(response.status).toBe(202);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    fetchSpy.mockClear();
    const trapped = await POST(request({ email: 'bot@example.com', role: 'both', website: 'http://spam' }));
    expect(trapped.status).toBe(202);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('forwards valid submissions server-side and reports upstream failures', async () => {
    vi.stubEnv('EARLY_ACCESS_WEBHOOK_URL', 'https://hooks.example.com/early-access');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    const response = await POST(request({ email: 'asha@example.com', role: 'driver' }));
    expect(response.status).toBe(502);
  });
});
