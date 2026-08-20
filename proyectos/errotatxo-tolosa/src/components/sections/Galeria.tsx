"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import FadeIn from "@/components/motion/FadeIn";
import RevealImage from "@/components/motion/RevealImage";
import RevealText from "@/components/motion/RevealText";
import { galleryImages } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

export default function Galeria() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t } = useLocale();
  const gallery = galleryImages.map((src, i) => ({ src, alt: t.galeria.alts[i] }));

  const close = () => setActiveIndex(null);
  const prev = () =>
    setActiveIndex((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length));
  const next = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % gallery.length));

  return (
    <section id="galeria" className="relative overflow-hidden bg-bg py-20 md:py-28">
      <div className="container-edge mb-10 md:mb-14">
        <FadeIn>
          <p className="eyebrow mb-3">{t.galeria.eyebrow}</p>
          <div className="line-mark" />
        </FadeIn>
        <RevealText as="h2" lines={[t.galeria.title]} className="display text-4xl md:text-6xl" />
      </div>

      <div className="container-edge grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {gallery.map((img, i) => (
          <button
            key={img.src}
            type="button"
            data-cursor-label={t.common.view}
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-sm"
          >
            <RevealImage
              src={img.src}
              alt={img.alt}
              className="h-full w-full"
              imgClassName="transition-transform duration-700 ease-organic group-hover:scale-105"
              delay={(i % 4) * 0.05}
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0D0A08]/95 px-4"
            onClick={close}
          >
            <button
              aria-label={t.common.close}
              data-cursor="hover"
              onClick={close}
              className="absolute right-6 top-6 text-[#F5EFE4]/80 hover:text-[#F5EFE4]"
            >
              <X size={30} />
            </button>
            <button
              aria-label={t.common.prev}
              data-cursor="hover"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 text-[#F5EFE4]/80 hover:text-[#F5EFE4] md:left-8"
            >
              <ChevronLeft size={36} />
            </button>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/3] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={gallery[activeIndex].src}
                alt={gallery[activeIndex].alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>
            <button
              aria-label={t.common.next}
              data-cursor="hover"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 text-[#F5EFE4]/80 hover:text-[#F5EFE4] md:right-8"
            >
              <ChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
