import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './ProductUI.module.css';

interface ProductFrameProps {
  /** What the preview shows, for assistive technology (the inner UI is presentational). */
  label: string;
  caption?: string;
  className?: string;
  children: ReactNode;
}

/**
 * A stylised product surface. Previews are illustrative, simplified versions of the app,
 * so they are exposed as a single labelled image rather than as (non-working) controls.
 */
export function ProductFrame({ label, caption = 'Product preview · illustrative', className, children }: ProductFrameProps) {
  return (
    <figure className={cn(styles.figure, className)}>
      <div role="img" aria-label={label} className={styles.frame}>
        <div aria-hidden="true" className={styles.inner}>
          {children}
        </div>
      </div>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}
