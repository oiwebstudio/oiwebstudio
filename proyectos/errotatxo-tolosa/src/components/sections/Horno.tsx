"use client";

import Image from "next/image";
import FadeIn from "@/components/motion/FadeIn";
import Parallax from "@/components/motion/Parallax";
import RevealText from "@/components/motion/RevealText";
import { useLocale } from "@/lib/i18n";

export default function Horno() {
  const { t } = useLocale();
  const horno = t.horno;

  return (
    <section
      id="horno"
      className="relative h-[85vh] min-h-[560px] overflow-hidden bg-[#15110D] md:h-screen"
    >
      <Parallax speed={0.18} className="absolute inset-0">
        <Image
          src="/images/pan-molde.jpg"
          alt={horno.imageAlt}
          fill
          sizes="100vw"
          className="object-cover opacity-70"
        />
      </Parallax>
      <div className="absolute inset-0 bg-gradient-to-b from-[#15110D]/70 via-[#15110D]/40 to-[#15110D]/90" />

      <div className="container-edge relative flex h-full flex-col justify-end pb-20 md:pb-28">
        <FadeIn>
          <p className="eyebrow mb-3 text-[#C79764]">{horno.eyebrow}</p>
          <div className="line-mark bg-[#C79764]/60" />
        </FadeIn>
        <RevealText
          as="h2"
          lines={horno.title}
          className="max-w-3xl font-serif text-4xl italic font-medium leading-[0.95] tracking-tight text-[#F5EFE4] md:text-7xl"
        />
        <div className="mt-8 max-w-md">
          {horno.paragraphs.map((p, i) => (
            <FadeIn key={p} delay={0.2 + i * 0.1}>
              <p className="text-base leading-relaxed text-[#F5EFE4]/70 md:text-lg">
                {p}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
