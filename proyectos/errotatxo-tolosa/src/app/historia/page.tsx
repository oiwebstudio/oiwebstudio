import type { Metadata } from "next";
import HistoriaContent from "./HistoriaContent";

export const metadata: Metadata = {
  title: "Nuestra historia",
  description:
    "Errotatxo abrió en 1996 en Andia Kalea, en el casco viejo de Tolosa. Hoy son tres tiendas en Tolosa y Anoeta con un solo obrador detrás.",
};

export default function HistoriaPage() {
  return <HistoriaContent />;
}
