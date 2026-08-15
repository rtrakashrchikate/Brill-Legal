import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { getNews, getNewsItem } from "@/lib/source/content";

export const alt = "Rotaract district project";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  return (await getNews()).map((item) => ({ slug: item.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getNewsItem(slug);

  return ogImage({
    eyebrow: item?.impactArea ?? "District project",
    title: item?.title ?? "District project",
    meta: item ? `${item.club} · ${item.district} · ${item.impactMetric}` : undefined,
  });
}
