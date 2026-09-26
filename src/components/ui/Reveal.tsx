import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './Reveal.module.css';

interface RevealProps {
  children: ReactNode;
  /** Position in a staggered group (0, 1, 2…): later items finish rising slightly later. */
  index?: number;
  as?: 'div' | 'li' | 'article';
  className?: string;
}

/**
 * Subtle entrance as content scrolls into view: a 16px rise and fade.
 *
 * Implemented with CSS scroll-driven animations, so it costs no JavaScript, hydration or
 * main-thread work, and runs on the compositor. Browsers without support (and people who
 * prefer reduced motion) simply see the content in place.
 */
export function Reveal({ children, index = 0, as: Tag = 'div', className }: RevealProps) {
  return (
    <Tag className={cn(styles.reveal, className)} style={{ '--reveal-index': index } as CSSProperties}>
      {children}
    </Tag>
  );
}
