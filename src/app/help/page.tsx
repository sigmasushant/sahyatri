import type { Metadata } from 'next';
import { Siren } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { HelpCenter } from '@/components/sections/help/HelpCenter';
import { ContactSection } from '@/components/sections/shared/ContactSection';
import { PageHero } from '@/components/sections/shared/PageHero';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';
import { faq } from '@/data/faq';
import { faqJsonLd, pageMetadata } from '@/lib/seo';
import styles from './help.module.css';

export const metadata: Metadata = pageMetadata({
  title: 'Help centre',
  description: 'Answers about booking, payments, cancellations, safety, privacy and Sahyatri for companies and campuses.',
  path: '/help',
});

export default function HelpPage() {
  return (
    <>
      <PageHero
        eyebrow="Help centre"
        title="How can we help?"
        lead="Search answers about booking, payments, safety and more — or get in touch with our support team."
        path="/help"
        layout="text"
      />
      <Section tone="light" aria-labelledby="help-articles-title">
        <Container size="narrow">
          <h2 id="help-articles-title" className="visually-hidden">
            Help articles
          </h2>
          <div className={styles.emergency} role="note">
            <Siren size={20} aria-hidden="true" />
            <p>
              <strong>In an emergency, call {siteConfig.emergencyNumber} first.</strong> During a trip you can also use SOS in the app to
              alert your trusted contacts and our incident team.
            </p>
          </div>
          <HelpCenter items={faq} />
        </Container>
      </Section>
      <ContactSection
        eyebrow="Still need help?"
        title="Contact support."
        lead="Tell us what happened and how we can help. Please don’t include payment card or ID details in your message."
        topic="support"
      />
      <JsonLd data={faqJsonLd(faq)} />
    </>
  );
}
