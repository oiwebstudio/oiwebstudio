"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Loader() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("errotatxo-visited")) {
      setSkip(true);
      setShow(false);
      return;
    }

    document.body.style.overflow = "hidden";
    let raf = 0;
    const start = performance.now();
    const duration = 2200;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          sessionStorage.setItem("errotatxo-visited", "1");
          setShow(false);
        }, 500);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  if (skip) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
      }}
    >
      {show && (
        <motion.div
          key="loader"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.05, ease: [0.87, 0, 0.13, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#F7F2EA]"
        >
          {/* halo de sol que late detrás del logo */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.9, 1.08, 0.9], opacity: 0.85 }}
            transition={{
              scale: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.9, ease: "easeOut" },
            }}
            className="absolute h-72 w-72 rounded-full bg-[#F2C216]/30 blur-3xl md:h-96 md:w-96"
          />

          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.82 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <Image
              src="/images/logo-errotatxo.png"
              alt="Errotatxo"
              width={304}
              height={165}
              priority
              className="h-28 w-auto object-contain mix-blend-multiply md:h-40"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-10 h-px w-40 overflow-hidden bg-[#4E2E1B]/15"
          >
            <motion.div
              style={{ scaleX: progress }}
              className="h-full w-full origin-left bg-[#4E2E1B]"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="relative mt-4 text-[11px] uppercase tracking-widest2 text-[#4E2E1B]/55"
          >
            Tolosa &middot; Desde siempre
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
