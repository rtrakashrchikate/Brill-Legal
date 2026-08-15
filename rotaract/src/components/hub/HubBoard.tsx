"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { EngagementBar } from "@/components/engagement/EngagementBar";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { CopyButton, MailIcon, WhatsAppIcon } from "@/components/ui/CopyButton";
import { EmptyState, FilterChips, SearchInput, SelectFilter } from "@/components/ui/Filters";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn, formatDate, relativeFromNow } from "@/lib/utils";
import type { RequestCategory, RequestUrgency, ResourceRequest } from "@/types";

const CATEGORY_META: Record<RequestCategory, { label: string; emoji: string; tone: string }> = {
  blood: { label: "Blood", emoji: "🩸", tone: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300" },
  funding: { label: "Funding", emoji: "💛", tone: "border-gold-500/30 bg-gold-500/10 text-gold-700 dark:text-gold-300" },
  collaboration: { label: "Collaboration", emoji: "🤝", tone: "border-royal-700/25 bg-royal-700/10 text-royal-700 dark:text-royal-300" },
  volunteers: { label: "Volunteers", emoji: "🙋", tone: "border-cranberry-600/25 bg-cranberry-600/10 text-cranberry-600 dark:text-cranberry-300" },
  materials: { label: "Materials", emoji: "📦", tone: "border-hairline bg-fg/5 text-fg-muted" },
  mentorship: { label: "Mentorship", emoji: "🧭", tone: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
};

const URGENCY_TONE: Record<RequestUrgency, "danger" | "gold" | "neutral"> = {
  critical: "danger",
  high: "gold",
  normal: "neutral",
};

export function HubBoard({ requests }: { requests: ResourceRequest[] }) {
  const [category, setCategory] = useState("all");
  const [district, setDistrict] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const request of requests)
      counts.set(request.category, (counts.get(request.category) ?? 0) + 1);
    return [
      { value: "all", label: "Everything", count: requests.length },
      ...(Object.keys(CATEGORY_META) as RequestCategory[])
        .filter((key) => counts.has(key))
        .map((key) => ({
          value: key,
          label: CATEGORY_META[key].label,
          count: counts.get(key),
        })),
    ];
  }, [requests]);

  const districts = useMemo(
    () => [
      { value: "all", label: "All districts" },
      ...[...new Set(requests.map((r) => r.district))].sort().map((value) => ({
        value,
        label: value,
      })),
    ],
    [requests],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return requests.filter((request) => {
      if (category !== "all" && request.category !== category) return false;
      if (district !== "all" && request.district !== district) return false;
      if (verifiedOnly && !request.isVerified) return false;
      if (!needle) return true;
      return [request.title, request.description, request.city, request.postedByClub]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [requests, category, district, verifiedOnly, query]);

  const open = filtered.filter((request) => request.status === "open");
  const closed = filtered.filter((request) => request.status !== "open");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <FilterChips
          ariaLabel="Filter requests by what is needed"
          layoutId="hub-category-filter"
          options={categories}
          value={category}
          onChange={setCategory}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SelectFilter
            label="District"
            value={district}
            onChange={setDistrict}
            options={districts}
          />
          <SearchInput
            label="Search requests"
            value={query}
            onChange={setQuery}
            placeholder="Search requests, clubs, cities…"
            className="sm:w-72"
          />
          <button
            type="button"
            onClick={() => setVerifiedOnly((value) => !value)}
            aria-pressed={verifiedOnly}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[0.8rem] font-medium transition-all duration-300",
              verifiedOnly
                ? "border-cranberry-600/40 bg-cranberry-600/12 text-cranberry-600 dark:text-cranberry-300"
                : "border-hairline bg-fg/[0.03] text-fg-muted hover:text-fg",
            )}
          >
            <span
              className={cn(
                "grid size-4 place-items-center rounded-full border transition-colors",
                verifiedOnly ? "border-cranberry-600 bg-cranberry-600" : "border-fg-muted/50",
              )}
              aria-hidden
            >
              {verifiedOnly && (
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12.5 4.5 4.5L19 7" />
                </svg>
              )}
            </span>
            Verified only
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No open asks match those filters"
          description="Widen the district or clear the category — the board covers the whole zone, not just this club."
        />
      ) : (
        <>
          <motion.div layout className="grid gap-5 lg:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {open.map((request) => (
                <motion.div
                  key={request.id}
                  layout
                  initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                >
                  <RequestCard request={request} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {closed.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-fg-muted">
                Closed &amp; fulfilled
              </h3>
              <div className="grid gap-5 lg:grid-cols-2">
                {closed.map((request) => (
                  <RequestCard key={request.id} request={request} muted />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function RequestCard({
  request,
  muted = false,
}: {
  request: ResourceRequest;
  muted?: boolean;
}) {
  const meta = CATEGORY_META[request.category];

  return (
    <GlassCard
      interactive={!muted}
      padding="none"
      className={cn("flex h-full flex-col", muted && "opacity-70")}
    >
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.72rem] font-medium",
              meta.tone,
            )}
          >
            <span aria-hidden>{meta.emoji}</span>
            {meta.label}
          </span>

          {request.status === "open" ? (
            <Badge tone={URGENCY_TONE[request.urgency]}>
              {request.urgency === "critical"
                ? "Critical"
                : request.urgency === "high"
                  ? "High priority"
                  : "Normal"}
            </Badge>
          ) : (
            <Badge tone="success">Fulfilled</Badge>
          )}

          <span className="ml-auto">
            {request.isVerified ? (
              <VerifiedBadge />
            ) : (
              <Badge tone="neutral" className="border-dashed">
                Unverified poster
              </Badge>
            )}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-[1.05rem] font-semibold leading-snug sm:text-lg">
            {request.title}
          </h3>
          <p className="text-[0.86rem] leading-relaxed text-fg-muted">{request.description}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-hairline bg-fg/[0.02] p-3 text-[0.76rem]">
          <div>
            <dt className="text-fg-muted">Where</dt>
            <dd className="font-medium">
              {request.city} · {request.district}
            </dd>
          </div>
          <div>
            <dt className="text-fg-muted">Needed by</dt>
            <dd className="font-medium">{formatDate(request.needBy)}</dd>
          </div>
          <div>
            <dt className="text-fg-muted">Posted by</dt>
            <dd className="font-medium">
              {request.contactName} · {request.postedByClub}
            </dd>
          </div>
          <div>
            <dt className="text-fg-muted">Posted</dt>
            <dd className="font-medium">{relativeFromNow(request.createdAt)}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center gap-2">
          <CopyButton
            value={request.contactWhatsapp}
            label={request.contactWhatsapp}
            icon={<WhatsAppIcon />}
          />
          <CopyButton value={request.contactEmail} label="Email" icon={<MailIcon />} />
        </div>

        <div className="mt-auto border-t border-hairline pt-3">
          <EngagementBar type="request" id={request.id} size="sm" />
        </div>
      </div>
    </GlassCard>
  );
}
