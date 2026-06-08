import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InsightsList, type InsightItem } from "@/components/InsightsList";
import { getPublishedArticles } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Insights — Legal Guides",
  description:
    "Plain-English legal guides from Brill Legal across litigation, white-collar, real estate, family, arbitration, corporate and tribunal law.",
  path: "/insights",
});

export default function InsightsPage() {
  const items: InsightItem[] = getPublishedArticles().map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    practice: a.practice,
    type: a.type,
    readingMinutes: a.readingMinutes,
  }));

  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Insights", url: "/insights" }]} />
      <div className="mt-8">
        <SectionHeading
          kicker="Insights"
          title="Legal guides, in plain English"
          intro="A growing library of practical guides across our seven practice areas — published on a regular calendar."
        />
      </div>
      <div className="mt-10">
        <Suspense fallback={null}>
          <InsightsList items={items} />
        </Suspense>
      </div>
    </Container>
  );
}
