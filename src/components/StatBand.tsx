"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { CountUp } from "@/components/motion";
import { Container } from "@/components/ui";

/**
 * Authority stat band — full-width wine section with 4 CountUp metrics
 * and a one-line positioning statement. All numbers are real capability
 * signals; no fabricated figures.
 */
const stats = [
  { to: 17, suffix: "+", label: "Years of practice", sub: "Since 2007" },
  { to: 7, suffix: "", label: "Practice areas", sub: "Civil · corporate · family" },
  { to: 90, suffix: "+", label: "Guides published", sub: "Free knowledge library" },
  { to: 6, suffix: "", label: "Forums we appear before", sub: "HC · NCLT · tribunals" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const itemV: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function StatItem({
  stat,
}: {
  stat: (typeof stats)[number];
}) {
  return (
    <div className="group flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
      <p className="font-display text-5xl font-semibold tabular-nums text-paper sm:text-6xl">
        <CountUp to={stat.to} suffix={stat.suffix} />
      </p>
      <p className="mt-1 text-sm font-medium text-accent-soft">{stat.label}</p>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-paper/40">
        {stat.sub}
      </p>
    </div>
  );
}

export function StatBand() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-wine relative overflow-hidden border-y border-paper/10">
      {/* Noise + grid layering */}
      <span aria-hidden className="noise pointer-events-none absolute inset-0" />
      <span aria-hidden className="bg-grid-dark pointer-events-none absolute inset-0" />

      {/* Accent radial bloom top-right */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(138,34,50,0.5) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <Container className="relative py-16">
        {/* Positioning statement */}
        {reduce ? (
          <p className="mb-10 max-w-xl font-display text-xl leading-snug text-paper/70 sm:text-2xl">
            Depth of practice, presented with restraint. Available across Maharashtra
            and by consultation nationally.
          </p>
        ) : (
          <motion.p
            className="mb-10 max-w-xl font-display text-xl leading-snug text-paper/70 sm:text-2xl"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Depth of practice, presented with restraint. Available across Maharashtra
            and by consultation nationally.
          </motion.p>
        )}

        {/* Stats row */}
        {reduce ? (
          <div className="grid grid-cols-2 gap-8 sm:flex sm:items-center sm:gap-10 lg:gap-16">
            {stats.map((s, i) => (
              <StatItem key={s.label} stat={s} />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-8 sm:flex sm:items-center sm:gap-10 lg:gap-16"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {stats.map((s, i) => (
              <motion.div key={s.label} variants={itemV} className="flex items-center gap-10 lg:gap-16">
                <StatItem stat={s} />
                {i < stats.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden h-16 w-px flex-shrink-0 bg-paper/10 sm:block"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
