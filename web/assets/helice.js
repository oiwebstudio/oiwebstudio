/* «WEBS EN MOVIMIENTO» (trabajos.html). Estilos en helice.css.
   Las nueve tarjetas se deslizan por una HÉLICE fija y lo único que cambia con el scroll es cuánto han avanzado.
   Los números (hélice, avance, palabras, rejilla) están medidos fotograma a fotograma en el vídeo de referencia. */
(function(){
  var sec = document.getElementById('wm');
  if (!sec) return;
  var pin = sec.querySelector('.wm__pin');
  var A = sec.querySelector('.wm__w--a'), B = sec.querySelector('.wm__w--b');
  var cap = sec.querySelector('.wm__cap');
  var esc = sec.querySelector('.wm__esc'), hel = sec.querySelector('.wm__hel');
  var celdas = [].slice.call(sec.querySelectorAll('.wm__g a'));
  var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BASE = (sec.getAttribute('data-img') || 'assets/wm/');

  /* HÉLICE (unidades: ancho del escenario = 1): centro, cabeceo y alabeo del eje, radio, subida por radián, perspectiva, paso por tarjeta */
  var CX = 0.0026, CYE = -0.0222, CZ = -0.2799, CAB = -0.0348, ALA = 0.0532, R = 0.506, K = 0.1055, P = 0.6135, DL = 0.4837;
  var ALTO = 0.18, TROZOS = 4;
  /* avance s(t) cada 0,125 s desde t = 1,25 s; fuera de ese tramo la cinta no se ve */
  var S0 = 1.25, SD = 0.125, SV = [7.967,7.638,7.309,6.981,6.652,6.309,5.981,5.61,5.173,4.741,4.37,4.06,3.77,3.44,3.022,2.531,2.081,1.738,1.489,1.241,0.873,0.431,0.007,-0.386,-0.73,-0.997,-1.199,-1.361,-1.483,-1.576,-1.659,-1.743,-1.844,-1.978,-2.145,-2.325,-2.498,-2.656,-2.817,-3.018,-3.279,-3.584,-3.881,-4.141,-4.388,-4.655,-4.961,-5.274,-5.586,-5.899,-6.211,-6.524,-6.836,-7.149,-7.461,-7.774,-8.086];
  function avance(T){
    var x = (T - S0) / SD, n = SV.length;
    if (x <= 0) return SV[0]; if (x >= n - 1) return SV[n - 1];
    var i = Math.floor(x), u = x - i, p0 = SV[Math.max(0, i - 1)], p1 = SV[i], p2 = SV[i + 1], p3 = SV[Math.min(n - 1, i + 2)];
    return 0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
  }

  /* Tarjetas de la cinta, en orden. Las seis de la rejilla ocupan los puestos 1, 2, 5 / 3, 8, 7, como en la referencia */
  var IDS = ['irri','ezki','malda','hauspo','tinko','orea','txilar','zehatz','behako'];
  var N = IDS.length, trozos = [];
  IDS.forEach(function(id, c){
    for (var j = 0; j < TROZOS; j++) for (var cara = 0; cara < 2; cara++) {
      var el = document.createElement('i');
      el.style.backgroundSize = (TROZOS * 100) + '% 100%';
      el.style.backgroundPosition = ((cara ? TROZOS - 1 - j : j) / (TROZOS - 1) * 100) + '% 0';   // por detrás, el trozo simétrico: la tarjeta se lee igual
      hel.appendChild(el);
      trozos.push({ el: el, id: id, a: (c - (N - 1) / 2 - 0.5 + (j + 0.5) / TROZOS) * DL, cara: cara });
    }
  });
  /* Las imágenes (unos 330 KB) solo se piden al acercarse a la sección */
  var cargadas = false;
  function cargar(){
    if (cargadas) return; cargadas = true;
    trozos.forEach(function(t){ t.el.style.backgroundImage = 'url(' + BASE + t.id + '.webp)'; });
    celdas.forEach(function(a){ a.style.backgroundImage = 'url(' + BASE + a.getAttribute('data-img') + '.webp)'; });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){ if (es.some(function(e){ return e.isIntersecting; })) { cargar(); io.disconnect(); } }, { rootMargin: '150% 0px' });
    io.observe(sec);
  } else cargar();

  /* Palabras: borde izquierdo (fracción del ancho) y borde de arriba (fracción del alto del escenario) */
  var KW = {
    aX: [[0,-.21],[.75,-.17],[1,-.12],[1.25,-.08],[1.5,-.01],[1.75,.04],[2,.085],[2.25,.16],[2.5,.22],[2.75,.26],[3,.31],[4.5,.66],[5.25,.72],[5.75,.76],[6,.78],[6.25,.82],[6.5,.87],[6.75,.91],[7,.96],[7.25,1.03],[7.6,1.14]],
    bX: [[0,.94],[.75,.9],[1,.86],[1.25,.83],[1.5,.76],[1.75,.69],[2,.64],[2.25,.57],[2.5,.51],[2.75,.47],[3,.42],[4.5,.09],[5.25,.05],[5.75,.0],[6,-.03],[6.5,-.09],[6.75,-.16],[7,-.23],[7.25,-.31],[7.6,-.44]],
    aY: [[0,.73],[.75,.59],[1,.49],[1.25,.39],[11.5,.39]],
    bY: [[0,.87],[.75,.74],[1,.64],[1.25,.535],[11.5,.535]],
    cY: [[0,.83],[.75,.69],[1,.6],[1.5,.485],[11.5,.485]],
    cO: [[0,1],[7,1],[7.6,0],[11.5,0]]
  };
  /* interpolación cúbica monótona: sin tirones entre medidas y sin pasarse */
  function prep(a){
    var n = a.length, d = [], m = [], i;
    for (i = 0; i < n - 1; i++) d.push((a[i + 1][1] - a[i][1]) / (a[i + 1][0] - a[i][0]));
    m.push(d[0]); for (i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2); m.push(d[n - 2]);
    for (i = 0; i < n - 1; i++) { if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; } var al = m[i] / d[i], be = m[i + 1] / d[i], q = al * al + be * be; if (q > 9) { var tau = 3 / Math.sqrt(q); m[i] = tau * al * d[i]; m[i + 1] = tau * be * d[i]; } }
    return { a: a, m: m };
  }
  var KP = {}; Object.keys(KW).forEach(function(k){ KP[k] = prep(KW[k]); });
  function val(k, t){
    var a = KP[k].a, m = KP[k].m, n = a.length;
    if (t <= a[0][0]) return a[0][1]; if (t >= a[n - 1][0]) return a[n - 1][1];
    for (var i = 1; i < n; i++) if (t <= a[i][0]) {
      var h = a[i][0] - a[i - 1][0], u = (t - a[i - 1][0]) / h, u2 = u * u, u3 = u2 * u;
      return (2 * u3 - 3 * u2 + 1) * a[i - 1][1] + (u3 - 2 * u2 + u) * h * m[i - 1] + (-2 * u3 + 3 * u2) * a[i][1] + (u3 - u2) * h * m[i];
    }
  }

  var W, H, U, movil, cel;
  function medir(){
    W = pin.clientWidth; H = pin.clientHeight; movil = W < 760;
    if (quieto) H = Math.max(H, 0);
    U = movil ? Math.min(H * 1.61, W * 1.75) : Math.min(W, H * 1.61);        // ancho del escenario (proporción 1,61)
    esc.style.perspective = (P * U) + 'px';
    A.style.fontSize = B.style.fontSize = ((movil ? W : U) * (movil ? .088 : .056)) + 'px';
    var ws = R * DL / TROZOS * U + 1, hs = ALTO * U, fi = Math.atan(K / R) * 180 / Math.PI;
    trozos.forEach(function(t){
      var s = t.el.style; s.width = ws + 'px'; s.height = hs + 'px'; s.margin = (-hs / 2) + 'px 0 0 ' + (-ws / 2) + 'px';
      s.transform = 'rotateY(' + t.a + 'rad) translate3d(0,' + (K * t.a * U) + 'px,' + (R * U) + 'px) skewY(' + fi + 'deg)' + (t.cara ? ' rotateY(180deg)' : '');
    });
    // Rejilla final: 3×2 (cada tarjeta, 25 % del ancho y 29 % del alto del escenario); en el móvil, 2×3
    var EH = U / 1.61, cols = movil ? 2 : 3, gw = movil ? .44 * W : .25 * U, gh = movil ? gw * .72 : .29 * EH, gap = movil ? .02 * W : .01 * U;
    var totW = cols * gw + (cols - 1) * gap, filas = 6 / cols, totH = filas * gh + (filas - 1) * gap, x0 = (W - totW) / 2, y0 = (H - totH) / 2;
    cel = celdas.map(function(a, i){ var c = i % cols, f = Math.floor(i / cols); a.style.width = gw + 'px'; a.style.height = gh + 'px'; return { x: x0 + c * (gw + gap), y: y0 + f * (gh + gap) }; });
  }

  // Entrada de cada tarjeta de la rejilla: desde su esquina, girada, y se asienta
  var GR = [ {t:6.9, dx:-.2, dy:-.42, r:-9, x3:28}, {t:7.3, dx:0, dy:-.45, r:5, x3:30}, {t:7.8, dx:.22, dy:-.42, r:8, x3:28},
             {t:8.6, dx:-.24, dy:.42, r:-8, x3:-28}, {t:8.9, dx:0, dy:.45, r:4, x3:-30}, {t:9.5, dx:.24, dy:.42, r:9, x3:-28} ];
  var sale = function(u){ return 1 - Math.pow(1 - u, 3); };
  var cl = function(v, a, b){ return v < a ? a : v > b ? b : v; };

  function pintar(T){
    var EH = U / 1.61, yT = function(f){ return H / 2 + (f - .5) * EH; };
    var fuera = (movil && T > 6.4) ? (T - 6.4) * 1.6 : 0;      // en el móvil las palabras son más anchas que la pantalla: se empujan hasta fuera
    A.style.transform = 'translate3d(' + ((val('aX', T) + fuera) * W) + 'px,' + yT(val('aY', T)) + 'px,0) scaleY(1.28)';
    B.style.transform = 'translate3d(' + ((val('bX', T) - fuera) * W) + 'px,' + yT(val('bY', T)) + 'px,0) scaleY(1.28)';
    cap.style.transform = 'translate3d(0,' + yT(val('cY', T)) + 'px,0)';
    cap.style.opacity = val('cO', T);

    var vivo = T > 1.3 && T < 8.2;
    esc.style.display = vivo ? '' : 'none';
    if (vivo) { var s = avance(T);
      hel.style.transform = 'translate3d(' + (CX * U) + 'px,' + (CYE * U) + 'px,' + (CZ * U) + 'px) rotateZ(' + ALA + 'rad) rotateX(' + CAB + 'rad) translateY(' + (K * s * U) + 'px) rotateY(' + s + 'rad)'; }

    celdas.forEach(function(a, i){
      var g = GR[i], u = sale(cl((T - g.t) / 1.5, 0, 1)), k = 1 - u, c = cel[i];
      a.style.opacity = u > 0 ? 1 : 0;
      a.style.transform = 'translate3d(' + (c.x + g.dx * W * k) + 'px,' + (c.y + g.dy * H * k) + 'px,0) rotateX(' + (g.x3 * k) + 'deg) rotateZ(' + (g.r * k) + 'deg)';
    });
    sec.classList.toggle('is-lista', T > 10.6);
  }

  if (quieto) {                          // rejilla quieta, sin tramo de scroll
    sec.classList.add('is-quieta'); pin.style.height = '100vh'; cargar(); medir(); pintar(20);
    addEventListener('resize', function(){ medir(); pintar(20); });
    return;
  }
  var FIN = 11.5, pend = false;          // a partir de FIN la rejilla queda quieta hasta que se suelta la sección
  function alScroll(){
    if (pend) return; pend = true;
    requestAnimationFrame(function(){
      pend = false;
      var r = sec.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return;      // fuera de la vista: nada que pintar
      var total = sec.offsetHeight - pin.offsetHeight;
      pintar(cl(-r.top / total, 0, 1) * FIN * 1.08);
    });
  }
  medir(); pintar(0); alScroll();
  addEventListener('scroll', alScroll, { passive: true });
  addEventListener('resize', function(){ medir(); pend = false; alScroll(); });
})();
