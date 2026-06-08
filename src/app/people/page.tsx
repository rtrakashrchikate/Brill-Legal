import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { people } from "@/data/people";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Our People",
  description:
    "Meet the lawyers at Brill Legal — experienced practitioners across litigation, corporate, real estate, family and regulatory law.",
  path: "/people",
});

export default function PeoplePage() {
  const team = people.filter((p) => p.slug !== "brill-legal");
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "People", url: "/people" }]} />
      <div className="mt-8">
        <SectionHeading
          kicker="Our people"
          title="The team"
          intro="Experienced practitioners who advise and represent our clients — and who author the guides in our Insights library."
        />
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {team.map((p) => (
          <Link
            key={p.slug}
            href={`/people/${p.slug}`}
            className="group border border-line bg-paper-card p-7 transition-colors hover:border-accent"
          >
            <h3 className="text-2xl text-ink group-hover:text-accent-deep">
              {p.name}
            </h3>
            <p className="mt-1 text-sm text-accent-deep">{p.title}</p>
            <p className="mt-3 text-sm text-muted">{p.bio}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
