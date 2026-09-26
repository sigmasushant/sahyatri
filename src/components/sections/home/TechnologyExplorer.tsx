'use client';

import { useState, type ReactNode } from 'react';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import type { TechnologyMode } from '@/components/three/lib/layouts';
import { cn } from '@/lib/cn';
import styles from './TechnologySection.module.css';

export interface ExplorerItem {
  mode: TechnologyMode;
  title: string;
  description: string;
  /** Rendered on the server, so the icon set never ships in this client bundle. */
  icon: ReactNode;
}

export function TechnologyExplorer({ items, fallback }: { items: ExplorerItem[]; fallback: ReactNode }) {
  const [active, setActive] = useState(0);
  const current = items[active]!;

  return (
    <div className={styles.layout}>
      <ul role="list" className={styles.cards}>
        {items.map((item, index) => (
          <li key={item.mode}>
            <button
              type="button"
              className={cn(styles.card, index === active && styles.cardActive)}
              aria-pressed={index === active}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
            >
              <span className={styles.cardIcon}>
                {item.icon}
              </span>
              <span className={styles.cardBody}>
                <span className={styles.cardTitle}>{item.title}</span>
                <span className={styles.cardText}>{item.description}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.stage}>
        <SceneCanvas
          scene="technology"
          sceneProps={{ mode: current.mode }}
          minTier="high"
          fallback={fallback}
          label="Abstract particle visualisation that re-forms for each technology: merging streams for matching, rings for verification, a shielded route for safety, traffic lanes for real-time mobility and an isolated anomaly for fraud protection."
          className={styles.visual}
        >
          <p className={styles.stageLabel}>
            <span className={styles.stageIndex}>{String(active + 1).padStart(2, '0')}</span>
            {current.title}
          </p>
        </SceneCanvas>
      </div>
    </div>
  );
}
