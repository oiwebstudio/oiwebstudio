"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 25, stiffness: 300, mass: 0.5 });
  const springY = useSpring(y, { damping: 25, stiffness: 300, mass: 0.5 });
  const isTouch = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mql.matches) return;

    const onMove = (e: MouseEvent) => {
      if (isTouch.current) return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onTouch = () => {
      isTouch.current = true;
      setVisible(false);
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("[data-cursor='hover']") ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setHovering(true);
      }
    };

    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("[data-cursor='hover']") ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setHovering(false);
      }
    };

    const onOut = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchstart", onTouch, { once: true });
    document.addEventListener("mouseover", onEnter, { passive: true });
    document.addEventListener("mouseout", onLeave, { passive: true });
    document.addEventListener("mouseleave", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      document.removeEventListener("mouseleave", onOut);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
    >
      <motion.div
        animate={{
          width: hovering ? 48 : 8,
          height: hovering ? 48 : 8,
          borderWidth: hovering ? 1.5 : 0,
          backgroundColor: hovering
            ? "rgba(214, 166, 74, 0)"
            : "rgba(214, 166, 74, 1)",
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-full border-sol/80 -translate-x-1/2 -translate-y-1/2"
      />
    </motion.div>
  );
}
