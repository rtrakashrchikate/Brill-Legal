import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { getBlog, getBlogs } from "@/lib/source/content";
import { formatDate } from "@/lib/utils";

export const alt = "Publication from the Rotaract Club of Pune Metro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  return (await getBlogs()).map((blog) => ({ slug: blog.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  return ogImage({
    eyebrow: blog?.category ?? "Publication",
    title: blog?.title ?? "Publication",
    meta: blog
      ? `${blog.authorName} · ${formatDate(blog.publishedAt)} · ${blog.readMinutes} min read`
      : undefined,
  });
}
