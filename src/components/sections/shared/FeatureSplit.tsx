import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import type { ToneName } from '@/design-system/tokens';
import { Button } from '@/components/ui/Button';
import { FeatureGrid, type Feature } from '@/components/ui/FeatureGrid';
import { StepList } from '@/components/ui/StepList';
import { cn } from '@/lib/cn';
import styles from './FeatureSplit.module.css';

interface FeatureSplitProps {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  /** Rendered as a two-column feature grid. */
  features?: Feature[];
  /** Rendered as a numbered sequence. */
  steps?: Feature[];
  cta?: { label: string; href: string };
  visual: ReactNode;
  /** Put the visual on the left on wide screens. */
  reverse?: boolean;
  tone?: ToneName;
  surface?: 'default' | 'subtle';
  children?: ReactNode;
}

/** Copy, features and a call to action beside a visual. The workhorse layout for product stories. */
export function FeatureSplit({
  id,
  eyebrow,
  title,
  lead,
  features,
  steps,
  cta,
  visual,
  reverse,
  tone = 'light',
  surface = 'default',
  children,
}: FeatureSplitProps) {
  const titleId = `${id}-title`;
  return (
    <Section tone={tone} surface={surface} id={id} aria-labelledby={titleId}>
      <Container className={cn(styles.layout, reverse && styles.reverse)}>
        <div className={styles.copy}>
          <SectionIntro eyebrow={eyebrow} title={title} titleId={titleId} lead={lead} />
          {features ? <FeatureGrid items={features} columns={2} className={styles.features} /> : null}
          {steps ? <StepList items={steps} /> : null}
          {children}
          {cta ? (
            <Button href={cta.href} variant="secondary" arrow>
              {cta.label}
            </Button>
          ) : null}
        </div>
        <div className={styles.visual}>{visual}</div>
      </Container>
    </Section>
  );
}
