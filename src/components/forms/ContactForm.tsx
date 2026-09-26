'use client';

import { AlertCircle, CircleCheck } from 'lucide-react';
import { useId, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Honeypot, SelectField, TextArea, TextField } from '@/components/ui/Field';
import { siteConfig } from '@/config/site';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { cn } from '@/lib/cn';
import type { ContactInput, ContactTopic, FieldErrors } from '@/lib/validation';
import styles from './Forms.module.css';

/** Kept in sync with `contactTopics` in lib/validation (asserted by a unit test). */
export const topicOptions: readonly { value: ContactTopic; label: string }[] = [
  { value: 'general', label: 'General question' },
  { value: 'business', label: 'Business mobility' },
  { value: 'universities', label: 'Universities' },
  { value: 'support', label: 'Help with a trip or account' },
  { value: 'safety', label: 'Safety concern' },
  { value: 'careers', label: 'Careers' },
  { value: 'press', label: 'Press' },
];

const fieldOrder: (keyof ContactInput)[] = ['name', 'email', 'organisation', 'topic', 'message'];

export function ContactForm({ defaultTopic = '', className }: { defaultTopic?: ContactTopic | ''; className?: string }) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState({ name: '', email: '', organisation: '', topic: defaultTopic as string, message: '', website: '' });
  const [errors, setErrors] = useState<FieldErrors<ContactInput>>({});
  const { status, message, submit } = useFormSubmit('/api/contact');

  const update = (key: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key as keyof ContactInput]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const focusFirstError = (next: FieldErrors<ContactInput>) => {
    const first = fieldOrder.find((key) => next[key]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${id}-${first}`)}`)?.focus();
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { contactSchema, fieldErrors } = await import('@/lib/validation');
    const parsed = contactSchema.safeParse({
      ...values,
      organisation: values.organisation || undefined,
      topic: values.topic || undefined,
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
      setErrors(result.fields as FieldErrors<ContactInput>);
      focusFirstError(result.fields as FieldErrors<ContactInput>);
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className={cn(styles.success, className)}>
        <CircleCheck size={28} aria-hidden="true" className={styles.successIcon} />
        <div>
          <p className={styles.successTitle}>Thanks, {values.name.split(' ')[0]}. Your message is with us.</p>
          <p className={styles.successText}>We’ll reply to {values.email}. If this is about a safety emergency, please call {siteConfig.emergencyNumber} now.</p>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className={cn(styles.form, className)}>
      <div className={styles.row}>
        <TextField
          id={`${id}-name`}
          label="Your name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => update('name', e.target.value)}
          error={errors.name}
          className={styles.grow}
        />
        <TextField
          id={`${id}-email`}
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={(e) => update('email', e.target.value)}
          error={errors.email}
          className={styles.grow}
        />
      </div>
      <div className={styles.row}>
        <TextField
          id={`${id}-organisation`}
          label="Company or university"
          optional
          name="organisation"
          autoComplete="organization"
          value={values.organisation}
          onChange={(e) => update('organisation', e.target.value)}
          error={errors.organisation}
          className={styles.grow}
        />
        <SelectField
          id={`${id}-topic`}
          label="Topic"
          name="topic"
          placeholder="Choose a topic"
          options={topicOptions}
          value={values.topic}
          onChange={(e) => update('topic', e.target.value)}
          error={errors.topic}
          className={styles.grow}
        />
      </div>
      <TextArea
        id={`${id}-message`}
        label="Message"
        name="message"
        hint="A few sentences is perfect. Please don’t include payment or ID details."
        value={values.message}
        onChange={(e) => update('message', e.target.value)}
        error={errors.message}
      />
      <Honeypot value={values.website} onChange={(value) => update('website', value)} />
      <div className={styles.actions}>
        <Button type="submit" size="lg" arrow disabled={status === 'submitting'} aria-disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </Button>
      </div>
      <div role="alert" className={styles.status}>
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
