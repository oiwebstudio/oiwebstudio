/* «DISEÑO EN MOVIMIENTO» (trabajos.html). Estilos en helice.css.
   Tramo 1: dos palabras se cruzan y nueve tarjetas se deslizan por una HÉLICE fija; lo único que cambia con el scroll es cuánto
   han avanzado. Los números están medidos fotograma a fotograma en el vídeo de referencia de Oier.
   Tramo 2: las seis primeras muestras quedan en su sitio y, al seguir bajando, van apareciendo todas las demás, fila a fila. */
(function(){
  var sec = document.getElementById('wm');
  if (!sec || matchMedia('(prefers-reduced-motion: reduce)').matches) return;      // sin animación queda la galería normal
  var pin = sec.querySelector('.wm__pin');
  var A = sec.querySelector('.wm__w--a'), B = sec.querySelector('.wm__w--b');
  var cap = sec.querySelector('.wm__cap');
  var esc = sec.querySelector('.wm__esc'), hel = sec.querySelector('.wm__hel');
  var galeria = sec.querySelector('.wm__g'), celdas = [].slice.call(galeria.children);
  if (celdas.length < 6) return;
  var BASE = (sec.getAttribute('data-img') || 'assets/wm/');
  sec.classList.add('is-viva');
  celdas.forEach(function(li, i){ if (i >= 6) li.classList.add('es-resto'); });

  /* HÉLICE (unidades: ancho del escenario = 1): centro, cabeceo y alabeo del eje, radio, subida por radián, perspectiva, paso por tarjeta */
  var CX = 0.0026, CYE = -0.0222, CZ = -0.2799, CAB = -0.0348, ALA = 0.0532, R = 0.506, K = 0.1055, P = 0.6135, DL = 0.4837;
  var ALTO = 0.18, TROZOS = 4, HUECO = 0.965;      // HUECO: cada tarjeta ocupa el 96,5 % de su sitio, para que se vea separada de la siguiente
  /* avance s(t) cada 0,125 s desde t = 1,25 s; fuera de ese tramo la cinta no se ve */
  var S0 = 1.25, SD = 0.125, SV = [7.967,7.638,7.309,6.981,6.652,6.309,5.981,5.61,5.173,4.741,4.37,4.06,3.77,3.44,3.022,2.531,2.081,1.738,1.489,1.241,0.873,0.431,0.007,-0.386,-0.73,-0.997,-1.199,-1.361,-1.483,-1.576,-1.659,-1.743,-1.844,-1.978,-2.145,-2.325,-2.498,-2.656,-2.817,-3.018,-3.279,-3.584,-3.881,-4.141,-4.388,-4.655,-4.961,-5.274,-5.586,-5.899,-6.211,-6.524,-6.836,-7.149,-7.461,-7.774,-8.086];
  function avance(T){
    var x = (T - S0) / SD, n = SV.length;
    if (x <= 0) return SV[0]; if (x >= n - 1) return SV[n - 1];
    var i = Math.floor(x), u = x - i, p0 = SV[Math.max(0, i - 1)], p1 = SV[i], p2 = SV[i + 1], p3 = SV[Math.min(n - 1, i + 2)];
    return 0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
  }

  /* Tarjetas de la cinta, en orden. Las seis primeras de la galería ocupan los puestos 1, 2, 5 / 3, 8, 7, como en la referencia */
  var IDS = ['errotatxo','aberri','malda','hauspo','tinko','orea','txilar','zehatz','behako'];      // abren la cinta las dos webs publicadas para clientes
  var N = IDS.length, trozos = [];
  IDS.forEach(function(id, c){
    for (var j = 0; j < TROZOS; j++) for (var cara = 0; cara < 2; cara++) {
      var el = document.createElement('i');
      el.style.backgroundSize = (TROZOS * 100) + '% 100%';
      el.style.backgroundPosition = ((cara ? TROZOS - 1 - j : j) / (TROZOS - 1) * 100) + '% 0';   // por detrás, el trozo simétrico: la tarjeta se lee igual
      var borde = j === 0 ? (cara ? 'es-der' : 'es-izq') : j === TROZOS - 1 ? (cara ? 'es-izq' : 'es-der') : '';   // esquinas redondeadas en los extremos
      if (borde) el.className = borde;
      hel.appendChild(el);
      trozos.push({ el: el, id: id, a: ((c - (N - 1) / 2) + ((j + 0.5) / TROZOS - 0.5) * HUECO) * DL, cara: cara });
    }
  });
  /* Las imágenes de la cinta (unos 330 KB) solo se piden al acercarse a la sección */
  var cargadas = false;
  function cargar(){ if (cargadas) return; cargadas = true; trozos.forEach(function(t){ t.el.style.backgroundImage = 'url(' + BASE + t.id + '.webp)'; }); }
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

  var W, H, U, movil, cel, LA, LB, TMAX = 11.2;
  function medir(){
    W = pin.clientWidth; H = pin.clientHeight; movil = W < 760;
    U = movil ? Math.min(H * 1.61, W * 1.75) : Math.min(W, H * 1.61);        // ancho del escenario (proporción 1,61)
    esc.style.perspective = (P * U) + 'px';
    A.style.fontSize = B.style.fontSize = ((movil ? W : U) * (movil ? .078 : .05)) + 'px';
    hel.style.setProperty('--wm-r', (U * 0.009) + 'px');
    var ws = R * DL * HUECO / TROZOS * U + 1, hs = ALTO * U, fi = Math.atan(K / R) * 180 / Math.PI;
    trozos.forEach(function(t){
      var s = t.el.style; s.width = ws + 'px'; s.height = hs + 'px'; s.margin = (-hs / 2) + 'px 0 0 ' + (-ws / 2) + 'px';
      s.transform = 'rotateY(' + t.a + 'rad) translate3d(0,' + (K * t.a * U) + 'px,' + (R * U) + 'px) skewY(' + fi + 'deg)' + (t.cara ? ' rotateY(180deg)' : '');
    });
    // Galería: 3 columnas (2 en el móvil). Cada tarjeta es la de «¿Qué negocio tienes?»: portada 16:10 y, debajo, nombre y sector
    var cols = movil ? 2 : 3, gw = movil ? (W - 16 * 2 - 12) / 2 : Math.min(.25 * U, 400), gx = movil ? 12 : Math.max(16, .014 * U), gy = movil ? 22 : 30;
    var pie = 40, fila = gw * .625 + pie + gy, totW = cols * gw + (cols - 1) * gx, x0 = (W - totW) / 2;
    var filas6 = 6 / cols, y0 = Math.max(movil ? 84 : 96, (H - (filas6 * fila - gy)) / 2);
    cel = celdas.map(function(li, i){
      var c = i % cols, f = Math.floor(i / cols); li.style.width = gw + 'px';
      if (i >= 6) { li.style.left = (x0 + c * (gw + gx)) + 'px'; li.style.top = (y0 + f * fila) + 'px'; li.style.setProperty('--d', (c * 90) + 'ms'); }
      return { x: x0 + c * (gw + gx), y: y0 + f * fila };
    });
    var total = y0 + Math.ceil(celdas.length / cols) * fila - gy;            // donde acaba la última fila
    LB = Math.max(0, total + (movil ? 40 : 72) - H);                          // lo que hay que bajar para verla entera
    LA = H * (movil ? 5.8 : 6.6);                                             // recorrido del tramo animado
    sec.style.height = (H + LA + LB) + 'px';
  }

  // Entrada de las seis primeras: cada una desde su esquina, girada, y se asienta
  var GR = [ {t:6.9, dx:-.2, dy:-.42, r:-9, x3:28}, {t:7.3, dx:0, dy:-.45, r:5, x3:30}, {t:7.8, dx:.22, dy:-.42, r:8, x3:28},
             {t:8.6, dx:-.24, dy:.42, r:-8, x3:-28}, {t:8.9, dx:0, dy:.45, r:4, x3:-30}, {t:9.5, dx:.24, dy:.42, r:9, x3:-28} ];
  var sale = function(u){ return 1 - Math.pow(1 - u, 3); };
  var cl = function(v, a, b){ return v < a ? a : v > b ? b : v; };

  function pintar(T, baja){
    var EH = U / 1.61, yT = function(f){ return H / 2 + (f - .5) * EH; };
    var fuera = (movil && T > 6.4) ? (T - 6.4) * 1.6 : 0;      // en el móvil las palabras son más anchas que la pantalla: se empujan hasta fuera
    A.style.transform = 'translate3d(' + ((val('aX', T) + fuera) * W) + 'px,' + yT(val('aY', T)) + 'px,0)';
    B.style.transform = 'translate3d(' + ((val('bX', T) - fuera) * W) + 'px,' + yT(val('bY', T)) + 'px,0)';
    cap.style.transform = 'translate3d(0,' + yT(val('cY', T)) + 'px,0)';
    cap.style.opacity = val('cO', T);

    var vivo = T > 1.3 && T < 8.2;
    esc.style.display = vivo ? '' : 'none';
    if (vivo) { var s = avance(T);
      hel.style.transform = 'translate3d(' + (CX * U) + 'px,' + (CYE * U) + 'px,' + (CZ * U) + 'px) rotateZ(' + ALA + 'rad) rotateX(' + CAB + 'rad) translateY(' + (K * s * U) + 'px) rotateY(' + s + 'rad)'; }

    galeria.style.transform = 'translate3d(0,' + (-baja) + 'px,0)';
    for (var i = 0; i < 6; i++) {
      var li = celdas[i], g = GR[i], u = sale(cl((T - g.t) / 1.5, 0, 1)), k = 1 - u, c = cel[i];
      li.style.visibility = u > 0 ? 'visible' : 'hidden'; li.style.opacity = u > 0 ? 1 : 0;
      li.style.transform = 'translate3d(' + (c.x + g.dx * W * k) + 'px,' + (c.y + g.dy * H * k) + 'px,0) rotateX(' + (g.x3 * k) + 'deg) rotateZ(' + (g.r * k) + 'deg)';
    }
    // las demás aparecen cuando su fila asoma por abajo (y se quedan); si se vuelve atrás del todo, se recogen
    var listo = T >= TMAX - .01;
    for (var n = 6; n < celdas.length; n++) celdas[n].classList.toggle('is-vista', listo && baja > 0 && cel[n].y - baja < H * .94);
    sec.classList.toggle('is-lista', T > 10.6);
  }

  var pend = false;
  function alScroll(){
    if (pend) return; pend = true;
    requestAnimationFrame(function(){
      pend = false;
      var r = sec.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return;      // fuera de la vista: nada que pintar
      var y = cl(-r.top, 0, LA + LB);
      pintar(Math.min(y / LA, 1) * TMAX, Math.max(0, y - LA));
    });
  }
  medir(); pintar(0, 0); alScroll();
  addEventListener('scroll', alScroll, { passive: true });
  addEventListener('resize', function(){ medir(); pend = false; alScroll(); });
})();
