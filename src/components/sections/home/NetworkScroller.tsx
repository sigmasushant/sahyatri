'use client';

import { useRef, type ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { cn } from '@/lib/cn';
import styles from './NetworkSection.module.css';

const stages = ['1 journey', '5 cities', '20 cities', 'A network'];

/**
 * Scroll-driven growth: the section is tall and its stage is sticky, so scrolling grows the
 * network from one journey to many. With reduced motion it is a normal-height static section.
 */
export function NetworkScroller({ fallback }: { fallback: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { progress, step } = useScrollProgress(ref, stages.length, !reducedMotion);

  return (
    <div ref={ref} className={styles.track}>
      <div className={styles.stage}>
        <SceneCanvas
          scene="network"
          sceneProps={{ progress }}
          fallback={fallback}
          label="Abstract illustration of a network growing from a single journey to five places, twenty places and finally a connected network with journeys lighting up across it."
          className={styles.visual}
        />
        <div className={styles.vignette} aria-hidden="true" />
        <Container className={styles.content}>
          <div className={styles.copy}>
            <p className={cn('text-eyebrow', styles.eyebrow)}>The network</p>
            <h2 id="network-title" className="text-h1">
              Every empty seat can connect two journeys.
            </h2>
            <p className={cn('text-body-large', styles.lead)}>
              As more people share the road, the network becomes more useful for everyone.
            </p>
          </div>
          <div className={styles.bottom}>
            <ol className={styles.stages} aria-label="How the network grows">
              {stages.map((stage, index) => (
                <li
                  key={stage}
                  className={cn(styles.stageItem, index <= step && styles.reached, index === step && styles.current)}
                  aria-current={index === step ? 'step' : undefined}
                >
                  <span className={styles.stageBar} aria-hidden="true" />
                  <span className={styles.stageLabel}>{stage}</span>
                </li>
              ))}
            </ol>
            <p className={styles.caption}>Abstract illustration — not a map of current service areas.</p>
          </div>
        </Container>
      </div>
    </div>
  );
}
