"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Magnetic, WordReveal } from "@/components/motion/primitives";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { Aurora } from "@/components/ui/Aurora";
import { site } from "@/config/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Ambient chips parked in the gutters either side of the centred headline.
 * They only render at 2xl, where there is genuinely room beside the text — at
 * anything narrower they would collide with the H1.
 */
const floatingCards = [
  { label: "Requirement Hub", value: "9 open asks", tone: "cranberry", side: "left", top: "30%" },
  { label: "Next project", value: "Blood drive · 23 Aug", tone: "gold", side: "right", top: "18%" },
  { label: "Since charter", value: "14,200 service hours", tone: "royal", side: "right", top: "62%" },
] as const;

const TONE_RING = {
  cranberry: "border-cranberry-600/30",
  gold: "border-gold-500/35",
  royal: "border-royal-700/30",
} as const;

const TONE_DOT = {
  cranberry: "bg-cranberry-600",
  gold: "bg-gold-500",
  royal: "bg-royal-700",
} as const;

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden pb-20 pt-10 sm:pb-28 sm:pt-16">
      <Aurora variant="hero" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[0.75rem] font-medium"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cranberry-600 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-cranberry-600" />
            </span>
            {site.district} · Chartered {site.chartered} · Pune
          </motion.div>

          <h1 className="mt-7 font-display text-[2.6rem] font-semibold leading-[1.06] tracking-[-0.04em] sm:text-6xl lg:text-[4.5rem]">
            <WordReveal text="Service, run like it" className="block" />
            <WordReveal
              text="actually matters."
              className="block text-gradient"
              delay={0.22}
            />
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.5, ease: EASE }}
            className="mt-7 max-w-2xl text-[1.02rem] leading-relaxed text-fg-muted sm:text-lg"
          >
            Nineteen live projects, published books, an open urban-canopy dataset, and a
            district-wide board where any Rotaractor can ask for help. Read everything without
            an account — that part is the point.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.62, ease: EASE }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Magnetic>
              <ButtonLink href="/hub" size="lg" className="group">
                Open the Requirement Hub
                <ArrowRight className="group-hover:translate-x-1" />
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="/events" size="lg" variant="glass">
              See what&rsquo;s coming up
            </ButtonLink>
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-6 text-[0.78rem] text-fg-muted/80"
          >
            No login to browse, filter, react or copy a contact. Verification is only needed to
            post.
          </motion.p>
        </div>

        <div className="pointer-events-none absolute inset-0 hidden 2xl:block" aria-hidden>
          {floatingCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={reduced ? false : { opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.7 + index * 0.14, ease: EASE }}
              style={{ top: card.top }}
              className={card.side === "left" ? "absolute left-0" : "absolute right-0"}
            >
              <motion.div
                animate={reduced ? {} : { y: [0, -12, 0] }}
                transition={{ duration: 7 + index, repeat: Infinity, ease: "easeInOut" }}
                className={`glass flex items-center gap-3 rounded-2xl border px-4 py-3 ${TONE_RING[card.tone]}`}
              >
                <span className={`size-2 rounded-full ${TONE_DOT[card.tone]}`} />
                <span className="flex flex-col leading-tight">
                  <span className="text-[0.62rem] uppercase tracking-[0.16em] text-fg-muted">
                    {card.label}
                  </span>
                  <span className="text-[0.82rem] font-medium">{card.value}</span>
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
