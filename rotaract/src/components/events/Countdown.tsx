"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function partsFor(target: number): Parts {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

/**
 * Live countdown to an event.
 *
 * Renders a stable placeholder on the server and starts ticking after mount, so
 * the markup can be statically generated without a hydration mismatch.
 */
export function Countdown({
  startsAt,
  className,
  compact = false,
}: {
  startsAt: string;
  className?: string;
  compact?: boolean;
}) {
  const target = useMemo(() => new Date(startsAt).getTime(), [startsAt]);
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(partsFor(target));
    const id = setInterval(() => setParts(partsFor(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: { label: string; value: number }[] = [
    { label: compact ? "d" : "days", value: parts?.days ?? 0 },
    { label: compact ? "h" : "hrs", value: parts?.hours ?? 0 },
    { label: compact ? "m" : "min", value: parts?.minutes ?? 0 },
    { label: compact ? "s" : "sec", value: parts?.seconds ?? 0 },
  ];

  if (parts?.done) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[0.75rem] font-medium text-emerald-700 dark:text-emerald-300",
          className,
        )}
      >
        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
        Happening now
      </span>
    );
  }

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role="timer"
      aria-live="off"
      aria-label={`Starts in ${parts?.days ?? 0} days`}
    >
      {units.map((unit) => (
        <div
          key={unit.label}
          className={cn(
            "glass flex flex-col items-center rounded-xl tabular-nums",
            compact ? "min-w-10 px-2 py-1" : "min-w-14 px-2.5 py-2",
          )}
        >
          <span className="relative block h-[1.15em] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={`${unit.label}-${unit.value}`}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "block font-display font-semibold",
                  compact ? "text-sm" : "text-lg",
                )}
              >
                {parts ? String(unit.value).padStart(2, "0") : "--"}
              </motion.span>
            </AnimatePresence>
          </span>
          <span
            className={cn(
              "uppercase tracking-[0.12em] text-fg-muted",
              compact ? "text-[0.52rem]" : "text-[0.58rem]",
            )}
          >
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
