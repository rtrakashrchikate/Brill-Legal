"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { clearSessionCache } from "@/lib/auth/useSession";
import { cn } from "@/lib/utils";

const DEMO_ACCOUNTS = [
  {
    label: "Verified Rotaractor",
    email: "president@racpunemetro.org",
    password: "rotaract2026",
    note: "Can post on the Requirement Hub",
    verified: true,
  },
  {
    label: "Unverified account",
    email: "prospect@example.org",
    password: "service2026",
    note: "Signed in, but blocked from posting",
    verified: false,
  },
];

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Sign-in failed.");
        setBusy(false);
        return;
      }

      clearSessionCache();
      router.replace(next);
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <GlassCard padding="lg" accent="cranberry">
        <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-1.5">
            <h1 className="font-display text-2xl font-semibold">Rotaractor sign-in</h1>
            <p className="text-[0.85rem] text-fg-muted">
              You only need this to post on the Requirement Hub. Everything else on the site —
              reading, filtering, reacting, copying contacts — stays open.
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.78rem] font-medium">Club email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@yourclub.org"
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.78rem] font-medium">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={fieldClass}
            />
          </label>

          {error && (
            <p role="alert" className="text-[0.8rem] text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </GlassCard>

      <GlassCard padding="lg">
        <h2 className="font-display text-lg font-semibold">Demo accounts</h2>
        <p className="mt-1.5 text-[0.82rem] text-fg-muted">
          This build ships a mock auth layer so the verification wall can be exercised
          end-to-end. Swap it for Supabase Auth and nothing else changes.
        </p>

        <ul className="mt-5 flex flex-col gap-3">
          {DEMO_ACCOUNTS.map((account) => (
            <li
              key={account.email}
              className="rounded-2xl border border-hairline bg-fg/[0.02] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[0.85rem] font-medium">{account.label}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em]",
                    account.verified
                      ? "bg-cranberry-600/12 text-cranberry-600 dark:text-cranberry-300"
                      : "bg-fg/8 text-fg-muted",
                  )}
                >
                  {account.verified ? "verified" : "unverified"}
                </span>
              </div>
              <p className="mt-1 text-[0.75rem] text-fg-muted">{account.note}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <code className="rounded-lg bg-fg/6 px-2 py-1 text-[0.72rem]">
                  {account.email}
                </code>
                <code className="rounded-lg bg-fg/6 px-2 py-1 text-[0.72rem]">
                  {account.password}
                </code>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
                className="mt-3 text-[0.76rem] font-medium text-cranberry-600 transition-colors hover:text-cranberry-700 dark:text-cranberry-400"
              >
                Fill this in →
              </button>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}

const fieldClass = cn(
  "w-full rounded-2xl border border-hairline bg-fg/[0.03] px-4 py-2.5 text-[0.88rem] outline-none",
  "transition-colors duration-300 placeholder:text-fg-muted/60 focus:border-cranberry-600/50",
);
