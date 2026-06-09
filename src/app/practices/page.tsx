import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui";
import { PracticeCard } from "@/components/cards";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { StaggerGroup, StaggerItem } from "@/components/motion";
import { allPractices } from "@/lib/source/structured";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Practice Areas",
  description:
    "Brill Legal's seven practice areas: litigation, white-collar crime, real estate & RERA, family, arbitration, corporate and tribunal & regulatory.",
  path: "/practices",
});

export default async function PracticesPage() {
  const practices = await allPractices();
  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-aura">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <Container className="relative pb-14 pt-10">
          <Breadcrumbs items={[{ name: "Practices", url: "/practices" }]} />
          <div className="mt-8">
            <SectionHeading
              kicker="What we do"
              title="Our practice areas"
              intro="Full-service capability across seven areas of Indian law. Each area is led by experienced practitioners and supported by a growing library of guides."
            />
          </div>
        </Container>
      </header>

      <Container className="py-16">
        <StaggerGroup className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3 [&>*]:bg-paper">
          {practices.map((p, i) => (
            <StaggerItem key={p.slug}>
              <PracticeCard practice={p} index={i} />
            </StaggerItem>
          ))}
        </StaggerGroup>
        <CtaBand matter="your matter" />
      </Container>
    </>
  );
}
