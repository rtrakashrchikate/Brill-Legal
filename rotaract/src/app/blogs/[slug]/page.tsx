import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blogs/BlogCard";
import { EngagementBar } from "@/components/engagement/EngagementBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/motion/primitives";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "@/components/ui/Button";
import { Aurora } from "@/components/ui/Aurora";
import { CoverArt, Monogram } from "@/components/ui/CoverArt";
import { GlassCard } from "@/components/ui/GlassCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { articleSchema, canonical } from "@/lib/seo";
import { getBlog, getBlogs } from "@/lib/source/content";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Post not found" };

  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: canonical(`/blogs/${blog.slug}`),
    authors: [{ name: blog.authorName }],
    keywords: blog.tags,
    openGraph: {
      type: "article",
      title: blog.title,
      description: blog.excerpt,
      publishedTime: blog.publishedAt,
      authors: [blog.authorName],
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  const related = (await getBlogs())
    .filter((item) => item.id !== blog.id && item.category === blog.category)
    .slice(0, 2);

  return (
    <>
      <JsonLd schema={articleSchema(blog)} />

      <article className="relative isolate">
        <Aurora variant="soft" />

        <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6">
          <Reveal y={12}>
            <Breadcrumbs
              trail={[
                { name: "Home", path: "/" },
                { name: "Blogs", path: "/blogs" },
                { name: blog.title, path: `/blogs/${blog.slug}` },
              ]}
            />
          </Reveal>

          <Reveal delay={0.05} className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone="gold">{blog.category}</Badge>
            {blog.tags.map((tag) => (
              <Badge key={tag} tone="neutral">
                {tag}
              </Badge>
            ))}
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-5 font-display text-[2.1rem] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-[2.9rem]">
              {blog.title}
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-fg-muted">{blog.excerpt}</p>
          </Reveal>

          <Reveal delay={0.2} className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="size-10 overflow-hidden rounded-full">
                <Monogram name={blog.authorName} textClassName="text-sm" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[0.86rem] font-medium">{blog.authorName}</span>
                <span className="text-[0.72rem] text-fg-muted">{blog.authorRole}</span>
              </span>
            </div>
            <span className="text-[0.78rem] text-fg-muted">
              <time dateTime={blog.publishedAt}>{formatDate(blog.publishedAt)}</time> ·{" "}
              {blog.readMinutes} min read
            </span>
          </Reveal>
        </div>

        <div className="relative mx-auto mt-10 w-full max-w-4xl px-4 sm:px-6">
          <Reveal delay={0.1}>
            <CoverArt
              seed={blog.id}
              className="h-56 w-full rounded-3xl sm:h-80"
              label={`Cover artwork for ${blog.title}`}
            />
          </Reveal>
        </div>

        <div className="relative mx-auto mt-12 w-full max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col gap-5">
            {blog.body.map((block, index) =>
              block.startsWith("## ") ? (
                <Reveal key={index} y={14}>
                  <h2 className="mt-6 font-display text-[1.5rem] font-semibold tracking-tight sm:text-[1.7rem]">
                    {block.replace("## ", "")}
                  </h2>
                </Reveal>
              ) : (
                <Reveal key={index} y={14}>
                  <p className="text-[1.02rem] leading-[1.85] text-fg/90">{block}</p>
                </Reveal>
              ),
            )}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-8">
            <p className="text-[0.8rem] text-fg-muted">
              Found this useful? React below — no account needed.
            </p>
            <EngagementBar type="blog" id={blog.id} trackView />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-24 w-full max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold">More in {blog.category}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {related.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.08}>
                <BlogCard blog={item} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6">
        <GlassCard padding="lg" accent="cranberry" className="text-center">
          <h2 className="font-display text-xl font-semibold">
            Running something similar in your club?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[0.88rem] text-fg-muted">
            Post what you need on the Requirement Hub — or read what other clubs are asking for.
            Reading needs no account.
          </p>
          <Link
            href="/hub"
            className="mt-5 inline-flex items-center gap-2 text-[0.85rem] font-medium text-cranberry-600 dark:text-cranberry-400"
          >
            Open the Requirement Hub
            <ArrowRight className="size-4" />
          </Link>
        </GlassCard>
      </section>
    </>
  );
}
