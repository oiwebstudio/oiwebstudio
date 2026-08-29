import BreadCounter from "@/components/BreadCounter";
import FreshnessMeter from "@/components/FreshnessMeter";
import Marquee from "@/components/Marquee";
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
      <Marquee />
      <Productos />
      <Tiendas />
      <Mapa />
      <Horarios />
      <div className="container-edge flex flex-col items-center justify-center gap-6 py-16 sm:flex-row sm:gap-10 md:py-20">
        <BreadCounter />
        <div className="hidden h-8 w-px bg-ink/10 sm:block" />
        <FreshnessMeter />
      </div>
      <SectionDivider />
      <Opiniones />
      <Explora />
    </PageTransition>
  );
}
