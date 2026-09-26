import { topicOptions } from '@/components/forms/ContactForm';
import { contactSchema, contactTopics, earlyAccessSchema, fieldErrors } from '../validation';

describe('earlyAccessSchema', () => {
  it('accepts a valid signup and trims input', () => {
    const result = earlyAccessSchema.safeParse({ email: '  asha@example.com ', role: 'both', city: ' Jaipur ' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ email: 'asha@example.com', role: 'both', city: 'Jaipur' });
  });

  it('explains every problem in plain language', () => {
    const result = earlyAccessSchema.safeParse({ email: 'not-an-email', role: 'pilot' });
    expect(result.success).toBe(false);
    const errors = fieldErrors(result.error!);
    expect(errors.email).toMatch(/valid email/i);
    expect(errors.role).toMatch(/choose how you plan/i);
  });

  it('asks for an email when it is missing', () => {
    const result = earlyAccessSchema.safeParse({ email: '', role: 'driver' });
    expect(fieldErrors(result.error!).email).toBe('Enter your email address.');
  });

  it('does not reveal the honeypot through validation errors', () => {
    expect(earlyAccessSchema.safeParse({ email: 'a@b.co', role: 'driver', website: 'spam' }).success).toBe(true);
  });
});

describe('contactSchema', () => {
  const valid = { name: 'Ravi', email: 'ravi@example.com', topic: 'business', message: 'We would like to discuss a pilot for our Gurugram office.' };

  it('accepts a complete message', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('requires a meaningful message and a known topic', () => {
    const result = contactSchema.safeParse({ ...valid, topic: 'other', message: 'hi' });
    const errors = fieldErrors(result.error!);
    expect(errors.topic).toBeDefined();
    expect(errors.message).toMatch(/at least 20/);
  });

  it('keeps the client topic list in sync with the server schema', () => {
    expect(topicOptions).toEqual(contactTopics);
  });
});
