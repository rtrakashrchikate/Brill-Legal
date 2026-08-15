import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { site } from "@/config/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    eyebrow: "Rotaract",
    title: "Service, run like it actually matters.",
    meta: "Projects · publications · a district-wide requirement hub",
  });
}
