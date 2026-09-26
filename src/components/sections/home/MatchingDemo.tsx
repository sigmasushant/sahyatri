'use client';

import { RotateCcw } from 'lucide-react';
import { useCallback, useState, type ReactNode } from 'react';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import type { MatchingPhase } from '@/components/three/lib/layouts';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import styles from './MatchingSection.module.css';

const steps: { phase: MatchingPhase; label: string }[] = [
  { phase: 'searching', label: 'Passenger searches Gurgaon → Jaipur' },
  { phase: 'scanning', label: 'Evaluating drivers heading that way' },
  { phase: 'selecting', label: 'Selecting the route that fits best' },
  { phase: 'matching', label: 'Placing the pickup on the driver’s route' },
  { phase: 'matched', label: 'Match found' },
];

/** Illustrative values for this demo — clearly labelled in the UI. */
const scores = [
  { label: 'Route match', value: 94 },
  { label: 'Time match', value: 91 },
  { label: 'Pickup convenience', value: 88 },
];

export function MatchingDemo({ fallback }: { fallback: ReactNode }) {
  // Until the live scene runs (or without WebGL), show the finished match.
  const [phase, setPhase] = useState<MatchingPhase>('matched');
  const [live, setLive] = useState(false);
  const [runId, setRunId] = useState(0);
  const handleLive = useCallback((value: boolean) => {
    setLive(value);
    if (!value) setPhase('matched');
  }, []);

  const current = steps.findIndex((step) => step.phase === phase);
  const matched = phase === 'matched';

  return (
    <div className={styles.demo}>
      <SceneCanvas
        scene="matching"
        sceneProps={{ runId, onPhaseChange: setPhase }}
        fallback={fallback}
        label="Illustration: a passenger's route from Gurgaon to Jaipur merges into a driver's route from Delhi to Jaipur at a pickup point, after other drivers' routes are evaluated and set aside."
        className={styles.visual}
        onLiveChange={handleLive}
      />

      <aside className={styles.panel} aria-label="Matching demo">
        <div className={styles.panelTop}>
          <Badge variant={matched ? 'accent' : 'live'}>{matched ? 'Match found' : 'Matching'}</Badge>
          {live ? (
            <button type="button" className={styles.replay} onClick={() => setRunId((id) => id + 1)}>
              <RotateCcw size={14} aria-hidden="true" />
              Replay
            </button>
          ) : null}
        </div>

        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li
              key={step.phase}
              className={cn(styles.step, index < current && styles.done, index === current && styles.current)}
              aria-current={index === current ? 'step' : undefined}
            >
              <span className={styles.stepDot} aria-hidden="true" />
              {step.label}
            </li>
          ))}
        </ol>

        <dl className={cn(styles.scores, matched && styles.scoresShown)}>
          {scores.map((score) => (
            <div key={score.label} className={styles.score}>
              <dt>{score.label}</dt>
              <dd>
                <span className={cn('tabular', styles.value)}>{score.value}%</span>
                <span className={styles.bar} aria-hidden="true">
                  <span className={styles.barFill} style={{ transform: `scaleX(${matched ? score.value / 100 : 0})` }} />
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className={styles.disclaimer}>
          Illustrative demo, not live data. Real scores are calculated for every search.
        </p>
      </aside>
    </div>
  );
}
