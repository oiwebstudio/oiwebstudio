"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLenis } from "@/components/motion/LenisProvider";
import Magnetic from "@/components/motion/Magnetic";
import { useLocale } from "@/lib/i18n";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const lenis = useLenis();
  const { t } = useLocale();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 800);
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, window.scrollY / total) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const r = 20;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      {visible && (
        <Magnetic
          strength={0.4}
          className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-5 z-40 md:right-6"
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollTop}
            aria-label={t.common.backToTop}
            data-cursor="hover"
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#2B2019] text-[#F5EFE4] shadow-lg"
          >
            <svg
              className="absolute inset-0 -rotate-90"
              viewBox="0 0 48 48"
              fill="none"
            >
              <circle
                cx="24"
                cy="24"
                r={r}
                stroke="rgb(214 166 74 / 0.2)"
                strokeWidth="2"
              />
              <circle
                cx="24"
                cy="24"
                r={r}
                stroke="rgb(214 166 74)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-[stroke-dashoffset] duration-150 ease-out"
              />
            </svg>
            <ArrowUp size={18} />
          </motion.button>
        </Magnetic>
      )}
    </AnimatePresence>
  );
}
