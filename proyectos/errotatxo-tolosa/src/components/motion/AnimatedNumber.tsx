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
  // El HTML estático lleva la cifra real (es lo que leen Google y quien no
  // tiene JavaScript); al montar se pone a 0 y cuenta al entrar en pantalla.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (numeric && !reduce) setDisplay("0");
  }, [numeric]);

  useEffect(() => {
    if (!inView || !numeric) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setDisplay(value);
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
