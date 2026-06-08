"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui";
import { WordReveal, CountUp } from "@/components/motion";
import { site } from "@/config/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const panelItems = [
  "Dispute Resolution & Litigation",
  "White-Collar & Investigations",
  "Real Estate & RERA",
  "Private Client & Family",
  "Arbitration & ADR",
  "Corporate & Commercial",
  "Tribunal & Regulatory",
];

export function Hero() {
  const reduce = useReducedMotion();

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    <section className="relative overflow-hidden border-b border-line bg-aura">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
      <Container className="relative py-20 sm:py-28 lg:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left: headline */}
          <div>
            <motion.p className="kicker" {...fade(0)}>
              Practising since {site.practisingSince} · {site.baseCity}, India
            </motion.p>

            <h1 className="mt-5 font-display text-[2.7rem] font-semibold leading-[1.03] tracking-tight text-ink sm:text-6xl md:text-7xl">
              <WordReveal text="Measured counsel for" />{" "}
              <WordReveal text="complex matters" highlight={["complex", "matters"]} />
              <span className="text-accent">.</span>
            </h1>

            <motion.p
              className="mt-7 max-w-xl text-lg leading-relaxed text-muted"
              {...fade(0.5)}
            >
              A full-service Indian law practice spanning litigation,
              white-collar defence, real estate &amp; RERA, family law,
              arbitration, corporate work and tribunal practice — advising
              individuals and businesses across India.
            </motion.p>

            <motion.div className="mt-9 flex flex-wrap gap-3" {...fade(0.65)}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-[2px] bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
              >
                Request a Consultation
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/practices"
                className="inline-flex items-center gap-2 rounded-[2px] border border-ink/25 px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                Explore our practices
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.dl
              className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8"
              {...fade(0.8)}
            >
              {[
                { n: 2007, label: "Practising since", suffix: "" },
                { n: 7, label: "Practice areas", suffix: "" },
                { n: 90, label: "Legal guides", suffix: "+" },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-3xl text-ink sm:text-4xl">
                    <CountUp to={s.n} suffix={s.suffix} />
                  </dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-muted">
                    {s.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Right: practice panel */}
          <motion.div
            className="relative hidden lg:block"
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={reduce ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          >
            <div className="absolute -inset-3 rounded-[3px] bg-gradient-to-br from-accent/15 to-transparent" />
            <div className="relative border border-line bg-paper-card p-8 shadow-[var(--shadow-card)]">
              <p className="kicker">Our practice</p>
              <p className="mt-2 font-display text-2xl text-ink">
                Seven areas, one standard.
              </p>
              <ul className="mt-6 divide-y divide-line">
                {panelItems.map((item, i) => (
                  <motion.li
                    key={item}
                    className="flex items-center gap-3 py-3 text-sm text-ink-soft"
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={reduce ? {} : { opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: EASE,
                      delay: 0.6 + i * 0.08,
                    }}
                  >
                    <span className="font-display text-xs text-accent-deep">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
