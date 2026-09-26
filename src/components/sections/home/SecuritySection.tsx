import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import { FeatureGrid } from '@/components/ui/FeatureGrid';
import { securityFeatures } from '@/data/features';
import styles from './SecuritySection.module.css';

export function SecuritySection() {
  return (
    <Section tone="dark" surface="subtle" id="security" aria-labelledby="security-title">
      <Container>
        <SectionIntro
          eyebrow="Security & privacy"
          title="Built for trust. Engineered for privacy."
          titleId="security-title"
          lead="Security is not something we add later. It shapes how the platform is designed, built and operated — and we collect only what a safe trip needs."
        />
        <FeatureGrid items={securityFeatures} columns={3} className={styles.grid} />
      </Container>
    </Section>
  );
}
