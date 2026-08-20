import type { Metadata } from "next";
import ProductosContent from "./ProductosContent";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Pan tradicional, bollería, pan de molde, pastelería y especialidades de temporada, elaborados cada día en los obradores de Errotatxo en Tolosa y Anoeta.",
};

export default function ProductosPage() {
  return <ProductosContent />;
}
