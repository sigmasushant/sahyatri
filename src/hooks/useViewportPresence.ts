'use client';

import { useEffect, useState, type RefObject } from 'react';

const observerSupported = () => typeof window === 'undefined' || 'IntersectionObserver' in window;

/**
 * Tracks an element against the viewport:
 *   `near`    becomes true once it is within `nearMargin` of the viewport and stays true (lazy loading).
 *   `visible` is true while any part of it is on screen (pausing work offscreen).
 * Without IntersectionObserver, both are simply true.
 */
export function useViewportPresence(ref: RefObject<Element | null>, nearMargin = '400px') {
  const [supported] = useState(observerSupported);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !supported) return;

    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          nearObserver.disconnect();
        }
      },
      { rootMargin: nearMargin },
    );
    const visibleObserver = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)));

    nearObserver.observe(element);
    visibleObserver.observe(element);
    return () => {
      nearObserver.disconnect();
      visibleObserver.disconnect();
    };
  }, [ref, nearMargin, supported]);

  return { near: near || !supported, visible: visible || !supported };
}
