import type { ReactNode } from 'react';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import type { SceneName, ScenePropsMap, SceneTier } from '@/components/three/types';
import styles from './SceneFrame.module.css';

interface SceneFrameProps<N extends SceneName> {
  scene: N;
  sceneProps: ScenePropsMap[N];
  fallback: ReactNode;
  label: string;
  minTier?: SceneTier;
  size?: 'default' | 'tall';
}

/** A 3D scene in the standard framed panel used on product pages. */
export function SceneFrame<N extends SceneName>({ size = 'default', ...props }: SceneFrameProps<N>) {
  return (
    <div data-tone="dark" className={styles.frame}>
      <SceneCanvas {...props} className={size === 'tall' ? styles.tall : styles.canvas} />
    </div>
  );
}
