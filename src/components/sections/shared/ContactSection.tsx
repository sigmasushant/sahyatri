import { ContactForm } from '@/components/forms/ContactForm';
import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import type { ContactTopic } from '@/lib/validation';
import styles from './ContactSection.module.css';

interface ContactSectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  lead: string;
  topic?: ContactTopic;
}

export function ContactSection({ id = 'contact', eyebrow = 'Talk to us', title, lead, topic }: ContactSectionProps) {
  const titleId = `${id}-title`;
  return (
    <Section tone="light" surface="subtle" id={id} aria-labelledby={titleId}>
      <Container className={styles.layout}>
        <SectionIntro eyebrow={eyebrow} title={title} titleId={titleId} lead={lead} />
        <div className={styles.card}>
          <ContactForm defaultTopic={topic} />
        </div>
      </Container>
    </Section>
  );
}
