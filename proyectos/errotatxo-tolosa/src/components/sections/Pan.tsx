"use client";

import FadeIn from "@/components/motion/FadeIn";
import RevealImage from "@/components/motion/RevealImage";
import RevealText from "@/components/motion/RevealText";
import { useLocale } from "@/lib/i18n";

export default function Pan() {
  const { t } = useLocale();
  const pan = t.pan;

  return (
    <section id="pan" className="relative overflow-hidden bg-lino/40 py-28 md:py-40">
      <div className="container-edge grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-6">
        <div className="order-2 flex flex-col justify-center md:order-1 md:col-span-4 md:col-start-1 md:mt-16">
          <FadeIn>
            <p className="eyebrow mb-3">{pan.eyebrow}</p>
            <div className="line-mark" />
          </FadeIn>
          <RevealText
            as="h2"
            lines={pan.title}
            className="display mb-8 text-4xl md:text-6xl"
          />
          <div className="space-y-5">
            {pan.paragraphs.map((p, i) => (
              <FadeIn key={p} delay={0.1 + i * 0.1}>
                <p className="body-editorial">{p}</p>
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="order-1 md:order-2 md:col-span-7 md:col-start-6">
          <RevealImage
            src="/images/pan-tradicional.jpg"
            alt={pan.imageAlt}
            className="aspect-[4/5] w-full md:aspect-[3/4]"
            imgClassName="object-[50%_25%]"
          />
        </div>
      </div>
    </section>
  );
}
