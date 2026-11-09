/* LERRO · muestra de academia y autoescuela (OI Studio, 8/11/2026).
   Botones de arriba que se esconden al bajar y vuelven al subir, menú a pantalla completa, collage vivo (el cartel cambia de color
   y una foto se turna, como el vídeo de la referencia), palabra gigante que se escribe sola, fechas del próximo grupo calculadas
   desde hoy (hora de Madrid), curso + horario → próximo grupo, plazas libres de ejemplo y mensaje de WhatsApp ya escrito,
   carrusel de opiniones y paneles que entran al asomar. Sin JS o con «reducir movimiento»: todo quieto y visible.
   Es una muestra: no se envía nada a ningún sitio. */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINO = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var EU = T.lang === "eu";
  var EASE = "cubic-bezier(.2,.75,.25,1)";
  var anima = function (el, k, o) { if (!R && el && el.animate) return el.animate(k, o); };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- botones de arriba: arriba del todo, con idioma y teléfono; al bajar se esconden y al subir vuelven ---------- */
  var ctrl = $("[data-ctrl]"), ultimoY = scrollY, menuAbierto = false;
  function mira() {
    var y = scrollY;
    if (!ctrl) return;
    ctrl.classList.toggle("alto", y < 40);
    if (!menuAbierto) {
      if (y > 160 && y > ultimoY + 2) ctrl.classList.add("oculto");
      else if (y < 160 || y < ultimoY - 2) ctrl.classList.remove("oculto");
    }
    ultimoY = y;
  }
  if (ctrl) { mira(); addEventListener("scroll", mira, { passive: true }); ctrl.addEventListener("focusin", function () { ctrl.classList.remove("oculto"); }); }

  /* ---------- «Apúntate» fijo abajo en el móvil (como el «Enrol» de la referencia): se aparta solo en el formulario ---------- */
  var pm = $("[data-pildora-movil]");
  if (pm && "IntersectionObserver" in window) {
    var vis = { emp: false };
    var pon = function () { pm.classList.toggle("fuera", vis.emp); if (vis.emp) pm.setAttribute("aria-hidden", "true"); else pm.removeAttribute("aria-hidden"); };
    var obs = function (el, k) { if (el) new IntersectionObserver(function (e) { vis[k] = e[0].isIntersecting; pon(); }, { rootMargin: "0px 0px -30% 0px" }).observe(el); };
    obs($(".elige"), "emp");
    pon();
    /* sobre la banda lila, la píldora lila no se vería: pasa a negro mientras la tiene debajo */
    var lila = $(".c-lila"), ioL = null;
    var miraL = function () {
      if (ioL) ioL.disconnect();
      ioL = new IntersectionObserver(function (e) { pm.classList.toggle("sobre-lila", e[0].isIntersecting); }, { rootMargin: "-" + Math.max(0, innerHeight - 90) + "px 0px 0px 0px" });
      if (lila) ioL.observe(lila);
    };
    miraL(); addEventListener("resize", function () { clearTimeout(miraL.t); miraL.t = setTimeout(miraL, 200); });
  }

  /* ---------- menú a pantalla completa ---------- */
  var panel = $("[data-panel-menu]"), abrir = $("[data-menu-abrir]"), cerrarB = $("[data-menu-cerrar]");
  if (panel && abrir && cerrarB) {
    abrir.setAttribute("role", "button");
    var cierra = function (volver) {
      if (!menuAbierto) return; menuAbierto = false;
      abrir.setAttribute("aria-expanded", "false");
      document.documentElement.style.overflow = "";
      var fin = function () { panel.hidden = true; if (volver) abrir.focus(); };
      var a = anima(panel, [{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }, { clipPath: "circle(0% at calc(100% - 40px) 40px)" }], { duration: 480, easing: "cubic-bezier(.6,0,.3,1)" });
      if (a) a.onfinish = fin; else fin();
    };
    abrir.addEventListener("click", function (e) {
      e.preventDefault(); menuAbierto = true;
      panel.hidden = false; abrir.setAttribute("aria-expanded", "true");
      document.documentElement.style.overflow = "hidden";
      anima(panel, [{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }, { clipPath: "circle(150% at calc(100% - 40px) 40px)" }], { duration: 700, easing: "cubic-bezier(.6,0,.2,1)" });
      $$(".panel-lista li, .panel-pie", panel).forEach(function (li, i) {
        anima(li, [{ opacity: 0, transform: "translateY(40px)" }, { opacity: 1, transform: "none" }], { duration: 850, delay: 160 + i * 60, easing: EASE, fill: "backwards" });
      });
      cerrarB.focus();
    });
    cerrarB.addEventListener("click", function () { cierra(true); });
    panel.addEventListener("click", function (e) { if (e.target.closest("a[href^='#']")) cierra(false); });
    document.addEventListener("keydown", function (e) {
      if (!menuAbierto) return;
      if (e.key === "Escape") cierra(true);
      if (e.key === "Tab") { /* el foco no sale del menú */
        var f = $$("a, button", panel), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
  }

  /* ---------- collage vivo: el cartel cambia de color y la foto de la alumna se turna con la de la clase de conducir ---------- */
  var col = $("[data-collage]");
  if (col && !R) {
    var capas = $$("[data-capa]", col), hueco = $("[data-turno-foto]", col), tpl = $("[data-alterna]", col);
    var fotos = hueco ? [hueco.querySelector("picture")] : [];
    if (hueco && tpl && tpl.content) { var alt = tpl.content.firstElementChild.cloneNode(true); alt.style.opacity = "0"; hueco.appendChild(alt); fotos.push(alt); }
    var c = 0, f = 0, enVista = true, reloj = null;
    var paso = function () {
      var antes = capas[c]; c = (c + 1) % capas.length; var ahora = capas[c];
      ahora.style.zIndex = 1; antes.style.zIndex = 0;
      anima(ahora, [{ opacity: 0, transform: "scale(1.04)" }, { opacity: 1, transform: "none" }], { duration: 650, easing: EASE, fill: "forwards" });
      setTimeout(function () { antes.getAnimations && antes.getAnimations().forEach(function (a) { a.cancel(); }); antes.style.opacity = "0"; if (c === 0) ahora.style.opacity = "1"; }, 700);
      if (fotos.length > 1 && c % 2 === 1) {
        var vieja = fotos[f]; f = (f + 1) % fotos.length; var nueva = fotos[f];
        nueva.style.opacity = "1";
        anima(nueva, [{ opacity: 0, transform: "scale(.92)" }, { opacity: 1, transform: "none" }], { duration: 700, easing: EASE });
        if (f === 0) { var a2 = anima(fotos[1], [{ opacity: 1 }, { opacity: 0 }], { duration: 500, easing: EASE }); if (a2) a2.onfinish = function () { fotos[1].style.opacity = "0"; }; }
        vieja.style.zIndex = 0; nueva.style.zIndex = 1;
      }
    };
    var arranca = function () { if (!reloj && enVista) reloj = setInterval(paso, 3400); };
    var para = function () { clearInterval(reloj); reloj = null; };
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { enVista = e[0].isIntersecting; enVista ? arranca() : para(); }).observe(col);
    document.addEventListener("visibilitychange", function () { document.hidden ? para() : arranca(); });
    setTimeout(arranca, 2600);

    /* con ratón, las piezas se mueven un poco con el cursor (cada una a su profundidad) */
    if (FINO) {
      var piezas = $$(".pz, .tag, .lazo", col).map(function (el, i) { return { el: el, p: [0.35, 1, 0.55, 0.8, 0.65, 0.45, 1.1, 0.9, 0.7, 1.1][i % 10] }; });
      var mx = 0, my = 0, cx = 0, cy = 0, raf = null;
      var mueve = function () {
        cx += (mx - cx) * 0.08; cy += (my - cy) * 0.08;
        piezas.forEach(function (o) { o.el.style.translate = (cx * 14 * o.p).toFixed(2) + "px " + (cy * 10 * o.p).toFixed(2) + "px"; });
        raf = Math.abs(mx - cx) > 0.002 || Math.abs(my - cy) > 0.002 ? requestAnimationFrame(mueve) : null;
      };
      col.addEventListener("pointermove", function (e) {
        var r = col.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width * 2 - 1; my = (e.clientY - r.top) / r.height * 2 - 1;
        if (!raf) raf = requestAnimationFrame(mueve);
      });
      col.addEventListener("pointerleave", function () { mx = 0; my = 0; if (!raf) raf = requestAnimationFrame(mueve); });
    }
  }

  /* ---------- la palabra gigante se escribe sola: los tres cursos, uno detrás de otro ---------- */
  var tec = $("[data-teclea]");
  if (tec && !R) {
    var pal = [T.cursos.ingles + ".", T.cursos.carne + ".", T.cursos.repaso + "."], k = 0, n = pal[0].length, borrando = false, t = null, activo = false;
    var tic = function () {
      var w = pal[k];
      if (!borrando) {
        n++; tec.textContent = w.slice(0, n);
        if (n >= w.length) { borrando = true; t = setTimeout(tic, 1700); return; }
        t = setTimeout(tic, 75 + Math.random() * 60);
      } else {
        n--; tec.textContent = w.slice(0, n);
        if (n <= 0) { borrando = false; k = (k + 1) % pal.length; t = setTimeout(tic, 380); return; }
        t = setTimeout(tic, 34);
      }
    };
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) {
      if (e[0].isIntersecting && !activo) { activo = true; borrando = n >= pal[k].length; t = setTimeout(tic, 900); }
      else if (!e[0].isIntersecting && activo) { activo = false; clearTimeout(t); }
    }).observe(tec);
  }

  /* ---------- fechas: el próximo grupo de cada curso, calculado desde hoy (hora de Madrid) ---------- */
  function hoyMadrid() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return Date.UTC(+o.year, +o.month - 1, +o.day) / 864e5;
    } catch (e) { var d = new Date(); return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5; }
  }
  var HOY = hoyMadrid(), ANCLA = Date.UTC(2026, 0, 5) / 864e5; /* lunes 5 de enero de 2026: desde ahí, los grupos empiezan cada 2 o 4 semanas */
  /* ciclo en días, día de la semana en que empieza cada horario (0 = lunes) y plazas del grupo: todo de ejemplo */
  var CURSOS = {
    ingles: { ciclo: 28, m: 0, t: 1, total: 8 },
    carne: { ciclo: 14, m: 0, t: 0, total: 10 },
    repaso: { ciclo: 28, m: 5, t: 0, total: 6 }
  };
  function proximo(c, turno) {
    var C = CURSOS[c], ini = ANCLA + C[turno], minimo = HOY + 3;
    return ini + Math.max(0, Math.ceil((minimo - ini) / C.ciclo)) * C.ciclo;
  }
  function fecha(dn) {
    var d = new Date(dn * 864e5), dia = T.dias[(d.getUTCDay() + 6) % 7], n = d.getUTCDate(), y = d.getUTCFullYear();
    var otroA = y !== new Date(HOY * 864e5).getUTCFullYear();
    if (EU && T.meses_de) {
      /* «astelehena, azaroaren 23a», como lo escribe Itzultzaile Neuronala: «-a» tras el día salvo el 11 y el 31;
         si es el año siguiente, «2027ko …» («-eko» en 2030, 2035, 2041, 2045…: los que acaban en bat, bost o hamar) */
      var u = y % 100 % 20;
      return dia + ", " + (otroA ? y + (u === 1 || u === 5 || u === 10 || u === 15 ? "eko " : "ko ") : "") + T.meses_de[d.getUTCMonth()] + " " + n + (n === 11 || n === 31 ? "" : "a");
    }
    return dia + " " + n + " de " + T.meses[d.getUTCMonth()] + (otroA ? " de " + y : "");
  }
  function libres(c, turno, dn) { /* plazas libres de ejemplo: las mismas para el mismo grupo en todas las visitas */
    var s = c + turno + dn, h = 7;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973;
    return 1 + h % (CURSOS[c].total - 2);
  }

  /* en cada banda de curso, el primer grupo que empieza (de mañana o de tarde) */
  $$("[data-prox]").forEach(function (el) {
    var c = el.getAttribute("data-prox");
    el.textContent = T.prox + " " + fecha(Math.min(proximo(c, "m"), proximo(c, "t")));
  });

  /* ---------- curso + horario → próximo grupo, plazas y mensaje ---------- */
  var form = $("[data-elige]");
  if (form) {
    var res = $("[data-res]", form), sinjs = $("[data-sinjs]", form), msg = $("[data-msg]", form);
    var elF = $("[data-fecha]", form), elH = $("[data-hora]", form), elP = $("[data-plazas]", form), elC = $("[data-cuadros]", form);
    var escr = $("[data-escribiendo]", form), txt = $("[data-mensaje]", form), btn = $("[data-wa-res]", form);
    sinjs.remove(); res.hidden = false; msg.hidden = false;
    var primera = true, tEscr = null;
    var pinta = function () {
      var c = form.curso.value, tu = form.turno.value, dn = proximo(c, tu), C = CURSOS[c], n = libres(c, tu, dn);
      var f = fecha(dn);
      elF.textContent = f;
      elH.textContent = T.horas[c + "_" + tu];
      elP.textContent = (n === 1 ? T.plazas["1_" + C.total] : T.plazas[C.total].replace("{n}", n));
      /* cuadros: ocupadas en negro, libres en lila */
      var html = "";
      for (var i = 0; i < C.total; i++) html += '<i class="' + (i < C.total - n ? "ocupada" : "libre") + '"></i>';
      elC.innerHTML = html;
      var m = T.wa[c + "_" + tu] + "\n" + T.prox + " " + f + ".\n" + T.wa_pregunta;
      btn.href = T.wa_url + "?text=" + encodeURIComponent(m);
      if (primera || R) { txt.textContent = m; escr.hidden = true; primera = false; return; }
      /* lo que cambia salta, y el mensaje se vuelve a escribir */
      anima(elF, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 520, easing: EASE });
      $$("i", elC).forEach(function (q, j) { anima(q, [{ transform: "scale(.4)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 420, delay: j * 30, easing: EASE, fill: "backwards" }); });
      clearTimeout(tEscr);
      txt.hidden = true; escr.hidden = false;
      tEscr = setTimeout(function () {
        escr.hidden = true; txt.hidden = false; txt.textContent = m;
        anima(txt, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 480, easing: EASE });
      }, 650);
    };
    form.addEventListener("change", function (e) {
      var s = e.target.parentElement;
      if (s) anima(s, [{ transform: "scale(.92)" }, { transform: "scale(1.04)" }, { transform: "none" }], { duration: 380, easing: EASE });
      pinta();
    });
    pinta();

    /* «Elegir este curso» en cada banda: marca el curso y baja al formulario */
    $$("[data-elegir]").forEach(function (a) {
      a.addEventListener("click", function () {
        var c = a.getAttribute("data-elegir"), r = form.querySelector('input[name="curso"][value="' + c + '"]');
        if (r && !r.checked) { r.checked = true; pinta(); }
      });
    });
  }

  /* ---------- carrusel de opiniones ---------- */
  var pista = $("[data-carr]"), ant = $("[data-carr-ant]"), sig = $("[data-carr-sig]");
  if (pista && ant && sig) {
    var paso2 = function () { var li = pista.querySelector("li"); return li ? li.getBoundingClientRect().width + parseFloat(getComputedStyle(pista).columnGap || 24) : 300; };
    var estado = function () { ant.disabled = pista.scrollLeft < 4; sig.disabled = pista.scrollLeft > pista.scrollWidth - pista.clientWidth - 4; };
    ant.addEventListener("click", function () { pista.scrollBy({ left: -paso2(), behavior: R ? "auto" : "smooth" }); });
    sig.addEventListener("click", function () { pista.scrollBy({ left: paso2(), behavior: R ? "auto" : "smooth" }); });
    pista.addEventListener("scroll", estado, { passive: true }); addEventListener("resize", estado); estado();
  }

  /* ---------- paneles que entran al asomar (por tiempo, no atados al scroll) ---------- */
  if (!R && window.gsap && window.ScrollTrigger) {
    /* si se llega con el teclado a algo que aún no ha entrado, se enseña ya */
    document.addEventListener("focusin", function (e) {
      for (var el = e.target; el && el !== document.body; el = el.parentElement) {
        if (getComputedStyle(el).opacity < 1 && el.style.opacity !== "") gsap.set(el, { opacity: 1, y: 0, clearProps: "transform" });
      }
    });
    gsap.registerPlugin(ScrollTrigger);
    $$("[data-curso]").forEach(function (b) {
      gsap.fromTo(b, { clipPath: "inset(6% 3% 0% 3% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.25, ease: "power3.out", scrollTrigger: { trigger: b, start: "top 88%" } });
      var img = b.querySelector("[data-foto] img");
      if (img) gsap.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: b, start: "top 80%" } });
      var txt = b.querySelectorAll(".curso-txt > *");
      gsap.from(txt, { y: 30, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: b, start: "top 75%" } });
    });
    var ops = $$(".op");
    if (ops.length) gsap.from(ops, { y: 50, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: ".carr", start: "top 85%" } });
    var grupos = $$(".elige > *");
    if (grupos.length) gsap.from(grupos, { y: 30, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.07, scrollTrigger: { trigger: ".elige", start: "top 85%" } });
    var pg = $(".pie-grande");
    if (pg) gsap.from(pg.children, { y: 26, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: pg, start: "top 90%" } });
  }
})();
