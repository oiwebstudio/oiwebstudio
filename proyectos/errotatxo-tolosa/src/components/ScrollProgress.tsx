"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });
  const bg = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [
      "linear-gradient(90deg, #F2C216 0%, #D6A64A 100%)",
      "linear-gradient(90deg, #D6A64A 0%, #C79764 60%, #A9825A 100%)",
      "linear-gradient(90deg, #A9825A 0%, #7A4C2A 60%, #5C3A23 100%)",
      "linear-gradient(90deg, #5C3A23 0%, #3B2114 60%, #2B1510 100%)",
    ]
  );

  return (
    <motion.div
      style={{ scaleX, background: bg }}
      className="fixed left-0 right-0 top-0 z-[55] h-[2px] origin-left"
    />
  );
}
