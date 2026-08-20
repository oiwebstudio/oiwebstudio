"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * card-cursor-glow (biblioteca-animaciones)
 * Escribe la posición del cursor en --gx/--gy; el halo lo pinta el CSS
 * (.fx-cursor-glow en globals.css). El mousemove va con rAF y solo actúa
 * con puntero fino: en táctil no deja ningún estado colgado.
 */
export default function CursorGlow({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<number | null>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (frame.current) return;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--gx", `${clientX - r.left}px`);
      el.style.setProperty("--gy", `${clientY - r.top}px`);
    });
  }, []);

  return (
    <Tag
      // @ts-expect-error ref polimórfico entre div y article
      ref={ref}
      onMouseMove={onMove}
      className={cn("fx-cursor-glow", className)}
    >
      {children}
    </Tag>
  );
}
