import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/config/site";
import { getSettings, waLinkFor, telLinkFor } from "@/lib/source/settings";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact & Request a Consultation",
  description:
    "Contact Brill Legal in Pune — request a consultation, call, or message us on WhatsApp about your legal matter.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-aura">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <Container className="relative pb-14 pt-10">
          <Breadcrumbs items={[{ name: "Contact", url: "/contact" }]} />
          <div className="mt-8">
            <SectionHeading
              kicker="Get in touch"
              title="Request a consultation"
              intro="Tell us a little about your matter and we'll be in touch. For anything urgent, call or message us on WhatsApp."
            />
          </div>
        </Container>
      </header>

      <Container className="grid gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Suspense fallback={<div className="text-muted">Loading form…</div>}>
          <ContactForm />
        </Suspense>

        <aside className="space-y-6">
          <div className="border border-line bg-paper-card p-6">
            <h2 className="text-lg">Direct lines</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={telLinkFor(settings.phoneDigits)}
                  className="text-accent-deep hover:underline"
                >
                  Call {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={waLinkFor(settings.whatsapp, site.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-deep hover:underline"
                >
                  WhatsApp us
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-accent-deep hover:underline"
                >
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="border border-line bg-paper-card p-6">
            <h2 className="text-lg">Office</h2>
            <address className="mt-3 text-sm not-italic text-muted">
              {settings.name}
              <br />
              {settings.address}
            </address>
            <p className="mt-4 text-sm text-muted">
              Based in {site.baseCity}; serving clients across India by
              consultation.
            </p>
          </div>
        </aside>
      </Container>
    </>
  );
}
