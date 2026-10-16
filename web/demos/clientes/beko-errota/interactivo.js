/* Beko Errota · interacción: «¿A qué venís?», cifras que cuentan, portada con contador, paseo horizontal
   y visor de fotos. Sin JS todo se ve y funciona (enlaces normales); con «reducir movimiento», sin animaciones. */
(function () {
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var G = window.gsap, ST = window.ScrollTrigger;
  if (G && ST) {
    G.registerPlugin(ST);
    /* el desplazamiento suave del CSS falsea las medidas de ScrollTrigger al recalcular: se quita mientras recalcula */
    var raiz = document.documentElement;
    ST.addEventListener("refreshInit", function () { raiz.style.scrollBehavior = "auto"; });
    ST.addEventListener("refresh", function () { raiz.style.scrollBehavior = ""; });
  }

  /* ── ¿A qué venís? — pestañas con foto ── */
  var venis = document.querySelector(".venis");
  if (venis) {
    var tabs = [].slice.call(venis.querySelectorAll("[role=tab]"));
    var fotos = [].slice.call(venis.querySelectorAll(".venis__foto img"));
    var elegir = function (t, foco) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
      fotos.forEach(function (f) { f.classList.toggle("on", f.dataset.v === t.dataset.v); });
      var p = document.getElementById(t.getAttribute("aria-controls"));
      if (G && !quieto) G.fromTo(p.children, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.06 });
      if (foco) t.focus();
    };
    tabs.forEach(function (t, k) {
      t.addEventListener("click", function () { elegir(t); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (!d) return; e.preventDefault(); elegir(tabs[(k + d + tabs.length) % tabs.length], true);
      });
      if (matchMedia("(hover:hover) and (pointer:fine)").matches) t.addEventListener("mouseenter", function () { if (t.getAttribute("aria-selected") !== "true") elegir(t); });
    });
  }

  /* ── portada: contador, nombre de la foto y barra de tiempo ── */
  var car = document.querySelector("[data-slides]"), info = document.querySelector(".slide-info");
  if (car && info) {
    var imgs = [].slice.call(car.querySelectorAll(".slides img"));
    var n = info.querySelector(".slide-n b"), tt = info.querySelector(".slide-t"), barra = info.querySelector(".slide-barra i");
    var pinta = function () {
      var k = imgs.findIndex(function (i) { return i.classList.contains("on"); }); if (k < 0) return;
      n.textContent = "0" + (k + 1); tt.textContent = imgs[k].dataset.t || "";
      if (barra && !quieto) { barra.style.animation = "none"; void barra.offsetWidth; barra.style.animation = ""; }
    };
    imgs.forEach(function (i) { new MutationObserver(function () { if (i.classList.contains("on")) pinta(); }).observe(i, { attributes: true, attributeFilter: ["class"] }); });
    pinta();
    /* la foto se mueve un poco con el ratón */
    if (!quieto && matchMedia("(hover:hover) and (pointer:fine)").matches) {
      var fondo = car.querySelector(".fondo");
      car.addEventListener("pointermove", function (e) {
        var r = car.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        if (G) G.to(fondo, { x: -x * 26, y: -y * 18, duration: 1.2, ease: "power3.out" });
      });
      car.addEventListener("pointerleave", function () { if (G) G.to(fondo, { x: 0, y: 0, duration: 1.2, ease: "power3.out" }); });
    }
  }

  /* ── cifras que cuentan al aparecer ── */
  var cifras = [].slice.call(document.querySelectorAll("[data-cuenta]"));
  if (cifras.length && "IntersectionObserver" in window && !quieto) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        var el = e.target, fin = +el.dataset.cuenta, pre = el.dataset.pre || "", t0 = performance.now(), dur = 1600;
        (function paso(t) {
          var p = Math.min(1, (t - t0) / dur), v = Math.round(fin * (1 - Math.pow(1 - p, 3)));
          el.textContent = pre + v; if (p < 1) requestAnimationFrame(paso);
        })(t0);
      });
    }, { threshold: 0.6 });
    cifras.forEach(function (c) { c.textContent = (c.dataset.pre || "") + "0"; io.observe(c); });
  }

  /* ── paseo: la sección se queda quieta en pantalla (position: sticky) mientras las fotos pasan de lado,
     en ordenador y en móvil. La altura de la sección da el recorrido: tanto como lo que hay que desplazar.
     Se calcula a mano con la posición real en cada fotograma. ── */
  var paseo = document.querySelector(".paseo"), pista = paseo && paseo.querySelector(".paseo__pista");
  if (paseo && pista && !quieto) {
    var x = 0, meta = 0, corriendo = false, recorrido = 0;
    var medir = function () {
      paseo.classList.add("pegado");
      recorrido = Math.max(0, pista.scrollWidth - innerWidth + 40);
      paseo.style.height = "calc(100svh + " + Math.round(recorrido * 1.15) + "px)";
    };
    var objetivo = function () {
      var r = paseo.getBoundingClientRect(), largo = paseo.offsetHeight - innerHeight;
      var p = largo > 0 ? Math.min(1, Math.max(0, -r.top / largo)) : 0;
      return -p * recorrido;
    };
    var bucle = function () {
      x += (meta - x) * 0.14;
      if (Math.abs(meta - x) < 0.3) x = meta;
      pista.style.transform = "translate3d(" + x.toFixed(1) + "px,0,0)";
      if (x !== meta) requestAnimationFrame(bucle); else corriendo = false;
    };
    var mover = function () { meta = objetivo(); if (!corriendo) { corriendo = true; requestAnimationFrame(bucle); } };
    medir(); mover();
    addEventListener("scroll", mover, { passive: true });
    addEventListener("resize", function () { medir(); mover(); });
    addEventListener("load", function () { medir(); mover(); });
  }

  /* las letras y las fotos cambian la altura de la página: se recalculan las posiciones al terminar de cargar */
  if (ST) { if (document.fonts) document.fonts.ready.then(function () { ST.refresh(); }); addEventListener("load", function () { setTimeout(function () { ST.refresh(); }, 200); }); }

  /* ── visor de fotos: pulsar una foto la abre en grande; flechas, deslizar y Esc ── */
  var sel = ".paseo__f img, .tarjeta img, .foto-marco img, .collage img, .platos img, .tarj-osc img, .lugar__g img";
  var lista = [].slice.call(document.querySelectorAll(sel));
  if (!lista.length) return;
  lista.forEach(function (im) {
    if (!im.closest("button")) { im.setAttribute("tabindex", "0"); im.setAttribute("role", "button"); im.setAttribute("aria-label", "Ver en grande: " + (im.alt || "foto")); }
    im.classList.add("ampliable");
  });
  var v = document.createElement("div");
  v.className = "visor"; v.hidden = true; v.setAttribute("role", "dialog"); v.setAttribute("aria-modal", "true"); v.setAttribute("aria-label", "Foto en grande");
  v.innerHTML = '<button class="visor__x" type="button" aria-label="Cerrar">✕</button><button class="visor__a visor__a--i" type="button" aria-label="Foto anterior">‹</button><figure><img alt=""/><figcaption></figcaption></figure><button class="visor__a visor__a--d" type="button" aria-label="Foto siguiente">›</button><p class="visor__n"></p>';
  document.body.appendChild(v);
  var vi = v.querySelector("img"), vc = v.querySelector("figcaption"), vn = v.querySelector(".visor__n"), ix = 0, antes = null;
  var mostrar = function (k) {
    ix = (k + lista.length) % lista.length; var im = lista[ix];
    vi.src = im.currentSrc || im.src; vi.alt = im.alt; vc.textContent = im.alt; vn.textContent = (ix + 1) + " / " + lista.length;
    if (G && !quieto) G.fromTo(vi, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" });
  };
  var abrir = function (k) { antes = document.activeElement; v.hidden = false; document.documentElement.classList.add("visor-abierto"); mostrar(k); v.querySelector(".visor__x").focus(); };
  var cerrar = function () { v.hidden = true; document.documentElement.classList.remove("visor-abierto"); if (antes) antes.focus(); };
  lista.forEach(function (im, k) {
    var disparo = im.closest("button") || im;
    disparo.addEventListener("click", function (e) { e.preventDefault(); abrir(k); });
    if (disparo === im) im.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(k); } });
  });
  v.querySelector(".visor__x").addEventListener("click", cerrar);
  v.querySelector(".visor__a--i").addEventListener("click", function () { mostrar(ix - 1); });
  v.querySelector(".visor__a--d").addEventListener("click", function () { mostrar(ix + 1); });
  v.addEventListener("click", function (e) { if (e.target === v) cerrar(); });
  addEventListener("keydown", function (e) {
    if (v.hidden) return;
    if (e.key === "Escape") cerrar(); else if (e.key === "ArrowRight") mostrar(ix + 1); else if (e.key === "ArrowLeft") mostrar(ix - 1);
    else if (e.key === "Tab") { var f = [].slice.call(v.querySelectorAll("button")), i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
  });
  var x0 = null;
  v.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  v.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) mostrar(ix + (dx < 0 ? 1 : -1)); x0 = null; });
})();
