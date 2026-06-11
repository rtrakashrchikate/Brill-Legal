import Link from "next/link";
import type { Article } from "@/lib/content";
import { Reveal } from "@/components/motion";

/**
 * Prev / Next article navigation shown at the end of an article.
 * Both slots are optional — pass null when there's no adjacent article.
 */
export function ArticleNav({
  prev,
  next,
}: {
  prev: Article | null;
  next: Article | null;
}) {
  if (!prev && !next) return null;

  return (
    <Reveal>
      <nav
        aria-label="Article navigation"
        className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2"
      >
        {prev ? (
          <Link
            href={`/insights/${prev.slug}`}
            className="group flex flex-col gap-1.5 bg-paper-card p-6 transition-colors hover:bg-paper-dim/40"
          >
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted">
              ← Previous
            </span>
            <span className="font-display text-base leading-snug text-ink transition-colors group-hover:text-accent-deep">
              {prev.title}
            </span>
          </Link>
        ) : (
          /* Empty slot so Next stays right-aligned */
          <span className="bg-paper-card" aria-hidden />
        )}

        {next ? (
          <Link
            href={`/insights/${next.slug}`}
            className="group flex flex-col items-end gap-1.5 bg-paper-card p-6 text-right transition-colors hover:bg-paper-dim/40"
          >
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted">
              Next →
            </span>
            <span className="font-display text-base leading-snug text-ink transition-colors group-hover:text-accent-deep">
              {next.title}
            </span>
          </Link>
        ) : (
          <span className="bg-paper-card" aria-hidden />
        )}
      </nav>
    </Reveal>
  );
}
