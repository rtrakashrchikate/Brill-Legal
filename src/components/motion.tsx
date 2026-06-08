"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
} from "motion/react";
import {
  createElement,
  useEffect,
  useRef,
  useState,
  type JSX,
  type ReactNode,
} from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------- Reveal on scroll ---------------- */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = "div",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: keyof typeof motion;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  if (reduce) {
    // Render statically when the user prefers reduced motion.
    const tag = (as as keyof JSX.IntrinsicElements) || "div";
    return createElement(tag, { className }, children);
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/* ---------------- Staggered group ---------------- */

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export function StaggerGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

/* ---------------- Word-by-word headline reveal ---------------- */

export function WordReveal({
  text,
  className,
  highlight,
}: {
  text: string;
  className?: string;
  /** Words (lowercased match) rendered in the gold accent. */
  highlight?: string[];
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const hi = new Set((highlight ?? []).map((w) => w.toLowerCase()));

  if (reduce) {
    return (
      <span className={className}>
        {words.map((w, i) => (
          <span key={i} className={hi.has(w.toLowerCase().replace(/[.,]/g, "")) ? "italic text-gold" : ""}>
            {w}{i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    );
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      {words.map((w, i) => {
        const clean = w.toLowerCase().replace(/[.,]/g, "");
        return (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: "0.5em", filter: "blur(6px)" },
              show: {
                opacity: 1,
                y: "0em",
                filter: "blur(0px)",
                transition: { duration: 0.7, ease: EASE },
              },
            }}
          >
            <span className={hi.has(clean) ? "italic text-gold" : ""}>{w}</span>
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

/* ---------------- Count-up number ---------------- */

export function CountUp({
  to,
  suffix = "",
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(eased * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, reduce]);

  return (
    <span ref={ref} className={className}>
      {val}
      {suffix}
    </span>
  );
}

/* ---------------- Hover-lift motion wrapper ---------------- */

export function HoverCard({
  children,
  className,
  ...rest
}: HTMLMotionProps<"div"> & { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.3, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
