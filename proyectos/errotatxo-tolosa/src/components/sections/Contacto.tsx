"use client";

import { ArrowUpRight, Facebook, Instagram, Phone } from "lucide-react";
import FadeIn from "@/components/motion/FadeIn";
import Magnetic from "@/components/motion/Magnetic";
import { socialLinks } from "@/lib/data";
import { stores } from "@/lib/stores";
import { useLocale } from "@/lib/i18n";

const socialIcons: Record<string, typeof Instagram> = { Instagram, Facebook };

export default function Contacto() {
  const { t } = useLocale();
  const contacto = t.contacto;
  const phoneStores = stores.filter((s) => s.phone);
  const facebook = socialLinks.find((s) => s.label === "Facebook");


  return (
    <section id="contacto" className="relative overflow-hidden bg-lino/40 py-20 md:py-28">
      <div className="container-edge grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <FadeIn delay={0.15}>
            <p className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-muted">
              <Phone size={14} className="text-madera" />
              {contacto.call}
            </p>
            <div className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
              {phoneStores.map((store) => (
                <a
                  key={store.id}
                  href={`tel:${store.phone!.replace(/\s/g, "")}`}
                  data-cursor="hover"
                  className="group flex items-center justify-between gap-4 py-3 transition-colors hover:text-madera"
                >
                  <span className="text-sm text-ink transition-colors group-hover:text-madera">
                    {store.name}
                  </span>
                  <span className="font-serif text-lg text-madera">{store.phone}</span>
                </a>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-8">
            <p className="mb-2 text-[11px] uppercase tracking-widest2 text-muted">
              {contacto.follow}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((s) => {
                const Icon = socialIcons[s.label];
                return (
                  <Magnetic key={s.label} strength={0.5}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      data-cursor="hover"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-300 hover:border-sol hover:bg-sol hover:text-[#4E2E1B]"
                    >
                      <Icon size={16} />
                    </a>
                  </Magnetic>
                );
              })}
            </div>
          </FadeIn>
        </div>

        {/* Antes había aquí un formulario que simulaba el envío: el mensaje no
            llegaba a nadie. Hasta que haya correo, el canal escrito es Facebook. */}
        <div className="md:col-span-6 md:col-start-7">
          <FadeIn delay={0.1}>
            <p className="display text-3xl md:text-4xl">{contacto.write.title}</p>
            <p className="body-editorial mt-4 max-w-md">{contacto.write.text}</p>
          </FadeIn>
          {facebook && (
            <FadeIn delay={0.2} className="mt-8">
              <Magnetic className="inline-block">
                <a
                  href={facebook.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="group flex min-h-[44px] items-center gap-3 text-sm uppercase tracking-widest2 text-ink"
                >
                  {contacto.write.cta}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 transition-colors duration-500 group-hover:border-sol group-hover:bg-sol group-hover:text-[#4E2E1B]">
                    <ArrowUpRight size={14} />
                  </span>
                </a>
              </Magnetic>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
