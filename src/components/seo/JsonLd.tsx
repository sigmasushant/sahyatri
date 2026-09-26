/**
 * Structured data block. JSON-LD is a data block, not executable script, so it is not
 * affected by the script-src CSP. `<` is escaped so content can never close the tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
