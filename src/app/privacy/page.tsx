import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "How Brill Legal collects, uses and protects personal information submitted through this website, in line with the Digital Personal Data Protection Act, 2023.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-aura">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <Container className="relative pb-12 pt-10">
          <Breadcrumbs items={[{ name: "Privacy Policy", url: "/privacy" }]} />
          <div className="mt-8">
            <SectionHeading
              kicker="Legal"
              title="Privacy Policy"
              intro="How we collect, use and protect the personal information you share with us through this website."
            />
          </div>
        </Container>
      </header>

      <Container className="py-14">
        <div className="prose max-w-3xl">
          <p>
            This policy explains how {site.name} (&ldquo;we&rdquo;,
            &ldquo;us&rdquo;) handles personal data collected through this
            website, consistent with the Digital Personal Data Protection Act,
            2023 and applicable Indian law.
          </p>

          <h2>What we collect</h2>
          <p>
            When you use our enquiry form, call us, or write to us, we collect
            the information you choose to provide: your name, contact details,
            and a description of your matter. We also collect limited technical
            data (such as pages visited) through analytics, used only in
            aggregate to improve the site.
          </p>

          <h2>How we use it</h2>
          <ul>
            <li>To respond to your enquiry and assess whether we can act for you</li>
            <li>To run conflict checks before accepting an engagement</li>
            <li>To communicate with you about your matter once engaged</li>
            <li>To meet professional and statutory record-keeping obligations</li>
          </ul>
          <p>
            We do not sell personal data, and we do not use enquiry details for
            marketing. Information you share in an enquiry is treated as
            confidential whether or not an engagement follows.
          </p>

          <h2>Sharing</h2>
          <p>
            We share personal data only where the engagement requires it (for
            example, with counsel we brief on your matter, or with courts and
            authorities in the course of proceedings), with service providers
            who host our systems under confidentiality obligations, or where
            the law requires disclosure.
          </p>

          <h2>Retention and security</h2>
          <p>
            We retain matter-related information for the periods required by
            professional rules and limitation law, and enquiry data only as
            long as needed for the purposes above. We use reasonable technical
            and organisational safeguards appropriate to the sensitivity of
            legal information.
          </p>

          <h2>Your rights</h2>
          <p>
            Subject to professional obligations (including legal privilege),
            you may request access to, correction of, or erasure of your
            personal data, and may withdraw consent for processing that relies
            on it. Write to{" "}
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>{" "}
            and we will respond within a reasonable time.
          </p>

          <h2>Changes</h2>
          <p>
            We may update this policy as the law or our practices change; the
            current version is always available at this page.
          </p>
        </div>
      </Container>
    </>
  );
}
