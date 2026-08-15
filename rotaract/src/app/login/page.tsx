import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Rotaractor login",
  description:
    "Sign in to post on the Requirement Hub. Reading the site never requires an account.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <>
      <PageHeader
        eyebrow="Verified access"
        title="Sign in only if you need to post."
        description="Browsing, filtering, reacting and copying contact details all work without an account. This wall exists for one reason: to keep the Requirement Hub free of solicitation."
      />

      <section className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6">
        <Suspense fallback={<div className="glass-panel h-96 animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </section>
    </>
  );
}
