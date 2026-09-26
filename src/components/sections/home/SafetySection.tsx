import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import { SceneImage } from '@/components/three/SceneImage';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { Button } from '@/components/ui/Button';
import { FeatureGrid } from '@/components/ui/FeatureGrid';
import { safetyFeatures } from '@/data/features';
import styles from './SafetySection.module.css';

export function SafetySection() {
  return (
    <Section tone="dark" id="safety" aria-labelledby="safety-title">
      <Container>
        <div className={styles.top}>
          <div className={styles.copy}>
            <SectionIntro
              eyebrow="Safety"
              title="Safety is part of the journey."
              titleId="safety-title"
              lead="Protection is built into every step: before you book, at pickup, on the road and after you arrive. Calm, visible, and always within reach."
            />
            <Button href="/safety" variant="secondary" arrow>
              How we keep trips safe
            </Button>
          </div>
          <SceneCanvas
            scene="safety"
            sceneProps={{}}
            minTier="high"
            fallback={<SceneImage name="safety" />}
            label="Illustration: a car travels a route through a city inside a soft protective field, with its trip shared live."
            className={styles.visual}
          />
        </div>
        <FeatureGrid items={safetyFeatures} columns={4} className={styles.features} />
      </Container>
    </Section>
  );
}
