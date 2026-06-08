import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { news } from "@/data/news";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "News & Updates",
  description:
    "Firm news and legal updates from Brill Legal — practice developments and plain-English commentary on changes in Indian law.",
  path: "/news",
});

export default function NewsPage() {
  const sorted = [...news].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "News", url: "/news" }]} />
      <div className="mt-8">
        <SectionHeading
          kicker="News"
          title="Firm news & legal updates"
          intro="Developments at the firm and short, practical commentary on changes in the law."
        />
      </div>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {sorted.map((n) => (
          <article key={n.slug} className="py-6">
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="kicker">{n.category}</span>
              <time dateTime={n.date}>
                {new Date(n.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </div>
            <h2 className="mt-2 text-2xl">
              <Link
                href={`/news/${n.slug}`}
                className="text-ink hover:text-accent-deep"
              >
                {n.title}
              </Link>
            </h2>
            <p className="mt-2 text-muted">{n.summary}</p>
          </article>
        ))}
      </div>
    </Container>
  );
}
