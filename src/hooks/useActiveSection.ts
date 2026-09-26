'use client';

import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently crossing the middle of the viewport,
 * or null when none of the given sections is there (or tracking is disabled).
 */
export function useActiveSection(ids: string[], enabled = true): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = elements.find((el) => visible.has(el.id));
        setActive(current ? current.id : null);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    elements.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      setActive(null);
    };
  }, [key, enabled]);

  return enabled ? active : null;
}
