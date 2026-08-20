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
        <span key={`${line}-${i}`} className="block overflow-hidden">
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
