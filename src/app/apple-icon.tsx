import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
          alignItems: "center",
          justifyContent: "center",
          background: "#0c1a2b",
          color: "#d9b877",
          fontFamily: "Playfair",
          fontSize: 112,
          fontWeight: 600,
        }}
      >
        B
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
