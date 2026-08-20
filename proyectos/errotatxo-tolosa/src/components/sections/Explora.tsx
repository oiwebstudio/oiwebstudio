"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";
import RevealText from "@/components/motion/RevealText";
import imageLoader from "@/lib/imageLoader";
import { useLocale } from "@/lib/i18n";

const CARD_IMAGES = [
  "/images/pan-tradicional.jpg",
  "/images/donuts.jpg",
  "/images/fachada.jpg",
];

export default function Explora() {
  const { t } = useLocale();
  const explore = t.explore;

  return (
    <section id="explora" className="relative bg-lino/30 py-24 md:py-32">
      <div className="container-edge mb-12 md:mb-16">
        <FadeIn>
          <p className="eyebrow mb-3">{explore.eyebrow}</p>
          <div className="line-mark" />
        </FadeIn>
        <RevealText as="h2" lines={explore.title} className="display text-4xl md:text-6xl" />
      </div>

      <div className="container-edge grid grid-cols-1 gap-6 md:grid-cols-3">
        {explore.cards.map((card, i) => (
          <FadeIn key={card.href} delay={0.08 * i}>
            <Link
              href={card.href}
              data-cursor="hover"
              className="group relative block aspect-[3/4] overflow-hidden rounded-3xl shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-16px_rgba(78,46,27,0.45)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageLoader({ src: CARD_IMAGES[i] })}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-organic group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 via-carbon/5 to-transparent" />

              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-carbon/25 px-5 py-4 backdrop-blur-md">
                <div>
                  <h3 className="font-serif text-lg font-medium leading-tight text-[#F5EFE4] transition-colors duration-500 group-hover:text-sol md:text-xl">
                    {card.title}
                  </h3>
                  <span className="mt-1 block text-[10px] uppercase tracking-widest2 text-[#F5EFE4]/60">
                    {card.label}
                  </span>
                </div>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-[#F5EFE4]/70 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sol"
                />
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
