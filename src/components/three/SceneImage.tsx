import type { SceneFallbackName } from './fallbacks/SceneFallbacks';
import styles from './SceneCanvas.module.css';

interface SceneImageProps {
  name: SceneFallbackName;
  /** Alternative framing for narrow (portrait) layouts. */
  compactName?: SceneFallbackName;
  /** Visuals near the top of the page load eagerly; everything else waits until it is near. */
  priority?: boolean;
}

/**
 * The static version of a scene: a pre-rendered SVG image. Decorative (the wrapping visual
 * carries the accessible label), cached by the browser, and decoded off the main thread.
 */
export function SceneImage({ name, compactName, priority = false }: SceneImageProps) {
  /* eslint-disable @next/next/no-img-element -- vector art; next/image adds nothing for SVG */
  const image = (
    <img
      src={`/visuals/${name}.svg`}
      alt=""
      width={1600}
      height={900}
      className={styles.image}
      loading={priority ? 'eager' : 'lazy'}
      // Above the fold the illustration is often the largest paint: fetch it early and paint it
      // with the first frame. Everything else decodes off the critical path.
      decoding={priority ? 'auto' : 'async'}
      fetchPriority={priority ? 'high' : 'low'}
    />
  );
  /* eslint-enable @next/next/no-img-element */
  if (!compactName) return image;
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={`/visuals/${compactName}.svg`} />
      {image}
    </picture>
  );
}
