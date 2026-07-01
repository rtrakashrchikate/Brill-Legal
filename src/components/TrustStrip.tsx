"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Container } from "@/components/ui";

/**
 * Credentials band — legitimate authority signals only.
 * Bone-on-wine treatment with iconography, stagger-in animation,
 * and a subtle scan-line reveal on the border rule.
 */

const credentials = [
  {
    icon: "⚖",
    label: "Practising since 2007",
    note: "Nearly two decades of counsel",
  },
  {
    icon: "✦",
    label: "Bar Council of Maharashtra & Goa",
    note: "Enrolled advocates",
  },
  {
    icon: "◈",
    label: "Bombay High Court & tribunals",
    note: "Appearance & representation",
  },
  {
    icon: "◉",
    label: "7 practice areas",
    note: "Civil · criminal · corporate · family",
  },
  {
    icon: "▸",
    label: "90+ guides published",
    note: "Free legal knowledge library",
  },
  {
    icon: "✦",
    label: "Pune · Mumbai · pan-India",
    note: "Consultations by appointment",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function TrustStrip() {
  const reduce = useReducedMotion();

  const cards = credentials.map((c) => (
    <div
      key={c.label}
      className="group relative flex flex-col gap-3 border-r border-paper/10 bg-transparent p-6 last:border-r-0 transition-colors duration-300 hover:bg-paper/5"
    >
      {/* Oxblood top rule that grows on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent-soft transition-transform duration-500 group-hover:scale-x-100"
      />

      <span
        aria-hidden
        className="font-display text-2xl leading-none text-accent-soft/50 transition-colors duration-300 group-hover:text-accent-soft"
      >
        {c.icon}
      </span>

      <div>
        <p className="font-display text-[0.95rem] leading-snug text-paper">
          {c.label}
        </p>
        <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-paper/45">
          {c.note}
        </p>
      </div>
    </div>
  ));

  return (
    <section className="bg-wine relative overflow-hidden border-b border-paper/10">
      {/* Noise grain */}
      <span aria-hidden className="noise pointer-events-none absolute inset-0" />
      {/* Grid texture */}
      <span aria-hidden className="bg-grid-dark pointer-events-none absolute inset-0" />

      <Container className="relative py-8">
        {/* Kicker */}
        <p className="kicker mb-5 text-accent-soft/80">Why clients trust Brill Legal</p>

        {reduce ? (
          <div className="grid grid-cols-2 divide-x divide-paper/10 border border-paper/10 sm:grid-cols-3 lg:grid-cols-6">
            {cards}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 divide-x divide-paper/10 border border-paper/10 sm:grid-cols-3 lg:grid-cols-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {credentials.map((c) => (
              <motion.div
                key={c.label}
                variants={item}
                className="group relative flex flex-col gap-3 border-r border-paper/10 bg-transparent p-6 last:border-r-0 transition-colors duration-300 hover:bg-paper/5"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent-soft transition-transform duration-500 group-hover:scale-x-100"
                />
                <span
                  aria-hidden
                  className="font-display text-2xl leading-none text-accent-soft/50 transition-colors duration-300 group-hover:text-accent-soft"
                >
                  {c.icon}
                </span>
                <div>
                  <p className="font-display text-[0.95rem] leading-snug text-paper">
                    {c.label}
                  </p>
                  <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-paper/45">
                    {c.note}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
