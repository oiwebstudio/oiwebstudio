/* Globo y cifras de las páginas de agentes de IA (22/11/2026, Oier: «quiero bolas del mundo y animaciones muy pros»).
 *
 * Globo: cobe 2.0.1 (MIT, assets/vendor/cobe-2.0.1.esm.js). Entra girando y se para mirando a Tolosa; se puede
 * arrastrar y vuelve solo. Solo dibuja mientras se ve (IntersectionObserver) y deja de hacerlo en una pestaña oculta.
 * Con «reducir movimiento», queda quieto mirando a Tolosa.
 * Cifras (.ia-cifras [data-cuenta]): cuentan de 0 al número al asomar.
 * Solo transform y opacity en lo animado con CSS (memoria animaciones-sin-parpadeo).
 */
import createGlobe from "./vendor/cobe-2.0.1.esm.js";

const QUIETO = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const TOLOSA = [43.1347, -2.0783];
const GIPUZKOA = [
  [43.3183, -1.9812], // Donostia
  [43.3390, -1.7896], // Irun
  [43.2846, -2.1704], // Zarautz
  [43.1847, -2.4733], // Eibar
  [43.0629, -2.3191], // Azpeitia
  [43.0328, -2.1966], // Beasain (Goierri)
];
const TERRA = [192 / 255, 122 / 255, 53 / 255];

/* Ángulos para que un punto quede de frente (fórmula de los ejemplos de cobe). */
const angulos = ([lat, lon]) => [Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];
const [PHI_T, THETA_T] = angulos(TOLOSA);

function globo(caja) {
  const canvas = caja.querySelector("canvas");
  if (!canvas) return;
  let ancho = caja.offsetWidth;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let gl;
  try {
    gl = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: ancho * dpr,
      height: ancho * dpr,
      phi: QUIETO ? PHI_T : PHI_T + 2.6,
      theta: THETA_T * 0.6,
      dark: 0,
      diffuse: 1.25,
      mapSamples: 18000,
      mapBrightness: 5.5,
      mapBaseBrightness: 0.04,
      baseColor: [1, 1, 1],
      markerColor: TERRA,
      glowColor: [1, 0.98, 0.95],
      markerElevation: 0.01,
      markers: [
        { location: TOLOSA, size: 0.07, id: "tolosa" },
        ...GIPUZKOA.map((l) => ({ location: l, size: 0.025 })),
      ],
      arcs: GIPUZKOA.slice(0, 4).map((l) => ({ from: TOLOSA, to: l })),
      arcColor: TERRA,
      arcWidth: 0.6,
      arcHeight: 0.12,
      opacity: 0.95,
    });
  } catch (e) {
    caja.classList.add("ia-globo--sin-webgl");
    return;
  }
  caja.classList.add("is-listo");

  /* Estado: entra girando hacia Tolosa; luego deriva despacio; el arrastre suma y se suelta con muelle. */
  let phi = QUIETO ? PHI_T : PHI_T + 2.6;
  let theta = THETA_T * 0.6;
  let arrastre = 0, arrastreV = 0, x0 = null;
  const t0 = performance.now();
  let visible = false, rafId = 0;

  const ease = (t) => 1 - Math.pow(1 - t, 4);
  function paso(ahora) {
    rafId = 0;
    const t = Math.min((ahora - t0) / 2600, 1);
    const deriva = t >= 1 ? Math.sin((ahora - t0) / 6000) * 0.25 : 0;
    phi = PHI_T + 2.6 * (1 - ease(t)) + deriva;
    theta = THETA_T * (0.6 + 0.4 * ease(t));
    if (x0 === null) { arrastre += arrastreV; arrastreV *= 0.9; arrastre *= 0.94; }
    gl.update({ phi: phi + arrastre, theta });
    if (visible && !document.hidden) rafId = requestAnimationFrame(paso);
  }
  const arrancar = () => { if (!rafId && visible && !document.hidden && !QUIETO) rafId = requestAnimationFrame(paso); };

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; arrancar(); }, { rootMargin: "80px" }).observe(caja);
  document.addEventListener("visibilitychange", arrancar);

  if (!QUIETO) {
    canvas.addEventListener("pointerdown", (e) => { x0 = e.clientX; canvas.setPointerCapture(e.pointerId); caja.classList.add("is-arrastrando"); });
    canvas.addEventListener("pointermove", (e) => {
      if (x0 === null) return;
      const d = (e.clientX - x0) / 180; x0 = e.clientX;
      arrastre += d; arrastreV = d;
    });
    const soltar = () => { x0 = null; caja.classList.remove("is-arrastrando"); };
    canvas.addEventListener("pointerup", soltar);
    canvas.addEventListener("pointercancel", soltar);
  }

  /* Si cambia mucho el ancho (girar el móvil), se rehace el tamaño del lienzo. */
  let espera;
  window.addEventListener("resize", () => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      const n = caja.offsetWidth;
      if (Math.abs(n - ancho) < 24) return;
      ancho = n;
      gl.update({ width: ancho * dpr, height: ancho * dpr });
    }, 200);
  });
}

function cifras(bloque) {
  const nums = [...bloque.querySelectorAll("[data-cuenta]")];
  const fin = (n) => { n.textContent = n.dataset.cuenta; };
  if (QUIETO || !("IntersectionObserver" in window)) { nums.forEach(fin); return; }
  bloque.classList.add("ia-anim");
  nums.forEach((n) => { n.textContent = "0"; });
  new IntersectionObserver((es, io) => {
    if (!es.some((e) => e.isIntersecting)) return;
    io.disconnect();
    bloque.classList.add("is-visto");
    nums.forEach((n, i) => {
      const meta = +n.dataset.cuenta, dur = 1500 + i * 200, t0 = performance.now() + i * 120;
      const tick = (ahora) => {
        const t = Math.max(0, Math.min((ahora - t0) / dur, 1));
        n.textContent = String(Math.round(meta * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick); else fin(n);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 }).observe(bloque);
}

document.querySelectorAll(".ia-globo").forEach(globo);
document.querySelectorAll(".ia-cifras").forEach(cifras);
