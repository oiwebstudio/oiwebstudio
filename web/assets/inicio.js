/* INICIO: fila de webs sin fin que se arrastra, campo que pregunta al asistente y tarjeta para pedir la llamada */
(function () {
  var quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var eu = (document.documentElement.lang || 'es').toLowerCase().indexOf('eu') === 0;
  // Los textos que escribe este script van en <template id="iniTx"> de la página: así la versión en euskera los trae traducidos
  var TX = document.getElementById('iniTx');
  function tx(k) { var e = TX && TX.content ? TX.content.querySelector('[data-k="' + k + '"]') : null; return e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function rot(sel) { var e = document.querySelector(sel + ' legend'); return e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; }

  /* ---------- Fila de webs ---------- */
  var fila = document.getElementById('iniFila'), pista = document.getElementById('iniPista');
  if (fila && pista && pista.children.length > 3) {
    var orig = Array.prototype.slice.call(pista.children), N = orig.length;
    // Tres copias seguidas: la del medio es la «de verdad»; las otras dos solo rellenan los lados
    function copia(antes) {
      var frag = document.createDocumentFragment();
      orig.forEach(function (li) {
        var c = li.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        var a = c.querySelector('a'); if (a) a.tabIndex = -1;
        frag.appendChild(c);
      });
      if (antes) pista.insertBefore(frag, pista.firstChild); else pista.appendChild(frag);
    }
    copia(true); copia(false);
    fila.classList.add('is-js');
    fila.scrollLeft = 0;

    var paso = 0, ancho = 0, x = 0, v = 0;           // x: desplazamiento dentro de una vuelta; v: impulso (px/s)
    var DERIVA = quieto ? 0 : 15, deriva = 0, derivaObj = DERIVA;
    var fijo = false;                                  // con el foco dentro no se da la vuelta: la tarjeta enfocada es la de verdad, no una copia
    var arrastra = false, pulsado = false, x0 = 0, px0 = 0, muestras = [], visible = true, raf = 0, t0 = 0;

    function medir() {
      var r = orig[0].getBoundingClientRect();
      var g = parseFloat(getComputedStyle(pista).columnGap) || 0;
      paso = r.width + g;
      ancho = paso * N;
    }
    function pon() {
      if (!ancho) return;
      if (!fijo || x < -ancho * .9 || x > ancho * 1.4) x = ((x % ancho) + ancho) % ancho;
      pista.style.transform = 'translate3d(' + (-(x + ancho)).toFixed(2) + 'px,0,0)';
    }
    function cuadro(t) {
      raf = 0;
      var dt = Math.min(.05, (t - t0) / 1000 || 0); t0 = t;
      if (!arrastra) {
        deriva += (derivaObj - deriva) * Math.min(1, dt * 3.5);
        v *= Math.exp(-4.2 * dt);
        if (Math.abs(v) < 2) v = 0;
        x += (deriva + v) * dt;
        pon();
      }
      if (visible && !document.hidden && (arrastra || Math.abs(v) > 0 || Math.abs(deriva) > .05 || Math.abs(derivaObj) > 0)) pide();
    }
    function pide() { if (!raf) { raf = requestAnimationFrame(cuadro); } }
    function despierta() { t0 = performance.now(); pide(); }

    medir();
    x = paso * .42;                                   // arranca con una tarjeta asomando por la izquierda, como la referencia
    pon();

    // Orden de entrada: desde el centro de la pantalla hacia los lados
    var centro = innerWidth / 2;
    Array.prototype.forEach.call(pista.children, function (li) {
      var r = li.getBoundingClientRect();
      if (r.right < -50 || r.left > innerWidth + 50) return;
      var o = Math.round(Math.abs(r.left + r.width / 2 - centro) / paso);
      li.querySelector('.ini__in').style.setProperty('--o', o);
    });
    requestAnimationFrame(function () { requestAnimationFrame(function () { fila.classList.add('is-lista'); }); });
    setTimeout(function () {
      fila.classList.add('is-viva');
      // Ya ha entrado: el resto de imágenes se cargan sin esperar a que asomen
      Array.prototype.forEach.call(pista.querySelectorAll('img[loading="lazy"]'), function (im) { im.loading = 'eager'; });
      despierta();
    }, quieto ? 0 : 1900);

    // Arrastre con ratón, dedo o lápiz. Hasta 6 px cuenta como clic; a partir de ahí se arrastra.
    fila.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pulsado = true; arrastra = false; px0 = e.clientX; x0 = x; v = 0; muestras = [[e.timeStamp, e.clientX]];
    });
    fila.addEventListener('pointermove', function (e) {
      if (!pulsado) return;
      var dx = e.clientX - px0;
      if (!arrastra && Math.abs(dx) > 6) {
        arrastra = true; fila.classList.add('is-arrastra'); paraRafaga();
        try { fila.setPointerCapture(e.pointerId); } catch (err) {}
      }
      if (!arrastra) return;
      x = x0 - dx; pon();
      muestras.push([e.timeStamp, e.clientX]); if (muestras.length > 6) muestras.shift();
    });
    function suelta(e) {
      if (!pulsado) return;
      pulsado = false;
      if (!arrastra) return;
      var a = muestras[0], b = muestras[muestras.length - 1], dt = (b[0] - a[0]) / 1000;
      v = dt > .01 && e.timeStamp - b[0] < 90 ? Math.max(-3200, Math.min(3200, -(b[1] - a[1]) / dt)) : 0;
      arrastra = false; fila.classList.remove('is-arrastra');
      // El clic que llega justo después de soltar no debe abrir la muestra
      var quita = function (ev) { ev.preventDefault(); ev.stopPropagation(); };
      fila.addEventListener('click', quita, { capture: true, once: true });
      setTimeout(function () { fila.removeEventListener('click', quita, true); }, 60);
      despierta();
    }
    fila.addEventListener('pointerup', suelta);
    fila.addEventListener('pointercancel', suelta);
    fila.addEventListener('dragstart', function (e) { e.preventDefault(); });

    // Rueda o panel táctil en horizontal; la rueda normal sigue bajando la página
    fila.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault(); x += e.deltaX; pon();
    }, { passive: false });

    // Con el ratón encima se para; al salir sigue
    fila.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') derivaObj = 0; });
    fila.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { derivaObj = DERIVA; despierta(); } });

    // Teclado: con el foco dentro se para; las flechas mueven una tarjeta y la que tiene el foco se trae a la vista
    fila.addEventListener('focusin', function (e) {
      derivaObj = 0; v = 0;
      var li = e.target.closest && e.target.closest('.ini__s'); if (!li) return;
      fila.scrollLeft = 0;
      fijo = true;
      var r = li.getBoundingClientRect();
      if (r.left < 16 || r.right > innerWidth - 16) { x += r.left - (innerWidth - r.width) / 2; pon(); }
    });
    fila.addEventListener('focusout', function () { fijo = false; derivaObj = DERIVA; despierta(); });
    fila.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      if (quieto) { x += (e.key === 'ArrowRight' ? 1 : -1) * paso; pon(); return; }
      v += (e.key === 'ArrowRight' ? 1 : -1) * paso * 4.2; despierta();
    });
    fila.addEventListener('scroll', function () { if (fila.scrollLeft) fila.scrollLeft = 0; });

    /* Ráfaga (como las tarjetas de la referencia): con el ratón encima, la tarjeta va pasando por otras
       pantallas de esa misma web, a cortes secos, y al salir vuelve a su portada. En el móvil no hay ratón:
       lo hace sola la tarjeta que queda en el centro. Las pantallas se piden la primera vez que hacen falta. */
    var tactil = window.matchMedia && matchMedia('(hover: none), (pointer: coarse)').matches;
    var RITMO = tactil ? 700 : 430, rafA = null, rafT = 0, rafI = -1;
    function paraRafaga() {
      clearInterval(rafT); rafT = 0;
      if (rafA) Array.prototype.forEach.call(rafA.querySelectorAll('.ini__f.is-on'), function (f) { f.classList.remove('is-on'); });
      rafA = null; rafI = -1;
    }
    function rafaga(a) {
      if (quieto || rafA === a) return;
      paraRafaga();
      var n = +a.getAttribute('data-r') || 0, id = a.getAttribute('data-id');
      if (!n || !id) return;
      rafA = a;
      var caja = a.querySelector('.ini__in'), et = caja.querySelector('.ini__et'), fs = caja.querySelectorAll('.ini__f');
      if (!fs.length) {
        for (var k = 1; k <= n; k++) {
          var im = new Image();
          im.className = 'ini__f'; im.alt = ''; im.decoding = 'async'; im.draggable = false;
          im.src = '/assets/inicio/' + id + '-' + k + '.webp';
          caja.insertBefore(im, et);
        }
        fs = caja.querySelectorAll('.ini__f');
      }
      function sig() {
        if (rafA !== a) return;
        var j = rafI + 1;                              // 0…n-1: pantallas; n: vuelve a la portada
        if (j < fs.length && !(fs[j].complete && fs[j].naturalWidth)) return;   // aún no ha llegado: espera al siguiente golpe
        Array.prototype.forEach.call(fs, function (f) { f.classList.remove('is-on'); });
        if (j < fs.length) { fs[j].classList.add('is-on'); rafI = j; } else rafI = -1;
      }
      rafT = setInterval(sig, RITMO);
      setTimeout(sig, tactil ? 500 : 170);
    }
    if (!quieto) {
      pista.addEventListener('pointerover', function (e) {
        if (e.pointerType !== 'mouse' || arrastra || !fila.classList.contains('is-viva')) return;
        var a = e.target.closest && e.target.closest('.ini__c'); if (a) rafaga(a);
      });
      pista.addEventListener('pointerout', function (e) {
        if (e.pointerType !== 'mouse' || !rafA) return;
        if (!e.relatedTarget || !rafA.contains(e.relatedTarget)) paraRafaga();
      });
      pista.addEventListener('focusin', function (e) { var a = e.target.closest && e.target.closest('.ini__c'); if (a && a.matches(':focus-visible')) rafaga(a); });
      pista.addEventListener('focusout', paraRafaga);
      if (tactil) setInterval(function () {
        if (!visible || document.hidden || arrastra || !fila.classList.contains('is-viva')) return;
        var r = fila.getBoundingClientRect();
        var e = document.elementFromPoint(innerWidth / 2, r.top + r.height / 2);
        var a = e && e.closest && e.closest('.ini__c');
        if (a) rafaga(a); else paraRafaga();
      }, 600);
    }

    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) despierta(); }).observe(fila);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) despierta(); });
    var tr = 0;
    addEventListener('resize', function () { clearTimeout(tr); tr = setTimeout(function () { var p = paso ? x / paso : 0; medir(); x = p * paso; pon(); }, 150); });
  }

  /* ---------- Campo de pregunta ---------- */
  var form = document.getElementById('iniPreg'), campo = document.getElementById('iniCampo'), ph = document.getElementById('iniPh');
  if (form && campo) {
    var FRASES = [ph ? ph.textContent : '', tx('f1'), tx('f2'), tx('f3'), tx('f4'), tx('f5')].filter(Boolean);
    var i = 0, n = FRASES[0].length, borra = false, tm = 0, parado = false;
    function paso2() {
      if (parado || !ph) return;
      var f = FRASES[i];
      if (!borra) {
        if (n < f.length) { n++; ph.textContent = f.slice(0, n); tm = setTimeout(paso2, 42); }
        else { borra = true; tm = setTimeout(paso2, 2600); }
      } else {
        if (n > 0) { n--; ph.textContent = f.slice(0, n); tm = setTimeout(paso2, 16); }
        else { borra = false; i = (i + 1) % FRASES.length; tm = setTimeout(paso2, 320); }
      }
    }
    if (!quieto && ph && FRASES.length > 1) { borra = true; tm = setTimeout(paso2, 3400); }
    function refresca() { form.classList.toggle('tiene', campo.value.length > 0); }
    campo.addEventListener('input', refresca);
    campo.addEventListener('focus', function () { parado = true; clearTimeout(tm); if (ph) ph.textContent = FRASES[0]; });
    campo.addEventListener('blur', function () {
      if (campo.value || quieto || !ph || FRASES.length < 2) return;
      parado = false; i = 0; n = FRASES[0].length; borra = true; clearTimeout(tm); tm = setTimeout(paso2, 2200);
    });
    // Si el asistente no llega a cargar (sin conexión, cupo del día agotado…), la nota de debajo lo dice y ofrece WhatsApp
    var nota = document.querySelector('.ini__ia'), listo = false;
    document.addEventListener('oiasistente:listo', function () { listo = true; });
    function sinAsistente() {
      if (listo || !nota) return;
      nota.textContent = tx('nc') + ' ';
      var w = document.createElement('a');
      w.href = 'https://wa.me/34611497409'; w.target = '_blank'; w.rel = 'noopener';
      w.textContent = tx('nw') || 'WhatsApp';
      nota.appendChild(w);
      nota.classList.add('is-aviso');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var a = window.OIAsistente, q = campo.value.trim();
      if (!a) { sinAsistente(); return; }
      if (a.preguntar) { campo.value = ''; refresca(); campo.blur(); if (q) a.preguntar(q); else a.abrir(); return; }
      // Aún cargando: se abre en cuanto esté; si en 4 s no ha llegado, se avisa y la pregunta se queda escrita
      var hecho = false;
      document.addEventListener('oiasistente:listo', function () {
        hecho = true; campo.value = ''; refresca();
        if (q && window.OIAsistente.preguntar) window.OIAsistente.preguntar(q); else window.OIAsistente.abrir();
      }, { once: true });
      setTimeout(function () { if (!hecho) sinAsistente(); }, 4000);
    });
  }

  /* ---------- Pedir una llamada: día y hora → WhatsApp con el mensaje ya escrito ----------
     No se guarda ni se envía nada desde la web: el mensaje lo manda el visitante desde su WhatsApp.
     Horas: de 17:00 a 19:30, de lunes a viernes (cuando Oier puede llamar). */
  var cita = document.getElementById('iniCita'), dias = document.getElementById('iniDias');
  if (cita && dias) {
    var tit = document.querySelector('.ini__tit');
    if (tit && window.OI_TITULO && window.SplitText) { try { window.OI_TITULO(tit); } catch (e) {} }

    var hoy = new Date(), f = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()), fechas = [];
    while (fechas.length < 5) {
      f = new Date(f.getFullYear(), f.getMonth(), f.getDate() + 1);
      if (f.getDay() !== 0 && f.getDay() !== 6) fechas.push(f);
    }
    // En euskera no se usa Intl: muchos navegadores (Chrome entre ellos) no traen el euskera y sacarían la fecha en castellano.
    // Días, meses y orden salen de Itzultzaile Neuronala (herramientas/sitio/inicio/fechas-eu.json); las abreviaturas son las de Euskaltzaindia.
    var EU_D = ['', 'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala'], EU_C = ['', 'al.', 'ar.', 'az.', 'og.', 'or.'];
    var EU_M = ['urtarrilak', 'otsailak', 'martxoak', 'apirilak', 'maiatzak', 'ekainak', 'uztailak', 'abuztuak', 'irailak', 'urriak', 'azaroak', 'abenduak'];
    var fc = new Intl.DateTimeFormat('es-ES', { weekday: 'short' }), fl = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    var corto = { format: function (d) { return eu ? EU_C[d.getDay()] : fc.format(d).replace('.', ''); } };
    var largo = { format: function (d) { return eu ? EU_M[d.getMonth()] + ' ' + d.getDate() + ', ' + EU_D[d.getDay()] : fl.format(d); } };
    fechas.forEach(function (d, k) {
      var l = document.createElement('label'); l.className = 'ini__op';
      var i = document.createElement('input'); i.type = 'radio'; i.name = 'dia'; i.value = largo.format(d);
      i.setAttribute('data-c', corto.format(d) + ' ' + d.getDate());
      if (k === 0) i.checked = true;
      var s = document.createElement('span'); s.textContent = corto.format(d);
      var n = document.createElement('small'); n.textContent = d.getDate(); s.appendChild(n);
      l.appendChild(i); l.appendChild(s); dias.appendChild(l);
    });

    var btnT = document.getElementById('iniPedirT'), aviso = document.getElementById('iniAviso');
    var gHora = document.getElementById('iniGHora'), neg = document.getElementById('iniNeg');
    var textoBtn = btnT.textContent, avisoHtml = aviso.innerHTML;
    function elegido(nombre) { return cita.querySelector('input[name="' + nombre + '"]:checked'); }
    function pinta() {
      var di = elegido('dia'), ho = elegido('hora');
      if (ho && aviso.classList.contains('is-falta')) { gHora.classList.remove('is-falta'); aviso.classList.remove('is-falta'); aviso.innerHTML = avisoHtml; }
      btnT.textContent = di && ho ? tx('cb') + ' · ' + di.getAttribute('data-c') + ', ' + ho.value : textoBtn;
    }
    cita.addEventListener('change', pinta);
    cita.addEventListener('submit', function (e) {
      e.preventDefault();
      var di = elegido('dia'), ho = elegido('hora');
      if (!di || !ho) {
        gHora.classList.add('is-falta'); aviso.classList.add('is-falta'); aviso.textContent = tx('ch');
        var p = gHora.querySelector('input'); if (p) p.focus();
        return;
      }
      var n = neg.value.trim().slice(0, 60);
      var msg = tx('m1') + ' ' + rot('#iniGDia') + ': ' + di.value + '. ' + rot('#iniGHora') + ': ' + ho.value + '.' + (n ? ' ' + tx('mn') + ': ' + n + '.' : '');
      window.open('https://wa.me/34611497409?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }
})();
