import { cn } from "@/lib/utils";

const PARTICLES = Array.from({ length: 35 }).map((_, i) => ({
  left: (i * 31 + 7) % 100,
  top: (i * 47 + 13) % 100,
  size: 1.5 + (i % 5) * 0.8,
  duration: 8 + (i % 7) * 2,
  delay: (i % 9) * 0.6,
  opacity: 0.15 + (i % 4) * 0.12,
  drift: (i % 2 === 0 ? 1 : -1) * (8 + (i % 6) * 3),
}));

export default function Particles({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[#F5EFE4]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `flour-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
