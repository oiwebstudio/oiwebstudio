"use client";

import FadeIn from "@/components/motion/FadeIn";
import RevealImage from "@/components/motion/RevealImage";
import RevealText from "@/components/motion/RevealText";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function Historia() {
  const { t } = useLocale();
  const historia = t.historia;

  return (
    <section id="historia" className="relative overflow-hidden bg-bg py-28 md:py-40">
      <div className="container-edge grid grid-cols-1 gap-y-20 md:grid-cols-12 md:gap-x-6">
        <div className="relative md:col-span-7 md:col-start-1">
          <RevealImage
            src="/images/fachada.jpg"
            alt={historia.imageAlt}
            className="aspect-[4/5] w-full md:aspect-[3/4]"
          />
          <div className="absolute -bottom-10 -right-4 w-32 rotate-3 sm:w-40 md:-right-8 md:-bottom-14 md:w-56 lg:w-64">
            <RevealImage
              src="/images/pan-tradicional.jpg"
              alt={historia.accentAlt}
              className="aspect-[4/5] w-full border-[6px] border-bg shadow-2xl"
              delay={0.35}
            />
          </div>
        </div>

        <div className="md:col-span-4 md:col-start-9 md:mt-24">
          <FadeIn>
            <p className="eyebrow mb-3">{historia.eyebrow}</p>
            <div className="line-mark" />
          </FadeIn>
          <RevealText
            as="h2"
            lines={historia.title}
            className="display mb-8 text-4xl md:text-6xl"
          />
          <div className="space-y-5">
            {historia.paragraphs.map((p, i) => (
              <FadeIn key={p} delay={0.1 + i * 0.1}>
                <p className={cn("body-editorial", i === 0 && "drop-cap")}>{p}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
