import { cn } from '@/lib/cn';
import styles from './Logo.module.css';

/**
 * Brand mark: one route joining an origin and a destination, set in the lime app-icon tile.
 * The same glyph is the app icon, favicon and social avatar.
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={cn(styles.mark, className)}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="48" height="48" rx="14" className={styles.tile} />
      <path
        d="M13 34c0-6.5 4.5-8.6 11-9.6S35 21 35 14"
        fill="none"
        className={styles.route}
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <circle cx="13" cy="34.5" r="4.4" className={styles.dot} />
      <circle cx="35" cy="13.5" r="4.4" className={styles.dot} />
    </svg>
  );
}

export function Logo({ className, size = 30 }: { className?: string; size?: number }) {
  return (
    <span className={cn(styles.logo, className)}>
      <LogoMark size={size} />
      <span className={styles.wordmark}>sahyatri</span>
    </span>
  );
}
