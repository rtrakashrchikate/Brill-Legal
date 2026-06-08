"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/** Thin gold reading-progress bar fixed under the header. */
export function ReadingProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-accent to-accent-soft"
    />
  );
}
