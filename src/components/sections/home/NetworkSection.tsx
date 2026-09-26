import { SceneImage } from '@/components/three/SceneImage';
import { NetworkScroller } from './NetworkScroller';

export function NetworkSection() {
  return (
    <section data-tone="dark" id="network" aria-labelledby="network-title">
      <NetworkScroller fallback={<SceneImage name="network" compactName="network-compact" />} />
    </section>
  );
}
