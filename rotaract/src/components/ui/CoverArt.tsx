import { cn, initials, seedFrom } from "@/lib/utils";

/**
 * Deterministic generated artwork.
 *
 * The seed data ships without photography, and a broken <img> looks worse than
 * no image at all — so covers and portraits are drawn from the record's own id.
 * The same id always produces the same artwork. Supply a real `photo` URL on a
 * member record and {@link Monogram} renders that instead.
 */

const PALETTES = [
  { from: "#D91B5C", via: "#F7A81B", to: "#0050A1" },
  { from: "#0050A1", via: "#D91B5C", to: "#F7A81B" },
  { from: "#F7A81B", via: "#D91B5C", to: "#0050A1" },
  { from: "#D91B5C", via: "#0050A1", to: "#D91B5C" },
] as const;

export function CoverArt({
  seed,
  className,
  label,
}: {
  seed: string;
  className?: string;
  label?: string;
}) {
  const hash = seedFrom(seed);
  const palette = PALETTES[hash % PALETTES.length];
  const angle = 20 + (hash % 110);
  const cx = 20 + (hash % 60);
  const cy = 25 + ((hash >> 3) % 50);
  const rings = 3 + (hash % 3);
  const id = `cover-${hash.toString(36)}`;

  return (
    <div className={cn("relative overflow-hidden", className)} aria-hidden={!label}>
      <svg
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
        className="size-full"
        role={label ? "img" : "presentation"}
        aria-label={label}
      >
        <defs>
          <linearGradient id={`${id}-base`} gradientTransform={`rotate(${angle})`}>
            <stop offset="0%" stopColor={palette.from} />
            <stop offset="52%" stopColor={palette.via} />
            <stop offset="100%" stopColor={palette.to} />
          </linearGradient>
          <radialGradient id={`${id}-glow`}>
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}-blur`}>
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        <rect width="400" height="260" fill={`url(#${id}-base)`} />
        <ellipse
          cx={cx * 4}
          cy={cy * 2}
          rx="150"
          ry="110"
          fill={`url(#${id}-glow)`}
          filter={`url(#${id}-blur)`}
        />

        {Array.from({ length: rings }).map((_, index) => (
          <circle
            key={index}
            cx={340 - index * 46}
            cy={40 + index * 34}
            r={54 + index * 26}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.16 - index * 0.03}
            strokeWidth="1.2"
          />
        ))}

        <g stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1">
          {Array.from({ length: 7 }).map((_, index) => (
            <line
              key={index}
              x1={index * 60 - 40}
              y1="0"
              x2={index * 60 + 60}
              y2="260"
            />
          ))}
        </g>
      </svg>

      {/* Keeps overlaid text legible in both themes. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />
    </div>
  );
}

export function Monogram({
  name,
  photo,
  className,
  textClassName,
}: {
  name: string;
  photo?: string;
  className?: string;
  textClassName?: string;
}) {
  const hash = seedFrom(name);
  const palette = PALETTES[hash % PALETTES.length];

  if (photo) {
    // Portraits come from arbitrary club-supplied hosts, so the optimiser would
    // need every domain declared up front. A plain <img> keeps the field open.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={name}
        loading="lazy"
        decoding="async"
        className={cn("size-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn("relative grid size-full place-items-center overflow-hidden", className)}
      style={{
        backgroundImage: `linear-gradient(135deg, ${palette.from}, ${palette.via} 55%, ${palette.to})`,
      }}
      aria-hidden
    >
      <span
        className="absolute -right-6 -top-8 size-24 rounded-full bg-white/20 blur-2xl"
        aria-hidden
      />
      <span
        className={cn(
          "relative font-display text-2xl font-semibold tracking-tight text-white drop-shadow-sm",
          textClassName,
        )}
      >
        {initials(name)}
      </span>
    </div>
  );
}
