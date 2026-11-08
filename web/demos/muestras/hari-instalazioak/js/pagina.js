/* HARI · muestra de instalador (OI Studio, 8/11/2026). Cabecera que cambia de color por banda, vídeo de portada, «¿Qué te pasa?»
   con el WhatsApp escrito, revisiones y boletines, «¿Llegáis hoy?» con la hora real, estado del pie y paneles que entran.
   Sin JS o con «reducir movimiento»: todo se ve quieto y completo. Es una muestra: los mensajes se abren en WhatsApp, no se envía nada. */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var G = !R && window.gsap && window.ScrollTrigger;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var waUrl = function (txt) { return "https://wa.me/" + T.wa + "?text=" + encodeURIComponent(txt); };
  var hm = function (m) { return Math.floor(m / 60) + ":" + ("0" + (m % 60)).slice(-2); };
  function ahora() {
    /* hora de Tolosaldea, aunque quien mire esté en otra zona */
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: +o.hour * 60 + +o.minute };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes() }; }
  }
  function salta(el) { if (R || !el) return; el.classList.remove("salta"); void el.offsetWidth; el.classList.add("salta"); }

  /* ---------- cabecera: blanca sobre bandas oscuras, negra sobre las blancas ---------- */
  var cab = $("[data-cab]");
  if (cab) {
    var pendiente = false;
    var tono = function () {
      pendiente = false;
      var y = Math.min(34, innerHeight * 0.05), x = innerWidth / 2, t = "oscuro";
      var pila = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [];
      for (var i = 0; i < pila.length; i++) {
        if (cab.contains(pila[i])) continue;
        var b = pila[i].closest("[data-tono]");
        if (b) { t = b.getAttribute("data-tono"); break; }
      }
      if (cab.getAttribute("data-tono") !== t) cab.setAttribute("data-tono", t);
    };
    addEventListener("scroll", function () { if (!pendiente) { pendiente = true; requestAnimationFrame(tono); } }, { passive: true });
    addEventListener("resize", tono);
    tono();
  }

  /* ---------- menú del móvil ---------- */
  var hb = $(".hamb"), m = document.getElementById("desplegable");
  if (hb && m) {
    var cierra = function () { m.classList.remove("abierto"); hb.setAttribute("aria-expanded", "false"); hb.setAttribute("aria-label", T.menu); };
    hb.addEventListener("click", function () { var ab = m.classList.toggle("abierto"); hb.setAttribute("aria-expanded", ab); hb.setAttribute("aria-label", ab ? T.cerrar : T.menu); });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) cierra(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && m.classList.contains("abierto")) { cierra(); hb.focus(); } });
  }

  /* ---------- vídeo de la portada: solo si no hay «reducir movimiento»; se para fuera de pantalla ---------- */
  var v = $("[data-video]");
  if (v && !R) {
    var arranca = function () { v.preload = "auto"; var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    v.addEventListener("playing", function () { v.classList.add("on"); }, { once: true });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { if (e[0].isIntersecting) arranca(); else v.pause(); }).observe(v.closest("section"));
    else arranca();
  }

  /* ---------- ¿qué te pasa?: elegir la avería, la dirección y el WhatsApp escrito ---------- */
  var pista = $("[data-pista-av]"), dirIn = $("[data-dir]");
  var tarjetas = $$(".av"), pests = $$(".pest");
  var escritas = {};
  /* en el ordenador (con GSAP) la sección se queda fija y las tarjetas pasan de lado: fijo = su ScrollTrigger; recorrido = px que corren */
  var fijo = null;
  var recorrido = function () { var u = tarjetas[tarjetas.length - 1]; return u.offsetLeft + u.offsetWidth; };
  var dir = function () { return dirIn ? dirIn.value.trim() : ""; };
  function pintaDir() {
    var d = dir();
    tarjetas.forEach(function (c) {
      var b = $("[data-msg-dir]", c);
      b.textContent = d || T.wa_sin_dir;
      b.classList.toggle("vacio", !d);
      $("[data-wa-av]", c).href = waUrl(T.av[c.getAttribute("data-k")] + "\n" + T.wa_dir.replace("{dir}", d));
    });
  }
  function escribe(c) {
    var k = c.getAttribute("data-k");
    if (escritas[k]) return;
    escritas[k] = true;
    if (R) return;
    c.classList.add("escribe");
    setTimeout(function () { c.classList.remove("escribe"); salta($("[data-wa-av]", c)); }, 950);
  }
  function activa(k, desplaza) {
    pests.forEach(function (b) {
      var on = b.getAttribute("data-k") === k;
      if (on && b.getAttribute("aria-pressed") !== "true") salta(b);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var c = document.getElementById("av-" + k);
    tarjetas.forEach(function (t) { if (t === c) t.setAttribute("data-activa", ""); else t.removeAttribute("data-activa"); });
    if (desplaza && fijo) {
      /* fija: se baja la página hasta el punto en que esa tarjeta ocupa el sitio de la primera */
      var y = fijo.start + (c.offsetLeft - tarjetas[0].offsetLeft) * (fijo.end - fijo.start) / recorrido();
      window.scrollTo({ top: Math.ceil(y) + 1, behavior: R ? "auto" : "smooth" });
    } else if (desplaza && pista) {
      var pad = parseFloat(getComputedStyle(pista).paddingLeft) || 0;
      pista.scrollTo({ left: c.offsetLeft - pad, behavior: R ? "auto" : "smooth" });
    }
    escribe(c);
  }
  if (pista && tarjetas.length) {
    if (dirIn) { dirIn.addEventListener("input", pintaDir); pintaDir(); }
    pests.forEach(function (b) { b.addEventListener("click", function () { activa(b.getAttribute("data-k"), true); }); });
    /* con el teclado: al entrar en una tarjeta que no se ve, se trae a la vista */
    tarjetas.forEach(function (t) { t.addEventListener("focusin", function () { if (fijo && !t.hasAttribute("data-activa")) activa(t.getAttribute("data-k"), true); }); });
    var espera;
    pista.addEventListener("scroll", function () {
      clearTimeout(espera);
      espera = setTimeout(function () {
        var pad = parseFloat(getComputedStyle(pista).paddingLeft) || 0, x = pista.scrollLeft + pad, mejor = tarjetas[0], d0 = 1e9;
        tarjetas.forEach(function (t) { var d = Math.abs(t.offsetLeft - x); if (d < d0) { d0 = d; mejor = t; } });
        if (!mejor.hasAttribute("data-activa")) activa(mejor.getAttribute("data-k"), false);
      }, 140);
    }, { passive: true });
    if ("IntersectionObserver" in window) {
      var vista = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { escribe($(".av[data-activa]") || tarjetas[0]); vista.disconnect(); }
      }, { threshold: 0.45 });
      vista.observe(pista);
    } else escritas[tarjetas[0].getAttribute("data-k")] = true;
  }

  /* ---------- revisiones y boletines: pulsar para ver, año de la última revisión, para qué es el boletín ---------- */
  $$("[data-srv]").forEach(function (s) {
    var b = $(".srv-boton", s);
    b.addEventListener("click", function () {
      var ab = !s.classList.contains("abierta");
      s.classList.toggle("abierta", ab);
      b.setAttribute("aria-expanded", ab ? "true" : "false");
    });
  });
  var sel = $("[data-ultima]"), res = $("[data-res]"), waRev = $("[data-wa-rev]");
  if (sel && res && waRev) {
    var anio = new Date().getFullYear(), ops = '<option value="">—</option>';
    for (var a = anio; a > anio - 8; a--) ops += '<option value="' + a + '">' + a + "</option>";
    sel.innerHTML = ops + '<option value="x">' + T.rev_no_se + "</option>";
    sel.addEventListener("change", function () {
      var val = sel.value, t = "", msg = T.rev_wa;
      if (val === "x") t = T.rev_no_se_r;
      else if (val) {
        var prox = +val + 2;
        t = prox <= anio ? T.rev_toca_ya : T.rev_toca_en.replace("{a}", prox);
        msg += " " + T.rev_wa_ultima.replace("{a}", val);
      }
      res.textContent = t;
      salta(res);
      waRev.href = waUrl(msg);
    });
  }
  var waBol = $("[data-wa-bol]");
  $$('input[name="bol"]').forEach(function (r) {
    r.addEventListener("change", function () {
      if (!r.checked || !waBol) return;
      waBol.href = waUrl(T.bol_wa.replace("{para}", r.value.charAt(0).toLowerCase() + r.value.slice(1)));
      salta(r.nextElementSibling);
    });
  });

  /* ---------- ¿llegáis hoy?: por pueblo, con la hora real (lunes a viernes, 8:00–19:00 de ejemplo) ---------- */
  var son = $("[data-son]"), pueblos = $$(".pueblo"), est = $("[data-estado]"), estTxt = $("[data-estado-txt]");
  function pinta() {
    var a = ahora(), lab = a.dia >= 1 && a.dia <= 5;
    if (son) son.textContent = T.hoy_son.replace("{h}", hm(a.min));
    pueblos.forEach(function (p) {
      var corte = +p.getAttribute("data-corte"), hoy = lab && a.min < corte, e = $("[data-est]", p);
      if (hoy) { e.innerHTML = "<b>" + T.hoy_hoy + ",</b>" + T.hoy_antes.replace("{h}", hm(corte)); e.setAttribute("data-hoy", ""); }
      else { e.innerHTML = "<b>" + (a.dia === 5 || a.dia === 6 ? T.hoy_lunes : T.hoy_manana) + "</b>"; e.removeAttribute("data-hoy"); }
      p.href = waUrl((hoy ? T.hoy_wa_hoy : T.hoy_wa_otro) + "\n" + T.hoy_wa_pueblo.replace("{pueblo}", p.getAttribute("data-pueblo")));
    });
    if (est && estTxt) {
      var ab = lab && a.min >= 480 && a.min < 1140;
      est.classList.toggle("abierto", ab);
      estTxt.textContent = ab ? T.pie_abierto : T.pie_cerrado;
    }
  }
  pinta();
  setInterval(pinta, 30000);

  /* ---------- paneles que entran al asomar (por tiempo, una vez) ---------- */
  if (!G) return;
  gsap.registerPlugin(ScrollTrigger);

  /* «¿Qué te pasa?» en el ordenador, como la referencia: la sección se queda fija, la palabra gigante quieta detrás y las cuatro
     tarjetas pasan de derecha a izquierda al bajar, hasta dejar la palabra sola. La que llega a su sitio se activa y «escribe». */
  var secAv = $(".averias");
  if (secAv && pista && tarjetas.length) {
    gsap.matchMedia().add("(min-width: 900px) and (min-height: 640px)", function () {
      secAv.classList.add("fijo");
      pista.scrollLeft = 0;
      var tw = gsap.to(pista, {
        x: function () { return -recorrido(); }, ease: "none",
        scrollTrigger: {
          trigger: secAv, start: "top top", end: function () { return "+=" + recorrido(); }, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (st) {
            var x = st.progress * recorrido(), x0 = tarjetas[0].offsetLeft, mejor = tarjetas[0], d0 = 1e9;
            tarjetas.forEach(function (t) { var d = Math.abs(t.offsetLeft - x0 - x); if (d < d0) { d0 = d; mejor = t; } });
            if (!mejor.hasAttribute("data-activa")) activa(mejor.getAttribute("data-k"), false);
          }
        }
      });
      fijo = tw.scrollTrigger;
      return function () { fijo = null; secAv.classList.remove("fijo"); };
    });
  }

  var una = function (trigger, start) { return { trigger: trigger, start: start || "top 86%", once: true }; };
  if (pista) gsap.from(tarjetas, { y: 70, opacity: 0, scale: 0.96, transformOrigin: "50% 100%", duration: 1.2, ease: "power3.out", stagger: 0.1, clearProps: "transform,opacity", scrollTrigger: una(pista, "top 88%") });
  var cabAv = $(".av-controles");
  if (cabAv) gsap.from(cabAv.children, { y: 24, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.1, clearProps: "transform,opacity", scrollTrigger: una(cabAv, "top 90%") });
  var enl = $(".enl-raya i");
  if (enl) gsap.from(enl, { scaleX: 0, duration: 1.3, ease: "power3.out", clearProps: "transform", scrollTrigger: una(enl, "top 92%") });
  var lista = $("[data-pueblos]");
  if (lista) {
    var tl = gsap.timeline({ scrollTrigger: una(lista, "top 85%") });
    tl.from($$(".linea", lista), { scaleX: 0, duration: 1.2, ease: "power3.inOut", stagger: 0.07 }, 0)
      .from($$(".pueblo > span", lista), { y: 22, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.025, clearProps: "transform,opacity" }, 0.25);
  }
  $$(".fila").forEach(function (f) {
    var foto = $("[data-foto]", f), img = $("img", f);
    var t2 = gsap.timeline({ scrollTrigger: una(f, "top 88%") });
    t2.from($(".linea", f), { scaleX: 0, duration: 1.1, ease: "power3.inOut" }, 0)
      .fromTo(foto, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut", clearProps: "clipPath" }, 0.1)
      .from(img, { scale: 1.16, duration: 1.6, ease: "power3.out", clearProps: "transform" }, 0.1)
      .from([$("h3", f), $(".f-txt", f)], { y: 20, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, clearProps: "transform,opacity" }, 0.35);
  });
  var pieM = $(".pie-rej");
  if (pieM) gsap.from(pieM.children, { y: 30, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.08, clearProps: "transform,opacity", scrollTrigger: una(pieM, "top 95%") });
})();
