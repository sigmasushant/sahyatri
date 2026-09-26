import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from './Container';
import styles from './StatusScreen.module.css';

interface StatusScreenProps {
  code?: string;
  title: string;
  text: string;
  actions: ReactNode;
  illustration?: 'detour' | 'roadworks';
}

/** Full-height state screen used for 404, errors and other interruptions. */
export function StatusScreen({ code, title, text, actions, illustration = 'detour' }: StatusScreenProps) {
  return (
    <section data-tone="dark" className={styles.screen} aria-labelledby="status-title">
      <Container className={styles.inner}>
        <div className={styles.copy}>
          {code ? <p className={cn('text-eyebrow', styles.code)}>{code}</p> : null}
          <h1 id="status-title" className="text-h1">
            {title}
          </h1>
          <p className={cn('text-body-large', styles.text)}>{text}</p>
          <div className={styles.actions}>{actions}</div>
        </div>
        <svg viewBox="0 0 400 300" className={styles.art} aria-hidden="true" focusable="false">
          {illustration === 'detour' ? (
            <>
              <path d="M20 250 C 120 250, 150 170, 200 150 S 300 120, 330 70" className={styles.road} />
              <path d="M200 150 C 230 138, 262 150, 262 182 C 262 214, 222 222, 206 196" className={styles.detour} />
              <circle cx="206" cy="196" r="7" className={styles.you} />
              <circle cx="206" cy="196" r="18" className={styles.youHalo} />
              <circle cx="330" cy="70" r="6" className={styles.destination} />
            </>
          ) : (
            <>
              <path d="M20 220 C 110 220, 150 150, 220 150 S 330 110, 380 90" className={styles.road} />
              <path d="M150 170 l 36 -26 M168 186 l 36 -26" className={styles.barrier} />
              <circle cx="220" cy="150" r="7" className={styles.you} />
              <circle cx="220" cy="150" r="18" className={styles.youHalo} />
            </>
          )}
        </svg>
      </Container>
    </section>
  );
}
