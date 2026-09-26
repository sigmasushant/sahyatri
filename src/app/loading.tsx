import styles from './loading.module.css';

/** Route-level loading state: a short route drawing itself. Most pages are static and never show it. */
export default function Loading() {
  return (
    <div data-tone="dark" className={styles.screen} role="status">
      <svg viewBox="0 0 120 40" className={styles.route} aria-hidden="true" focusable="false">
        <path d="M8 30 C 34 30, 44 10, 60 10 S 90 26, 112 12" className={styles.track} />
        <path d="M8 30 C 34 30, 44 10, 60 10 S 90 26, 112 12" className={styles.progress} pathLength={1} />
        <circle cx="8" cy="30" r="4" className={styles.dot} />
        <circle cx="112" cy="12" r="4" className={styles.dotEnd} />
      </svg>
      <span className="visually-hidden">Loading</span>
    </div>
  );
}
