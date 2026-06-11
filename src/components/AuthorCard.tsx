import Link from "next/link";
import type { Person } from "@/data/people";
import { Reveal } from "@/components/motion";

/**
 * End-of-article author card — rich E-E-A-T signal.
 * Server component (no interactivity needed).
 */
export function AuthorCard({ author }: { author: Person }) {
  // "brill-legal" is a generic editorial slug — show a minimal card
  const isEditorial = author.slug === "brill-legal";

  return (
    <Reveal>
      <div className="mt-14 border-t border-line pt-10">
        <p className="kicker mb-5">About the author</p>

        <div className="flex flex-col gap-6 border border-line bg-paper-card p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-start">
          {/* Monogram avatar */}
          <div
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center bg-wine font-display text-xl font-semibold text-accent-soft"
          >
            {author.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {isEditorial ? (
                <span className="font-display text-lg text-ink">{author.name}</span>
              ) : (
                <Link
                  href={`/people/${author.slug}`}
                  className="font-display text-lg text-ink hover:text-accent-deep"
                >
                  {author.name}
                </Link>
              )}
              {author.title && (
                <span className="text-sm text-muted">{author.title}</span>
              )}
            </div>

            {author.enrolment && (
              <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
                {author.enrolment}
              </p>
            )}

            {author.bio && (
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {author.bio}
              </p>
            )}

            {author.focus.length > 0 && !isEditorial && (
              <div className="mt-4">
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
                  Focus areas
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {author.focus.map((f) => (
                    <li
                      key={f}
                      className="rounded-[2px] border border-line bg-paper px-2.5 py-0.5 text-xs text-ink"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!isEditorial && (
              <Link
                href={`/people/${author.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent-deep hover:underline"
              >
                Full profile →
              </Link>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
