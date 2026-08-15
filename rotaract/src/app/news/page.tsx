import type { Metadata } from "next";

import { CtaBand } from "@/components/home/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { NewsGrid } from "@/components/news/NewsGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, canonical, itemListSchema } from "@/lib/seo";
import { Badge } from "@/components/ui/Badge";
import { getNews } from "@/lib/source/content";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Rotaract News",
  description:
    "Community service projects from Rotaract clubs across six districts, filterable by district and Rotary impact area.",
  alternates: canonical("/news"),
};

export default async function NewsPage() {
  const news = await getNews();
  const districts = new Set(news.map((item) => item.district));
  const reach = news.reduce((total, item) => total + item.beneficiaries, 0);

  return (
    <>
      <JsonLd
        schema={[
          itemListSchema(
            "Rotaract News",
            "/news",
            news.map((item) => ({ name: item.title, path: `/news/${item.slug}` })),
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Rotaract News", path: "/news" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="Rotaract news"
        title="What the rest of the district managed to pull off."
        description="An aggregated feed of completed community-service projects from clubs across the zone. Filter by district or impact area — and note how many of these publish their failures alongside their headline numbers."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="cranberry">{news.length} projects</Badge>
          <Badge tone="royal">{districts.size} districts</Badge>
          <Badge tone="gold">{formatNumber(reach)} people reached</Badge>
        </div>
      </PageHeader>

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <NewsGrid items={news} />
      </section>

      <CtaBand />
    </>
  );
}
