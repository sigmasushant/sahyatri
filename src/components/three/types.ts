import type { MatchingPhase, TechnologyMode } from './lib/layouts';

export type SceneName = 'mobility' | 'matching' | 'safety' | 'seats' | 'network' | 'technology';

/** Tier a scene renders at. `static` never reaches a scene; it gets the SVG fallback instead. */
export type SceneTier = 'high' | 'low';

export interface BaseSceneProps {
  tier: SceneTier;
  /** Render one calm, final-state frame: no travelling particles, pulses or parallax. */
  reducedMotion: boolean;
}

export interface MobilitySceneProps {
  /** `hero`: labelled example route. `ambient`: quieter background for the closing call to action. */
  variant?: 'hero' | 'ambient';
}

export interface MatchingSceneProps {
  /** Changing this restarts the demo. */
  runId?: number;
  onPhaseChange?: (phase: MatchingPhase) => void;
}

export type SafetySceneProps = Record<string, never>;
export type SeatsSceneProps = Record<string, never>;

export interface NetworkSceneProps {
  /** Scroll progress through the section, 0–1, written by the section without re-rendering. */
  progress: { current: number };
}

export interface TechnologySceneProps {
  mode: TechnologyMode;
}

export interface ScenePropsMap {
  mobility: MobilitySceneProps;
  matching: MatchingSceneProps;
  safety: SafetySceneProps;
  seats: SeatsSceneProps;
  network: NetworkSceneProps;
  technology: TechnologySceneProps;
}
