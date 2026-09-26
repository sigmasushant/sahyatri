'use client';

import { AlertCircle, CircleCheck } from 'lucide-react';
import Link from 'next/link';
import { useId, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { ChoiceGroup, Honeypot, TextField } from '@/components/ui/Field';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { cn } from '@/lib/cn';
import type { EarlyAccessInput, FieldErrors } from '@/lib/validation';
import styles from './Forms.module.css';

const roles = [
  { value: 'passenger', label: 'Find rides' },
  { value: 'driver', label: 'Offer rides' },
  { value: 'both', label: 'Both' },
] as const;

const fieldOrder: (keyof EarlyAccessInput)[] = ['email', 'role', 'city'];

export function EarlyAccessForm({ submitLabel = 'Join the network', className }: { submitLabel?: string; className?: string }) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState({ email: '', role: '', city: '', website: '' });
  const [errors, setErrors] = useState<FieldErrors<EarlyAccessInput>>({});
  const { status, message, submit } = useFormSubmit('/api/early-access');

  const set = (key: keyof typeof values) => (value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key as keyof EarlyAccessInput]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const focusFirstError = (next: FieldErrors<EarlyAccessInput>) => {
    const first = fieldOrder.find((key) => next[key]);
    if (!first) return;
    const target =
      first === 'role'
        ? formRef.current?.querySelector<HTMLInputElement>('input[name="role"]')
        : formRef.current?.querySelector<HTMLInputElement>(`#${CSS.escape(`${id}-${first}`)}`);
    target?.focus();
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // The schema (and Zod) load on first submit, keeping them out of the initial page bundle.
    const { earlyAccessSchema, fieldErrors } = await import('@/lib/validation');
    const parsed = earlyAccessSchema.safeParse({
      email: values.email,
      role: values.role || undefined,
      city: values.city || undefined,
      website: values.website || undefined,
    });
    if (!parsed.success) {
      const next = fieldErrors(parsed.error);
      setErrors(next);
      focusFirstError(next);
      return;
    }
    setErrors({});
    const result = await submit(parsed.data);
    if (result.fields) {
      setErrors(result.fields as FieldErrors<EarlyAccessInput>);
      focusFirstError(result.fields as FieldErrors<EarlyAccessInput>);
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className={cn(styles.success, className)}>
        <CircleCheck size={28} aria-hidden="true" className={styles.successIcon} />
        <div>
          <p className={styles.successTitle}>You’re on the list.</p>
          <p className={styles.successText}>
            We’ll email {values.email} when Sahyatri opens near you. One email, no spam.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className={cn(styles.form, className)} aria-describedby={message ? `${id}-status` : undefined}>
      <div className={styles.row}>
        <TextField
          id={`${id}-email`}
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => set('email')(e.target.value)}
          error={errors.email}
          className={styles.grow}
        />
        <TextField
          id={`${id}-city`}
          label="City"
          optional
          name="city"
          autoComplete="address-level2"
          value={values.city}
          onChange={(e) => set('city')(e.target.value)}
          error={errors.city}
        />
      </div>
      <ChoiceGroup name="role" legend="I want to…" options={roles} value={values.role} onChange={set('role')} error={errors.role} />
      <Honeypot value={values.website} onChange={set('website')} />
      <div className={styles.actions}>
        <Button type="submit" size="lg" arrow disabled={status === 'submitting'} aria-disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Joining…' : submitLabel}
        </Button>
        <p className={styles.fineprint}>
          We’ll only use your email to tell you about launch. See our <Link href="/privacy">privacy policy</Link>.
        </p>
      </div>
      <div id={`${id}-status`} role="alert" className={styles.status}>
        {status === 'error' && message ? (
          <p className={styles.statusError}>
            <AlertCircle size={18} aria-hidden="true" />
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
