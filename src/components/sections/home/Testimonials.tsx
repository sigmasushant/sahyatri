import { Quote } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { ctaLinks } from '@/data/navigation';
import { testimonials as defaultTestimonials, type Testimonial } from '@/data/testimonials';
import styles from './Testimonials.module.css';

export function Testimonials({ items = defaultTestimonials }: { items?: Testimonial[] }) {
  return (
    <Section tone="light" id="stories" aria-labelledby="stories-title">
      <Container>
        <SectionIntro eyebrow="Stories" title="Journeys worth sharing." titleId="stories-title" />
        {items.length > 0 ? (
          <ul role="list" className={styles.grid}>
            {items.map((item, index) => (
              <Reveal as="li" key={item.name} index={index % 3}>
                <figure className={styles.card}>
                  <Quote size={24} aria-hidden="true" className={styles.mark} />
                  <blockquote className={styles.quote}>
                    <p>{item.quote}</p>
                  </blockquote>
                  <figcaption className={styles.person}>
                    <span className={styles.name}>{item.name}</span>
                    <span className={styles.context}>{item.context}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className={styles.empty} data-testid="stories-empty">
            <p className="text-h3">We are collecting stories from our first riders and drivers.</p>
            <p className={styles.emptyText}>
              We will only ever publish real experiences, shared with permission. Join early access and yours
              could be one of the first.
            </p>
            <Button href={ctaLinks.earlyAccess.href} variant="secondary" arrow>
              {ctaLinks.earlyAccess.label}
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}
