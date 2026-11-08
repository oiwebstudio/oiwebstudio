/* ZIDOR · muestra de casa rural (OI Studio, 8/11/2026).
   Cabecera que se vuelve blanca al dejar la portada, menú a pantalla completa, calendario con las noches libres desde hoy
   (ocupación de ejemplo, siempre la misma para cada fecha), llegada + noches + personas → precio orientativo y el mensaje de
   WhatsApp ya escrito, y paneles que entran al asomar. Sin JS o con «reducir movimiento»: todo se ve quieto y completo.
   Es una muestra: no se envía nada a ningún sitio. */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EU = T.lang === "eu";
  var EASE = "cubic-bezier(.2,.75,.25,1)";
  var anima = function (el, k, o) { if (!R && el && el.animate) el.animate(k, o); };

  /* ---------- cabecera: blanca y con el nombre cuando la portada ya ha pasado por debajo ---------- */
  var cab = document.querySelector("[data-cab]"), port = document.querySelector("[data-portada]"), nom = document.querySelector(".cab-nombre");
  function solida(on) { cab.classList.toggle("solida", on); if (nom) nom.tabIndex = on ? 0 : -1; }
  if (cab && port && "IntersectionObserver" in window) {
    var io = null;
    var mira = function () {
      if (io) io.disconnect();
      io = new IntersectionObserver(function (e) { solida(!e[0].isIntersecting); }, { rootMargin: "-" + (cab.offsetHeight + 150) + "px 0px 0px 0px" } /* como la referencia: se vuelve blanca un poco antes de que la portada acabe de pasar */);
      io.observe(port);
    };
    mira(); addEventListener("resize", function () { clearTimeout(mira.t); mira.t = setTimeout(mira, 200); });
  } else if (cab) solida(true);

  /* ---------- menú a pantalla completa ---------- */
  var panel = document.querySelector("[data-panel-menu]"), abrir = document.querySelector("[data-menu-abrir]"), cerrarB = document.querySelector("[data-menu-cerrar]");
  if (panel && abrir && cerrarB) {
    abrir.setAttribute("role", "button");
    var abierto = false;
    var cierra = function (volver) {
      if (!abierto) return; abierto = false;
      abrir.setAttribute("aria-expanded", "false");
      document.documentElement.style.overflow = "";
      var fin = function () { panel.hidden = true; if (volver) abrir.focus(); };
      if (R || !panel.animate) fin();
      else panel.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 100% 0)" }], { duration: 420, easing: "cubic-bezier(.6,0,.3,1)" }).onfinish = fin;
    };
    abrir.addEventListener("click", function (e) {
      e.preventDefault(); abierto = true;
      panel.hidden = false; abrir.setAttribute("aria-expanded", "true");
      document.documentElement.style.overflow = "hidden";
      anima(panel, [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 620, easing: "cubic-bezier(.6,0,.2,1)" });
      panel.querySelectorAll(".panel-lista li, .panel-tel").forEach(function (li, i) {
        anima(li, [{ opacity: 0, transform: "translateY(36px)" }, { opacity: 1, transform: "none" }], { duration: 800, delay: 180 + i * 60, easing: EASE, fill: "backwards" });
      });
      cerrarB.focus();
    });
    cerrarB.addEventListener("click", function () { cierra(true); });
    panel.addEventListener("click", function (e) { if (e.target.closest("a[href^='#']")) cierra(false); });
    document.addEventListener("keydown", function (e) {
      if (!abierto) return;
      if (e.key === "Escape") cierra(true);
      if (e.key === "Tab") { /* el foco no sale del menú */
        var f = panel.querySelectorAll("a, button"), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
  }

  /* ---------- fechas (hora de Madrid) ---------- */
  function hoyMadrid() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return new Date(+o.year, +o.month - 1, +o.day);
    } catch (e) { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  }
  var HOY = hoyMadrid();
  var mas = function (d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; };
  var iso = function (d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); };
  var lun0 = function (d) { return (d.getDay() + 6) % 7; }; /* lunes = 0 */
  function largo(d) { /* «viernes 13 de noviembre» · «ostirala, 2026/11/13» */
    var dia = T.dias[lun0(d)];
    if (EU) return dia + ", " + d.getFullYear() + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2);
    return dia + " " + d.getDate() + " de " + T.meses[d.getMonth()];
  }

  /* ocupación de ejemplo: la misma para cada fecha en todas las visitas; más llena los viernes y sábados */
  function azar(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; }
  var OCUP = {};
  (function () {
    var prev = false;
    for (var k = -40; k < 260; k++) {
      var d = mas(HOY, k), w = d.getDay(), s = iso(d);
      var p = (w === 5 || w === 6) ? 0.42 : 0.12;
      var o = azar(s + "zidor") < p || (prev && azar(s + "sigue") < 0.4);
      if (k >= 0 && k <= 2) o = false; /* hoy y los dos días siguientes, libres: que se pueda probar en el momento */
      OCUP[s] = o; prev = o;
    }
  })();
  var ocupada = function (d) { return !!OCUP[iso(d)]; };

  /* ---------- reservar ---------- */
  var form = document.querySelector("[data-reserva]"), cal = document.querySelector("[data-cal]");
  if (!form || !cal) return;
  var mesesEl = cal.querySelector("[data-meses]"), ant = cal.querySelector("[data-mes-ant]"), sig = cal.querySelector("[data-mes-sig]");
  var llegEl = form.querySelector("[data-llegada]"), nochEl = form.querySelector("[data-noches]"), persEl = form.querySelector("[data-personas]");
  var bMenosN = form.querySelector("[data-menos-n]"), bMasN = form.querySelector("[data-mas-n]"), bMenosP = form.querySelector("[data-menos-p]"), bMasP = form.querySelector("[data-mas-p]");
  var pNoche = form.querySelector("[data-precio-noche]"), pTotal = form.querySelector("[data-precio-total]"), aviso = form.querySelector("[data-aviso]");
  var caja = form.querySelector(".mensaje"), msgEl = form.querySelector("[data-mensaje]"), was = document.querySelectorAll("[data-wa]");
  var dos = matchMedia("(min-width: 900px)");
  var MAX_MES = 7, MAX_N = 14, MAX_P = 8;
  var st = { llegada: null, noches: 2, personas: 2, mes: 0 };
  var temporizador = 0;

  /* para que se vea funcionando nada más llegar: el primer viernes con dos noches libres */
  (function () {
    for (var k = 3; k < 90; k++) {
      var d = mas(HOY, k);
      if (d.getDay() === 5 && !ocupada(d) && !ocupada(mas(d, 1))) { st.llegada = d; break; }
    }
  })();

  function precio(d0, n, p) {
    var total = 0;
    for (var i = 0; i < n; i++) {
      var w = d0 ? mas(d0, i).getDay() : 1;
      total += 90 + Math.max(0, Math.min(p, 6) - 2) * 25 + ((w === 5 || w === 6) ? 15 : 0);
    }
    return total;
  }
  function choca() {
    if (!st.llegada) return false;
    for (var i = 0; i < st.noches; i++) if (ocupada(mas(st.llegada, i))) return true;
    return false;
  }

  function pintaMeses(entrada) {
    var n = dos.matches ? 2 : 1, html = "";
    for (var m = 0; m < n; m++) {
      var base = new Date(HOY.getFullYear(), HOY.getMonth() + st.mes + m, 1);
      html += '<div class="mes"><h3>' + T.meses[base.getMonth()] + " " + base.getFullYear() + '</h3><div class="semana" aria-hidden="true">' +
        T.cortos.map(function (c) { return "<span>" + c + "</span>"; }).join("") + '</div><div class="dias">';
      for (var b = 0; b < lun0(base); b++) html += "<span></span>";
      var dias = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
      for (var dd = 1; dd <= dias; dd++) {
        var d = new Date(base.getFullYear(), base.getMonth(), dd), s = iso(d), pas = d < HOY, oc = !pas && ocupada(d);
        var cls = "d" + (pas ? " pasado" : "") + (oc ? " ocupada" : "") + (s === iso(HOY) ? " hoy" : "");
        var lab = largo(d) + (oc ? " · " + T.ley_ocupada : pas ? "" : " · " + T.ley_libre);
        html += '<button type="button" class="' + cls + '" data-iso="' + s + '"' + (pas || oc ? " disabled" : "") + ' aria-label="' + lab + '" aria-pressed="false">' + dd + "</button>";
      }
      html += "</div></div>";
    }
    mesesEl.innerHTML = html;
    ant.disabled = st.mes <= 0; sig.disabled = st.mes >= MAX_MES - n;
    marca();
    if (entrada) mesesEl.querySelectorAll(".mes").forEach(function (m, i) {
      anima(m, [{ opacity: 0, transform: "translateX(" + (entrada * 28) + "px)" }, { opacity: 1, transform: "none" }], { duration: 520, delay: i * 70, easing: EASE, fill: "backwards" });
    });
  }
  function marca() {
    var ini = st.llegada ? iso(st.llegada) : "", fin = st.llegada ? iso(mas(st.llegada, st.noches)) : "", c = choca();
    mesesEl.querySelectorAll(".d").forEach(function (b) {
      var s = b.getAttribute("data-iso"), dentro = ini && s >= ini && s < fin;
      b.classList.toggle("rango", !!dentro); b.classList.toggle("choca", !!(dentro && c));
      b.classList.toggle("llegada", s === ini); b.classList.toggle("salida", s === fin);
      b.setAttribute("aria-pressed", s === ini ? "true" : "false");
    });
  }

  function rueda(el, txt, dir) {
    if (el.textContent === String(txt)) return;
    el.textContent = txt;
    anima(el, [{ transform: "translateY(" + (dir > 0 ? 45 : -45) + "%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 300, easing: EASE });
  }

  function escribe(inmediato) {
    var n = st.noches, p = st.personas, total = precio(st.llegada, n, p);
    var porNoche = Math.round(total / n), c = choca();
    llegEl.textContent = st.llegada ? largo(st.llegada) : T.sin_llegada;
    bMenosN.disabled = n <= 1; bMasN.disabled = n >= MAX_N; bMenosP.disabled = p <= 1; bMasP.disabled = p >= MAX_P;
    var tn = T.precio_noche.replace("{p}", porNoche), tt = T.precio_total.replace("{t}", total);
    if (pNoche.textContent !== tn) { pNoche.textContent = tn; anima(pNoche, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: EASE }); }
    pTotal.textContent = tt;
    var av = c ? T.aviso_ocupada : (p > 6 ? T.aviso_muchos : "");
    if (aviso.textContent !== av) { aviso.textContent = av; if (av) anima(aviso, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 }); }
    var l = [T.wa_hola];
    if (st.llegada) { l.push(T.wa_llegada + ": " + largo(st.llegada)); l.push(T.wa_salida + ": " + largo(mas(st.llegada, n))); }
    l.push(T.wa_noches + ": " + n); l.push(T.wa_personas + ": " + p);
    if (p <= 6) l.push(T.wa_precio + ": " + total + " €");
    l.push(T.wa_pregunta);
    var msg = l.join("\n"), href = T.wa + "?text=" + encodeURIComponent(msg);
    was.forEach(function (w) { w.href = href; });
    clearTimeout(temporizador);
    if (inmediato || R) { caja.classList.remove("escribe"); msgEl.textContent = msg; return; }
    caja.classList.add("escribe");
    temporizador = setTimeout(function () {
      msgEl.textContent = msg; caja.classList.remove("escribe");
      anima(msgEl, [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: EASE });
    }, 520);
  }

  mesesEl.addEventListener("click", function (e) {
    var b = e.target.closest(".d"); if (!b || b.disabled) return;
    var p = b.getAttribute("data-iso").split("-");
    st.llegada = new Date(+p[0], +p[1] - 1, +p[2]);
    marca(); escribe();
    anima(b, [{ transform: "scale(.82)" }, { transform: "scale(1.08)" }, { transform: "none" }], { duration: 340, easing: EASE });
  });
  bMenosN.addEventListener("click", function () { if (st.noches > 1) { st.noches--; rueda(nochEl, st.noches, -1); marca(); escribe(); } });
  bMasN.addEventListener("click", function () { if (st.noches < MAX_N) { st.noches++; rueda(nochEl, st.noches, 1); marca(); escribe(); } });
  bMenosP.addEventListener("click", function () { if (st.personas > 1) { st.personas--; rueda(persEl, st.personas, -1); escribe(); } });
  bMasP.addEventListener("click", function () { if (st.personas < MAX_P) { st.personas++; rueda(persEl, st.personas, 1); escribe(); } });
  ant.addEventListener("click", function () { if (st.mes > 0) { st.mes--; pintaMeses(-1); } });
  sig.addEventListener("click", function () { if (st.mes < MAX_MES - (dos.matches ? 2 : 1)) { st.mes++; pintaMeses(1); } });
  (dos.addEventListener ? dos.addEventListener.bind(dos, "change") : dos.addListener.bind(dos))(function () { st.mes = Math.min(st.mes, MAX_MES - (dos.matches ? 2 : 1)); pintaMeses(0); });

  /* el mes de la llegada propuesta, a la vista */
  if (st.llegada) st.mes = Math.max(0, (st.llegada.getFullYear() - HOY.getFullYear()) * 12 + st.llegada.getMonth() - HOY.getMonth() - (dos.matches ? 1 : 0));
  cal.hidden = false;
  var sinjs = document.querySelector("[data-cal-sinjs]"); /* el respaldo sin JS («escríbenos las fechas por WhatsApp») sobra con el calendario */
  if (sinjs) sinjs.parentNode.removeChild(sinjs);
  nochEl.textContent = st.noches; persEl.textContent = st.personas;
  pintaMeses(0); escribe(true);
})();

