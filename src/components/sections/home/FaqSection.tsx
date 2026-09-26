import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import { JsonLd } from '@/components/seo/JsonLd';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { faq as allFaq, type FaqItem } from '@/data/faq';
import { faqJsonLd } from '@/lib/seo';
import styles from './FaqSection.module.css';

interface FaqSectionProps {
  items?: FaqItem[];
  title?: string;
  /** Emit FAQPage structured data (once per page). */
  structuredData?: boolean;
}

export function FaqSection({ items = allFaq, title = 'Questions, answered.', structuredData = true }: FaqSectionProps) {
  return (
    <Section tone="light" id="faq" aria-labelledby="faq-title">
      <Container className={styles.layout}>
        <div className={styles.intro}>
          <SectionIntro eyebrow="FAQ" title={title} titleId="faq-title" />
          <p className={styles.more}>Can’t find what you’re looking for?</p>
          <Button href="/help" variant="secondary" arrow>
            Visit the help centre
          </Button>
        </div>
        <Accordion items={items} />
      </Container>
      {structuredData ? <JsonLd data={faqJsonLd(items)} /> : null}
    </Section>
  );
}
