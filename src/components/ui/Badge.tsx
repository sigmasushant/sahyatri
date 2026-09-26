import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './Badge.module.css';

interface BadgeProps {
  variant?: 'neutral' | 'accent' | 'live' | 'outline';
  className?: string;
  children: ReactNode;
}

export function Badge({ variant = 'neutral', className, children }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[variant], className)}>
      {variant === 'live' ? <span className={styles.pulse} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
