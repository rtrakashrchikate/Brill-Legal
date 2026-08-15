"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { DISTRICTS } from "@/config/site";
import { cn } from "@/lib/utils";
import type { NewRequestInput, RequestCategory, RequestUrgency } from "@/types";

const CATEGORIES: { value: RequestCategory; label: string; hint: string }[] = [
  { value: "blood", label: "Blood", hint: "Group, units, hospital, window" },
  { value: "funding", label: "Funding", hint: "Amount, purpose, utilisation report" },
  { value: "collaboration", label: "Collaboration", hint: "What you bring, what you need" },
  { value: "volunteers", label: "Volunteers", hint: "Count, skills, date, location" },
  { value: "materials", label: "Materials", hint: "Item, quantity, condition accepted" },
  { value: "mentorship", label: "Mentorship", hint: "Field, commitment, format" },
];

const URGENCIES: { value: RequestUrgency; label: string }[] = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
];

const EMPTY: NewRequestInput = {
  title: "",
  category: "volunteers",
  urgency: "normal",
  description: "",
  city: "Pune",
  district: "RID 3131",
  needBy: "",
  contactWhatsapp: "",
  contactEmail: "",
};

export function RequestForm({ defaultEmail }: { defaultEmail?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<NewRequestInput>({
    ...EMPTY,
    contactEmail: defaultEmail ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const set = <K extends keyof NewRequestInput>(key: K, value: NewRequestInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    // Clear the field's error as soon as the author starts fixing it.
    setErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setMessage(null);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string; errors?: Record<string, string> };

      if (!res.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.error ?? "Something went wrong. Try again.");
        setStatus("idle");
        return;
      }

      setStatus("done");
      setForm({ ...EMPTY, contactEmail: defaultEmail ?? "" });
      // Pull the new listing into the server-rendered hub.
      router.refresh();
    } catch {
      setMessage("Could not reach the server. Check your connection and try again.");
      setStatus("idle");
    }
  }

  return (
    <GlassCard padding="lg" accent="cranberry">
      <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-xl font-semibold">Post a requirement</h2>
          <p className="text-[0.85rem] text-fg-muted">
            It appears on the public board immediately, carrying your club name and the verified
            badge. Anyone can read and respond without an account.
          </p>
        </div>

        <Field label="What do you need?" error={errors.title}>
          <input
            value={form.title}
            onChange={(event) => set("title", event.target.value)}
            placeholder="e.g. O-negative donors needed — surgery on 22 Aug"
            maxLength={120}
            className={inputClass(errors.title)}
          />
        </Field>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-[0.78rem] font-medium">Category</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => set("category", option.value)}
                aria-pressed={form.category === option.value}
                title={option.hint}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[0.8rem] transition-all duration-300",
                  form.category === option.value
                    ? "border-cranberry-600 bg-cranberry-600 text-white shadow-[0_10px_28px_-14px_rgb(217_27_92/0.9)]"
                    : "border-hairline bg-fg/[0.03] text-fg-muted hover:text-fg",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-[0.72rem] text-fg-muted">
            {CATEGORIES.find((c) => c.value === form.category)?.hint}
          </p>
          {errors.category && <FieldError>{errors.category}</FieldError>}
        </fieldset>

        <Field label="Details" error={errors.description}>
          <textarea
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
            rows={5}
            maxLength={1200}
            placeholder="Be specific about quantity, timing, location and what a respondent should expect. Vague asks get ignored."
            className={cn(inputClass(errors.description), "resize-y leading-relaxed")}
          />
          <span className="mt-1 block text-right text-[0.7rem] text-fg-muted">
            {form.description.length}/1200
          </span>
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="City" error={errors.city}>
            <input
              value={form.city}
              onChange={(event) => set("city", event.target.value)}
              className={inputClass(errors.city)}
            />
          </Field>

          <Field label="District" error={errors.district}>
            <select
              value={form.district}
              onChange={(event) => set("district", event.target.value)}
              className={inputClass(errors.district)}
            >
              {DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Needed by" error={errors.needBy}>
            <input
              type="date"
              value={form.needBy}
              onChange={(event) => set("needBy", event.target.value)}
              className={inputClass(errors.needBy)}
            />
          </Field>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-[0.78rem] font-medium">Urgency</legend>
          <div className="flex gap-2">
            {URGENCIES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => set("urgency", option.value)}
                aria-pressed={form.urgency === option.value}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[0.8rem] transition-all duration-300",
                  form.urgency === option.value
                    ? "border-gold-500 bg-gold-500 text-ink-950"
                    : "border-hairline bg-fg/[0.03] text-fg-muted hover:text-fg",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="WhatsApp" error={errors.contactWhatsapp}>
            <input
              value={form.contactWhatsapp}
              onChange={(event) => set("contactWhatsapp", event.target.value)}
              placeholder="+91 98220 00000"
              inputMode="tel"
              className={inputClass(errors.contactWhatsapp)}
            />
          </Field>

          <Field label="Email" error={errors.contactEmail}>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(event) => set("contactEmail", event.target.value)}
              placeholder="you@club.org"
              className={inputClass(errors.contactEmail)}
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-hairline pt-5">
          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Posting…" : "Publish to the hub"}
          </Button>

          <AnimatePresence mode="wait">
            {status === "done" && (
              <motion.p
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[0.82rem] font-medium text-emerald-600 dark:text-emerald-400"
              >
                Posted. It is live on the Requirement Hub now.
              </motion.p>
            )}
            {message && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="alert"
                className="text-[0.82rem] font-medium text-red-600 dark:text-red-400"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>
    </GlassCard>
  );
}

function inputClass(error?: string): string {
  return cn(
    "w-full rounded-2xl border bg-fg/[0.03] px-4 py-2.5 text-[0.88rem] outline-none",
    "transition-colors duration-300 placeholder:text-fg-muted/60",
    "focus:border-cranberry-600/50 focus:bg-fg/[0.05]",
    error ? "border-red-500/60" : "border-hairline",
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.78rem] font-medium">{label}</span>
      {children}
      {error && <FieldError>{error}</FieldError>}
    </label>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <span role="alert" className="text-[0.74rem] text-red-600 dark:text-red-400">
      {children}
    </span>
  );
}
