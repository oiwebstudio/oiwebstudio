import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/site";
import { breadcrumbNode, graph } from "@/lib/structuredData";
import ContactoContent from "./ContactoContent";

export const metadata = pageMetadata({
  title: "Contacto y teléfonos",
  description:
    "Teléfonos de las tres tiendas de Errotatxo en Tolosa y Anoeta: Andia 943 65 54 92, San Frantzisko 943 65 47 33 y Anoeta 943 65 25 99.",
  path: "/contacto/",
});

export default function Page() {
  return (
    <>
      <JsonLd json={graph(breadcrumbNode([["Contacto", "/contacto/"]]))} />
      <ContactoContent />
    </>
  );
}
