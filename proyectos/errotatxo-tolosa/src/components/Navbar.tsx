"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import Logo from "@/components/Logo";
import { useLenis } from "@/components/motion/LenisProvider";
import Magnetic from "@/components/motion/Magnetic";
import { businessInfo, socialLinks } from "@/lib/data";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const { t } = useLocale();

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  // cerrar el menú al cambiar de página
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = t.nav.sections;

  return (
    <>
      <header className="fixed left-0 right-0 top-4 z-50 px-4 md:top-6 md:px-6">
        {/* head-aurora-glass: isla de cristal con anillo cónico dorado
            (adv-aurora + card-gradient-ring, biblioteca-animaciones) */}
        <div className="fx-nav-island mx-auto flex max-w-content items-center justify-between gap-4 rounded-full py-2.5 pl-5 pr-2.5 backdrop-blur-2xl backdrop-saturate-150 md:py-3 md:pl-6 md:pr-3">
          <Link href="/" data-cursor="hover" className="flex items-center gap-2.5 text-ink">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sol/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sol" />
            </span>
            <Logo className="h-8 md:h-9" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.slice(1).map((s) => {
              const active = pathname === s.href;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  data-cursor="hover"
                  className={cn(
                    "relative text-xs uppercase tracking-widest2 transition-colors duration-300",
                    active ? "text-madera" : "text-ink/70 hover:text-madera"
                  )}
                >
                  {s.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-1.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sol to-transparent"
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <LanguageToggle light />
            </div>
            <Magnetic>
              <Link
                href="/tiendas"
                data-cursor="hover"
                className="group hidden items-center overflow-hidden rounded-full bg-gradient-to-br from-[#241812] to-[#4E2E1B] px-5 py-2.5 text-[11px] font-medium uppercase tracking-widest2 text-[#F5EFE4] shadow-[0_6px_18px_-8px_rgba(214,166,74,0.8)] ring-1 ring-sol/30 transition-all duration-500 hover:shadow-[0_10px_26px_-8px_rgba(214,166,74,0.95)] hover:ring-sol/70 sm:inline-flex"
              >
                {t.nav.sections[3].label}
              </Link>
            </Magnetic>
            <button
              type="button"
              data-cursor="hover"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t.nav.close : t.nav.menu}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-300 hover:border-madera lg:hidden"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.87, 0, 0.13, 1] }}
            className="container-edge fixed inset-0 z-40 flex flex-col justify-between overflow-hidden bg-[#0D0A08]/80 pb-12 pt-28 text-[#F5EFE4] backdrop-blur-2xl backdrop-saturate-150"
          >
            {/* adv-aurora (biblioteca-animaciones): atmósfera bajo el menú */}
            <div aria-hidden className="fx-aurora">
              <span />
              <span />
            </div>

            <nav className="relative z-[1] flex flex-col gap-1 md:gap-2">
              {links.map((s, i) => (
                <motion.div
                  key={s.href}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    delay: 0.15 + i * 0.06,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={s.href}
                    data-cursor="hover"
                    className="group relative flex items-baseline gap-4 border-b border-white/10 py-3 text-left"
                  >
                    {/* btn-underline-sweep (biblioteca-animaciones): hilo dorado
                        que barre el borde inferior al pasar */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-sol via-[#F5E6C8] to-transparent transition-transform duration-700 ease-organic group-hover:scale-x-100"
                    />
                    <span className="text-xs text-sol/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-serif text-3xl italic transition-transform duration-500 group-hover:translate-x-3 md:text-4xl",
                        // text-gold-sweep: la página activa va en oro vivo
                        pathname === s.href && "fx-gold"
                      )}
                    >
                      {s.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="relative z-[1] flex flex-col gap-4 pt-8 md:flex-row md:items-end md:justify-between"
            >
              <div className="flex items-center gap-5 text-sm text-[#F5EFE4]/60">
                <div className="flex flex-col gap-1">
                  <p>{businessInfo.address}</p>
                  <a href={`tel:${businessInfo.phone.replace(/\s/g, "")}`}>
                    {businessInfo.phone}
                  </a>
                </div>
              </div>
              <div className="flex gap-6">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="flex items-center gap-1 text-xs uppercase tracking-widest2 text-[#F5EFE4]/70 hover:text-[#F5EFE4]"
                  >
                    {s.label} <ArrowUpRight size={12} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
