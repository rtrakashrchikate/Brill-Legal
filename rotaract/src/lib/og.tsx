import { ImageResponse } from "next/og";

import { site } from "@/config/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * The card renders with next/og's built-in font, which has no rupee glyph.
 * Rather than reaching out for a dynamic font at build time — a network call
 * that can and does fail — the few characters outside that font are
 * transliterated. Only the social card is affected; page copy keeps ₹.
 */
function ogSafe(text: string): string {
  return text.replace(/₹\s?/g, "Rs ");
}

/**
 * Shared Open Graph card.
 *
 * Deliberately typographic: no remote images, no external fonts, so the render
 * cannot fail on a network hiccup at build time. The brand gradient does the
 * visual work.
 */
export function ogImage({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string;
  title: string;
  meta?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0B0F19",
          position: "relative",
        }}
      >
        {/* Ambient brand wash */}
        <div
          style={{
            position: "absolute",
            top: -220,
            left: -160,
            width: 780,
            height: 780,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(217,27,92,0.55) 0%, rgba(217,27,92,0) 65%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -300,
            right: -180,
            width: 820,
            height: 820,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(0,80,161,0.6) 0%, rgba(0,80,161,0) 65%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 9999,
              background: "#D91B5C",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#F7A81B",
              display: "flex",
            }}
          >
            {ogSafe(eyebrow)}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              fontSize: title.length > 70 ? 58 : 72,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2,
              color: "#EEF1F8",
              display: "flex",
              maxWidth: 980,
            }}
          >
            {ogSafe(title)}
          </div>
          {meta && (
            <div style={{ fontSize: 28, color: "#9AA4BF", display: "flex" }}>{ogSafe(meta)}</div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
          }}
        >
          <div style={{ fontSize: 26, color: "#EEF1F8", display: "flex" }}>{site.name}</div>
          <div style={{ fontSize: 24, color: "#9AA4BF", display: "flex" }}>
            {site.district} · Chartered {site.chartered}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