/* ---------- movimiento de lo de abajo (por tiempo al asomar) ---------- */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var visto = function (el) { return el.getBoundingClientRect().top < innerHeight; }; /* lo que ya se ve al cargar, quieto */
  var port = document.querySelector("[data-portada]"), foto = document.querySelector("[data-portada-foto]");
  if (port && foto) gsap.to(foto, { yPercent: 14, ease: "none", scrollTrigger: { trigger: port, start: "top top", end: "bottom top", scrub: true } });
  document.querySelectorAll('[data-panel="foto"]').forEach(function (el) {
    if (visto(el)) return;
    var img = el.querySelector("img");
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    tl.fromTo(el, { clipPath: "inset(12% 6% 0% 6%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power3.out", clearProps: "clipPath" });
    if (img) tl.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 2, ease: "power3.out", clearProps: "transform" }, 0);
  });
  document.querySelectorAll("[data-collage]").forEach(function (col) {
    var fs = col.querySelectorAll(".c");
    if (!visto(col)) gsap.from(fs, { y: function (i) { return 70 + i * 40; }, opacity: 0, duration: 1.3, ease: "power3.out", stagger: 0.16, clearProps: "transform,opacity", scrollTrigger: { trigger: col, start: "top 82%", once: true } });
    fs.forEach(function (f, i) { /* cada foto del collage se queda atrás a su ritmo */
      var img = f.querySelector("img"); if (!img) return;
      gsap.fromTo(img, { yPercent: -5 - i * 2, scale: 1.14 }, { yPercent: 5 + i * 2, scale: 1.14, ease: "none", scrollTrigger: { trigger: col, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });
  document.querySelectorAll(".raya i").forEach(function (i) {
    if (visto(i)) return;
    gsap.from(i, { scaleX: 0, duration: 1.1, ease: "power3.out", delay: 0.25, clearProps: "transform", scrollTrigger: { trigger: i, start: "top 92%", once: true } });
  });
  [".texto > p", ".banda .raya", ".res-p", ".cal", ".res-elige"].forEach(function (s) {
    document.querySelectorAll(s).forEach(function (el) {
      if (visto(el)) return;
      gsap.from(el, { y: 26, opacity: 0, duration: 1.1, ease: "power3.out", delay: 0.12, clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });
  });
  var marca = document.querySelector(".pie-marca");
  if (marca && !visto(marca)) gsap.from(marca, { yPercent: 40, opacity: 0, duration: 1.3, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: marca, start: "top 96%", once: true } });
})();
