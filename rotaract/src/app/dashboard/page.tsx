import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { RequestCard } from "@/components/hub/HubBoard";
import { RequestForm } from "@/components/hub/RequestForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/primitives";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { canPostRequests, getSession } from "@/lib/auth/users";
import { getRequests } from "@/lib/source/requests";

export const metadata: Metadata = {
  title: "Rotaractor dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();

  // Middleware already redirected unsigned visitors; this is the belt-and-braces
  // check for anyone reaching the component another way.
  if (!session) redirect("/login?next=/dashboard");

  const verified = canPostRequests(session);
  const requests = await getRequests();
  const mine = requests.filter((request) => request.contactName === session.name);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${session.name.split(" ")[0]}.`}
        description={
          verified
            ? "Your profile is verified, so anything you publish here carries the accent badge on the public board."
            : "Your account is signed in but not yet verified as a Rotaractor, so posting is disabled until your club secretary verifies you."
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          {verified ? <VerifiedBadge /> : <Badge tone="neutral">Unverified</Badge>}
          <Badge tone="royal">{session.club}</Badge>
          <Badge tone="neutral">{session.role}</Badge>
          <SignOutButton />
        </div>
      </PageHeader>

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div>
            {verified ? (
              <Reveal>
                <RequestForm defaultEmail={session.email} />
              </Reveal>
            ) : (
              <Reveal>
                <GlassCard padding="lg" accent="gold" className="flex flex-col gap-4">
                  <Badge tone="gold">Verification required</Badge>
                  <h2 className="font-display text-xl font-semibold">
                    Posting is closed until your club verifies you
                  </h2>
                  <p className="text-[0.88rem] leading-relaxed text-fg-muted">
                    Your profile carries{" "}
                    <code className="rounded bg-fg/8 px-1.5 py-0.5 text-[0.8rem]">
                      is_verified_rotaractor: false
                    </code>
                    . The create-request API rejects submissions from unverified accounts with a
                    403, so this is not just a hidden form — it is enforced server-side.
                  </p>
                  <p className="text-[0.88rem] leading-relaxed text-fg-muted">
                    Ask your club secretary to verify your membership. Everything else on the
                    site remains fully open to you, exactly as it is for visitors with no
                    account at all.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <ButtonLink href="/hub" className="group">
                      Read the hub instead
                      <ArrowRight className="group-hover:translate-x-1" />
                    </ButtonLink>
                    <ButtonLink href="/members" variant="glass">
                      Find your secretary
                    </ButtonLink>
                  </div>
                </GlassCard>
              </Reveal>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <Reveal delay={0.08}>
              <GlassCard padding="lg" className="flex flex-col gap-3">
                <h2 className="font-display text-lg font-semibold">Your profile</h2>
                <dl className="flex flex-col gap-2.5 text-[0.84rem]">
                  <Row label="Name" value={session.name} />
                  <Row label="Email" value={session.email} />
                  <Row label="Club" value={session.club} />
                  <Row label="District" value={session.district} />
                  <Row label="Role" value={session.role} />
                  <Row
                    label="is_verified_rotaractor"
                    value={String(session.is_verified_rotaractor)}
                    mono
                  />
                </dl>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.14}>
              <GlassCard padding="lg" className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-lg font-semibold">Your listings</h2>
                  <Link
                    href="/hub"
                    className="text-[0.78rem] font-medium text-cranberry-600 dark:text-cranberry-400"
                  >
                    View board
                  </Link>
                </div>

                {mine.length === 0 ? (
                  <p className="text-[0.84rem] text-fg-muted">
                    Nothing posted yet. Anything you publish shows up here and on the public
                    board at the same moment.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-4">
                    {mine.slice(0, 3).map((request) => (
                      <li key={request.id}>
                        <RequestCard request={request} />
                      </li>
                    ))}
                  </ul>
                )}
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-hairline pb-2 last:border-0 last:pb-0">
      <dt className="text-fg-muted">{label}</dt>
      <dd className={mono ? "font-mono text-[0.78rem]" : "font-medium"}>{value}</dd>
    </div>
  );
}
