"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FadeIn({
  children,
  delay = 0,
  duration = 1,
  y = 28,
  blur = false,
  once = true,
  amount = 0.3,
  className,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
  amount?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: blur ? "blur(10px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
