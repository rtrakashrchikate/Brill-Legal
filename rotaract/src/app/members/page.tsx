import type { Metadata } from "next";

import { CtaBand } from "@/components/home/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { MemberDirectory } from "@/components/members/MemberDirectory";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, canonical, memberListSchema } from "@/lib/seo";
import { getMembers } from "@/lib/source/content";

export const metadata: Metadata = {
  title: "Members & Board of Directors",
  description:
    "The board and full roster of the Rotaract Club of Pune Metro, filterable by name, Rotary year and role. Contact details are public — no account required.",
  alternates: canonical("/members"),
};

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <>
      <JsonLd
        schema={[
          memberListSchema(members),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Members & BOD", path: "/members" },
          ]),
        ]}
      />
      <PageHeader
        eyebrow="Members & BOD"
        title="The people who actually turn up on Sunday."
        description="Filter by role, Rotary year or name. Every profile carries a WhatsApp number and email you can copy in one tap — reaching a Rotaractor should never require a login."
      />

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <MemberDirectory members={members} />
      </section>

      <CtaBand />
    </>
  );
}
