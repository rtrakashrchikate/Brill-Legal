/**
 * Emits structured data as a single JSON-LD script.
 *
 * Server component by design — the payload ships in the initial HTML, which is
 * what crawlers read.
 */
export function JsonLd({ schema }: { schema: object | object[] }) {
  const payload = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {payload.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          // JSON.stringify output is inserted verbatim; `<` is escaped so a
          // stray string value can never close the script tag early.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(entry).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
