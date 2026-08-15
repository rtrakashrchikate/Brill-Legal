import type { Metadata } from "next";

import { BlogCard } from "@/components/blogs/BlogCard";
import { BlogGrid } from "@/components/blogs/BlogGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/primitives";
import { CtaBand } from "@/components/home/CtaBand";
import { getBlogs } from "@/lib/source/content";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Playbooks, field notes and data from the Rotaract Club of Pune Metro — written by the people who ran the projects.",
};

export default async function BlogsPage() {
  const blogs = await getBlogs();
  const [lead, ...rest] = blogs;

  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="What we learned, written down properly."
        description="Every piece here comes out of a project the club actually ran. Where a number is uncomfortable, it is printed anyway — that is the house style."
      />

      {lead && (
        <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6">
          <Reveal>
            <BlogCard blog={lead} featured />
          </Reveal>
        </section>
      )}

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <BlogGrid blogs={rest} />
      </section>

      <CtaBand />
    </>
  );
}
