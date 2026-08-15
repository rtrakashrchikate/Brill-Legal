import { cn } from "@/lib/utils";

/**
 * The ambient gradient field that sits behind heroes and section breaks.
 * Pure CSS so it costs nothing on the main thread, and it is `aria-hidden`
 * decoration — never a carrier of meaning.
 */
export function Aurora({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "soft" | "band";
}) {
  return (
    <div className={cn("aurora", className)} aria-hidden>
      {variant === "hero" && (
        <>
          <span className="absolute -top-40 -left-24 size-[38rem] rounded-full bg-[var(--blob-a)] blur-[110px] animate-[var(--animate-drift)]" />
          <span className="absolute -top-24 right-[-12%] size-[32rem] rounded-full bg-[var(--blob-c)] blur-[120px] animate-[var(--animate-drift-slow)]" />
          <span className="absolute top-[42%] left-[38%] size-[26rem] rounded-full bg-[var(--blob-b)] blur-[130px] animate-[var(--animate-drift)]" />
          <span className="grid-fade absolute inset-0" />
        </>
      )}

      {variant === "soft" && (
        <>
          <span className="absolute -top-32 left-[10%] size-[26rem] rounded-full bg-[var(--blob-a)] blur-[120px] animate-[var(--animate-drift-slow)]" />
          <span className="absolute bottom-[-20%] right-[5%] size-[24rem] rounded-full bg-[var(--blob-c)] blur-[130px] animate-[var(--animate-drift)]" />
        </>
      )}

      {variant === "band" && (
        <>
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cranberry-600/40 to-transparent" />
          <span className="absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--blob-a)] blur-[140px]" />
        </>
      )}
    </div>
  );
}
