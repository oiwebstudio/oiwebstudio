import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/site";
import { breadcrumbNode, graph } from "@/lib/structuredData";
import ProductosContent from "./ProductosContent";

export const metadata = pageMetadata({
  title: "Pan, bollería y pastelería en Tolosa",
  description:
    "Pan artesanal, bollería, pan de molde, galletas y pastelería de Errotatxo, hechos cada día. En sus tiendas de Tolosa y Anoeta.",
  path: "/productos/",
});

export default function Page() {
  return (
    <>
      <JsonLd json={graph(breadcrumbNode([["Productos", "/productos/"]]))} />
      <ProductosContent />
    </>
  );
}
