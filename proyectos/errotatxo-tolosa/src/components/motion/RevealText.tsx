"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";

export default function RevealText({
  lines,
  as: Tag = "div",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.1,
  duration = 1.1,
  once = true,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        // La máscara se alarga por abajo (pb) y se devuelve el espacio (-mb):
        // con el interlineado apretado de los titulares, las letras con
        // descendente (p, g, q) quedaban cortadas por la máscara.
        <span key={`${line}-${i}`} className="-mb-[0.18em] block overflow-hidden pb-[0.18em]">
          <motion.span
            className={lineClassName ?? "block"}
            initial={{ y: "112%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once, amount: 0.6 }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
