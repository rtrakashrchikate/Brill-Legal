import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { glossary } from "@/data/glossary";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Legal Glossary",
  description:
    "Plain-English definitions of Indian legal terms — bail, RERA, arbitration, probate, NCLT, SARFAESI and more, from Brill Legal.",
  path: "/glossary",
});

export default function GlossaryPage() {
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Glossary", url: "/glossary" }]} />
      <div className="mt-8">
        <SectionHeading
          kicker="Reference"
          title="Legal glossary"
          intro="Plain-English definitions of the legal terms our clients encounter most. Each links to the relevant practice or guide."
        />
      </div>
      <dl className="mt-10 divide-y divide-line border-y border-line">
        {sorted.map((g) => (
          <div key={g.slug} className="py-5">
            <dt className="text-lg font-medium text-ink">
              <Link
                href={`/glossary/${g.slug}`}
                className="hover:text-accent-deep"
              >
                {g.term}
              </Link>
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted">
              {g.definition}
            </dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}
