import Link from "next/link";
import type { Article } from "@/lib/content";
import type { Practice } from "@/data/practices";
import { practiceMap } from "@/data/practices";

export function ArticleCard({ article }: { article: Article }) {
  const practice = practiceMap[article.practice];
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="card-lift group flex flex-col border border-line bg-paper-card p-6 shadow-[var(--shadow-card)] hover:border-accent/60"
    >
      <div className="flex items-center gap-2">
        <span className="kicker">{practice?.short ?? "Guide"}</span>
        {article.type === "pillar" && (
          <span className="rounded-[2px] bg-accent/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-accent-deep">
            Pillar
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-xl leading-snug text-ink transition-colors group-hover:text-accent-deep">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{article.description}</p>
      <span className="mt-4 flex items-center gap-1.5 text-xs text-muted">
        {article.readingMinutes} min read
        <span className="text-accent opacity-0 transition-opacity group-hover:opacity-100">
          →
        </span>
      </span>
    </Link>
  );
}

export function PracticeCard({
  practice,
  index,
}: {
  practice: Practice;
  index?: number;
}) {
  return (
    <Link
      href={`/practices/${practice.slug}`}
      className="card-lift group relative flex flex-col justify-between overflow-hidden border border-line bg-paper-card p-8 shadow-[var(--shadow-card)] hover:border-accent/60"
    >
      {typeof index === "number" && (
        <span className="pointer-events-none absolute right-5 top-4 font-display text-5xl text-line-strong/60 transition-colors group-hover:text-accent/40">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <div>
        <h3 className="font-display text-2xl leading-tight text-ink transition-colors group-hover:text-accent-deep">
          {practice.name}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          {practice.summary}
        </p>
      </div>
      <span className="mt-8 flex items-center gap-1.5 text-sm font-medium text-accent-deep">
        Explore practice
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
