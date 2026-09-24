/** Datos estructurados de la página (ver lib/structuredData.ts). */
export default function JsonLd({ json }: { json: string }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
