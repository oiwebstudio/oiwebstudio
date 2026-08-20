"use client";

import FadeIn from "@/components/motion/FadeIn";
import RevealImage from "@/components/motion/RevealImage";
import RevealText from "@/components/motion/RevealText";
import Scramble from "@/components/motion/Scramble";
import { productImages } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

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

      <div className="container-edge grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {productos.items.map((item, i) => (
          <div key={productImages[i]} className="group relative">
            {/* card-big-number (biblioteca-animaciones) */}
            <span aria-hidden className="fx-big-number">
              0{i + 1}
            </span>
            {/* card-glass-sheen (biblioteca-animaciones) */}
            <div className="fx-sheen relative mb-5 overflow-hidden rounded-md">
              <RevealImage
                src={productImages[i]}
                alt={item.name}
                className="aspect-[4/3] w-full"
                imgClassName="transition-transform duration-700 ease-organic group-hover:scale-110"
              />
            </div>
            <span className="relative mb-2 block text-xs text-madera">0{i + 1}</span>
            <h3 className="display mb-2 text-xl transition-colors duration-500 group-hover:text-madera md:text-2xl">
              {item.name}
            </h3>
            <p className="body-editorial text-sm md:text-base">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
