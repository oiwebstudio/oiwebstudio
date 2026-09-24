import FreshnessMeter from "@/components/FreshnessMeter";
import JsonLd from "@/components/JsonLd";
import Marquee from "@/components/Marquee";
import PageTransition from "@/components/PageTransition";
import SectionDivider from "@/components/SectionDivider";
import Comarca from "@/components/sections/Comarca";
import Explora from "@/components/sections/Explora";
import Hero from "@/components/sections/Hero";
import Horarios from "@/components/sections/Horarios";
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
    "Errotatxo: panadería y pastelería en Tolosa (Andia Kalea y San Frantzisko, con cafetería) y Anoeta. Pan del obrador cada día, abierto también el fin de semana.",
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
      <Marquee />
      <Muro />
      <Comarca />
      <Tiendas />
      <Mapa />
      <Horarios />
      <div className="container-edge flex justify-center py-16 md:py-20">
        <FreshnessMeter />
      </div>
      <SectionDivider />
      <Opiniones />
      <Preguntas />
      <Explora />
    </PageTransition>
  );
}
