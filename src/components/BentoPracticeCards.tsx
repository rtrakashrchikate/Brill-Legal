"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useTransform,
  type Variants,
} from "motion/react";
import { type Practice } from "@/data/practices";

/* ── Bento layout spans ─────────────────────────────────── */
// 7 cards in an asymmetric 12-column bento.
// Row 1: [wide 5col][narrow 3col][narrow 4col]
// Row 2: [narrow 4col][wide 5col][narrow 3col]
// Row 3: [full 12col strip — Tribunal]
const SPANS: string[] = [
  "lg:col-span-5",       // 0 Dispute Resolution — wide
  "lg:col-span-3",       // 1 White-Collar — narrow
  "lg:col-span-4",       // 2 Real Estate
  "lg:col-span-4",       // 3 Family
  "lg:col-span-5",       // 4 Arbitration — wide
  "lg:col-span-3",       // 5 Corporate — narrow
  "lg:col-span-12",      // 6 Tribunal — full-width strip
];

/* ── Stagger variants ───────────────────────────────────── */
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── Tilt card (skips transform when reduced-motion) ────── */
function TiltCard({
  practice,
  index,
  colSpan,
  isWide,
  isStrip,
}: {
  practice: Practice;
  index: number;
  colSpan: string;
  isWide: boolean;
  isStrip: boolean;
}) {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-80, 80], [4, -4]);
  const rotateY = useTransform(mouseX, [-80, 80], [-4, 4]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }
  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const idx = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      variants={item}
      className={`${colSpan} col-span-12 sm:col-span-6`}
      style={{ perspective: 800 }}
    >
      <motion.div
        style={
          reduce
            ? {}
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="h-full"
      >
        <Link
          href={`/practices/${practice.slug}`}
          className={[
            "group relative flex h-full flex-col justify-between overflow-hidden",
            "border border-line bg-paper-card",
            "transition-all duration-300 ease-out",
            "hover:border-accent/70 hover:shadow-[0_0_0_1px_rgba(138,34,50,0.3),0_8px_40px_rgba(138,34,50,0.18)]",
            isStrip
              ? "min-h-[140px] flex-row items-center gap-8 px-10 py-8"
              : isWide
                ? "min-h-[280px] p-8"
                : "min-h-[240px] p-7",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* Subtle oxblood glow on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(138,34,50,0.1), transparent 70%)",
            }}
          />

          {/* Noise grain */}
          <span
            aria-hidden
            className="noise pointer-events-none absolute inset-0"
          />

          {/* Index numeral */}
          <span
            aria-hidden
            className={[
              "pointer-events-none absolute font-display font-light text-line-strong/50 select-none",
              "transition-colors duration-300 group-hover:text-accent/30",
              isStrip ? "right-8 top-1/2 -translate-y-1/2 text-6xl" : "right-5 top-4 text-5xl",
            ].join(" ")}
          >
            {idx}
          </span>

          {/* Main content */}
          {isStrip ? (
            /* Strip layout — horizontal */
            <>
              <div className="flex-1">
                <p className="kicker mb-2">{practice.short}</p>
                <h3 className="font-display text-2xl leading-tight text-ink transition-colors group-hover:text-accent-deep">
                  {practice.name}
                </h3>
              </div>
              <div className="hidden max-w-sm shrink-0 md:block">
                <p className="text-sm leading-relaxed text-muted">
                  {practice.summary}
                </p>
              </div>
              <span className="ml-auto shrink-0 flex items-center gap-1.5 text-sm font-medium text-accent-deep transition-transform duration-200 group-hover:translate-x-1">
                Explore →
              </span>
            </>
          ) : (
            /* Stacked layout */
            <>
              <div>
                <p className="kicker mb-3">{practice.short}</p>
                <h3
                  className={[
                    "font-display leading-tight text-ink transition-colors group-hover:text-accent-deep",
                    isWide ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
                  ].join(" ")}
                >
                  {practice.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {practice.summary}
                </p>
              </div>

              {/* Capability list — reveals on hover */}
              <div className="mt-4 overflow-hidden">
                <ul
                  className={[
                    "space-y-1.5 text-xs text-muted transition-all duration-300",
                    "max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100",
                  ].join(" ")}
                >
                  {practice.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-2">
                      <span className="mt-0.5 text-accent">·</span>
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>

              <span className="mt-6 flex items-center gap-1.5 text-sm font-medium text-accent-deep transition-transform duration-200 group-hover:translate-x-1">
                Explore practice →
              </span>
            </>
          )}
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ── Public component ───────────────────────────────────── */
export function BentoPracticeCards({
  practices,
}: {
  practices: Practice[];
}) {
  const reduce = useReducedMotion();

  const grid = (
    <div className="grid grid-cols-12 gap-px bg-line">
      {practices.map((p, i) => (
        <TiltCard
          key={p.slug}
          practice={p}
          index={i}
          colSpan={SPANS[i] ?? "lg:col-span-4"}
          isWide={SPANS[i]?.includes("col-span-5") ?? false}
          isStrip={SPANS[i]?.includes("col-span-12") ?? false}
        />
      ))}
    </div>
  );

  if (reduce) return grid;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="grid grid-cols-12 gap-px bg-line">
        {practices.map((p, i) => (
          <TiltCard
            key={p.slug}
            practice={p}
            index={i}
            colSpan={SPANS[i] ?? "lg:col-span-4"}
            isWide={SPANS[i]?.includes("col-span-5") ?? false}
            isStrip={SPANS[i]?.includes("col-span-12") ?? false}
          />
        ))}
      </div>
    </motion.div>
  );
}
