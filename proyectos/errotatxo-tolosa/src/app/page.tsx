import JsonLd from "@/components/JsonLd";
import Marquee from "@/components/Marquee";
import PageTransition from "@/components/PageTransition";
import Comarca from "@/components/sections/Comarca";
import Explora from "@/components/sections/Explora";
import Hero from "@/components/sections/Hero";
import Hoy from "@/components/sections/Hoy";
import Mapa from "@/components/sections/Mapa";
import Muro from "@/components/sections/Muro";
import Opiniones from "@/components/sections/Opiniones";
import Preguntas from "@/components/sections/Preguntas";
import Tiendas from "@/components/sections/Tiendas";
import { buildFaq } from "@/lib/faq";
import { pageMetadata } from "@/lib/site";
import {
  allStoreNodes,
  faqNode,
  graph,
  organizationNode,
  websiteNode,
} from "@/lib/structuredData";

export const metadata = pageMetadata({
  title: "Panadería y cafetería en Tolosa y Anoeta | Errotatxo Okindegia",
  description:
    "Errotatxo okindegia: panadería, pastelería y cafetería en Tolosa (Andia Kalea y San Frantzisko) y Anoeta. Pan del obrador cada día, abierto los 7 días de la semana.",
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <PageTransition>
      <JsonLd
        json={graph(websiteNode(), organizationNode(), ...allStoreNodes(), faqNode(buildFaq("es")))}
      />
      <Hero />
      <Hoy />
      <Marquee />
      <Muro />
      <Tiendas />
      <Mapa />
      <Comarca />
      <Opiniones />
      <Preguntas />
      <Explora />
    </PageTransition>
  );
}
