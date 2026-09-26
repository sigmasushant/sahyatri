import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import { SceneImage } from '@/components/three/SceneImage';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { Button } from '@/components/ui/Button';
import { StepList } from '@/components/ui/StepList';
import { MatchListPreview } from '@/components/visuals/RidePreviews';
import { driverSteps, passengerSteps } from '@/data/features';
import { ctaLinks } from '@/data/navigation';
import styles from './AudienceSplit.module.css';

export function AudienceSplit() {
  return (
    <Section tone="light" id="drivers-and-passengers" aria-label="For drivers and passengers">
      <Container className={styles.stack}>
        <article className={styles.row} aria-labelledby="drivers-title">
          <div className={styles.copy}>
            <SectionIntro
              eyebrow="For drivers"
              title="Turn empty seats into shared journeys."
              titleId="drivers-title"
              lead="You are making the trip anyway. Offer the seats you are not using to verified people going the same way, and share what it costs."
            />
            <StepList items={driverSteps} />
            <Button href={ctaLinks.offerRide.href} arrow>
              {ctaLinks.offerRide.label}
            </Button>
          </div>
          <div data-tone="dark" className={styles.visualPanel}>
            <SceneCanvas
              scene="seats"
              sceneProps={{}}
              minTier="high"
              fallback={<SceneImage name="seats" />}
              label="Illustration: a car on its published route with three empty seats, filled one by one by nearby matched travellers."
              className={styles.visual}
            />
          </div>
        </article>

        <article className={`${styles.row} ${styles.reverse}`} aria-labelledby="passengers-title">
          <div className={styles.copy}>
            <SectionIntro
              eyebrow="For passengers"
              title="Your destination. A smarter way to get there."
              titleId="passengers-title"
              lead="Door-to-door convenience without the door-to-door price: ride with verified drivers who are already heading your way."
            />
            <StepList items={passengerSteps} />
            <Button href={ctaLinks.findRide.href} arrow>
              {ctaLinks.findRide.label}
            </Button>
          </div>
          <div className={styles.previewPanel}>
            <MatchListPreview />
          </div>
        </article>
      </Container>
    </Section>
  );
}
