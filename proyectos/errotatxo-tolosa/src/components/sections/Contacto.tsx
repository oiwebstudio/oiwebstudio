"use client";

import { CheckCircle2, Facebook, Instagram, Phone, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import FadeIn from "@/components/motion/FadeIn";
import Magnetic from "@/components/motion/Magnetic";
import { socialLinks } from "@/lib/data";
import { stores } from "@/lib/stores";
import { useLocale } from "@/lib/i18n";

const socialIcons: Record<string, typeof Instagram> = { Instagram, Facebook };

export default function Contacto() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const { t } = useLocale();
  const contacto = t.contacto;
  const phoneStores = stores.filter((s) => s.phone);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 900);
  };

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

        <div className="relative md:col-span-6 md:col-start-7">
          <FadeIn
            delay={0.25}
            className="absolute -top-5 right-6 z-10 hidden rotate-6 bg-sol px-4 py-3 text-center shadow-lg md:block md:right-10"
          >
            <p className="text-[11px] font-bold uppercase leading-tight tracking-widest2 text-[#4E2E1B]">
              {contacto.quickReply}
            </p>
          </FadeIn>
          {status === "sent" ? (
            <FadeIn className="flex flex-col items-start gap-3 py-8">
              <CheckCircle2 className="text-madera" size={36} strokeWidth={1.5} />
              <p className="display text-2xl">{contacto.form.sentTitle}</p>
              <p className="body-editorial">{contacto.form.sentText}</p>
            </FadeIn>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <FadeIn delay={0.05}>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder={contacto.form.name}
                  className="w-full border-b border-ink/20 bg-transparent py-3 font-serif text-2xl placeholder:text-ink/30 focus:border-madera focus:outline-none md:text-3xl"
                />
              </FadeIn>
              <FadeIn delay={0.1}>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder={contacto.form.email}
                  className="w-full border-b border-ink/20 bg-transparent py-3 font-serif text-2xl placeholder:text-ink/30 focus:border-madera focus:outline-none md:text-3xl"
                />
              </FadeIn>
              <FadeIn delay={0.15}>
                <textarea
                  name="message"
                  required
                  rows={3}
                  placeholder={contacto.form.message}
                  className="w-full resize-none border-b border-ink/20 bg-transparent py-3 font-serif text-2xl placeholder:text-ink/30 focus:border-madera focus:outline-none md:text-3xl"
                />
              </FadeIn>
              <FadeIn delay={0.2}>
                <Magnetic className="inline-block">
                  <button
                    type="submit"
                    data-cursor="hover"
                    disabled={status === "sending"}
                    className="group flex items-center gap-3 text-sm uppercase tracking-widest2 text-ink disabled:opacity-50"
                  >
                    {status === "sending" ? contacto.form.sending : contacto.form.submit}
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 transition-colors duration-500 group-hover:border-sol group-hover:bg-sol group-hover:text-[#4E2E1B]">
                      <Send size={14} />
                    </span>
                  </button>
                </Magnetic>
              </FadeIn>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
