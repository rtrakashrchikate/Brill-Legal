"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { formatCompact, useEngagement } from "@/lib/engagement/client";
import { cn } from "@/lib/utils";
import { REACTION_KINDS, type EngageableType, type ReactionKind } from "@/types";

const REACTION_META: Record<ReactionKind, { emoji: string; label: string; glow: string }> = {
  clap: { emoji: "👏", label: "Applaud", glow: "rgb(247 168 27 / 0.45)" },
  heart: { emoji: "❤️", label: "Love this", glow: "rgb(217 27 92 / 0.45)" },
  fire: { emoji: "🔥", label: "This is fire", glow: "rgb(0 80 161 / 0.4)" },
};

export interface EngagementBarProps {
  type: EngageableType;
  id: string;
  /** Registers a deduplicated view when the component mounts. */
  trackView?: boolean;
  size?: "sm" | "md";
  className?: string;
  showViews?: boolean;
}

/**
 * The public engagement surface. No account, no prompt to sign in — a visitor
 * can view, like and react anywhere on the site. Identity is a rotating hash of
 * the request, held only to stop one person inflating a counter.
 */
export function EngagementBar({
  type,
  id,
  trackView = false,
  size = "md",
  className,
  showViews = true,
}: EngagementBarProps) {
  const { counts, visitor, like, react, loading } = useEngagement(type, id, { trackView });
  const compact = size === "sm";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5",
        loading && "opacity-70",
        className,
      )}
    >
      {showViews && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-hairline bg-fg/[0.03] text-fg-muted",
            compact ? "px-2.5 py-1 text-[0.72rem]" : "px-3 py-1.5 text-[0.78rem]",
          )}
          title={`${counts.views} views`}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
            <circle cx="12" cy="12" r="2.8" />
          </svg>
          <AnimatedNumber value={counts.views} />
          <span className="sr-only">views</span>
        </span>
      )}

      <LikeButton
        active={visitor.liked}
        count={counts.likes}
        onClick={like}
        compact={compact}
      />

      {REACTION_KINDS.map((kind) => (
        <ReactionPill
          key={kind}
          kind={kind}
          count={counts.reactions[kind]}
          active={visitor.reactions.includes(kind)}
          onClick={() => react(kind)}
          compact={compact}
        />
      ))}
    </div>
  );
}

function LikeButton({
  active,
  count,
  onClick,
  compact,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  compact: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Remove your like" : "Like this"}
      className={cn(
        "group/like relative inline-flex items-center gap-1.5 rounded-full border transition-all duration-300 ease-[var(--ease-glass)]",
        compact ? "px-2.5 py-1 text-[0.72rem]" : "px-3 py-1.5 text-[0.78rem]",
        active
          ? "border-cranberry-600/40 bg-cranberry-600/12 text-cranberry-600 dark:text-cranberry-300"
          : "border-hairline bg-fg/[0.03] text-fg-muted hover:border-cranberry-600/30 hover:text-cranberry-600",
        "active:scale-95",
      )}
    >
      <motion.span
        animate={active && !reduced ? { scale: [1, 1.45, 1], rotate: [0, -12, 0] } : {}}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="grid place-items-center"
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 3.2 14.5 9l6.3.5-4.8 4.1 1.5 6.2L12 16.5 6.5 19.8 8 13.6 3.2 9.5 9.5 9 12 3.2Z" />
        </svg>
      </motion.span>
      <AnimatedNumber value={count} />

      {active && !reduced && <Burst />}
    </button>
  );
}

function ReactionPill({
  kind,
  count,
  active,
  onClick,
  compact,
}: {
  kind: ReactionKind;
  count: number;
  active: boolean;
  onClick: () => void;
  compact: boolean;
}) {
  const meta = REACTION_META[kind];
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${meta.label}${active ? " (added)" : ""}`}
      title={meta.label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-all duration-300 ease-[var(--ease-glass)] active:scale-95",
        compact ? "px-2.5 py-1 text-[0.72rem]" : "px-3 py-1.5 text-[0.78rem]",
        active
          ? "border-transparent text-fg"
          : "border-hairline bg-fg/[0.03] text-fg-muted hover:border-fg/20 hover:text-fg",
      )}
      style={active ? { background: meta.glow } : undefined}
    >
      <motion.span
        aria-hidden
        className="text-[0.95em] leading-none"
        animate={active && !reduced ? { scale: [1, 1.5, 1], y: [0, -4, 0] } : {}}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {meta.emoji}
      </motion.span>
      <AnimatedNumber value={count} />
    </button>
  );
}

/** Rolls the digits when a count changes, instead of snapping. */
function AnimatedNumber({ value }: { value: number }) {
  const text = formatCompact(value);
  return (
    <span className="relative inline-grid h-[1.1em] min-w-[1.4ch] overflow-hidden tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="col-start-1 row-start-1"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Burst() {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden>
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute left-1/2 top-1/2 size-1 rounded-full bg-cranberry-500"
          initial={{ opacity: 0.9, x: 0, y: 0, scale: 1 }}
          animate={{
            opacity: 0,
            scale: 0.2,
            x: Math.cos((index / 6) * Math.PI * 2) * 22,
            y: Math.sin((index / 6) * Math.PI * 2) * 22,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </span>
  );
}
