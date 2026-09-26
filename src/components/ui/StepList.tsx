import { cn } from '@/lib/cn';
import type { Feature } from './FeatureGrid';
import { Icon } from './Icon';
import styles from './StepList.module.css';

/** A compact numbered sequence (publish → choose → meet …) with icons. */
export function StepList({ items, className }: { items: Feature[]; className?: string }) {
  return (
    <ol className={cn(styles.list, className)}>
      {items.map((item, index) => (
        <li key={item.title} className={styles.item}>
          <span className={styles.marker} aria-hidden="true">
            {item.icon ? <Icon name={item.icon} size={18} /> : String(index + 1)}
          </span>
          <div>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.description}>{item.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
