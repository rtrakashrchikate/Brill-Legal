import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Adds the pointer-follow highlight and lift on hover. */
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  accent?: "none" | "cranberry" | "gold" | "royal";
}

const PADDING = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-7",
  lg: "p-7 sm:p-10",
} as const;

const ACCENT_GLOW = {
  none: "",
  cranberry: "before:from-cranberry-600/70",
  gold: "before:from-gold-500/70",
  royal: "before:from-royal-700/70",
} as const;

export function GlassCard({
  children,
  className,
  interactive = false,
  padding = "md",
  accent = "none",
  ...rest
}: GlassCardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "glass-panel glass-sheen",
        PADDING[padding],
        interactive &&
          "group/card transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-glass)] hover:-translate-y-1.5 hover:border-cranberry-600/30 hover:shadow-[0_32px_80px_-32px_rgb(217_27_92/0.45)]",
        accent !== "none" &&
          cn(
            "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:to-transparent",
            ACCENT_GLOW[accent],
          ),
        className,
      )}
    >
      {children}
    </div>
  );
}
