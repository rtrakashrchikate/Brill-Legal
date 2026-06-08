import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui";
import { PracticeCard } from "@/components/cards";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { practices } from "@/data/practices";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Practice Areas",
  description:
    "Brill Legal's seven practice areas: litigation, white-collar crime, real estate & RERA, family, arbitration, corporate and tribunal & regulatory.",
  path: "/practices",
});

export default function PracticesPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Practices", url: "/practices" }]} />
      <div className="mt-8">
        <SectionHeading
          kicker="What we do"
          title="Our practice areas"
          intro="Full-service capability across seven areas of Indian law. Each area is led by experienced practitioners and supported by a growing library of guides."
        />
      </div>
      <div className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3 [&>*]:bg-paper">
        {practices.map((p) => (
          <PracticeCard key={p.slug} practice={p} />
        ))}
      </div>
      <CtaBand matter="your matter" />
    </Container>
  );
}
