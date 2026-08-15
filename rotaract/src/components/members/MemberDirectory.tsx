"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { EngagementBar } from "@/components/engagement/EngagementBar";
import { Tilt } from "@/components/motion/primitives";
import { Badge } from "@/components/ui/Badge";
import { CopyButton, MailIcon, WhatsAppIcon } from "@/components/ui/CopyButton";
import { Monogram } from "@/components/ui/CoverArt";
import { EmptyState, FilterChips, SearchInput, SelectFilter } from "@/components/ui/Filters";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import type { Member } from "@/types";

const CATEGORY_LABEL: Record<string, string> = {
  all: "Everyone",
  bod: "Board of Directors",
  member: "Members",
  alumni: "Alumni",
};

export function MemberDirectory({ members }: { members: Member[] }) {
  const [category, setCategory] = useState("bod");
  const [year, setYear] = useState("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Member | null>(null);

  const years = useMemo(
    () => [
      { value: "all", label: "All years" },
      ...[...new Set(members.map((m) => m.year))]
        .sort()
        .reverse()
        .map((value) => ({ value, label: value })),
    ],
    [members],
  );

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const member of members)
      counts.set(member.category, (counts.get(member.category) ?? 0) + 1);
    return [
      { value: "all", label: CATEGORY_LABEL.all, count: members.length },
      ...["bod", "member", "alumni"]
        .filter((key) => counts.has(key))
        .map((key) => ({
          value: key,
          label: CATEGORY_LABEL[key],
          count: counts.get(key),
        })),
    ];
  }, [members]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return members.filter((member) => {
      if (category !== "all" && member.category !== category) return false;
      if (year !== "all" && member.year !== year) return false;
      if (!needle) return true;
      return [member.name, member.role, member.avenue ?? "", member.bio]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [members, category, year, query]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <FilterChips
          ariaLabel="Filter the directory by role"
          layoutId="member-category-filter"
          options={categories}
          value={category}
          onChange={setCategory}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SelectFilter label="Year" value={year} onChange={setYear} options={years} />
          <SearchInput
            label="Search members"
            value={query}
            onChange={setQuery}
            placeholder="Search by name, portfolio or avenue…"
            className="sm:w-80"
          />
          <p className="text-[0.78rem] text-fg-muted sm:ml-auto" aria-live="polite">
            <span className="font-semibold text-fg">{filtered.length}</span> people
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No one matches that search"
          description="Try another year, or switch to Everyone to see the full roster including alumni."
        />
      ) : (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((member, index) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.42, delay: (index % 8) * 0.03, ease: [0.16, 1, 0.3, 1] }}
              >
                <MemberCard member={member} onOpen={() => setActive(member)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <MemberSheet member={active} onClose={() => setActive(null)} />
    </div>
  );
}

function MemberCard({ member, onOpen }: { member: Member; onOpen: () => void }) {
  return (
    <Tilt strength={7} className="h-full">
      <GlassCard interactive padding="none" className="flex h-full flex-col">
        <button
          type="button"
          onClick={onOpen}
          className="group/photo relative block aspect-[4/5] w-full overflow-hidden text-left"
          aria-label={`Open profile for ${member.name}`}
        >
          <Monogram
            name={member.name}
            photo={member.photo}
            textClassName="text-4xl"
            className="transition-transform duration-700 ease-[var(--ease-glass)] group-hover/photo:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/15 to-transparent" />

          <span className="absolute inset-x-4 bottom-4 flex flex-col gap-1.5 text-white">
            <span className="font-display text-lg font-semibold leading-tight">
              {member.name}
            </span>
            <span className="text-[0.78rem] text-white/85">{member.role}</span>
          </span>

          {/* Sits on generated gradient art, so it needs its own dark ground
              rather than a theme-tinted one. */}
          <span className="absolute right-3 top-3">
            <Badge
              tone="neutral"
              className={cn(
                "border-white/20 bg-ink-950/55 text-white backdrop-blur",
                member.category === "bod" && "border-white/35 font-semibold",
              )}
            >
              {member.year}
            </Badge>
          </span>
        </button>

        <div className="flex flex-1 flex-col gap-3 p-4">
          {member.avenue && (
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-fg-muted">
              {member.avenue}
            </p>
          )}
          <p className="line-clamp-2 text-[0.82rem] leading-relaxed text-fg-muted">
            {member.bio}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
            <CopyButton value={member.whatsapp} label="WhatsApp" icon={<WhatsAppIcon />} />
            <CopyButton value={member.email} label="Email" icon={<MailIcon />} />
          </div>

          <EngagementBar type="member" id={member.id} size="sm" showViews={false} />
        </div>
      </GlassCard>
    </Tilt>
  );
}

function MemberSheet({ member, onClose }: { member: Member | null; onClose: () => void }) {
  useEffect(() => {
    if (!member) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [member, onClose]);

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] grid place-items-end sm:place-items-center sm:p-6"
        >
          <button
            type="button"
            aria-label="Close profile"
            onClick={onClose}
            className="absolute inset-0 bg-ink-950/55 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${member.name} — ${member.role}`}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel glass-sheen relative max-h-[88dvh] w-full overflow-y-auto sm:max-w-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile"
              className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-canvas/70 text-fg backdrop-blur transition-colors hover:text-cranberry-600"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>

            <div className="flex flex-col gap-6 sm:flex-row sm:gap-0">
              <div className="relative h-56 shrink-0 sm:h-auto sm:w-56">
                <Monogram name={member.name} photo={member.photo} textClassName="text-5xl" />
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="cranberry">{member.role}</Badge>
                    <Badge tone="neutral">{member.year}</Badge>
                    <Badge tone="royal">Member since {member.since}</Badge>
                  </div>
                  <h2 className="font-display text-2xl font-semibold">{member.name}</h2>
                  {member.avenue && (
                    <p className="text-[0.8rem] text-fg-muted">{member.avenue}</p>
                  )}
                </div>

                <p className="text-[0.9rem] leading-relaxed text-fg-muted">{member.bio}</p>

                {member.highlights.length > 0 && (
                  <ul className="flex flex-col gap-1.5">
                    {member.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2 text-[0.84rem] text-fg-muted"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap gap-2 border-t border-hairline pt-4">
                  <CopyButton value={member.whatsapp} label={member.whatsapp} icon={<WhatsAppIcon />} />
                  <CopyButton value={member.email} label={member.email} icon={<MailIcon />} />
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center rounded-full border border-hairline bg-fg/[0.03] px-3 py-1.5 text-[0.78rem] text-fg-muted transition-colors hover:text-cranberry-600"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>

                <EngagementBar type="member" id={member.id} trackView size="sm" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
