import { BadgeCheck, CalendarDays, Clock, MapPin, Navigation, Search, UserRound, Users } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ProductFrame } from './ProductFrame';
import ui from './ProductUI.module.css';
import styles from './RidePreviews.module.css';

/** Step 1 — search a route. */
export function SearchPreview() {
  return (
    <ProductFrame label="Preview of the search screen: from Gurugram, Cyber City to Jaipur, tomorrow at 07:00, one passenger.">
      <span className={ui.label}>Find a ride</span>
      <div className={styles.searchStack}>
        <div className={ui.field}>
          <MapPin size={18} className={ui.fieldIcon} />
          <span className={ui.fieldText}>
            <span className={ui.fieldLabel}>From</span>
            <span className={ui.fieldValue}>Gurugram, Cyber City</span>
          </span>
        </div>
        <div className={ui.field}>
          <Navigation size={18} className={ui.fieldIcon} />
          <span className={ui.fieldText}>
            <span className={ui.fieldLabel}>To</span>
            <span className={ui.fieldValue}>Jaipur</span>
          </span>
        </div>
        <div className={styles.searchRow}>
          <div className={ui.field}>
            <CalendarDays size={18} className={ui.fieldIcon} />
            <span className={ui.fieldText}>
              <span className={ui.fieldLabel}>When</span>
              <span className={ui.fieldValue}>Tomorrow, 07:00</span>
            </span>
          </div>
          <div className={ui.field}>
            <UserRound size={18} className={ui.fieldIcon} />
            <span className={ui.fieldText}>
              <span className={ui.fieldLabel}>Seats</span>
              <span className={ui.fieldValue}>1</span>
            </span>
          </div>
        </div>
      </div>
      <span className={ui.button}>
        <Search size={16} />
        Search rides
      </span>
    </ProductFrame>
  );
}

const rides = [
  { initials: 'RV', depart: '06:40', pickup: '600 m walk', fit: 94, best: true, seats: 2 },
  { initials: 'PN', depart: '07:15', pickup: '1.1 km walk', fit: 91, best: false, seats: 3 },
  { initials: 'FQ', depart: '06:00', pickup: '1.4 km walk', fit: 86, best: false, seats: 4 },
];

/** Step 2 — compare matches, with the reason each fits. */
export function MatchListPreview({ compact = false }: { compact?: boolean }) {
  const list = compact ? rides.slice(0, 2) : rides;
  return (
    <ProductFrame label="Preview of search results: three verified drivers ranked by how well their route fits, the best at 94 percent with a 600 metre walk to pickup.">
      <div className={ui.bar}>
        <span className={ui.label}>Best matches</span>
        <span className={ui.small}>Gurugram → Jaipur</span>
      </div>
      <ul className={styles.rides}>
        {list.map((ride) => (
          <li key={ride.initials} className={cn(ui.ride, ride.best && ui.rideBest)}>
            <span className={ui.avatar}>{ride.initials}</span>
            <span>
              <span className={styles.rideTitle}>
                Departs {ride.depart}
                <BadgeCheck size={16} className={ui.checkIcon} />
              </span>
              <span className={ui.meta}>
                <span className={ui.metaItem}>
                  <MapPin size={13} /> {ride.pickup}
                </span>
                <span className={ui.metaItem}>
                  <Users size={13} /> {ride.seats} seats
                </span>
              </span>
            </span>
            <span className={ui.fit}>
              <span className={cn(ui.fitValue, ride.best && ui.fitBest)}>{ride.fit}%</span>
              <span className={ui.small}>route fit</span>
            </span>
          </li>
        ))}
      </ul>
      {!compact ? (
        <p className={styles.reason}>
          <span className={styles.reasonDot} />
          96% of your trip is on this driver’s route, and pickup is 600 m from you.
        </p>
      ) : null}
    </ProductFrame>
  );
}

/** Step 3 — travelling together. */
export function TogetherPreview() {
  return (
    <ProductFrame label="Preview of a shared trip in progress: two travellers in one car, picked up at IFFCO Chowk and heading to Jaipur, trip PIN confirmed.">
      <div className={ui.bar}>
        <span className={ui.label}>On the way</span>
        <span className={cn(ui.small, styles.eta)}>
          <Clock size={13} /> ETA 10:20
        </span>
      </div>
      <div className={styles.progress}>
        <span className={styles.progressTrack}>
          <span className={styles.progressFill} />
          <span className={styles.progressCar} />
        </span>
        <span className={styles.progressLabels}>
          <span>IFFCO Chowk</span>
          <span>Jaipur</span>
        </span>
      </div>
      <div className={styles.together}>
        <span className={styles.stack}>
          <span className={cn(ui.avatar, styles.driverAvatar)}>RV</span>
          <span className={cn(ui.avatar, styles.passengerAvatar)}>You</span>
        </span>
        <span className={ui.muted}>Two journeys, one car. Fuel and tolls shared.</span>
      </div>
      <div className={ui.divider} />
      <span className={ui.check}>
        <BadgeCheck size={18} className={ui.checkIcon} /> Trip PIN confirmed at pickup
      </span>
    </ProductFrame>
  );
}
