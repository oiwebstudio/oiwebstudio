"use client";

import { useEffect, useRef, useState } from "react";

/**
 * text-scramble-scroll (biblioteca-animaciones)
 * El texto se "descifra" la primera vez que entra en pantalla.
 * Pensado para las etiquetas .eyebrow: son cortas y en mayúsculas.
 */
export default function Scramble({
  text,
  className,
  pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%·",
}: {
  text: string;
  className?: string;
  pool?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sin movimiento: el texto final ya está en el DOM, no se toca.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }

    let interval: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        let n = 0;
        interval = setInterval(() => {
          setShown(
            [...text]
              .map((c, i) =>
                c === " " ? " " : i < n ? c : pool[(Math.random() * pool.length) | 0]
              )
              .join("")
          );
          if (n >= text.length) {
            clearInterval(interval);
            setShown(text);
          }
          n += 0.45;
        }, 38);
      },
      { threshold: 0.6 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [text, pool]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{shown}</span>
    </span>
  );
}
