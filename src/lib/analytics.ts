/**
 * Thin GA4 event helper. Conversion surfaces call track() so leads can be
 * attributed (generate_lead, click_whatsapp, click_call). No-ops safely when
 * GA isn't loaded. Set NEXT_PUBLIC_GA_ID to enable the gtag script.
 */

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: string, params: GtagParams = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  } else {
    // Buffer to dataLayer so a later-loaded GA can pick it up.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
