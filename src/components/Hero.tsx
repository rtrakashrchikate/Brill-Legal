"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
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

/* ── Kinetic SVG underline drawn on mount ───────────────── */
function KineticUnderline({ reduce }: { reduce: boolean | null }) {
  return (
    <span className="relative inline-block">
      complex matters
      {!reduce && (
        <motion.svg
          aria-hidden
          viewBox="0 0 320 12"
          preserveAspectRatio="none"
          className="absolute -bottom-1 left-0 h-[0.18em] w-full overflow-visible"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.2 }}
        >
          {/* Wavy editorial underline */}
          <motion.path
            d="M2 8 Q40 2 80 8 Q120 14 160 8 Q200 2 240 8 Q280 14 318 8"
            fill="none"
            stroke="rgba(212,154,161,0.7)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.0 }}
          />
          {/* Brighter accent line behind */}
          <motion.path
            d="M2 8 Q40 2 80 8 Q120 14 160 8 Q200 2 240 8 Q280 14 318 8"
            fill="none"
            stroke="rgba(138,34,50,0.35)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0, ease: EASE, delay: 0.95 }}
          />
        </motion.svg>
      )}
    </span>
  );
}

/* ── Scroll cue — bouncing chevron, hides after first scroll ── */
function ScrollCue({ reduce }: { reduce: boolean | null }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduce) return;
    const handler = () => {
      if (window.scrollY > 80) setVisible(false);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [reduce]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <span className="text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-paper/30">
            scroll
          </span>
          <span className="scroll-cue-bounce block text-paper/30">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 5L7 10L12 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main component ─────────────────────────────────────── */
export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /* Parallax: practice panel drifts up slightly as user scrolls */
  const { scrollY } = useScroll();
  const rawParallax = useTransform(scrollY, [0, 600], [0, -55]);
  const panelY = useSpring(rawParallax, { stiffness: 80, damping: 20 });

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    <section
      ref={sectionRef}
      className="bg-hero relative overflow-hidden text-paper"
      style={{
        /* Extra depth: second wine bloom centre-left + deep vignette edge */
        backgroundImage: [
          "radial-gradient(52rem 36rem at 12% 80%, rgba(61,12,22,0.65), transparent 65%)",
          "radial-gradient(70rem 50rem at 90% -10%, rgba(138,34,50,0.5), transparent 60%)",
          "radial-gradient(50rem 35rem at -8% 110%, rgba(98,20,32,0.55), transparent 58%)",
          "linear-gradient(160deg, #120810 0%, #1c0911 45%, #280a12 75%, #2e0b14 100%)",
        ].join(", "),
      }}
    >
      {/* Grid texture */}
      <div className="bg-grid-dark pointer-events-none absolute inset-0" />

      {/* Animated noise grain (drifts slowly) */}
      <div className="noise-animated pointer-events-none absolute -inset-4" />

      {/* Static noise layer for density */}
      <div className="noise pointer-events-none absolute inset-0 opacity-60" />

      {/* Subtle vignette ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 40%, transparent 55%, rgba(10,4,8,0.55) 100%)",
        }}
      />

      {/* Vertical side label */}
      <div
        className="pointer-events-none absolute right-7 top-1/2 hidden -translate-y-1/2 select-none xl:block"
        aria-hidden
      >
        <p
          className="text-[0.62rem] font-semibold uppercase tracking-[0.5em] text-paper/25"
          style={{ writingMode: "vertical-rl" }}
        >
          Est. {site.practisingSince} — {site.baseCity}, India
        </p>
      </div>

      <Container className="relative py-24 sm:py-32 lg:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">

          {/* ── Left: headline block ─────────────────── */}
          <div>
            {/* Kicker with animated rule */}
            <motion.div className="flex items-center gap-4" {...fade(0)}>
              <motion.span
                className="h-px bg-accent"
                initial={reduce ? false : { width: 0 }}
                animate={reduce ? {} : { width: 40 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
              />
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-accent-soft">
                Practising since {site.practisingSince} · {site.baseCity}, India
              </p>
            </motion.div>

            {/* Headline with kinetic underline */}
            <h1 className="mt-7 font-display text-[3.1rem] font-semibold leading-[0.98] tracking-tight text-paper sm:text-7xl md:text-[5.6rem]">
              <WordReveal text="Measured counsel" />
              <br />
              <span className="inline-flex items-baseline gap-[0.15em]">
                <WordReveal text="for" />
                {" "}
                <motion.span
                  initial={reduce ? false : { opacity: 0 }}
                  animate={reduce ? {} : { opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.01 }}
                >
                  <KineticUnderline reduce={reduce} />
                </motion.span>
              </span>
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
                <span className="transition-transform group-hover:translate-x-1">→</span>
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

          {/* ── Right: parallax practice panel ──────── */}
          <motion.div
            className="relative hidden lg:block"
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={reduce ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            style={reduce ? {} : { y: panelY }}
          >
            {/* Glow border */}
            <div className="absolute -inset-px rounded-[3px] bg-gradient-to-br from-accent/60 via-transparent to-accent/10" />

            {/* Panel surface */}
            <div className="relative border border-paper/10 bg-white/[0.04] p-8 backdrop-blur-sm">
              {/* Inner accent rule */}
              <div className="mb-5 h-px w-8 bg-accent-soft/60" />

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
                    className="group flex items-center gap-4 py-3 text-sm text-paper/75 transition-colors hover:text-paper"
                    initial={reduce ? false : { opacity: 0, x: 12 }}
                    animate={reduce ? {} : { opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.45,
                      ease: EASE,
                      delay: 0.7 + i * 0.07,
                    }}
                  >
                    <span className="font-display text-xs text-accent-soft/60 transition-colors group-hover:text-accent-soft">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{item}</span>
                    <span className="translate-x-0 text-xs text-accent-soft/0 transition-all group-hover:translate-x-0.5 group-hover:text-accent-soft/70">
                      →
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Bottom CTA inside panel */}
              <motion.div
                className="mt-6 border-t border-paper/10 pt-5"
                initial={reduce ? false : { opacity: 0 }}
                animate={reduce ? {} : { opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <Link
                  href="/practices"
                  className="text-xs font-medium text-accent-soft/70 transition-colors hover:text-accent-soft"
                >
                  View all practice areas →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Outlined marquee bottom edge */}
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

      {/* Scroll cue — self-hides after 80px scroll */}
      <ScrollCue reduce={reduce} />
    </section>
  );
}
