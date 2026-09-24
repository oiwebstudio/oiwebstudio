"use client";

import { Plus } from "lucide-react";
import FadeIn from "@/components/motion/FadeIn";
import RevealText from "@/components/motion/RevealText";
import { buildFaq } from "@/lib/faq";
import { useLocale } from "@/lib/i18n";

/**
 * Preguntas frecuentes con <details>: el texto de cada respuesta está en el
 * HTML desde el principio (Google lo lee aunque esté plegado) y funciona con
 * teclado sin JavaScript propio.
 */
export default function Preguntas() {
  const { t, locale } = useLocale();
  const items = buildFaq(locale);

  return (
    <section id="preguntas" className="relative bg-lino/40 py-20 md:py-28">
      <div className="container-edge grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <FadeIn>
            <p className="eyebrow mb-3">{t.faq.eyebrow}</p>
            <div className="line-mark" />
          </FadeIn>
          <RevealText as="h2" lines={t.faq.title} className="display text-4xl md:text-5xl" />
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {items.map((item) => (
              <details key={item.q} className="group">
                <summary
                  data-cursor="hover"
                  className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden"
                >
                  <h3 className="font-serif text-lg italic text-ink transition-colors group-open:text-madera md:text-xl">
                    {item.q}
                  </h3>
                  <Plus
                    size={18}
                    aria-hidden
                    className="shrink-0 text-madera transition-transform duration-500 group-open:rotate-45"
                  />
                </summary>
                <p className="body-editorial pb-6 pr-10 text-sm md:text-base">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
