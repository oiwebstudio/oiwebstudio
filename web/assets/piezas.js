/* Piezas que se tocan (6/11/2026, aprobadas por Oier: W2, A1 y B1).
   · #tu-sector (portada): eliges tu negocio y cambia la muestra, en ordenador y en móvil.
   · #prueba-el-asistente (automatizaciones): chat de ejemplo con respuestas preparadas.
   · #prueba-tu-nombre (branding): escribes el nombre y lo ves con cuatro letras.
   Sin JS se ve el primer sector, el saludo del chat y el nombre de ejemplo. Los textos que pone el JS
   salen de [data-k] del HTML, así /eu/ los lleva traducidos. Movimiento: solo transform y opacity,
   con animate(); con movimiento reducido, todo cambia sin animar. */
(function () {
  var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SUAVE = 'cubic-bezier(.2,.75,.25,1)';
  function txt(raiz, k) { var el = raiz.querySelector('[data-k="' + k + '"]'); return el ? el.textContent.trim() : ''; }
  function entra(el, desde, ms, retraso) {
    if (quieto || !el || !el.animate) return;
    el.animate([desde, { transform: 'none', opacity: 1 }], { duration: ms || 520, delay: retraso || 0, easing: SUAVE, fill: 'backwards' });
  }

  /* ---------------------------------------------------------------- W2 · ¿Qué negocio tienes? */
  (function () {
    var raiz = document.getElementById('tu-sector');
    if (!raiz) return;
    var tabs = [].slice.call(raiz.querySelectorAll('[role="tab"]'));
    var paneles = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var actual = 0;
    function elegir(i, foco) {
      if (i === actual) return;
      var antes = paneles[actual], p = paneles[i];
      tabs.forEach(function (t, j) {
        var on = j === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        t.classList.toggle('is-on', on);
      });
      if (foco) tabs[i].focus();
      antes.hidden = true;
      p.hidden = false;
      actual = i;
      entra(p.querySelector('.sx__win'), { transform: 'translateX(28px)', opacity: 0 }, 620);
      entra(p.querySelector('.sx__tel'), { transform: 'translateY(36px)', opacity: 0 }, 680, 90);
      [].slice.call(p.querySelectorAll('.sx__txt > *')).forEach(function (el, j) {
        entra(el, { transform: 'translateY(14px)', opacity: 0 }, 480, 60 + j * 55);
      });
      // Que el botón elegido se vea entero en la fila del móvil, sin mover la página
      var fila = tabs[i].parentNode, b = tabs[i];
      if (fila.scrollWidth > fila.clientWidth) {
        var x = b.offsetLeft - (fila.clientWidth - b.offsetWidth) / 2;
        fila.scrollTo({ left: x, behavior: quieto ? 'auto' : 'smooth' });
      }
    }
    // Precarga la muestra al acercar el dedo o el ratón: así entra con la imagen ya puesta
    function precarga(i) {
      [].slice.call(paneles[i].querySelectorAll('img')).forEach(function (im) { im.loading = 'eager'; });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { elegir(i, false); });
      t.addEventListener('pointerenter', function () { precarga(i); });
      t.addEventListener('touchstart', function () { precarga(i); }, { passive: true });
      t.addEventListener('keydown', function (e) {
        var n = tabs.length, j = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % n;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + n) % n;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = n - 1;
        if (j !== null) { e.preventDefault(); precarga(j); elegir(j, true); }
      });
    });
    // En el móvil, deslizar la muestra a un lado pasa al sector de al lado
    var caja = raiz.querySelector('.sx__caja'), x0 = null, y0 = 0;
    caja.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
      precarga((actual + 1) % tabs.length); precarga((actual - 1 + tabs.length) % tabs.length);
    }, { passive: true });
    caja.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      var n = tabs.length;
      elegir(dx < 0 ? (actual + 1) % n : (actual - 1 + n) % n, false);
    }, { passive: true });
  })();

  /* ---------------------------------------------------------------- W2b · Todas las muestras (9/11/2026)
     Las tarjetas entran fila a fila al asomar (solo transform y opacity, por CSS); «Ver todas» abre el resto.
     Sin JS o con movimiento reducido se ven todas, quietas. */
  (function () {
    var raiz = document.querySelector('#tu-sector .sx-t');
    if (!raiz) return;
    var rejilla = raiz.querySelector('.sx-t__g');
    var items = [].slice.call(raiz.querySelectorAll('.sx-t__i'));
    var boton = raiz.querySelector('.sx-t__mas');
    function columnas() { return getComputedStyle(rejilla).gridTemplateColumns.split(' ').length || 1; }
    var io = null;
    if (!quieto && 'IntersectionObserver' in window) {
      rejilla.classList.add('mv');
      io = new IntersectionObserver(function (es) {
        var n = columnas();
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var li = e.target, j = items.indexOf(li);
          li.style.setProperty('--d', ((j % n) * 75) + 'ms');
          li.classList.add('is-in');
          io.unobserve(li);
        });
      }, { rootMargin: '0px 0px -6% 0px' });
      items.forEach(function (li) { io.observe(li); });
    }
    if (!boton) return;
    var mas = boton.children[0], menos = boton.children[1];
    boton.hidden = false;
    boton.addEventListener('click', function () {
      var abrir = !raiz.classList.contains('is-abierta');
      raiz.classList.toggle('is-abierta', abrir);
      boton.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      mas.hidden = abrir; menos.hidden = !abrir;
      if (!abrir) {
        var r = raiz.getBoundingClientRect();
        if (r.top < 0) raiz.scrollIntoView({ block: 'start', behavior: quieto ? 'auto' : 'smooth' });
      }
    });
  })();

  /* ---------------------------------------------------------------- A1 · Chat de ejemplo */
  (function () {
    var raiz = document.getElementById('prueba-el-asistente');
    if (!raiz) return;
    var log = raiz.querySelector('.ch__log');
    var chips = raiz.querySelector('.ch__chips');
    var form = raiz.querySelector('.ch__form');
    var campo = form.querySelector('input');
    var otra = raiz.querySelector('.ch__otra');
    var ocupado = false;
    var inicio = log.innerHTML;

    function bajar() { log.scrollTo({ top: log.scrollHeight, behavior: quieto ? 'auto' : 'smooth' }); }
    function burbuja(quien, texto) {
      var b = document.createElement('p');
      b.className = 'ch__b ch__b--' + quien;
      b.textContent = texto;
      log.appendChild(b);
      entra(b, { transform: 'translateY(10px) scale(.97)', opacity: 0 }, 380);
      bajar();
      return b;
    }
    function escribe(fn) {
      var e = document.createElement('p');
      e.className = 'ch__b ch__b--bot ch__esc';
      e.innerHTML = '<span class="sv-vh"></span><i></i><i></i><i></i>';
      e.firstChild.textContent = txt(raiz, 'esc');
      log.appendChild(e);
      entra(e, { transform: 'translateY(8px)', opacity: 0 }, 300);
      bajar();
      setTimeout(function () { e.remove(); fn(); }, quieto ? 250 : 900);
    }
    function horas() {
      var b = burbuja('bot', txt(raiz, 'a1'));
      var fila = document.createElement('span');
      fila.className = 'ch__horas';
      ['14:00', '21:30'].forEach(function (h) {
        var x = document.createElement('button');
        x.type = 'button'; x.textContent = h;
        x.addEventListener('click', function () {
          if (ocupado) return;
          fila.remove();
          pregunta(h, function () {
            burbuja('bot', txt(raiz, 'a1b'));
            var t = raiz.querySelector('.ch__ticket');
            t.querySelector('.ch__tk-hora').textContent = h;
            t.hidden = false;
            entra(t, { transform: 'translateY(16px)', opacity: 0 }, 560, 250);
            fin();
          });
        });
        fila.appendChild(x);
      });
      b.appendChild(fila);
      bajar();
    }
    function fin() { otra.hidden = false; entra(otra, { opacity: 0 }, 400, 400); }
    function pregunta(texto, respuesta) {
      if (ocupado) return;
      ocupado = true;
      burbuja('yo', texto);
      escribe(function () { respuesta(); ocupado = false; });
    }
    function quitaAcentos(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function responder(texto) {
      var t = quitaAcentos(texto);
      if (/mesa|reserv|mahai|erreserb|sitio|cenar|comer|afaldu|bazkaldu/.test(t)) return horas;
      if (/hora|abr|horario|cerr|ordu|ireki|itxi|zabal/.test(t)) return function () { burbuja('bot', txt(raiz, 'a2')); };
      if (/gluten|celia|alerg|zeliak/.test(t)) return function () { burbuja('bot', txt(raiz, 'a3')); };
      if (/aparc|parking|coche|aparka|kotxe/.test(t)) return function () { burbuja('bot', txt(raiz, 'a4')); };
      return function () { burbuja('bot', txt(raiz, 'a0')); };
    }
    [].slice.call(chips.querySelectorAll('button')).forEach(function (b) {
      b.addEventListener('click', function () { pregunta(b.textContent.trim(), responder(b.dataset.q || b.textContent)); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = campo.value.trim().slice(0, 140);
      if (!v || ocupado) return;
      campo.value = '';
      pregunta(v, responder(v));
    });
    otra.addEventListener('click', function () {
      log.innerHTML = inicio;
      raiz.querySelector('.ch__ticket').hidden = true;
      otra.hidden = true;
      ocupado = false;
    });
  })();

  /* ---------------------------------------------------------------- B1 · Prueba tu nombre */
  (function () {
    var raiz = document.getElementById('prueba-tu-nombre');
    if (!raiz) return;
    var campo = raiz.querySelector('#lg-nombre');
    var esc = raiz.querySelector('.lg__esc');
    var botones = [].slice.call(raiz.querySelectorAll('.lg__est button'));
    var nombres = [].slice.call(raiz.querySelectorAll('[data-lg="nombre"]'));
    var usuario = raiz.querySelector('[data-lg="usuario"]');
    var porDefecto = campo.value || 'Mendi';
    // Que el nombre quepa entero: si no cabe, la letra se hace más pequeña (nunca «…»)
    function encajar() {
      nombres.forEach(function (n) {
        n.style.fontSize = '';
        var sobra = n.scrollWidth / n.clientWidth;
        if (sobra > 1) n.style.fontSize = (parseFloat(getComputedStyle(n).fontSize) / sobra * 0.97) + 'px';
      });
    }
    function pintar() {
      var v = campo.value.replace(/\s+/g, ' ').trim() || porDefecto;
      nombres.forEach(function (n) { n.textContent = v; });
      encajar();
      usuario.textContent = '@' + (quitar(v).replace(/[^a-z0-9]+/g, '').slice(0, 20) || 'tunegocio');
    }
    function quitar(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    campo.addEventListener('input', pintar);
    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('aria-pressed') === 'true') return;
        botones.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        esc.dataset.est = b.dataset.est;
        encajar();
        if (document.fonts) document.fonts.ready.then(encajar);
        nombres.forEach(function (n, i) { entra(n, { transform: 'translateY(12px)', opacity: 0 }, 460, i * 70); });
      });
    });
    pintar();
    if (document.fonts) document.fonts.ready.then(encajar);
    addEventListener('resize', encajar);
  })();
})();
