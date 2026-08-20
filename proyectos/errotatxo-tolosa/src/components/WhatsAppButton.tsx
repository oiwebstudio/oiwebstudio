"use client";

import { motion } from "framer-motion";
import Magnetic from "@/components/motion/Magnetic";
import { businessInfo } from "@/lib/data";
import { useLocale } from "@/lib/i18n";

export default function WhatsAppButton() {
  const { t } = useLocale();

  return (
    <Magnetic strength={0.4} className="fixed bottom-6 left-6 z-40">
      <motion.a
        href={`https://wa.me/${businessInfo.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.common.whatsapp}
        data-cursor="hover"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.876.518 3.632 1.417 5.13L2 22l4.995-1.375A9.955 9.955 0 0 0 12.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.09c-1.65 0-3.196-.46-4.516-1.257l-.324-.192-3.14.865.85-3.06-.211-.336A8.075 8.075 0 0 1 3.91 12c0-4.465 3.626-8.09 8.091-8.09 4.464 0 8.09 3.625 8.09 8.09 0 4.465-3.626 8.09-8.09 8.09z" />
        </svg>
      </motion.a>
    </Magnetic>
  );
}
