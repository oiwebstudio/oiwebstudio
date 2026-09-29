/* "Cómo trabajo": decide qué paso está en el centro de la vista.
 *
 * Escribe data-paso="1..5" en la sección y --pro-avance (0..1) para el carril
 * de progreso. No anima nada por su cuenta: todo el movimiento lo hace
 * assets/proceso.css. Funciona en los dos sentidos, así que al subir la web se
 * "desconstruye". Sin JS o sin IntersectionObserver se ve la web terminada.
 */
(function () {
  const sec = document.querySelector('[data-pro]');
  if (!sec) return;
  const pasos = [...sec.querySelectorAll('.pro-paso')];
  if (!pasos.length) return;

  function marcar(n) {
    sec.setAttribute('data-paso', String(n));
    sec.style.setProperty('--pro-avance', String((n - 1) / (pasos.length - 1)));
    pasos.forEach((p, i) => {
      p.classList.toggle('is-act', i + 1 === n);
      p.classList.toggle('is-hecho', i + 1 < n);
    });
  }

  // Estado de partida: la web terminada, por si el observer no llega a dispararse.
  marcar(pasos.length);
  if (!('IntersectionObserver' in window)) return;
  marcar(1);

  // La franja que cuenta como "centro de la vista". En móvil la pantalla fija
  // ocupa la parte de arriba, así que la franja baja hacia el tercio inferior.
  const movil = window.matchMedia('(max-width: 980px)');
  let obs;

  function observar() {
    if (obs) obs.disconnect();
    obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) marcar(pasos.indexOf(e.target) + 1);
      });
    }, { rootMargin: movil.matches ? '-68% 0px -22% 0px' : '-46% 0px -46% 0px' });
    pasos.forEach((p) => obs.observe(p));
  }

  observar();
  if (movil.addEventListener) movil.addEventListener('change', observar);
})();
