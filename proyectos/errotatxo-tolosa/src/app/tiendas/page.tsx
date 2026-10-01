import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/site";
import { allStoreNodes, breadcrumbNode, graph } from "@/lib/structuredData";
import TiendasContent from "./TiendasContent";

export const metadata = pageMetadata({
  title: "Panaderías en Tolosa y Anoeta: horarios y cómo llegar",
  description:
    "Las tres tiendas de Errotatxo: la calle Andia y San Frantzisko (con cafetería) en Tolosa, y la calle San Juan en Anoeta. Horarios, teléfonos y mapa.",
  path: "/tiendas/",
});

export default function Page() {
  return (
    <>
      <JsonLd json={graph(...allStoreNodes(), breadcrumbNode([["Tiendas", "/tiendas/"]]))} />
      <TiendasContent />
    </>
  );
}
