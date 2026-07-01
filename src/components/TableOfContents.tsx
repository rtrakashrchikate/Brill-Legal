"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";

type Heading = { id: string; text: string; level: 2 | 3 };

/**
 * Sticky "On this page" table of contents.
 * Reads rendered ## / ### headings from the DOM (works for both Markdown
 * and HTML body formats), tracks the active heading via IntersectionObserver,
 * and gates all motion on prefers-reduced-motion.
 *
 * Mount inside the article <aside> — it self-hides when no headings exist.
 */
export function TableOfContents({
  articleSelector = ".article-body",
}: {
  articleSelector?: string;
}) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const reduce = useReducedMotion();

  /* ── Collect headings after first paint ─────────────────────── */
  useEffect(() => {
    const article = document.querySelector(articleSelector);
    if (!article) return;

    const els = Array.from(
      article.querySelectorAll<HTMLElement>("h2, h3"),
    );

    const collected: Heading[] = els.map((el, i) => {
      // Ensure each heading has a stable id for anchor links
      if (!el.id) {
        el.id =
          el.textContent
            ?.toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .slice(0, 60) ?? `heading-${i}`;
      }
      return {
        id: el.id,
        text: el.textContent?.trim() ?? "",
        level: el.tagName === "H2" ? 2 : 3,
      };
    });

    setHeadings(collected);
    if (collected[0]) setActiveId(collected[0].id);
  }, [articleSelector]);

  /* ── Track active heading via IntersectionObserver ──────────── */
  useEffect(() => {
    if (!headings.length) return;

    observerRef.current?.disconnect();

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    observerRef.current = io;
    return () => io.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav
      aria-label="On this page"
      className="border border-line bg-paper-card shadow-[var(--shadow-card)]"
    >
      {/* Header row */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="kicker">On this page</span>
        <span
          aria-hidden
          className={[
            "text-xs text-muted transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90",
          ].join(" ")}
        >
          ▾
        </span>
      </button>

      {/* Collapsible list */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="toc-list"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <ol className="space-y-0.5 px-4 pb-5 pt-1">
              {headings.map(({ id, text, level }) => {
                const isActive = id === activeId;
                return (
                  <li key={id} className={level === 3 ? "pl-3" : ""}>
                    <a
                      href={`#${id}`}
                      className={[
                        "group relative flex items-start gap-2 py-1 text-[0.8rem] leading-snug transition-colors duration-150",
                        isActive
                          ? "font-medium text-accent-deep"
                          : "text-muted hover:text-ink",
                      ].join(" ")}
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById(id)
                          ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
                      }}
                    >
                      {/* Active indicator pill */}
                      <span
                        aria-hidden
                        className={[
                          "mt-[0.35em] h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200",
                          isActive
                            ? "scale-125 bg-accent"
                            : "bg-line-strong group-hover:bg-accent/50",
                        ].join(" ")}
                      />
                      {text}
                    </a>
                  </li>
                );
              })}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
