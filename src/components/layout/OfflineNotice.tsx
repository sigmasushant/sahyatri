'use client';

import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import styles from './OfflineNotice.module.css';

/** Offline state: a calm, non-blocking notice. Everything already loaded keeps working. */
export function OfflineNotice() {
  const online = useOnlineStatus();
  return (
    <div role="status" aria-live="polite" className={styles.region}>
      {online ? null : (
        <div data-tone="dark" className={styles.notice}>
          <WifiOff size={18} aria-hidden="true" />
          <span>You’re offline. Pages you’ve opened still work; forms will send once you’re back.</span>
        </div>
      )}
    </div>
  );
}
