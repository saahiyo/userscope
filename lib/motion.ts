'use client';

import { Transition } from 'framer-motion';

/**
 * animations.dev / Emil Kowalski-inspired Motion Tokens & Spring Physics
 * Precision-tuned springs and easings for tactile, organic UI microinteractions.
 */

// Custom cubic bezier curves
export const easings = {
  // Emil's signature ease-out: rapid acceleration then buttery smooth deceleration
  emil: [0.16, 1, 0.3, 1] as const,
  fluid: [0.25, 1, 0.5, 1] as const,
  snappy: [0.19, 1, 0.22, 1] as const,
  anticipate: [0.36, 0, 0.66, -0.56] as const,
};

// Physics-driven spring presets
export const springs = {
  // Ultra-crisp for buttons, toggles, small chips, and icon clicks
  snappy: {
    type: 'spring',
    stiffness: 500,
    damping: 32,
    mass: 0.8,
  } as Transition,

  // Natural layout transitions and tab sliders (Linear / Apple style)
  smooth: {
    type: 'spring',
    stiffness: 380,
    damping: 34,
    mass: 1,
  } as Transition,

  // Playful spring with subtle overshoot for badges and notification dots
  bouncy: {
    type: 'spring',
    stiffness: 420,
    damping: 22,
    mass: 0.9,
  } as Transition,

  // Soft and controlled for popovers, cards, drawers, and modal sheets
  popover: {
    type: 'spring',
    stiffness: 320,
    damping: 30,
    mass: 1,
  } as Transition,

  // Smooth expanding container / auto-height transitions
  expand: {
    type: 'spring',
    stiffness: 300,
    damping: 32,
    mass: 1,
  } as Transition,
};

// Common Interactive Microinteraction Presets
export const microinteractions = {
  // Button tap feedback
  buttonTap: {
    scale: 0.96,
    transition: springs.snappy,
  },
  // Subtle card hover
  cardHover: {
    y: -3,
    transition: springs.smooth,
  },
  // Pill chip tap
  chipTap: {
    scale: 0.94,
    transition: springs.snappy,
  },
};

// Card / Item entrance variants
export const itemFadeInUp = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.15, ease: easings.emil },
  },
};

// Staggered list container
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};
