"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { EngagementBar } from "@/components/engagement/EngagementBar";
import { Badge } from "@/components/ui/Badge";
import { CoverArt } from "@/components/ui/CoverArt";
import { EmptyState, FilterChips, SearchInput, SelectFilter } from "@/components/ui/Filters";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import type { NewsItem } from "@/types";

const COVER_HEIGHT = {
  tall: "h-56",
  wide: "h-32",
  regular: "h-40",
} as const;

export function NewsGrid({ items }: { items: NewsItem[] }) {
  const [district, setDistrict] = useState("all");
  const [impact, setImpact] = useState("all");
  const [query, setQuery] = useState("");

  const districts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) counts.set(item.district, (counts.get(item.district) ?? 0) + 1);
    return [
      { value: "all", label: "All districts", count: items.length },
      ...[...counts.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([value, count]) => ({ value, label: value, count })),
    ];
  }, [items]);

  const impactAreas = useMemo(
    () => [
      { value: "all", label: "All impact areas" },
      ...[...new Set(items.map((item) => item.impactArea))]
        .sort()
        .map((value) => ({ value, label: value })),
    ],
    [items],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (district !== "all" && item.district !== district) return false;
      if (impact !== "all" && item.impactArea !== impact) return false;
      if (!needle) return true;
      return [item.title, item.summary, item.club, item.impactMetric]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [items, district, impact, query]);

  const reach = filtered.reduce((total, item) => total + item.beneficiaries, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <FilterChips
          ariaLabel="Filter district news by district"
          layoutId="news-district-filter"
          options={districts}
          value={district}
          onChange={setDistrict}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SelectFilter
            label="Impact"
            value={impact}
            onChange={setImpact}
            options={impactAreas}
            className="sm:w-auto"
          />
          <SearchInput
            label="Search district news"
            value={query}
            onChange={setQuery}
            placeholder="Search clubs, projects, outcomes…"
            className="sm:w-72"
          />
          <p className="text-[0.78rem] text-fg-muted sm:ml-auto" aria-live="polite">
            <span className="font-semibold text-fg">{filtered.length}</span> projects ·{" "}
            <span className="font-semibold text-fg">{formatNumber(reach)}</span> people reached
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No projects match those filters"
          description="Try a wider impact area, or clear the district filter to see the whole zone."
        />
      ) : (
        <div className="masonry-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, delay: (index % 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 break-inside-avoid"
              >
                <NewsCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <GlassCard interactive padding="none" className="flex flex-col">
      <Link
        href={`/news/${item.slug}`}
        aria-hidden
        tabIndex={-1}
        className={cn("relative block overflow-hidden", COVER_HEIGHT[item.weight])}
      >
        <CoverArt seed={item.id} className="size-full" />
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-1.5">
          <Badge tone="cranberry" className="bg-canvas/80 backdrop-blur">
            {item.district}
          </Badge>
          <Badge tone="royal" className="bg-canvas/80 backdrop-blur">
            {item.impactArea}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2 text-[0.72rem] text-fg-muted">
          <span className="font-medium text-fg">{item.club}</span>
          <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
        </div>

        <h3 className="text-[1.05rem] font-semibold leading-snug">
          <Link
            href={`/news/${item.slug}`}
            className="transition-colors duration-300 hover:text-cranberry-600 dark:hover:text-cranberry-400"
          >
            {item.title}
          </Link>
        </h3>
        <p className="text-[0.85rem] leading-relaxed text-fg-muted">{item.summary}</p>

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <p className="rounded-2xl border border-gold-500/25 bg-gold-500/8 px-3 py-2 text-[0.78rem] font-medium text-gold-700 dark:text-gold-300">
            {item.impactMetric}
          </p>
          <EngagementBar type="news" id={item.id} size="sm" showViews={false} />
        </div>
      </div>
    </GlassCard>
  );
}
