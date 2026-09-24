"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";
import RevealText from "@/components/motion/RevealText";
import { useLocale } from "@/lib/i18n";
import { storePath, stores } from "@/lib/stores";

/**
 * Dice en texto llano qué es Errotatxo y dónde está: panadería, pastelería y
 * cafetería en Tolosaldea. Es lo que Google necesita leer para asociar la web
 * con esas búsquedas, y enlaza a la página propia de cada tienda.
 */
export default function Comarca() {
  const { t } = useLocale();
  const copy = t.comarca;

  return (
    <section id="tolosaldea" className="relative bg-bg py-20 md:py-28">
      <div className="container-edge grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <FadeIn>
            <p className="eyebrow mb-3">{copy.eyebrow}</p>
            <div className="line-mark" />
          </FadeIn>
          <RevealText as="h2" lines={copy.title} className="display text-4xl md:text-5xl" />
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <FadeIn delay={0.1}>
            <p className="body-editorial">{copy.text}</p>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-10">
            <p className="mb-3 text-[11px] uppercase tracking-widest2 text-muted">{copy.storesLabel}</p>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {stores.map((store) => (
                <li key={store.id}>
                  <Link
                    href={storePath(store)}
                    data-cursor="hover"
                    className="group flex min-h-[44px] items-center justify-between gap-4 py-4"
                  >
                    <span>
                      <span className="font-serif text-lg italic text-ink transition-colors group-hover:text-madera">
                        {store.name}
                      </span>
                      <span className="block text-xs text-muted">
                        {store.street}, {store.locality}
                        {store.cafe && ` · ${t.tiendas.cafeTag}`}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-madera transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
