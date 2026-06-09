/**
 * Central site configuration — the single source of truth for NAP
 * (Name / Address / Phone), brand voice, and contact routes.
 *
 * NOTE: All contact details below are configuration placeholders meant to be
 * wired to the firm's real Google Business Profile NAP. Keep them CONSISTENT
 * everywhere (citations/directories) — NAP consistency is a real ranking
 * factor. Do NOT invent additional offices; the firm operates from Pune and
 * serves other cities via consults + a counsel network (see location pages).
 */

export const site = {
  name: "Brill Legal",
  legalName: "Brill Legal",
  tagline: "A full-service Indian law practice. Measured counsel, since 2007.",
  practisingSince: 2007,
  // Public-facing base URL (used for canonicals + sitemaps).
  // Overridable via NEXT_PUBLIC_SITE_URL for staging/preview deploys.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://brilllegal.in").replace(
    /\/$/,
    "",
  ),
  locale: "en_IN",
  // Real base of operations.
  baseCity: "Pune",
  baseState: "Maharashtra",
  // NAP — wire to the verified Google Business Profile. Placeholder address.
  contact: {
    addressLine: "Office address, Pune",
    locality: "Pune",
    region: "Maharashtra",
    postalCode: "411001",
    country: "IN",
    phone: "+91 00000 00000",
    // E.164 digits only, for tel: and wa.me links.
    phoneDigits: "910000000000",
    whatsapp: "910000000000",
    email: "contact@brilllegal.in",
  },
  // Default WhatsApp prefilled message.
  whatsappMessage: "Hi, I'd like to ask about a legal matter.",
  social: {
    linkedin: "https://www.linkedin.com/company/brill-legal",
  },
  // Legitimate trust signals only — no fabricated stats or testimonials.
  trust: [
    "Practising since 2007",
    "7 practice areas",
    "90+ legal guides",
    "Pune-based, serving clients across India",
  ],
} as const;

export type Site = typeof site;

export const waLink = (message: string = site.whatsappMessage) =>
  `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;

export const telLink = () => `tel:+${site.contact.phoneDigits}`;
