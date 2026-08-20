"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({
  value,
  suffix,
  className,
  duration = 1.5,
}: {
  value: string;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const numeric = /^\d+$/.test(value);
  const [display, setDisplay] = useState(numeric ? "0" : value);

  useEffect(() => {
    if (!inView || !numeric) return;
    const target = parseInt(value, 10);
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, numeric, value, duration]);

  return (
    <p ref={ref} className={className}>
      {display}
      {suffix && <span className="text-madera">{suffix}</span>}
    </p>
  );
}
