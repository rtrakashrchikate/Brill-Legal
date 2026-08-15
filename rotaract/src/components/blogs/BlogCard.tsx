import Link from "next/link";

import { EngagementBar } from "@/components/engagement/EngagementBar";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "@/components/ui/Button";
import { CoverArt, Monogram } from "@/components/ui/CoverArt";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn, formatDate } from "@/lib/utils";
import type { Blog } from "@/types";

export function BlogCard({ blog, featured = false }: { blog: Blog; featured?: boolean }) {
  return (
    <GlassCard
      interactive
      padding="none"
      className={cn("flex h-full flex-col", featured && "lg:flex-row")}
    >
      <Link
        href={`/blogs/${blog.slug}`}
        className={cn(
          "relative block shrink-0 overflow-hidden",
          featured ? "h-52 lg:h-auto lg:w-[42%]" : "h-44",
        )}
        tabIndex={-1}
        aria-hidden
      >
        <CoverArt seed={blog.id} className="size-full" />
        <span className="absolute bottom-3 left-3">
          <Badge tone="gold">{blog.category}</Badge>
        </span>
      </Link>

      <div className={cn("flex flex-1 flex-col gap-3 p-5 sm:p-6", featured && "lg:p-8")}>
        <div className="flex items-center gap-2 text-[0.72rem] text-fg-muted">
          <time dateTime={blog.publishedAt}>{formatDate(blog.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{blog.readMinutes} min read</span>
        </div>

        <h3
          className={cn(
            "font-semibold leading-snug",
            featured ? "text-xl sm:text-2xl" : "text-lg",
          )}
        >
          <Link
            href={`/blogs/${blog.slug}`}
            className="transition-colors duration-300 hover:text-cranberry-600 dark:hover:text-cranberry-400"
          >
            {blog.title}
          </Link>
        </h3>

        <p className="line-clamp-3 text-[0.86rem] leading-relaxed text-fg-muted">
          {blog.excerpt}
        </p>

        <div className="mt-auto flex flex-col gap-4 pt-3">
          <div className="flex items-center gap-2.5">
            <span className="size-8 overflow-hidden rounded-full">
              <Monogram name={blog.authorName} textClassName="text-[0.7rem]" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.8rem] font-medium">{blog.authorName}</span>
              <span className="text-[0.68rem] text-fg-muted">{blog.authorRole}</span>
            </span>
            <Link
              href={`/blogs/${blog.slug}`}
              className="group/read ml-auto inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-cranberry-600 dark:text-cranberry-400"
            >
              Read
              <ArrowRight className="size-3.5 group-hover/read:translate-x-1" />
            </Link>
          </div>

          <EngagementBar type="blog" id={blog.id} size="sm" />
        </div>
      </div>
    </GlassCard>
  );
}
