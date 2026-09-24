"use client";

import FadeIn from "@/components/motion/FadeIn";
import RevealImage from "@/components/motion/RevealImage";
import RevealText from "@/components/motion/RevealText";
import Scramble from "@/components/motion/Scramble";
import Tilt3D from "@/components/motion/Tilt3D";
import { productImages } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

const ASPECTS = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[4/5]", "aspect-[5/4]"];

export default function Productos() {
  const { t } = useLocale();
  const productos = t.productos;

  return (
    <section id="productos" className="relative overflow-hidden bg-bg py-20 md:py-28">
      <div className="container-edge mb-12 md:mb-16">
        <FadeIn>
          {/* text-scramble-scroll (biblioteca-animaciones) */}
          <Scramble text={productos.eyebrow} className="eyebrow mb-3 block" />
          <div className="line-mark" />
        </FadeIn>
        <RevealText
          as="h2"
          lines={productos.title}
          className="display text-4xl md:text-6xl"
        />
      </div>

      {/* Estilo Pinterest: mampostería de dos columnas en el móvil, con alturas
          distintas para que no parezca una rejilla de catálogo. */}
      <div className="columns-2 gap-3 px-3 sm:gap-6 md:px-12 lg:columns-3 lg:gap-8">
        {productos.items.map((item, i) => (
          <Tilt3D key={productImages[i]} className="group relative mb-6 break-inside-avoid md:mb-12">
            <span aria-hidden className="fx-big-number hidden md:block">
              0{i + 1}
            </span>
            <div className="fx-sheen relative mb-3 overflow-hidden rounded-[1.25rem] shadow-[0_10px_30px_-18px_rgba(43,30,20,0.45)] md:mb-5">
              <RevealImage
                src={productImages[i]}
                alt={item.name}
                sizes="(min-width: 1024px) 33vw, 50vw"
                className={`${ASPECTS[i % ASPECTS.length]} w-full`}
                imgClassName="transition-transform duration-700 ease-organic group-hover:scale-110"
              />
            </div>
            <h3 className="display px-1 text-lg leading-tight transition-colors duration-500 group-hover:text-madera md:mb-2 md:text-2xl">
              {item.name}
            </h3>
            <p className="px-1 text-[13px] leading-snug text-muted md:text-base md:leading-relaxed">
              {item.description}
            </p>
          </Tilt3D>
        ))}
      </div>
    </section>
  );
}
