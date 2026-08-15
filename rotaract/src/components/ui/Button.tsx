import Link from "next/link";

import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "royal" | "glass" | "ghost";
type Size = "sm" | "md" | "lg";

const BASE =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap " +
  "transition-[transform,box-shadow,background-color,color] duration-300 ease-[var(--ease-glass)] " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-55";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-cranberry-600 text-white shadow-[0_16px_40px_-16px_rgb(217_27_92/0.9)] hover:bg-cranberry-700 hover:shadow-[0_22px_54px_-18px_rgb(217_27_92/0.95)] hover:-translate-y-0.5",
  gold: "bg-gold-500 text-ink-950 shadow-[0_16px_40px_-16px_rgb(247_168_27/0.85)] hover:bg-gold-400 hover:-translate-y-0.5",
  royal:
    "bg-royal-700 text-white shadow-[0_16px_40px_-16px_rgb(0_80_161/0.85)] hover:bg-royal-800 hover:-translate-y-0.5",
  glass:
    "glass text-fg hover:-translate-y-0.5 hover:border-cranberry-600/35 hover:text-cranberry-600 dark:hover:text-cranberry-400",
  ghost: "text-fg-muted hover:bg-fg/5 hover:text-fg",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8rem]",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-[0.95rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={cn(BASE, VARIANTS[variant], SIZES[size], className)}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...rest
}: CommonProps & React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link {...rest} href={href} className={cn(BASE, VARIANTS[variant], SIZES[size], className)}>
      {children}
    </Link>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("transition-transform duration-300 ease-[var(--ease-glass)]", className)}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
