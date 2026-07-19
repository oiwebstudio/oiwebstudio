import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

/* ---------------- imágenes ---------------- */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=2200&h=1000&q=80&auto=format&fit=crop";
const SECTION2_IMAGE =
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=2200&h=1000&q=80&auto=format&fit=crop";
const SECTION3_IMG1 =
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80&auto=format&fit=crop";
const SECTION3_IMG2 =
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80&auto=format&fit=crop";
const SECTION3_BG =
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=1200&q=80&auto=format&fit=crop";

/* ---------------- datos ---------------- */
const featureBars = ["Corte y estilo", "Color y mechas", "Tratamientos de brillo"];

const services = [
  { name: "Corte\ny peinado", num: "01", active: true },
  { name: "Color\ny mechas", num: "02", active: false },
  { name: "Balayage", num: "03", active: false },
  { name: "Tratamientos", num: null, active: false },
];

const WINE = "#8a2f4f";

/* ---------------- hooks ---------------- */
interface MaskPosition {
  x: number;
  y: number;
  sw: number;
  sh: number;
}

function useMaskPositions(
  sectionRef: RefObject<HTMLElement | null>,
  cardsRef: RefObject<(HTMLDivElement | null)[]>,
) {
  const [positions, setPositions] = useState<MaskPosition[]>([]);

  const measure = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const sRect = section.getBoundingClientRect();
    const next = (cardsRef.current ?? []).map((card) => {
      if (!card) return { x: 0, y: 0, sw: sRect.width, sh: sRect.height };
      const r = card.getBoundingClientRect();
      return {
        x: r.left - sRect.left,
        y: r.top - sRect.top,
        sw: sRect.width,
        sh: sRect.height,
      };
    });
    setPositions(next);
  }, [sectionRef, cardsRef]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, sectionRef]);

  return positions;
}

function useImageWidth(src: string, sectionHeight: number | undefined) {
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = src;
  }, [src]);

  if (!natural || !sectionHeight) return 0;
  return natural.w * (sectionHeight / natural.h);
}

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return mobile;
}

function useStaggeredReveal(count: number, threshold = 0.15) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const getAnimStyle = useCallback(
    (index: number): CSSProperties => ({
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
    }),
    [visible],
  );

  void count;
  return { containerRef, getAnimStyle };
}

/* ---------------- MaskedCard ---------------- */
interface MaskedCardProps {
  bgImage: string;
  position?: MaskPosition;
  imageWidth: number;
  focalX: number;
  className?: string;
  children?: ReactNode;
  cardRef?: (el: HTMLDivElement | null) => void;
  style?: CSSProperties;
}

function MaskedCard({
  bgImage,
  position,
  imageWidth,
  focalX,
  className,
  children,
  cardRef,
  style,
}: MaskedCardProps) {
  let bgStyle: CSSProperties = {};
  if (position) {
    const overflow = imageWidth > position.sw ? imageWidth - position.sw : 0;
    const focalOffset = overflow * focalX;
    bgStyle = {
      backgroundImage: `url(${bgImage})`,
      backgroundSize: `auto ${position.sh}px`,
      backgroundPosition: `-${position.x + focalOffset}px -${position.y}px`,
      backgroundRepeat: "no-repeat",
    };
  }
  return (
    <div ref={cardRef} className={className} style={{ ...bgStyle, ...style }}>
      {children}
    </div>
  );
}

