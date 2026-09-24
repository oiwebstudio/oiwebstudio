import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/site";
import { breadcrumbNode, graph } from "@/lib/structuredData";
import HistoriaContent from "./HistoriaContent";

export const metadata = pageMetadata({
  title: "Historia de Errotatxo, panadería de Tolosa desde 1996",
  description:
    "Okindegia Errotatxo se constituyó en 1996 en Tolosa. Hoy son tres tiendas en Tolosaldea —dos en Tolosa y una en Anoeta— con un solo obrador detrás.",
  path: "/historia/",
});

export default function Page() {
  return (
    <>
      <JsonLd json={graph(breadcrumbNode([["Historia", "/historia/"]]))} />
      <HistoriaContent />
    </>
  );
}
