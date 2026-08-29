import BreadCounter from "@/components/BreadCounter";
import PageTransition from "@/components/PageTransition";
import SectionDivider from "@/components/SectionDivider";
import Explora from "@/components/sections/Explora";
import Hero from "@/components/sections/Hero";
import Horarios from "@/components/sections/Horarios";
import Mapa from "@/components/sections/Mapa";
import Opiniones from "@/components/sections/Opiniones";
import Productos from "@/components/sections/Productos";
import Tiendas from "@/components/sections/Tiendas";
import { buildBakeryStructuredData } from "@/lib/structuredData";

export default function Home() {
  const structuredData = buildBakeryStructuredData();

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <Productos />
      <Tiendas />
      <Mapa />
      <Horarios />
      <div className="container-edge flex justify-center py-16 md:py-20">
        <BreadCounter />
      </div>
      <SectionDivider />
      <Opiniones />
      <Explora />
    </PageTransition>
  );
}
