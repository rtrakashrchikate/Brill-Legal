"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { practices } from "@/data/practices";
import { track } from "@/lib/analytics";

const matterTypes = practices.map((p) => p.matterType);

/**
 * Consultation form. The matter-type pre-selects from the `?matter=` query
 * (per-page contact context). Submission is a client-side stub that fires the
 * GA4 generate_lead event — wire to a real endpoint/CRM at integration time.
 */
export function ContactForm() {
  const params = useSearchParams();
  const presetMatter = params.get("matter") ?? "";
  const [matter, setMatter] = useState(
    matterTypes.includes(presetMatter) ? presetMatter : "",
  );
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    track("generate_lead", { method: "contact_form", matter: matter || "unspecified" });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-line bg-paper-card p-8">
        <h2 className="text-2xl">Thank you.</h2>
        <p className="mt-3 text-muted">
          Your enquiry has been noted. A member of the team will be in touch.
          For anything urgent, please call or message us on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 border border-line bg-paper-card p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Phone" name="phone" type="tel" required />
      </div>
      <Field label="Email" name="email" type="email" />
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="matter">
          Matter type
        </label>
        <select
          id="matter"
          name="matter"
          value={matter}
          onChange={(e) => setMatter(e.target.value)}
          className="mt-1 w-full border border-line bg-paper px-3 py-2.5 text-sm"
        >
          <option value="">Select a matter type…</option>
          {matterTypes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="message">
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="mt-1 w-full border border-line bg-paper px-3 py-2.5 text-sm"
        />
      </div>
      <button
        type="submit"
        className="rounded-[2px] bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-ink-soft"
      >
        Request a Consultation
      </button>
      <p className="text-xs text-muted">
        Submitting this form does not create a lawyer–client relationship.
        Please do not share confidential details until we are engaged.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-ink" htmlFor={name}>
        {label}
        {required && <span className="text-accent-deep"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full border border-line bg-paper px-3 py-2.5 text-sm"
      />
    </div>
  );
}
