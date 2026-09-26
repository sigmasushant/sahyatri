'use client';

import { useState } from 'react';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

interface SubmitResult {
  ok: boolean;
  fields?: Record<string, string>;
}

const MESSAGES = {
  offline: 'You appear to be offline. Check your connection and try again — nothing was sent.',
  network: 'We couldn’t reach our servers. Check your connection and try again.',
  validation: 'Please check the highlighted fields.',
  server: 'Something went wrong on our side. Please try again in a moment.',
};

/** POST JSON to a form endpoint with distinct offline, network, validation and server states. */
export function useFormSubmit(endpoint: string) {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [message, setMessage] = useState('');

  async function submit(data: unknown): Promise<SubmitResult> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setStatus('error');
      setMessage(MESSAGES.offline);
      return { ok: false };
    }
    setStatus('submitting');
    setMessage('');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setStatus('success');
        return { ok: true };
      }
      if (response.status === 422) {
        const body = (await response.json().catch(() => ({}))) as { fields?: Record<string, string> };
        setStatus('error');
        setMessage(MESSAGES.validation);
        return { ok: false, fields: body.fields };
      }
      setStatus('error');
      setMessage(MESSAGES.server);
      return { ok: false };
    } catch {
      setStatus('error');
      setMessage(MESSAGES.network);
      return { ok: false };
    }
  }

  return { status, message, submit };
}
