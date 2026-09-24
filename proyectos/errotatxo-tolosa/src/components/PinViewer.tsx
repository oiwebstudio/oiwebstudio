"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useLenis } from "@/components/motion/LenisProvider";
import { useLocale } from "@/lib/i18n";
import type { Pin } from "@/lib/pins";
import { storePath, stores } from "@/lib/stores";

const SWIPE = 70; // px de arrastre para pasar de foto

/**
 * Visor a pantalla completa del muro: se desliza con el dedo entre fotos,
 * se cierra con la X, con Escape o tocando fuera, y con flechas del teclado.
 */
export default function PinViewer({
  items,
  index,
  onChange,
  onClose,
}: {
  items: Pin[];
  index: number | null;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const { t, locale } = useLocale();
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const pin = open ? items[index] : null;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + items.length) % items.length);
    },
    [index, items.length, onChange]
  );

  // Bloquea el scroll de debajo y devuelve el foco donde estaba al cerrar.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE) go(1);
    else if (info.offset.x > SWIPE) go(-1);
    else if (info.offset.y > SWIPE * 1.5) onClose(); // deslizar hacia abajo cierra
  };

  const store = pin?.store ? stores.find((s) => s.id === pin.store) : undefined;
  const caption = pin ? (locale === "eu" ? pin.eu : pin.es) : "";

  return (
    <AnimatePresence>
      {pin && (
        <motion.div
          key="visor"
          role="dialog"
          aria-modal="true"
          aria-label={caption}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex flex-col bg-[#150D07]/95 backdrop-blur-md"
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] text-[#F5EFE4]">
            <span className="text-xs tabular-nums text-[#F5EFE4]/60">
              {index! + 1} / {items.length}
            </span>
            <button
              ref={closeRef}
              type="button"
              aria-label={t.common.close}
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-3">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={pin.src}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                drag
                dragSnapToOrigin
                dragElastic={0.5}
                onDragEnd={onDragEnd}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full touch-none items-center justify-center"
              >
                <Image
                  src={pin.src}
                  alt={caption}
                  width={pin.w}
                  height={pin.h}
                  sizes="100vw"
                  draggable={false}
                  // Ancho explícito: el loader sirve un único archivo pero declara
                  // varios anchos en el srcset, y con "w-auto" el navegador
                  // calculaba la foto a 44 px. Cabe a lo ancho y a lo alto.
                  style={{ width: `min(calc(100vw - 1.5rem), calc(74svh * ${pin.w / pin.h}))` }}
                  className="h-auto rounded-2xl shadow-2xl"
                />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              aria-label={t.common.prev}
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-4 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[#F5EFE4] transition-colors hover:bg-white/20 md:flex"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              aria-label={t.common.next}
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-4 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[#F5EFE4] transition-colors hover:bg-white/20 md:flex"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div
            className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-serif text-xl italic text-[#F5EFE4]">{caption}</p>
            {store && (
              <Link
                href={storePath(store)}
                onClick={onClose}
                className="mt-1 inline-flex min-h-[44px] items-center gap-1.5 text-xs text-[#F5EFE4]/70 hover:text-sol"
              >
                <MapPin size={12} className="text-sol" />
                {store.name}
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
