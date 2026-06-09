import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Brill Legal — Measured counsel for complex matters";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0c1a2b";
const PAPER = "#f6f3ec";
const GOLD = "#b08643";
const GOLD_SOFT = "#d9b877";

export default async function Image() {
  const playfair = await readFile(
    join(
      process.cwd(),
      "node_modules/@fontsource/playfair-display/files/playfair-display-latin-600-normal.woff",
    ),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          backgroundImage:
            "radial-gradient(900px 500px at 100% -10%, rgba(176,134,67,0.30), transparent 60%)",
          padding: "72px 80px",
          color: PAPER,
          fontFamily: "Playfair",
        }}
      >
        {/* Top row: monogram + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 10,
              border: `1.5px solid ${GOLD}`,
              color: GOLD_SOFT,
              fontSize: 42,
              fontWeight: 600,
            }}
          >
            B
          </div>
          <div style={{ display: "flex", fontSize: 34, letterSpacing: -0.5 }}>
            Brill Legal
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 80,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: -1.5,
              maxWidth: 900,
            }}
          >
            Measured counsel for complex matters.
          </div>
          <div
            style={{
              marginTop: 28,
              width: 110,
              height: 4,
              background: GOLD,
              display: "flex",
            }}
          />
        </div>

        {/* Footer line */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "rgba(246,243,236,0.72)",
          }}
        >
          A full-service Indian law practice · Practising since 2007 · brilllegal.in
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair", data: playfair, style: "normal", weight: 600 },
      ],
    },
  );
}
