import { z } from 'zod';

/**
 * Form schemas shared by the browser (instant, accessible feedback) and the API routes
 * (the authority). Messages are written for people, not developers.
 */

const email = z
  .string({ error: 'Enter your email address.' })
  .trim()
  .min(1, { error: 'Enter your email address.' })
  .max(254, { error: 'That email address is too long.' })
  .pipe(z.email({ error: 'Enter a valid email address, like name@example.com.' }));

/**
 * Honeypot: hidden from people, often filled by bots. Any value is accepted here so bots get no
 * signal; the API silently drops submissions where it is filled in.
 */
const honeypot = z.string().max(500).optional();

export const earlyAccessRoles = ['passenger', 'driver', 'both'] as const;

export const earlyAccessSchema = z.object({
  email,
  role: z.enum(earlyAccessRoles, { error: 'Choose how you plan to use Sahyatri.' }),
  city: z.string().trim().max(80, { error: 'Keep your city under 80 characters.' }).optional(),
  website: honeypot,
});

export type EarlyAccessInput = z.infer<typeof earlyAccessSchema>;

export const contactTopics = [
  { value: 'general', label: 'General question' },
  { value: 'business', label: 'Business mobility' },
  { value: 'universities', label: 'Universities' },
  { value: 'support', label: 'Help with a trip or account' },
  { value: 'safety', label: 'Safety concern' },
  { value: 'careers', label: 'Careers' },
  { value: 'press', label: 'Press' },
] as const;

export type ContactTopic = (typeof contactTopics)[number]['value'];

export const contactSchema = z.object({
  name: z
    .string({ error: 'Enter your name.' })
    .trim()
    .min(1, { error: 'Enter your name.' })
    .max(100, { error: 'Keep your name under 100 characters.' }),
  email,
  organisation: z.string().trim().max(120, { error: 'Keep this under 120 characters.' }).optional(),
  topic: z.enum(contactTopics.map((t) => t.value) as [ContactTopic, ...ContactTopic[]], {
    error: 'Choose what your message is about.',
  }),
  message: z
    .string({ error: 'Write a short message.' })
    .trim()
    .min(20, { error: 'Tell us a little more — at least 20 characters.' })
    .max(2000, { error: 'Keep your message under 2,000 characters.' }),
  website: honeypot,
});

export type ContactInput = z.infer<typeof contactSchema>;

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** First error message per field, for inline display. */
export function fieldErrors<T>(error: z.ZodError<T>): FieldErrors<T> {
  const flattened = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  return Object.fromEntries(
    Object.entries(flattened).flatMap(([key, messages]) => (messages?.[0] ? [[key, messages[0]]] : [])),
  ) as FieldErrors<T>;
}
