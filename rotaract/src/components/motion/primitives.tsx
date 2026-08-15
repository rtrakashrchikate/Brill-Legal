"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* -------------------------------------------------------------------------- */
/* Reveal — the workhorse scroll entrance                                     */
/* -------------------------------------------------------------------------- */

const REVEAL_ELEMENTS = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  article: motion.article,
  header: motion.header,
} as const;

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
  as?: keyof typeof REVEAL_ELEMENTS;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  blur = true,
  once = true,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = REVEAL_ELEMENTS[as];

  return (
    <Component
      className={className}
      initial={reduced ? false : { opacity: 0, y, filter: blur ? "blur(10px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-12% 0px -8% 0px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

/* -------------------------------------------------------------------------- */
/* Stagger container/item                                                     */
/* -------------------------------------------------------------------------- */

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: EASE } },
};

export function Stagger({
  children,
  className,
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* CountUp — statistics that animate once in view                             */
/* -------------------------------------------------------------------------- */

export function CountUp({
  value,
  duration = 1.9,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const total = duration * 1000;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / total);
      // Same ease as the CSS easing token, so numbers settle like panels do.
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {new Intl.NumberFormat("en-IN").format(display)}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Tilt — pointer-reactive 3D on glass cards                                  */
/* -------------------------------------------------------------------------- */

export function Tilt({
  children,
  className,
  strength = 8,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), {
    stiffness: 180,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), {
    stiffness: 180,
    damping: 18,
  });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={cn("[transform-style:preserve-3d]", className)}
      style={{ rotateX, rotateY }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Magnetic — cursor attraction for primary CTAs                              */
/* -------------------------------------------------------------------------- */

export function Magnetic({
  children,
  className,
  radius = 22,
}: {
  children: React.ReactNode;
  className?: string;
  radius?: number;
}) {
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 20 });

  if (reduced) return <span className={className}>{children}</span>;

  return (
    <motion.span
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        x.set(Math.max(-radius, Math.min(radius, dx * 0.35)));
        y.set(Math.max(-radius, Math.min(radius, dy * 0.35)));
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/* -------------------------------------------------------------------------- */
/* WordReveal — hero headline, word by word                                   */
/* -------------------------------------------------------------------------- */

export function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={reduced ? false : { y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.85, delay: delay + index * 0.06, ease: EASE }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
