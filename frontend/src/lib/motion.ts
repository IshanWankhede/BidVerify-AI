import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

// Helper to check for user reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Hook to animate counting up from 0 to a target value using GSAP
export function useCountUp(target: number, duration: number = 1.0, delay: number = 0): number {
  const [count, setCount] = useState<number>(0);
  const valRef = useRef<{ value: number }>({ value: 0 });

  useEffect(() => {
    if (prefersReducedMotion()) {
      setCount(target);
      return;
    }

    valRef.current.value = 0;
    const tween = gsap.to(valRef.current, {
      value: target,
      duration: duration,
      delay: delay,
      ease: 'power2.out',
      onUpdate: () => {
        setCount(Math.round(valRef.current.value));
      }
    });

    return () => {
      tween.kill();
    };
  }, [target, duration, delay]);

  return count;
}

// Framer Motion shared transition variants
export const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.16,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

export const staggerContainer = (staggerChildren: number = 0.08, delayChildren: number = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

export const cardFadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const rowFadeIn = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};
