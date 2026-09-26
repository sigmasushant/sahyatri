import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import { FeatureGrid } from '@/components/ui/FeatureGrid';
import { LiveTripCard } from '@/components/visuals/LiveTripCard';
import styles from './LiveTripSection.module.css';

export function LiveTripSection() {
  return (
    <Section tone="light" surface="subtle" id="live-trip" aria-labelledby="live-title">
      <Container className={styles.layout}>
        <div className={styles.copy}>
          <SectionIntro
            eyebrow="Real-time trips"
            title="Every trip, visible from pickup to drop-off."
            titleId="live-title"
            lead="See where your ride is, when you will arrive and that everything is on track — and let the people who matter see it too."
          />
          <FeatureGrid
            columns={2}
            headingLevel="h3"
            items={[
              { icon: 'map-pinned', title: 'Live location & ETA', description: 'Real-time position and arrival estimates, updated as you move.' },
              { icon: 'key', title: 'Trip PIN at pickup', description: 'The trip starts only when the PIN matches.' },
              { icon: 'radar', title: 'Deviation alerts', description: 'Unexpected detours or long stops trigger a check-in.' },
              { icon: 'share', title: 'One-tap sharing', description: 'A live link for family or friends that expires on arrival.' },
            ]}
          />
        </div>
        <LiveTripCard />
      </Container>
    </Section>
  );
}
