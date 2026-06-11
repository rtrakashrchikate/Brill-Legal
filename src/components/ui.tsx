import Link from "next/link";
import type { ReactNode } from "react";

/** Page-width container. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

/** Narrow reading column for long-form content. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose max-w-none">{children}</div>;
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker">{children}</p>;
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
  external?: boolean;
};

export function Button({
  href,
  children,
  variant = "solid",
  className = "",
  external,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium tracking-wide transition-colors rounded-[2px]";
  const styles = {
    solid: "bg-ink text-paper hover:bg-ink-soft",
    outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
    ghost: "text-ink hover:text-accent-deep",
  }[variant];
  const cls = `${base} ${styles} ${className}`;
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function SectionHeading({
  kicker,
  title,
  intro,
}: {
  kicker?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2 className="mt-3 font-display text-4xl leading-[1.08] sm:text-5xl">
        {title}
      </h2>
      <div className="gold-rule mt-4" />
      {intro && (
        <p className="mt-5 text-lg leading-relaxed text-muted">{intro}</p>
      )}
    </div>
  );
}