/* ---------------- Splash ---------------- */
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let n = 0;
    const iv = setInterval(() => {
      n += 1;
      setCount(n);
      if (n >= 100) {
        clearInterval(iv);
        setTimeout(() => setExiting(true), 200);
        setTimeout(() => onComplete(), 900);
      }
    }, 20);
    return () => clearInterval(iv);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex items-end justify-start transition-opacity duration-700 ${exiting ? "opacity-0" : "opacity-100"}`}
    >
      <span className="text-7xl md:text-9xl font-bold tabular-nums p-6 md:p-10 leading-none text-black">
        {count}
      </span>
    </div>
  );
}

/* ---------------- Navbar ---------------- */
function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = ["Inicio", "Servicios", "Trabajos", "Tarifas", "Contacto"];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none">
            Studio
          </span>
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none -mt-1.5 md:-mt-2">
            Noir
          </span>
          <span className="text-[8px] md:text-[9px] font-medium leading-none mt-1.5 md:mt-2">
            peluquería · tolosa
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <span className="text-sm font-semibold text-black">Cita el mismo día</span>
          <button className="px-6 py-3 bg-white rounded-full border border-black text-sm font-semibold hover:bg-black hover:text-white transition-colors duration-200">
            Menú
          </button>
        </div>

        <button
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 flex items-center justify-center relative"
        >
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? "rotate-45 translate-y-0" : "-translate-y-2"}`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? "-rotate-45 translate-y-0" : "translate-y-2"}`}
          />
        </button>
      </nav>

      <div className={`md:hidden fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col justify-center h-full px-8 gap-1">
            {links.map((l, i) => (
              <a
                key={l}
                href="#"
                onClick={() => setOpen(false)}
                className={`text-4xl font-bold text-black hover:text-neutral-500 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
              >
                {l}
              </a>
            ))}
            <div
              className={`mt-8 pt-8 border-t border-neutral-200 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
              style={{ transitionDelay: open ? "450ms" : "0ms" }}
            >
              <p className="text-sm font-semibold text-black mb-4">Cita el mismo día</p>
              <button className="w-full px-6 py-4 bg-black rounded-full text-white text-sm font-semibold hover:bg-neutral-800 transition-colors duration-200">
                Reservar cita
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- App ---------------- */
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const isMobile = useIsMobile();

  /* sección 1 */
  const section1Ref = useRef<HTMLElement | null>(null);
  const s1Cards = useRef<(HTMLDivElement | null)[]>([]);
  const s1Positions = useMaskPositions(section1Ref, s1Cards);
  const s1ImgWidth = useImageWidth(HERO_IMAGE, s1Positions[0]?.sh);
  const s1Reveal = useStaggeredReveal(4);
  const s1Focal = isMobile ? 0.7 : 0.8;

  /* sección 2 */
  const section2Ref = useRef<HTMLElement | null>(null);
  const s2Cards = useRef<(HTMLDivElement | null)[]>([]);
  const s2Positions = useMaskPositions(section2Ref, s2Cards);
  const s2ImgWidth = useImageWidth(SECTION2_IMAGE, s2Positions[0]?.sh);
  const s2Reveal = useStaggeredReveal(4);
  const s2Focal = isMobile ? 0.65 : 0.8;

  /* sección 3 */
  const s3Reveal = useStaggeredReveal(4);

  const setS1 = (i: number) => (el: HTMLDivElement | null) => {
    s1Cards.current[i] = el;
  };
  const setS2 = (i: number) => (el: HTMLDivElement | null) => {
    s2Cards.current[i] = el;
  };

  return (
    <div className="bg-white">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Navbar />

      {/* ============ SECCIÓN 1 · HERO ============ */}
      <section
        ref={(el) => {
          section1Ref.current = el;
          s1Reveal.containerRef.current = el;
        }}
        className="h-screen w-full overflow-hidden flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
      >
        {featureBars.map((bar, i) => (
          <MaskedCard
            key={bar}
            bgImage={HERO_IMAGE}
            position={s1Positions[i]}
            imageWidth={s1ImgWidth}
            focalX={s1Focal}
            cardRef={setS1(i)}
            className="w-full h-14 md:h-20 shrink-0 rounded-xl md:rounded-2xl overflow-hidden relative"
            style={s1Reveal.getAnimStyle(i)}
          >
            <div className="absolute inset-0 bg-white/40" aria-hidden="true" />
            <span className="flex items-center justify-center h-full text-black text-lg md:text-3xl font-bold text-center relative z-10">
              {bar}
            </span>
          </MaskedCard>
        ))}

        <MaskedCard
          bgImage={HERO_IMAGE}
          position={s1Positions[3]}
          imageWidth={s1ImgWidth}
          focalX={s1Focal}
          cardRef={setS1(3)}
          className="w-full flex-1 min-h-0 rounded-xl md:rounded-2xl overflow-hidden relative"
          style={s1Reveal.getAnimStyle(3)}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/35 to-transparent"
            aria-hidden="true"
          />
          <p className="absolute top-4 left-4 md:top-7 md:left-7 text-black text-xs md:text-sm font-semibold leading-4 md:leading-5 max-w-[200px] md:max-w-[300px] z-10">
            Técnica de salón grande,
            <br />
            trato de peluquería de barrio
          </p>
          <div className="absolute bottom-5 left-3 md:bottom-8 md:left-4 z-10">
            <span
              className="block text-xs md:text-sm font-semibold mb-1 md:mb-2"
              style={{ color: WINE }}
            >
              Tu peluquería de confianza en Tolosa
            </span>
            <h1 className="font-display text-black text-[clamp(3rem,11vw,11rem)] leading-[0.79] tracking-tight">
              Studio
              <br />
              Noir
            </h1>
          </div>
          <p className="absolute bottom-6 right-4 md:bottom-10 md:right-8 text-white text-xs md:text-sm font-semibold z-10 bg-black/35 backdrop-blur-sm px-4 py-2 rounded-full">
            Cita online en 1 minuto
          </p>
        </MaskedCard>
      </section>

      {/* ============ SECCIÓN 2 · ANTES Y DESPUÉS ============ */}
      <section
        ref={(el) => {
          section2Ref.current = el;
          s2Reveal.containerRef.current = el;
        }}
        className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
      >
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto_auto_auto] md:grid-rows-[1fr_1fr_0.8fr] gap-1.5 md:gap-2">
          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[0]}
            imageWidth={s2ImgWidth}
            focalX={s2Focal}
            cardRef={setS2(0)}
            className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
            style={s2Reveal.getAnimStyle(0)}
          >
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent md:from-white/60 md:to-white/10"
              aria-hidden="true"
            />
            <h2 className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-2xl md:text-3xl font-bold z-10">
              Antes y después
            </h2>
            <p className="absolute bottom-4 left-5 md:bottom-6 md:left-7 text-white md:text-black text-xs md:text-sm font-semibold z-10">
              Color real de nuestras clientas
            </p>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[1]}
            imageWidth={s2ImgWidth}
            focalX={s2Focal}
            cardRef={setS2(1)}
            className="md:row-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
            style={s2Reveal.getAnimStyle(1)}
          >
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
              aria-hidden="true"
            />
            <p className="absolute bottom-16 left-5 md:bottom-20 md:left-7 text-white text-xs md:text-sm font-semibold leading-4 md:leading-5 z-10">
              ¿Quieres un cambio de verdad?
              <br />
              Escríbenos y te asesoramos sin compromiso.
            </p>
            <button className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold z-10 hover:scale-105 transition-transform">
              Reservar
            </button>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[2]}
            imageWidth={s2ImgWidth}
            focalX={s2Focal}
            cardRef={setS2(2)}
            className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
            style={s2Reveal.getAnimStyle(2)}
          >
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent md:from-white/60 md:to-white/10"
              aria-hidden="true"
            />
            <h3 className="font-display absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-[clamp(3rem,7vw,6rem)] leading-[0.9] z-10">
              Cambio
              <br />
              de look
            </h3>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[3]}
            imageWidth={s2ImgWidth}
            focalX={s2Focal}
            cardRef={setS2(3)}
            className="col-span-1 md:col-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
            style={s2Reveal.getAnimStyle(3)}
          >
            <div className="absolute inset-0 z-10 flex flex-wrap md:flex-nowrap gap-1.5 md:gap-2 p-2 md:p-3">
              {services.map((svc) => (
                <div
                  key={svc.name}
                  className={`flex-1 min-w-[calc(50%-4px)] md:min-w-0 rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between ${svc.active ? "bg-white/90 backdrop-blur-md" : "bg-white/20 backdrop-blur-xl"}`}
                >
                  <h3
                    className={`text-xl md:text-4xl font-bold leading-[1.05] whitespace-pre-line ${svc.active ? "" : "text-white"}`}
                    style={svc.active ? { color: WINE } : undefined}
                  >
                    {svc.name}
                  </h3>
                  {svc.num && (
                    <span
                      className={`self-end w-8 h-8 md:w-12 md:h-12 rounded-full border flex items-center justify-center text-xs md:text-sm font-semibold ${svc.active ? "border-black text-black" : "border-white text-white"}`}
                    >
                      {svc.num}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </MaskedCard>
        </div>
      </section>

      {/* ============ SECCIÓN 3 · COLOR DE AUTOR ============ */}
      <section
        ref={(el) => {
          s3Reveal.containerRef.current = el;
        }}
        className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
      >
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
          <div className="flex flex-col gap-1.5 md:gap-2">
            <div
              className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col justify-between flex-[1.2] min-h-[180px] md:min-h-0"
              style={s3Reveal.getAnimStyle(0)}
            >
              <h2 className="font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] text-black">
                Color
                <br />
                de autor
              </h2>
              <p className="text-xs md:text-sm font-semibold" style={{ color: WINE }}>
                Balayage · Babylights · Rubios fríos
              </p>
            </div>

            <div
              className="flex gap-1.5 md:gap-2 flex-1 min-h-[140px] md:min-h-0"
              style={s3Reveal.getAnimStyle(1)}
            >
              <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
                <img
                  src={SECTION3_IMG1}
                  alt="Trabajo de peluquería en salón"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
                <img
                  src={SECTION3_IMG2}
                  alt="Secado y peinado profesional"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div
              className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-7 flex items-end justify-between flex-[0.8] min-h-[160px] md:min-h-0"
              style={s3Reveal.getAnimStyle(2)}
            >
              <div>
                <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">
                  Primera visita
                </p>
                <h3 className="text-xl md:text-3xl font-bold text-black leading-6 md:leading-8">
                  Diagnóstico
                  <br />
                  de color
                  <br />
                  gratis
                </h3>
              </div>
              <button className="px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform">
                Reservar cita
              </button>
            </div>
          </div>

          <div
            className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[350px] md:min-h-0"
            style={s3Reveal.getAnimStyle(3)}
          >
            <img
              src={SECTION3_BG}
              alt="Clienta con el pelo recién hecho"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5 flex gap-1.5 md:gap-2">
              <div className="flex-1 bg-white rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between h-36 md:h-52">
                <h4 className="text-lg md:text-2xl font-bold text-black leading-5 md:leading-7">
                  El proceso
                  <br />
                  de un
                  <br />
                  balayage
                </h4>
                <span className="self-end w-9 h-9 md:w-12 md:h-12 rounded-full border border-black flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="rotate-[-45deg]"
                  >
                    <path
                      d="M1 7h12m0 0L8 2m5 5L8 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="flex-1 bg-white/20 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between h-36 md:h-52">
                <h4 className="text-lg md:text-2xl font-bold text-white leading-5 md:leading-7">
                  Cuidados
                  <br />
                  del color
                  <br />
                  en casa
                </h4>
                <span className="self-end w-9 h-9 md:w-12 md:h-12 rounded-full border border-white flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="rotate-[-45deg] text-white"
                  >
                    <path
                      d="M1 7h12m0 0L8 2m5 5L8 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
