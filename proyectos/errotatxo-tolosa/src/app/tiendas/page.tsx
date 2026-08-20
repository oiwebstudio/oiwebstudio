import type { Metadata } from "next";
import { buildBakeryStructuredData } from "@/lib/structuredData";
import TiendasContent from "./TiendasContent";

export const metadata: Metadata = {
  title: "Tiendas",
  description:
    "Nuestros obradores en Tolosa (Andia y San Frantzisko) y Anoeta: dirección, horarios, teléfono y cómo llegar.",
};

export default function TiendasPage() {
  const structuredData = buildBakeryStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TiendasContent />
    </>
  );
}
