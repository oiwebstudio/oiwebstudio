"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import FadeIn from "@/components/motion/FadeIn";
import RevealText from "@/components/motion/RevealText";
import Scramble from "@/components/motion/Scramble";
import { productGallery } from "@/lib/data";
import imageLoader from "@/lib/imageLoader";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

// Mosaico de 12 columnas: el pan manda (ficha grande) y el resto encaja alrededor.
const SPANS = [
  "col-span-2 row-span-2 lg:col-span-7",
  "col-span-1 lg:col-span-5",
  "col-span-1 lg:col-span-5",
  "col-span-2 lg:col-span-5",
  "col-span-2 lg:col-span-7",
];

const INTERVAL = 3600;

function Ficha({
  name,
  description,
  photos,
  index,
}: {
  name: string;
  description: string;
  photos: string[];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Cada ficha pasa sus fotos a su ritmo, desfasada de las demás para que el
  // mosaico no cambie entero de golpe. Solo mientras se ve.
  useEffect(() => {
    if (!inView || reduce || paused || photos.length < 2) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      setCurrent((c) => (c + 1) % photos.length);
      interval = setInterval(() => setCurrent((c) => (c + 1) % photos.length), INTERVAL);
    }, INTERVAL + index * 700);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [inView, reduce, paused, photos.length, index]);

  return (
    <motion.article
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.08, ease: EASE }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        "group relative isolate min-h-[220px] overflow-hidden rounded-[1.5rem] bg-lino shadow-[0_18px_40px_-26px_rgba(43,30,20,0.6)] md:min-h-[300px]",
        SPANS[index]
      )}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={photos[current]}
          src={imageLoader({ src: photos[current] })}
          alt={current === 0 ? name : ""}
          loading="lazy"
          decoding="async"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9, ease: "easeOut" }, scale: { duration: 4.5, ease: "linear" } }}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      </AnimatePresence>

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#2B1E14]/75 via-[#2B1E14]/0 via-55% to-transparent transition-opacity duration-500 group-hover:opacity-90"
      />

      <div className="flex h-full flex-col justify-end p-5 md:p-7">
        <h3 className="display text-2xl leading-tight text-[#FBF6EC] md:text-4xl">{name}</h3>
        <p className="mt-2 max-w-sm text-[13px] leading-snug text-[#FBF6EC]/80 md:text-base">{description}</p>

        {photos.length > 1 && (
          <div className="mt-4 flex gap-1.5" aria-hidden>
            {photos.map((p, i) => (
              <span
                key={p}
                className={cn(
                  "h-1 rounded-full transition-all duration-500 ease-organic",
                  i === current ? "w-6 bg-sol" : "w-1.5 bg-[#FBF6EC]/45"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

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
        <RevealText as="h2" lines={productos.title} className="display text-4xl md:text-6xl" />
      </div>

      <div className="container-edge grid auto-rows-[minmax(220px,auto)] grid-cols-2 gap-3 md:auto-rows-[minmax(300px,auto)] md:gap-5 lg:grid-cols-12">
        {productos.items.map((item, i) => (
          <Ficha
            key={item.name}
            name={item.name}
            description={item.description}
            photos={productGallery[i] ?? []}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
