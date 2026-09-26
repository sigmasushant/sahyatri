import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import { SceneImage } from '@/components/three/SceneImage';
import { Icon } from '@/components/ui/Icon';
import { technologies } from '@/data/features';
import { TechnologyExplorer } from './TechnologyExplorer';
import styles from './TechnologySection.module.css';

export function TechnologySection({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) {
  return (
    <Section tone="dark" id="technology" aria-labelledby="technology-title">
      <Container>
        <div className={styles.header}>
          <SectionIntro
            eyebrow="Technology"
            title="Intelligence behind every journey."
            titleId="technology-title"
            as={headingLevel}
            lead="Five systems work together on every trip. Hover or focus each one to see how it shapes the network."
          />
        </div>
        <TechnologyExplorer
          items={technologies.map(({ icon, ...item }) => ({ ...item, icon: <Icon name={icon} size={22} /> }))}
          fallback={<SceneImage name="technology" />}
        />
      </Container>
    </Section>
  );
}
