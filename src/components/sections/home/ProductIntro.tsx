import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import styles from './ProductIntro.module.css';

const pillars = [
  { name: 'Trust', text: 'Every person and vehicle is verified, and every trip builds a visible reputation.' },
  { name: 'Match', text: 'Rides are matched on route, timing and pickup convenience — not just distance.' },
  { name: 'Safety', text: 'Trip PIN, live sharing, route monitoring and SOS travel with you.' },
  { name: 'Reliability', text: 'Clear cancellation rules and reliability scores keep plans dependable.' },
  { name: 'Intelligence', text: 'Matching learns what fits real journeys, and explains why a ride fits.' },
  { name: 'Community', text: 'Private networks for companies, campuses and regular commuters.' },
];

export function ProductIntro() {
  return (
    <Section tone="light" id="product" aria-labelledby="product-title">
      <Container className={styles.layout}>
        <div className={styles.intro}>
          <p className={cn('text-eyebrow', styles.eyebrow)}>The platform</p>
          <h2 id="product-title" className="text-h1">
            Better journeys begin with better connections.
          </h2>
          <p className={cn('text-body-large', styles.lead)}>
            Sahyatri connects drivers who have empty seats with people heading the same way — daily commuters,
            students, teams and travellers between cities — and wraps every trip in verification and live safety.
          </p>
        </div>
        <ol className={styles.pillars}>
          {pillars.map((pillar, index) => (
            <Reveal as="li" key={pillar.name} index={index % 2} className={styles.pillar}>
              <span className={styles.index} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.name}>{pillar.name}</h3>
              <p className={styles.text}>{pillar.text}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
