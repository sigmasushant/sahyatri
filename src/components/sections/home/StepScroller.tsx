'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './HowItWorks.module.css';

interface StepScrollerProps {
  steps: { title: string; text: string }[];
  /** One visual per step, rendered on the server. */
  visuals: ReactNode[];
}

/**
 * Desktop: steps scroll past a sticky visual that crossfades to match the step in focus.
 * Mobile: each step carries its own visual inline.
 */
export function StepScroller({ steps, visuals }: StepScrollerProps) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.layout}>
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li
            key={step.title}
            ref={(el) => {
              refs.current[index] = el;
            }}
            data-index={index}
            className={cn(styles.step, index === active && styles.stepActive)}
          >
            <span className={styles.number} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className={cn('text-h2', styles.stepTitle)}>{step.title}</h3>
            <p className={cn('text-body-large', styles.stepText)}>{step.text}</p>
            <div className={styles.inlineVisual}>{visuals[index]}</div>
          </li>
        ))}
      </ol>
      <div className={styles.sticky} aria-hidden="true">
        <div className={styles.stage}>
          {visuals.map((visual, index) => (
            <div key={index} className={cn(styles.slide, index === active && styles.slideActive)}>
              {visual}
            </div>
          ))}
        </div>
        <div className={styles.progress}>
          {steps.map((step, index) => (
            <span key={step.title} className={cn(styles.tick, index <= active && styles.tickOn)} />
          ))}
        </div>
      </div>
    </div>
  );
}
