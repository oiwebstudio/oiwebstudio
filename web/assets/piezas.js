/* Piezas que se tocan (6/11/2026, aprobadas por Oier: W2, A1 y B1).
   · #tu-sector (portada y Trabajos): todas las muestras de sector, con filtros por tipo de negocio.
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

  /* ---------------------------------------------------------------- W2 · ¿Qué negocio tienes? (9/11/2026 noche)
     Todas las muestras de sector en una galería justo debajo de la portada. Filtros por tipo de negocio y, en la
     portada, «Ver todas» (8 a la vista, 6 por debajo de 1000 px). Las tarjetas entran fila a fila al asomar (CSS, por
     tiempo); al filtrar, las que quedan entran con animate(). Solo transform y opacity. Sin JS se ven todas, quietas. */
  (function () {
    var raiz = document.querySelector('#tu-sector .sx-t');
    if (!raiz) return;
    var rejilla = raiz.querySelector('.sx-t__g');
    var items = [].slice.call(raiz.querySelectorAll('.sx-t__i'));
    var boton = raiz.querySelector('.sx-t__mas');
    var fil = raiz.querySelector('.sx-f');
    var botones = fil ? [].slice.call(fil.querySelectorAll('button')) : [];
    var grupo = '*';
    var abierta = raiz.classList.contains('is-abierta');
    var estrecho = matchMedia('(max-width:1000px)');
    function columnas() { return getComputedStyle(rejilla).gridTemplateColumns.split(' ').length || 1; }

    // Entrada al asomar (la primera vez)
    var io = null;
    if (!quieto && 'IntersectionObserver' in window) {
      rejilla.classList.add('mv');
      io = new IntersectionObserver(function (es) {
        var n = columnas();
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var li = e.target, j = items.filter(function (x) { return !x.hidden; }).indexOf(li);
          li.style.setProperty('--d', ((Math.max(j, 0) % n) * 75) + 'ms');
          li.classList.add('is-in');
          io.unobserve(li);
        });
      }, { rootMargin: '0px 0px -6% 0px' });
      items.forEach(function (li) { io.observe(li); });
    }
    // Tras el primer toque, la entrada por CSS se apaga y manda animate()
    function soltarEntrada() {
      if (io) { io.disconnect(); io = null; }
      rejilla.classList.remove('mv');
    }

    function pintar(animar) {
      var limite = (grupo === '*' && !abierta && boton) ? (estrecho.matches ? 6 : 8) : Infinity;
      var nuevos = [], n = 0;
      items.forEach(function (li) {
        var dentro = grupo === '*' || li.dataset.g === grupo;
        var ver = dentro && n < limite;
        if (dentro) n++;
        var estaba = !li.hidden;
        li.hidden = !ver;
        if (ver && (animar === 'todo' || (animar === 'nuevos' && !estaba))) nuevos.push(li);
      });
      if (boton) boton.hidden = grupo !== '*';
      if (quieto || !nuevos.length) return;
      nuevos.forEach(function (li, j) {
        li.animate([{ transform: 'translateY(16px)', opacity: 0 }, { transform: 'none', opacity: 1 }],
          { duration: 460, delay: Math.min(j, 8) * 45, easing: SUAVE, fill: 'backwards' });
      });
    }

    raiz.classList.add('is-vivo');
    pintar();
    estrecho.addEventListener && estrecho.addEventListener('change', function () { pintar(); });

    if (fil) {
      fil.hidden = false;
      botones.forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.getAttribute('aria-pressed') === 'true') return;
          botones.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          grupo = b.dataset.g;
          soltarEntrada();
          pintar('todo');
          // Que el filtro elegido se vea entero en la fila del móvil, sin mover la página
          if (fil.scrollWidth > fil.clientWidth) {
            fil.scrollTo({ left: b.offsetLeft - (fil.clientWidth - b.offsetWidth) / 2, behavior: quieto ? 'auto' : 'smooth' });
          }
        });
      });
    }

    if (!boton) return;
    var mas = boton.querySelector('[data-t="sx_todas_mas"]'), menos = boton.querySelector('[data-t="sx_todas_menos"]');
    boton.addEventListener('click', function () {
      abierta = !abierta;
      raiz.classList.toggle('is-abierta', abierta);
      boton.setAttribute('aria-expanded', abierta ? 'true' : 'false');
      mas.hidden = abierta; menos.hidden = !abierta;
      soltarEntrada();
      pintar('nuevos');
      if (!abierta) {
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
