import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { allResources } from "@/lib/source/structured";
import { practiceMap } from "@/data/practices";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Resources & Guides",
  description:
    "Free, practical legal checklists from Brill Legal — property due diligence, startup legal, RERA complaints, will drafting and commercial contracts.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const resources = await allResources();
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Resources", url: "/resources" }]} />
      <div className="mt-8">
        <SectionHeading
          kicker="Resources"
          title="Checklists & guides"
          intro="Practical, downloadable checklists to help you prepare. Free to use — get in touch when you'd like advice tailored to your matter."
        />
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {resources.map((r) => (
          <Link
            key={r.slug}
            href={`/resources/${r.slug}`}
            className="group flex flex-col border border-line bg-paper-card p-7 transition-colors hover:border-accent"
          >
            <span className="kicker">
              {practiceMap[r.practice]?.short ?? "Guide"}
            </span>
            <h3 className="mt-3 text-2xl leading-tight text-ink group-hover:text-accent-deep">
              {r.title}
            </h3>
            <p className="mt-3 text-sm text-muted">{r.description}</p>
            <span className="mt-5 text-sm font-medium text-accent-deep">
              View checklist →
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
