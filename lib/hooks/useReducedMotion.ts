'use client';

import { useState, useEffect } from 'react';

/**
 * Accessible Animation Hook: useReducedMotion
 * Complies with WCAG 2.3.3 (Animation from Interactions) & C39 technique.
 * Gracefully syncs client-side OS prefers-reduced-motion setting with live event listeners.
 */
export function useReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  
  const get = (): boolean =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(query).matches
      : false;

  const [reduced, setReduced] = useState<boolean>(get);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setReduced(e.matches);
    };

    // Initial sync post-hydration to avoid SSR mismatch
    setReduced(mq.matches);

    // Modern matchMedia change listener
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
