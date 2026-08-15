import { cn } from "@/lib/utils";

type Tone = "neutral" | "cranberry" | "gold" | "royal" | "success" | "danger";

const TONES: Record<Tone, string> = {
  neutral: "border-hairline bg-fg/5 text-fg-muted",
  cranberry: "border-cranberry-600/25 bg-cranberry-600/10 text-cranberry-700 dark:text-cranberry-300",
  gold: "border-gold-500/30 bg-gold-500/12 text-gold-700 dark:text-gold-300",
  royal: "border-royal-700/25 bg-royal-700/10 text-royal-700 dark:text-royal-300",
  success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  danger: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-medium tracking-wide",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * The Requirement Hub trust marker. Rendered only when the posting account
 * carried `is_verified_rotaractor: true` at submission time.
 */
export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      title="Posted by a verified Rotaractor"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]",
        "bg-gradient-to-r from-cranberry-600 to-cranberry-500 text-white",
        "shadow-[0_8px_22px_-10px_rgb(217_27_92/0.9)]",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
        <path d="M12 1.6 15 4l3.8-.4 1 3.7 3 2.4-1.7 3.4 1.7 3.4-3 2.4-1 3.7L15 22l-3 2.4L9 22l-3.8.4-1-3.7-3-2.4L2.9 13 1.2 9.6l3-2.4 1-3.7L9 4l3-2.4Z" />
        <path
          d="m8.4 12.4 2.5 2.5 4.8-5"
          fill="none"
          stroke="var(--color-cranberry-700)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Verified
    </span>
  );
}
