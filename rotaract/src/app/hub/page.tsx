import type { Metadata } from "next";

import { HubBoard } from "@/components/hub/HubBoard";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, canonical } from "@/lib/seo";
import { Reveal } from "@/components/motion/primitives";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { getRequests } from "@/lib/source/requests";

export const metadata: Metadata = {
  title: "Requirement Hub",
  description:
    "A public bulletin board of active resource requests from Rotaract clubs — blood, funding, volunteers, materials, mentorship and collaboration. Open to read for everyone.",
  alternates: canonical("/hub"),
};

// New listings should appear immediately after they are posted.
export const dynamic = "force-dynamic";

export default async function HubPage() {
  const requests = await getRequests();
  const open = requests.filter((request) => request.status === "open");
  const critical = open.filter((request) => request.urgency === "critical");

  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Requirement Hub", path: "/hub" },
        ])}
      />
      <PageHeader
        eyebrow="Requirement hub"
        title="Ask the whole district, not one WhatsApp group."
        description="A public board of live resource requests. Anyone can read it, filter it and contact a poster — no account, no gate. Posting is the only thing that needs a verified Rotaractor profile."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="cranberry">{open.length} open</Badge>
          {critical.length > 0 && <Badge tone="danger">{critical.length} critical</Badge>}
          <Badge tone="neutral">Reading needs no login</Badge>
        </div>
      </PageHeader>

      {/* How the wall works — stated plainly, because trust is the product here. */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6">
        <Reveal>
          <GlassCard padding="lg" accent="cranberry">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-cranberry-600 dark:text-cranberry-400">
                  Anyone can read
                </span>
                <p className="text-[0.86rem] leading-relaxed text-fg-muted">
                  Every listing, every contact detail, one tap to copy. A blood requirement
                  behind a login is a blood requirement that fails.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-gold-600 dark:text-gold-400">
                  Verified Rotaractors post
                </span>
                <p className="text-[0.86rem] leading-relaxed text-fg-muted">
                  Publishing needs a signed-in account whose profile carries the
                  verified-Rotaractor flag, set by a club secretary. The API rejects anything
                  else.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-royal-700 dark:text-royal-300">
                  The badge is the contract
                </span>
                <p className="text-[0.86rem] leading-relaxed text-fg-muted">
                  A <VerifiedBadge className="mx-0.5 align-middle" /> mark does not vouch for
                  the outcome. It means a real Rotaractor, with a real club, attached their name
                  to the ask.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-hairline pt-5">
              <ButtonLink href="/dashboard" className="group">
                Post a requirement
                <ArrowRight className="group-hover:translate-x-1" />
              </ButtonLink>
              <p className="text-[0.78rem] text-fg-muted">
                You&rsquo;ll be asked to sign in if you aren&rsquo;t already.
              </p>
            </div>
          </GlassCard>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <HubBoard requests={requests} />
      </section>
    </>
  );
}
