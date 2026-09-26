import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import { SceneImage } from '@/components/three/SceneImage';
import { MatchingDemo } from './MatchingDemo';
import styles from './MatchingSection.module.css';

const factors = ['Route overlap', 'Departure timing', 'Pickup convenience', 'Travel preferences', 'Reliability'];

export function MatchingSection() {
  return (
    <Section tone="dark" id="matching" aria-labelledby="matching-title">
      <Container>
        <div className={styles.header}>
          <SectionIntro
            eyebrow="AI matching"
            title="The right ride isn’t just nearby."
            titleId="matching-title"
            lead="Our matching engine considers routes, timing, pickup convenience and preferences to find rides that fit naturally into your journey."
          />
          <ul role="list" className={styles.factors} aria-label="What a match considers">
            {factors.map((factor) => (
              <li key={factor}>{factor}</li>
            ))}
          </ul>
        </div>
        <MatchingDemo fallback={<SceneImage name="matching" compactName="matching-compact" />} />
      </Container>
    </Section>
  );
}
