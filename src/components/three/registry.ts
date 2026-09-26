import type { ComponentType } from 'react';
import type { BaseSceneProps, SceneName, ScenePropsMap } from './types';

type SceneModule<N extends SceneName> = Promise<{ default: ComponentType<ScenePropsMap[N] & BaseSceneProps> }>;

/**
 * Each scene is its own chunk, fetched only when its section approaches the viewport
 * on a device that qualifies for WebGL.
 */
export const sceneLoaders: { [N in SceneName]: () => SceneModule<N> } = {
  mobility: () => import('./scenes/MobilityNetwork'),
  matching: () => import('./scenes/MatchingScene'),
  safety: () => import('./scenes/SafetyScene'),
  seats: () => import('./scenes/SeatsScene'),
  network: () => import('./scenes/NetworkGrowthScene'),
  technology: () => import('./scenes/TechnologyScene'),
};
