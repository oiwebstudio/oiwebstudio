/* "Así funciona": reproduce una reserva completa en tres pantallas.
 *
 * Arranca cuando la sección entra en pantalla, se corta en cuanto sale (para
 * no gastar batería animando algo que nadie ve) y vuelve a empezar desde el
 * principio al volver. Con "reducir movimiento" activado se enseña directamente
 * el estado final, sin bucle.
 *
 * El JS solo cambia clases y atributos; todo el movimiento lo hace el CSS
 * (assets/showcase.css) con transform y opacity.
 */
(function () {
  const sc = document.querySelector('[data-sc]');
  if (!sc) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => sc.querySelector(s);
  const $$ = (s) => sc.querySelectorAll(s);

  const pantalla = $('.sc-screen');
  const dedo = $('.sc-tap');
  const campo = $('[data-sc-nombre]');
  const nombre = campo ? campo.getAttribute('data-sc-nombre') : '';
  const tarjetas = [...$$('.sc-card')];

  // Cada vuelta tiene su número; si cambia, la vuelta en curso se abandona.
  let vuelta = 0;
  const espera = (ms, v) => new Promise((ok, no) =>
    setTimeout(() => (v === vuelta ? ok() : no(new Error('cancelada'))), ms));

  function paso(n) {
    tarjetas.forEach((t, i) => {
      t.classList.toggle('is-act', i + 1 === n);
      t.classList.toggle('is-done', i + 1 < n);
    });
  }

  function limpiar() {
    sc.removeAttribute('data-step');
    sc.classList.remove('has-agenda', 'has-cal', 'is-calm');
    $$('.is-sel, .is-press').forEach((e) => e.classList.remove('is-sel', 'is-press'));
    tarjetas.forEach((t) => t.classList.remove('is-act', 'is-done'));
    if (dedo) { dedo.classList.remove('is-on', 'is-press'); dedo.style.transform = ''; }
    if (campo) campo.textContent = '';
  }

  function estadoFinal() {
    limpiar();
    sc.setAttribute('data-step', 'd');
    sc.classList.add('has-agenda', 'has-cal', 'is-calm');
    tarjetas.forEach((t) => t.classList.add('is-done'));
    if (campo) campo.textContent = nombre;
  }

  /** Lleva el dedo al centro de `el` y pulsa. */
  async function pulsar(el, v, marcar = true) {
    if (!el || !dedo || !pantalla) return;
    const r = el.getBoundingClientRect();
    const p = pantalla.getBoundingClientRect();
    const x = r.left - p.left + r.width / 2 - 14;
    const y = r.top - p.top + r.height / 2 - 14;
    dedo.style.transform = `translate(${x}px, ${y}px)`;
    dedo.classList.add('is-on');
    await espera(460, v);
    dedo.classList.remove('is-press');
    void dedo.offsetWidth;               // reinicia la onda si se pulsa dos veces seguidas
    dedo.classList.add('is-press');
    el.classList.add('is-press');
    if (marcar) el.classList.add('is-sel');
    await espera(170, v);
    el.classList.remove('is-press');
  }

  async function escribir(v) {
    if (!campo) return;
    campo.textContent = '';
    for (const letra of nombre) {
      campo.textContent += letra;
      await espera(95, v);
    }
  }

  async function reproducir() {
    const v = ++vuelta;
    try {
      for (;;) {
        limpiar();
        sc.classList.remove('is-reset');
        sc.setAttribute('data-step', 'a');
        paso(1);
        await espera(900, v);

        // 1 · La clienta reserva en la web
        await pulsar($('[data-sc-t="servicio"]'), v);
        await espera(420, v);
        sc.setAttribute('data-step', 'b');
        await espera(560, v);
        await pulsar($('[data-sc-t="dia"]'), v);
        await espera(260, v);
        await pulsar($('[data-sc-t="hora"]'), v);
        await espera(460, v);
        sc.setAttribute('data-step', 'c');
        dedo.classList.remove('is-on');
        await espera(420, v);
        await escribir(v);
        await espera(300, v);
        await pulsar($('[data-sc-t="confirmar"]'), v, false);
        await espera(260, v);
        dedo.classList.remove('is-on');
        sc.setAttribute('data-step', 'd');
        await espera(1100, v);

        // 2 · Entra en la agenda del negocio
        paso(2);
        await espera(350, v);
        sc.classList.add('has-agenda');
        await espera(1600, v);
        sc.classList.add('is-calm');

        // 3 · Queda en Google Calendar
        paso(3);
        await espera(350, v);
        sc.classList.add('has-cal');
        await espera(900, v);
        paso(4);                          // las tres en "hecho"

        await espera(3600, v);
        sc.classList.add('is-reset');
        await espera(320, v);
      }
    } catch (e) { /* vuelta cancelada al salir de pantalla */ }
  }

  if (reduce) { estadoFinal(); return; }

  // Antes de que se vea, la sección ya muestra el final: si alguien hace scroll
  // rápido o el navegador no da el IntersectionObserver, no queda vacía.
  estadoFinal();

  if (!('IntersectionObserver' in window)) return;
  new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (en.isIntersecting) reproducir();
      else { vuelta++; estadoFinal(); }
    });
  }, { threshold: 0.35 }).observe(sc);
})();
