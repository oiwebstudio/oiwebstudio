import JsonLd from "@/components/JsonLd";
import Marquee from "@/components/Marquee";
import PageTransition from "@/components/PageTransition";
import Cafeteria from "@/components/sections/Cafeteria";
import Explora from "@/components/sections/Explora";
import Hero from "@/components/sections/Hero";
import Hoy from "@/components/sections/Hoy";
import Mapa from "@/components/sections/Mapa";
import Muro from "@/components/sections/Muro";
import Panes from "@/components/sections/Panes";
import Opiniones from "@/components/sections/Opiniones";
import Preguntas from "@/components/sections/Preguntas";
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
    "Pan artesanal cada día y cafetería en San Frantzisko, Tolosa. Errotatxo okindegia: panadería y pastelería en Tolosa y Anoeta, abierta los 7 días de la semana.",
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
      <Cafeteria />
      <Panes />
      <Marquee />
      <Muro />
      <Mapa />
      <Opiniones />
      <Preguntas />
      <Explora />
    </PageTransition>
  );
}
