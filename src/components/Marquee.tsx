import type { ReactNode } from "react";

/** CSS-driven infinite marquee (pauses for reduced-motion via globals). */
export function Marquee({
  items,
  className = "",
}: {
  items: ReactNode[];
  className?: string;
}) {
  const row = (
    <div className="marquee" aria-hidden>
      {[...items, ...items].map((it, i) => (
        <span
          key={i}
          className="mx-6 flex items-center gap-3 whitespace-nowrap text-sm text-muted"
        >
          {it}
          <span className="text-accent">◆</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      {row}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent" />
    </div>
  );
}
