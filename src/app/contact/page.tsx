import type { Metadata } from 'next';
import { ContactSection } from '@/components/sections/shared/ContactSection';
import { PageHero } from '@/components/sections/shared/PageHero';
import { siteConfig } from '@/config/site';
import { pageMetadata } from '@/lib/seo';
import { contactTopics, type ContactTopic } from '@/lib/validation';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description: 'Get in touch with Sahyatri about business mobility, universities, support, safety, careers or press.',
  path: '/contact',
});

const isTopic = (value: unknown): value is ContactTopic =>
  typeof value === 'string' && contactTopics.some((topic) => topic.value === value);

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string | string[] }> }) {
  const { topic } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s talk."
        lead="Questions, partnerships, press or support — send us a message and the right person will reply."
        path="/contact"
        layout="text"
      />
      <ContactSection
        eyebrow="Send a message"
        title="How can we help?"
        lead={`For a safety emergency, call ${siteConfig.emergencyNumber} first. For anything else, send us a message and we will reply by email.`}
        topic={isTopic(topic) ? topic : undefined}
      />
    </>
  );
}
