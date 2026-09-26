import type { z } from 'zod';
import { fieldErrors } from './validation';

const MAX_BODY_BYTES = 10_000;

/** Browsers send Origin on cross-site POSTs; reject any that is not this site (behind proxies too). */
function isSameHost(origin: string, request: Request): boolean {
  try {
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? new URL(request.url).host;
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

/**
 * A hardened JSON form endpoint:
 *   - same-origin requests only, JSON only, small bodies only
 *   - validation with the same Zod schema the browser uses
 *   - honeypot submissions are accepted silently and dropped
 *   - valid submissions are forwarded server-side to a webhook from the environment
 *     (never exposed to the client). Without one configured, they are validated and discarded.
 */
export function createFormHandler<S extends z.ZodType<Record<string, unknown>>>(schema: S, webhookEnv: string) {
  return async function POST(request: Request): Promise<Response> {
    const origin = request.headers.get('origin');
    if (origin && !isSameHost(origin, request)) {
      return json({ error: 'forbidden' }, 403);
    }
    if (!(request.headers.get('content-type') ?? '').includes('application/json')) {
      return json({ error: 'unsupported_media_type' }, 415);
    }

    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return json({ error: 'payload_too_large' }, 413);

    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return json({ error: 'invalid_json' }, 400);
    }

    const result = schema.safeParse(body);
    if (!result.success) {
      return json({ error: 'validation_failed', fields: fieldErrors(result.error) }, 422);
    }

    const { website, ...data } = result.data as Record<string, unknown> & { website?: string };
    if (website) return json({ ok: true }, 202);

    const webhook = process.env[webhookEnv];
    if (webhook) {
      try {
        const response = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, receivedAt: new Date().toISOString() }),
          signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) return json({ error: 'upstream_failed' }, 502);
      } catch {
        return json({ error: 'upstream_unreachable' }, 502);
      }
    }

    return json({ ok: true }, 202);
  };
}
