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
    <section className="bg-hero relative overflow-hidden text-paper">
      <div className="bg-grid-dark pointer-events-none absolute inset-0" />
      <div className="noise pointer-events-none absolute inset-0" />

      {/* Vertical side label */}
      <div
        className="pointer-events-none absolute right-7 top-1/2 hidden -translate-y-1/2 select-none xl:block"
        aria-hidden
      >
        <p
          className="text-[0.65rem] font-semibold uppercase tracking-[0.5em] text-paper/30"
          style={{ writingMode: "vertical-rl" }}
        >
          Est. {site.practisingSince} — {site.baseCity}, India
        </p>
      </div>

      <Container className="relative py-24 sm:py-32 lg:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: headline */}
          <div>
            <motion.div className="flex items-center gap-4" {...fade(0)}>
              <span className="h-px w-10 bg-accent" />
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-accent-soft">
                Practising since {site.practisingSince} · {site.baseCity}, India
              </p>
            </motion.div>

            <h1 className="mt-7 font-display text-[3.1rem] font-semibold leading-[0.98] tracking-tight text-paper sm:text-7xl md:text-[5.6rem]">
              <WordReveal text="Measured counsel" />
              <br />
              <WordReveal text="for complex matters" highlight={["complex", "matters"]} />
              <span className="text-accent-soft">.</span>
            </h1>

            <motion.p
              className="mt-8 max-w-xl text-lg leading-relaxed text-paper/65"
              {...fade(0.5)}
            >
              A full-service Indian law practice spanning litigation,
              white-collar defence, real estate &amp; RERA, family law,
              arbitration, corporate work and tribunal practice — advising
              individuals and businesses across India.
            </motion.p>

            <motion.div className="mt-10 flex flex-wrap gap-3" {...fade(0.65)}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-[2px] bg-accent px-7 py-4 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
              >
                Request a Consultation
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/practices"
                className="inline-flex items-center gap-2 rounded-[2px] border border-paper/25 px-7 py-4 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                Explore our practices
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.dl
              className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-paper/15 pt-8"
              {...fade(0.8)}
            >
              {[
                { n: 2007, label: "Practising since", suffix: "" },
                { n: 7, label: "Practice areas", suffix: "" },
                { n: 90, label: "Legal guides", suffix: "+" },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-3xl text-paper sm:text-4xl">
                    <CountUp to={s.n} suffix={s.suffix} />
                  </dt>
                  <dd className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-paper/45">
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
            <div className="absolute -inset-px rounded-[3px] bg-gradient-to-br from-accent/50 via-transparent to-transparent" />
            <div className="relative border border-paper/10 bg-white/[0.04] p-8 backdrop-blur-sm">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-accent-soft">
                Our practice
              </p>
              <p className="mt-2 font-display text-2xl text-paper">
                Seven areas, one standard.
              </p>
              <ul className="mt-6 divide-y divide-paper/10">
                {panelItems.map((item, i) => (
                  <motion.li
                    key={item}
                    className="group flex items-center gap-4 py-3 text-sm text-paper/75"
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={reduce ? {} : { opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: EASE,
                      delay: 0.6 + i * 0.08,
                    }}
                  >
                    <span className="font-display text-xs text-accent-soft">
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

      {/* Outlined display marquee along the hero's bottom edge */}
      <div className="relative border-t border-paper/10 py-5" aria-hidden>
        <div className="marquee-slow">
          {[...panelItems, ...panelItems].map((item, i) => (
            <span
              key={i}
              className="text-outline-dark mx-8 whitespace-nowrap font-display text-5xl font-semibold tracking-tight sm:text-6xl"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
