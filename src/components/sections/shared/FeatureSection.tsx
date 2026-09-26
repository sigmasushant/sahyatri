import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import type { ToneName } from '@/design-system/tokens';
import { FeatureGrid, type Feature } from '@/components/ui/FeatureGrid';
import styles from './FeatureSection.module.css';

interface FeatureSectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  features?: Feature[];
  columns?: 2 | 3 | 4;
  variant?: 'plain' | 'card';
  tone?: ToneName;
  surface?: 'default' | 'subtle';
  children?: ReactNode;
}

/** A headed section with a feature grid and/or custom content beneath the intro. */
export function FeatureSection({
  id,
  eyebrow,
  title,
  lead,
  features,
  columns = 3,
  variant = 'plain',
  tone = 'light',
  surface = 'default',
  children,
}: FeatureSectionProps) {
  const titleId = `${id}-title`;
  return (
    <Section tone={tone} surface={surface} id={id} aria-labelledby={titleId}>
      <Container>
        <SectionIntro eyebrow={eyebrow} title={title} titleId={titleId} lead={lead} />
        {features ? <FeatureGrid items={features} columns={columns} variant={variant} className={styles.body} /> : null}
        {children ? <div className={styles.body}>{children}</div> : null}
      </Container>
    </Section>
  );
}
