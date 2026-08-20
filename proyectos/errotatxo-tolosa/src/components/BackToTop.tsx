"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLenis } from "@/components/motion/LenisProvider";
import Magnetic from "@/components/motion/Magnetic";
import { useLocale } from "@/lib/i18n";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();
  const { t } = useLocale();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <Magnetic strength={0.4} className="fixed bottom-6 right-6 z-40">
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollTop}
            aria-label={t.common.backToTop}
            data-cursor="hover"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2B2019] text-[#F5EFE4] shadow-lg"
          >
            <ArrowUp size={20} />
          </motion.button>
        </Magnetic>
      )}
    </AnimatePresence>
  );
}
