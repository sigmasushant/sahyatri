export interface Testimonial {
  quote: string;
  name: string;
  /** e.g. "Daily commuter, Gurugram" — only with the person's written consent. */
  context: string;
  role: 'driver' | 'passenger' | 'organisation';
}

/**
 * Real, consented testimonials only. Leave this empty until they exist:
 * the section renders an honest "stories are coming" state instead.
 */
export const testimonials: Testimonial[] = [];
