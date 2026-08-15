"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { BlogCard } from "@/components/blogs/BlogCard";
import { EmptyState, FilterChips, SearchInput } from "@/components/ui/Filters";
import type { Blog } from "@/types";

export function BlogGrid({ blogs }: { blogs: Blog[] }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const blog of blogs) counts.set(blog.category, (counts.get(blog.category) ?? 0) + 1);
    return [
      { value: "all", label: "All writing", count: blogs.length },
      ...[...counts.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([value, count]) => ({ value, label: value, count })),
    ];
  }, [blogs]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return blogs.filter((blog) => {
      if (category !== "all" && blog.category !== category) return false;
      if (!needle) return true;
      return [blog.title, blog.excerpt, blog.authorName, ...blog.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [blogs, category, query]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips
          ariaLabel="Filter posts by category"
          layoutId="blog-filter"
          options={categories}
          value={category}
          onChange={setCategory}
        />
        <SearchInput
          label="Search posts"
          value={query}
          onChange={setQuery}
          placeholder="Search titles, tags, authors…"
          className="lg:w-72"
        />
      </div>

      <p aria-live="polite" className="sr-only">
        {filtered.length} posts match the current filters.
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nothing matches that yet"
          description="Try a different category, or clear the search to see everything the club has published."
        />
      ) : (
        <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((blog) => (
              <motion.div
                key={blog.id}
                layout
                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
