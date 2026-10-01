"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CROQUIS } from "@/lib/croquis";
import { stores } from "@/lib/stores";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Punto del trazado cuya altura se acerca más a `y`; sirve para colgar etiquetas. */
function pointNearY(d: string, y: number): [number, number] {
  let best: [number, number] = [0, 0];
  let bestDist = Infinity;
  for (const pair of d.slice(1).split("L")) {
    const [px, py] = pair.split(" ").map(Number);
    if (Math.abs(py - y) < bestDist) {
      bestDist = Math.abs(py - y);
      best = [px, py];
    }
  }
  return best;
}

const PIN_LABELS: Record<string, { text: string; dx: number; dy: number; anchor: "start" | "end" }> = {
  "tolosa-andia": { text: "Andia", dx: 18, dy: 6, anchor: "start" },
  "tolosa-san-frantzisko": { text: "San Frantzisko", dx: -18, dy: 6, anchor: "end" },
  anoeta: { text: "San Juan kalea", dx: -18, dy: 6, anchor: "end" },
};

/**
 * Croquis dibujado de Tolosa a Anoeta: el Oria, la N-I y las tres tiendas en
 * su sitio real. Sustituye al mapa de teselas, que cargaba lento; es un SVG
 * ligero que se pinta solo al entrar en pantalla.
 */
export default function Croquis({
  activeId,
  onSelect,
  label,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  label: string;
}) {
  const reduce = useReducedMotion();
  const { width, height, rivers, tributaries, roads, pins } = CROQUIS;
  const oriaLabel = pointNearY(rivers[0], 430);
  const roadShield = pointNearY(roads[0], 600);
  const andia = pins["tolosa-andia"];
  const anoeta = pins.anoeta;

  const draw = (delay: number, duration = 2.2) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, margin: "-10% 0px" },
          transition: { duration, delay, ease: EASE },
        };

  const appear = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 6 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-10% 0px" },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className="croquis h-full w-full select-none"
    >
      <defs>
        {/* Trazo de lápiz: un temblor leve para que no parezca vector perfecto. */}
        <filter id="croquis-lapiz" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="3.5" />
        </filter>
        <pattern id="croquis-cuadricula" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="rgb(var(--color-madera) / 0.07)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width={width} height={height} fill="url(#croquis-cuadricula)" />

      <g filter="url(#croquis-lapiz)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Agua: una mancha ancha y clara con la línea encima, como acuarela. */}
        {[...rivers, ...tributaries].map((d, i) => (
          <motion.path key={`w${i}`} d={d} stroke="#9DBFD3" strokeOpacity={0.45} strokeWidth={i < rivers.length ? 16 : 9} {...draw(0.1 + i * 0.15)} />
        ))}
        {[...rivers, ...tributaries].map((d, i) => (
          <motion.path key={`r${i}`} d={d} stroke="#5E8DAA" strokeWidth={i < rivers.length ? 3 : 2} {...draw(0.1 + i * 0.15)} />
        ))}

        {/* N-I: doble trazo discontinuo de carretera. */}
        {roads.map((d, i) => (
          <motion.path
            key={`n${i}`}
            d={d}
            stroke="rgb(var(--color-ink) / 0.55)"
            strokeWidth={2}
            strokeDasharray="10 7"
            {...draw(0.5 + i * 0.1, 2.6)}
          />
        ))}

        {/* Distancia entre Tolosa y Anoeta. */}
        <motion.path
          d={`M${andia[0] + 14} ${andia[1] - 22} C ${andia[0] + 120} ${andia[1] - 260}, ${anoeta[0] + 90} ${anoeta[1] + 300}, ${anoeta[0] + 10} ${anoeta[1] + 26}`}
          stroke="rgb(var(--color-madera) / 0.7)"
          strokeWidth={2}
          strokeDasharray="2 9"
          {...draw(1.4, 1.8)}
        />
      </g>

      <g className="font-hand" fill="rgb(var(--color-ink))">
        <motion.text x={oriaLabel[0] - 18} y={oriaLabel[1]} textAnchor="end" fontSize="26" fill="#4D7893" {...appear(1.2)}>
          Oria ibaia
        </motion.text>

        <motion.g {...appear(1.4)}>
          <rect x={roadShield[0] + 12} y={roadShield[1] - 17} width="46" height="26" rx="5" fill="rgb(var(--color-surface))" stroke="rgb(var(--color-ink) / 0.6)" strokeWidth="1.5" />
          <text x={roadShield[0] + 35} y={roadShield[1] + 2} textAnchor="middle" fontSize="20">N-I</text>
        </motion.g>

        <motion.text x={andia[0] + 150} y={(andia[1] + anoeta[1]) / 2 + 10} fontSize="24" fill="rgb(var(--color-madera))" {...appear(2.2)}>
          ~2,7 km
        </motion.text>

        <motion.text x={34} y={andia[1] - 60} fontSize="54" {...appear(0.9)}>
          Tolosa
        </motion.text>
        <motion.text x={anoeta[0] - 205} y={anoeta[1] - 52} fontSize="54" {...appear(1)}>
          Anoeta
        </motion.text>

        {/* Rosa de los vientos mínima y hacia dónde queda Donostia. */}
        <motion.g {...appear(1.6)} transform={`translate(${width - 44} ${height - 70})`}>
          <path d="M0 -26 L8 4 L0 -2 L-8 4 Z" fill="rgb(var(--color-ink) / 0.75)" />
          <text y="30" textAnchor="middle" fontSize="22">N</text>
        </motion.g>
        <motion.text x={width - 24} y={34} textAnchor="end" fontSize="22" fill="rgb(var(--color-muted))" {...appear(1.8)}>
          Donostia ↑
        </motion.text>
      </g>

      {stores
        .filter((s) => pins[s.id])
        .map((store, i) => {
          const [x, y] = pins[store.id];
          const active = store.id === activeId;
          const lbl = PIN_LABELS[store.id];
          return (
            <motion.g
              key={store.id}
              role="button"
              tabIndex={-1}
              aria-label={store.name}
              onClick={() => onSelect(store.id)}
              className="cursor-pointer"
              initial={reduce ? false : { opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 380, damping: 18, delay: 1 + i * 0.15 }}
            >
              {active && !reduce && (
                <circle cx={x} cy={y} r="14" fill="rgb(var(--color-sol))" className="croquis-pulse" />
              )}
              <circle cx={x} cy={y} r="22" fill="transparent" />
              <circle
                cx={x}
                cy={y}
                r={active ? 12 : 9}
                fill={active ? "rgb(var(--color-madera))" : "rgb(var(--color-surface))"}
                stroke="rgb(var(--color-madera))"
                strokeWidth="3"
                style={{ transition: "r 400ms cubic-bezier(0.22,1,0.36,1), fill 400ms" }}
              />
              <text
                x={x + lbl.dx}
                y={y + lbl.dy}
                textAnchor={lbl.anchor}
                className={cn("font-sans", active ? "fill-ink" : "fill-muted")}
                fontSize="17"
                fontWeight={active ? 600 : 500}
                paintOrder="stroke"
                stroke="rgb(var(--color-lino))"
                strokeWidth="6"
                strokeLinejoin="round"
              >
                {lbl.text}
              </text>
            </motion.g>
          );
        })}
    </svg>
  );
}
