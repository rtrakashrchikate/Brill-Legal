"use client";

import { useState } from "react";
import { site } from "@/config/site";

/** Compact share row for articles — copy link, WhatsApp, LinkedIn. */
export function ShareRow({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${site.url}/insights/${slug}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const cls =
    "rounded-[2px] border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent-deep";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-muted">Share</span>
      <button type="button" onClick={copy} className={cls}>
        {copied ? "Copied" : "Copy link"}
      </button>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={cls}>
        WhatsApp
      </a>
      <a href={li} target="_blank" rel="noopener noreferrer" className={cls}>
        LinkedIn
      </a>
    </div>
  );
}
