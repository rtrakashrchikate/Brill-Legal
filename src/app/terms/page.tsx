import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Terms of Use",
  description:
    "The terms on which this website may be used, including the Bar Council of India rules on advertising, the no-advice disclaimer, and intellectual property.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-aura">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <Container className="relative pb-12 pt-10">
          <Breadcrumbs items={[{ name: "Terms of Use", url: "/terms" }]} />
          <div className="mt-8">
            <SectionHeading
              kicker="Legal"
              title="Terms of Use"
              intro="The terms on which this website and its content may be used."
            />
          </div>
        </Container>
      </header>

      <Container className="py-14">
        <div className="prose max-w-3xl">
          <h2>No solicitation; Bar Council compliance</h2>
          <p>
            The Bar Council of India does not permit advocates to advertise or
            solicit work. This website exists to provide general information
            about {site.name} for visitors who seek it of their own accord. By
            using the site, you acknowledge that you are accessing it
            voluntarily, that no solicitation, advertisement or inducement is
            intended, and that the material here does not create any
            lawyer–client relationship.
          </p>

          <h2>Not legal advice</h2>
          <p>
            Everything published on this site — guides, FAQs, glossary entries
            and resources — is general information about Indian law. It is not
            legal advice, may not reflect the most recent legal developments,
            and cannot account for the facts of your situation. Do not act on
            anything you read here without obtaining advice on your specific
            facts. A lawyer–client relationship with us arises only through an
            express engagement.
          </p>

          <h2>Confidentiality of enquiries</h2>
          <p>
            Information sent through our enquiry form is treated confidentially
            and used to assess your matter and run conflict checks, as
            described in our <a href="/privacy">Privacy Policy</a>. Until we
            confirm an engagement, however, sending us information does not by
            itself make us your lawyers, and you should not send sensitive
            documents unrequested.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The content of this site — text, design and arrangement — belongs
            to {site.name}. You may read, link to and share our guides with
            attribution; you may not republish them commercially or present
            them as your own.
          </p>

          <h2>Liability</h2>
          <p>
            We take care to keep the material accurate and current, but we make
            no warranties about completeness or fitness for any purpose, and we
            accept no liability for loss arising from reliance on the site's
            content. External links are provided for convenience and are not
            endorsements.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by Indian law, and the courts at{" "}
            {site.baseCity}, {site.baseState} have exclusive jurisdiction over
            any dispute relating to this website.
          </p>
        </div>
      </Container>
    </>
  );
}
