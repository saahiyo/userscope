'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

/**
 * SmoothScroll component powered by Lenis.
 * Complies with the `gsap-web` and `accessible-animation` skills:
 * - Physics-based fluid inertial scrolling with Apple exponential easing curve.
 * - WCAG 2.3.3 Tier 1 Gate: Automatically disables and destroys Lenis when prefers-reduced-motion is active.
 * - Single requestAnimationFrame loop with clean lifecycle teardown to prevent memory leaks or jitter.
 */
export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isReducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Tier 1: If reduced motion is requested, do not run smooth scrolling; keep native scroll
    if (isReducedMotion) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.45,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -6.5 * t)), // low-friction exponential glide with extended silky tail
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15, // lighter, more responsive travel per wheel notch
      touchMultiplier: 1.8,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function update(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isReducedMotion]);

  return <>{children}</>;
};
