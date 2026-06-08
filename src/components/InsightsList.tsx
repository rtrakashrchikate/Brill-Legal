"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { practices } from "@/data/practices";

export type InsightItem = {
  slug: string;
  title: string;
  description: string;
  practice: string;
  type: string;
  readingMinutes: number;
};

const practiceLabel: Record<string, string> = Object.fromEntries(
  practices.map((p) => [p.slug, p.short]),
);

export function InsightsList({
  items,
  initialQuery = "",
}: {
  items: InsightItem[];
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [practice, setPractice] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((a) => {
      if (practice && a.practice !== practice) return false;
      if (!term) return true;
      return (
        a.title.toLowerCase().includes(term) ||
        a.description.toLowerCase().includes(term)
      );
    });
  }, [items, q, practice]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search guides…"
          className="flex-1 border border-line bg-paper-card px-4 py-2.5 text-sm"
          aria-label="Search insights"
        />
        <select
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
          className="border border-line bg-paper-card px-3 py-2.5 text-sm"
          aria-label="Filter by practice"
        >
          <option value="">All practices</option>
          {practices.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-muted">
        {filtered.length} {filtered.length === 1 ? "guide" : "guides"}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <Link
            key={a.slug}
            href={`/insights/${a.slug}`}
            className="group flex flex-col border border-line bg-paper-card p-6 transition-colors hover:border-accent"
          >
            <div className="flex items-center gap-2">
              <span className="kicker">{practiceLabel[a.practice] ?? "Guide"}</span>
              {a.type === "pillar" && (
                <span className="rounded-[2px] bg-accent/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-accent-deep">
                  Pillar
                </span>
              )}
            </div>
            <h3 className="mt-3 text-xl leading-snug text-ink group-hover:text-accent-deep">
              {a.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm text-muted">
              {a.description}
            </p>
            <span className="mt-4 text-xs text-muted">
              {a.readingMinutes} min read
            </span>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-muted">
          No guides match your search. Try a different term or browse by
          practice.
        </p>
      )}
    </div>
  );
}
