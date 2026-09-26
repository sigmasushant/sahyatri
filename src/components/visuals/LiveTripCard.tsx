import { BadgeCheck, Share2, Siren } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ProductFrame } from './ProductFrame';
import ui from './ProductUI.module.css';
import styles from './LiveTripCard.module.css';

const stops = [
  { place: 'Delhi', detail: 'Departed 07:05', state: 'done' },
  { place: 'Gurgaon', detail: 'Picked up 07:40', state: 'done' },
  { place: 'Neemrana', detail: 'Next stop · ~08:55', state: 'next' },
  { place: 'Jaipur', detail: 'Arriving ~10:20', state: 'upcoming' },
] as const;

const checks = ['Driver verified', 'Vehicle verified', 'Trip PIN confirmed'];

export function LiveTripCard() {
  return (
    <ProductFrame
      className={styles.card}
      label="Preview of the live trip screen: Delhi to Jaipur via Gurgaon and Neemrana, arriving in about 2 hours 14 minutes. Driver verified, vehicle verified and trip PIN confirmed."
    >
      <div className={ui.bar}>
        <span className={styles.live}>
          <span className={styles.liveDot} />
          Live trip
        </span>
        <span className={styles.eta}>
          <span className={ui.small}>ETA</span>
          <span className={cn('tabular', styles.etaValue)}>2h 14m</span>
        </span>
      </div>

      <div className={styles.route}>
        <span className={styles.track}>
          <span className={styles.trackFill} />
          <span className={styles.vehicle} />
        </span>
        <ol className={styles.stops}>
          {stops.map((stop) => (
            <li key={stop.place} className={cn(styles.stop, styles[stop.state])}>
              <span className={styles.node} />
              <span className={styles.place}>{stop.place}</span>
              <span className={styles.detail}>{stop.detail}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.protected}>
        <span className={styles.protectedTitle}>Trip protected</span>
        {checks.map((check) => (
          <span key={check} className={ui.check}>
            <BadgeCheck size={18} className={ui.checkIcon} />
            {check}
          </span>
        ))}
      </div>

      <div className={styles.actions}>
        <span className={styles.share}>
          <Share2 size={16} /> Share trip
        </span>
        <span className={styles.sos}>
          <Siren size={16} /> SOS
        </span>
      </div>
    </ProductFrame>
  );
}
