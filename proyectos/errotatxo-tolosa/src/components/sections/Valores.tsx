"use client";

import FadeIn from "@/components/motion/FadeIn";
import RevealText from "@/components/motion/RevealText";
import imageLoader from "@/lib/imageLoader";
import { useLocale } from "@/lib/i18n";

const IMAGES = [
  "/images/pan-tradicional.jpg",
  "/images/fachada.jpg",
  "/images/donuts.jpg",
  "/images/pastel.jpg",
];

export default function Valores() {
  const { t } = useLocale();
  const items = t.valores.items;
  const track = [...items, ...items];

  return (
    <section id="valores" className="relative overflow-hidden bg-bg py-28 md:py-40">
      <div className="container-edge mb-16 md:mb-20">
        <FadeIn>
          <p className="eyebrow mb-3">{t.valores.eyebrow}</p>
          <div className="line-mark" />
        </FadeIn>
        <RevealText
          as="h2"
          lines={t.valores.title}
          className="display text-4xl md:text-6xl"
        />
      </div>

      <div className="group relative [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="flex w-max animate-marquee gap-6 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {track.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
              className="group/card relative aspect-[3/4] w-64 shrink-0 overflow-hidden rounded-3xl shadow-sm transition-shadow duration-500 hover:shadow-[0_24px_48px_-16px_rgba(78,46,27,0.45)] sm:w-72"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageLoader({ src: IMAGES[i % IMAGES.length] })}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-organic group-hover/card:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 via-carbon/5 to-transparent" />

              <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/15 bg-carbon/25 px-5 py-4 backdrop-blur-md">
                <h3 className="font-serif text-lg font-medium leading-tight text-[#F5EFE4] md:text-xl">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-snug text-[#F5EFE4]/70">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
