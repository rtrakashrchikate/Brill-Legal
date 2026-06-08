/** Renders a JSON-LD <script> block. Server-rendered into <head>-adjacent DOM. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe; no user HTML is injected.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
