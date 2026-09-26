'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Progress (0–1) of scrolling through a tall element whose content is sticky.
 * The precise value is written to a ref every frame (no re-renders, for WebGL);
 * a coarse `step` (0…steps-1) is React state, for text that changes per stage.
 * When disabled (e.g. reduced motion) progress is complete: 1 and the last step.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, steps: number, enabled = true) {
  const progress = useRef(enabled ? 0 : 1);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!enabled) {
      progress.current = 1;
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const value = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 1;
      progress.current = value;
      setStep(Math.min(steps - 1, Math.round(value * (steps - 1))));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref, steps, enabled]);

  return { progress, step: enabled ? step : steps - 1 };
}
