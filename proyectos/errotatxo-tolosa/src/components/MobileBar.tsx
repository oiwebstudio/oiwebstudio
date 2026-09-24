"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ArrowUpRight, Navigation, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LiveStatusBadge from "@/components/LiveStatusBadge";
import { useLenis } from "@/components/motion/LenisProvider";
import { useLocale } from "@/lib/i18n";
import { directionsUrl, storePath, stores } from "@/lib/stores";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Barra inferior del móvil: lo que busca casi todo el que entra desde el
 * teléfono —llamar o ir— siempre al alcance del pulgar. Cualquiera de los dos
 * botones abre una hoja con las tres tiendas, su estado y ambas acciones.
 * Aparece al pasar el hero, para no tapar la portada.
 */
export default function MobileBar() {
  const { t } = useLocale();
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!sheet) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [sheet, lenis]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 80 || info.velocity.y > 500) setSheet(false);
  };

  const pill =
    "flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full text-[13px] font-medium transition-transform active:scale-[0.97]";

  return (
    <>
      {/* Hueco al final de la página para que la barra no tape el pie. */}
      <div aria-hidden className="h-20 md:hidden" />

      <AnimatePresence>
        {visible && !sheet && (
          <motion.nav
            aria-label={t.ubicacion.storesTitle}
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-30 flex gap-2 rounded-full border border-ink/10 bg-surface/85 p-1.5 shadow-[0_12px_40px_-12px_rgba(43,30,20,0.45)] backdrop-blur-xl md:hidden"
          >
            <button type="button" onClick={() => setSheet(true)} className={`${pill} bg-ink text-bg`}>
              <Phone size={15} /> {t.tiendas.callCta}
            </button>
            <button type="button" onClick={() => setSheet(true)} className={`${pill} bg-sol/25 text-ink`}>
              <Navigation size={15} /> {t.tiendas.routeCta}
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sheet && (
          <motion.div
            key="fondo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#150D07]/50 backdrop-blur-sm md:hidden"
            onClick={() => setSheet(false)}
          />
        )}
        {sheet && (
          <motion.div
            key="hoja"
            role="dialog"
            aria-modal="true"
            aria-label={t.ubicacion.storesTitle}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={onDragEnd}
            className="fixed inset-x-0 bottom-0 z-[61] rounded-t-[1.75rem] bg-bg px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3 shadow-2xl md:hidden"
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-ink/15" />
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="font-serif text-2xl italic text-ink">{t.ubicacion.storesTitle}</p>
              <button
                type="button"
                aria-label={t.common.close}
                onClick={() => setSheet(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-lino text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <ul className="space-y-2.5">
              {stores.map((store) => (
                <li key={store.id} className="rounded-2xl bg-surface p-4 shadow-[0_6px_20px_-14px_rgba(43,30,20,0.5)]">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={storePath(store)}
                      onClick={() => setSheet(false)}
                      className="group min-w-0"
                    >
                      <span className="flex items-center gap-1 font-serif text-lg italic text-ink">
                        {store.name}
                        <ArrowUpRight size={14} className="text-madera" />
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {store.street}
                        {store.cafe && ` · ${t.tiendas.cafeTag}`}
                      </span>
                    </Link>
                  </div>
                  <div className="mt-1.5">
                    <LiveStatusBadge store={store} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    {store.phone && store.verified.phone && (
                      <a
                        href={`tel:${store.phone.replace(/\s/g, "")}`}
                        className={`${pill} bg-ink text-bg`}
                      >
                        <Phone size={14} /> {store.phone}
                      </a>
                    )}
                    <a
                      href={directionsUrl(store)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t.tiendas.routeCta}: ${store.name}`}
                      className={`${pill} max-w-[8.5rem] bg-sol/25 text-ink`}
                    >
                      <Navigation size={14} /> {t.tiendas.routeCta}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
