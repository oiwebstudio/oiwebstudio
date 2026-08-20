"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FadeIn from "@/components/motion/FadeIn";
import RevealText from "@/components/motion/RevealText";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLocale } from "@/lib/i18n";

const STEP_IMAGES = [
  "/images/pan-tradicional.jpg",
  "/images/pan-molde.jpg",
  "/images/donuts.jpg",
  "/images/galletas.jpg",
];

export default function Proceso() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { t } = useLocale();
  const proceso = t.proceso;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const steps = gsap.utils.toArray<HTMLElement>(".proceso-step", section);
    const triggers = steps.map((step, i) =>
      ScrollTrigger.create({
        trigger: step,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        },
      })
    );

    return () => triggers.forEach((trg) => trg.kill());
  }, []);

  return (
    <section
      id="proceso"
      ref={sectionRef}
      className="relative bg-bg py-28 md:py-40"
    >
      <div className="container-edge mb-16 md:mb-24">
        <FadeIn>
          <p className="eyebrow mb-3">{proceso.eyebrow}</p>
          <div className="line-mark" />
        </FadeIn>
        <RevealText
          as="h2"
          lines={[proceso.title]}
          className="display text-4xl md:text-6xl"
        />
      </div>

      <div className="container-edge grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="hidden md:col-span-5 md:block">
          <div className="sticky top-32">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-carbon">
            {STEP_IMAGES.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={proceso.steps[i].title}
                fill
                sizes="40vw"
                className="absolute inset-0 object-cover transition-opacity duration-700 ease-in-out"
                style={{ opacity: active === i ? 1 : 0 }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 font-serif text-6xl text-[#F5EFE4]">
              0{active + 1}
            </div>
          </div>
          </div>
        </div>

        <div className="md:col-span-7">
          {proceso.steps.map((step, i) => (
            <div
              key={step.n}
              className="proceso-step flex min-h-[45vh] flex-col justify-center border-t border-ink/10 py-10 first:border-t-0 md:min-h-[55vh]"
            >
              <FadeIn amount={0.5}>
                <span className="mb-4 block text-sm text-madera">
                  {step.n}
                </span>
                <h3 className="display mb-4 text-3xl md:text-5xl">
                  {step.title}
                </h3>
                <p className="body-editorial max-w-md">{step.text}</p>
              </FadeIn>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
