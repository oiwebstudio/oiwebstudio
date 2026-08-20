import type { Metadata } from "next";
import ContactoContent from "./ContactoContent";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos o llámanos. Teléfonos de nuestros obradores de Tolosa (Andia y San Frantzisko) y Anoeta.",
};

export default function ContactoPage() {
  return <ContactoContent />;
}
