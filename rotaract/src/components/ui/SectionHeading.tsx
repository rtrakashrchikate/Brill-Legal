import { Reveal } from "@/components/motion/primitives";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cranberry-600 dark:text-cranberry-400",
        className,
      )}
    >
      <span aria-hidden className="h-px w-7 bg-gradient-to-r from-cranberry-600 to-transparent" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-semibold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-[0.98rem] leading-relaxed text-fg-muted sm:text-base",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
      {children}
    </Reveal>
  );
}
