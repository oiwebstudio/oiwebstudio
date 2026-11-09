/* UZTAI · lo que reacciona: menú, lista de reservas (la «cesta»), encargo de alianzas con talla, metal y grabado,
   estado de la tienda con la hora real y entrada de las fotos al bajar. Sin JS la página se lee entera. */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var coma = function (n) { return T.lang === "eu" || T.lang === "es" ? String(n).replace(".", ",") : String(n); };
  var reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ano = $("[data-ano]"); if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- menú ---------- */
  var cab = $("[data-cab]"), bMenu = $("[data-menu]");
  function menu(abrir) { cab.classList.toggle("abierta", abrir); bMenu.setAttribute("aria-expanded", abrir ? "true" : "false"); }
  bMenu.addEventListener("click", function () { menu(!cab.classList.contains("abierta")); });
  $$(".mega a").forEach(function (a) { a.addEventListener("click", function () { menu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (cab.classList.contains("abierta")) { menu(false); bMenu.focus(); } cerrarLista(); } });

  /* ---------- lista ---------- */
  var CLAVE = "uztai-lista", lista = [];
  try { lista = JSON.parse(localStorage.getItem(CLAVE) || "[]"); } catch (e) { lista = []; }
  var cajon = $("[data-cajon]"), velo = $("[data-velo]"), ultimoFoco = null;
  function precioTxt(it) { return it.tipo === "taller" ? T.precio_tpl.replace("{n}", it.precio) : it.precio + " €"; }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(lista)); } catch (e) {} }
  function pintarLista(saltar) {
    $$("[data-n]").forEach(function (n) {
      n.textContent = lista.length;
      if (saltar && !reducir && n.closest(".cab-lista")) { n.classList.remove("salta"); void n.offsetWidth; n.classList.add("salta"); }
    });
    $$("[data-anadir]").forEach(function (b) {
      var esta = lista.some(function (x) { return x.k === b.dataset.anadir; });
      b.setAttribute("aria-pressed", esta ? "true" : "false");
    });
    var ul = $("[data-lista-items]");
    ul.innerHTML = "";
    if (!lista.length) { var v = document.createElement("li"); v.className = "vacio"; v.textContent = T.lista_vacia; ul.appendChild(v); }
    lista.forEach(function (it) {
      var li = document.createElement("li");
      var n = document.createElement("span"); n.textContent = it.nombre;
      var p = document.createElement("span"); p.className = "p"; p.textContent = precioTxt(it);
      var q = document.createElement("button"); q.type = "button"; q.className = "enl-btn"; q.textContent = T.quitar;
      q.addEventListener("click", function () { quitar(it.k); });
      li.appendChild(n); li.appendChild(p); li.appendChild(q); ul.appendChild(li);
    });
    var total = lista.reduce(function (s, x) { return s + x.precio; }, 0);
    var hayTaller = lista.some(function (x) { return x.tipo === "taller"; });
    $("[data-lista-total]").textContent = total ? (hayTaller ? T.precio_tpl.replace("{n}", total) : total + " €") : "0 €";
    var msg = lista.length ? T.msg_lista_1 + "\n" + lista.map(function (x) { return "– " + x.nombre + " (" + precioTxt(x) + ")"; }).join("\n") + "\n" + T.msg_lista_fin : "";
    var pm = $("[data-lista-msg]"); pm.textContent = msg; pm.hidden = !msg;
    var wa = $("[data-wa-lista]");
    wa.href = T.wa + (msg ? "?text=" + encodeURIComponent(msg) : "");
    wa.toggleAttribute("aria-disabled", !msg);
  }
  function quitar(k) { lista = lista.filter(function (x) { return x.k !== k; }); guardar(); pintarLista(false); }
  $$("[data-anadir]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.dataset.anadir;
      if (lista.some(function (x) { return x.k === k; })) { quitar(k); return; }
      lista.push({ k: k, nombre: b.dataset.nombre, precio: +b.dataset.precio, tipo: b.dataset.tipo });
      guardar(); pintarLista(true);
    });
  });
  function abrirLista() {
    ultimoFoco = document.activeElement; menu(false);
    velo.hidden = false; cajon.hidden = false;
    $$("[data-abrir-lista]").forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { velo.classList.add("on"); cajon.classList.add("on"); }); });
    document.body.style.overflow = "hidden";
    $("[data-cerrar-lista]").focus();
  }
  function cerrarLista() {
    if (cajon.hidden) return;
    velo.classList.remove("on"); cajon.classList.remove("on");
    $$("[data-abrir-lista]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    document.body.style.overflow = "";
    setTimeout(function () { velo.hidden = true; cajon.hidden = true; }, reducir ? 0 : 450);
    if (ultimoFoco) ultimoFoco.focus();
  }
  $$("[data-abrir-lista]").forEach(function (b) { b.addEventListener("click", abrirLista); });
  $("[data-cerrar-lista]").addEventListener("click", cerrarLista);
  velo.addEventListener("click", cerrarLista);
  cajon.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    var f = $$("a[href],button,input", cajon).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
  pintarLista(false);

  /* ---------- encargo de alianzas ---------- */
  var form = $("[data-encargo]");
  if (form) {
    var K = 5.8;                      /* px del dibujo por mm */
    var GROSOR = { plana: 13, media: 19, ancha: 27 };
    var MODELOS = ["plana", "media", "ancha"];
    var METAL = { plata: ["#f6f6f6", "#9c9c9c", "#ececec", "#6f6f6f"], oro: ["#f8e6ae", "#b48a36", "#f3d88e", "#8a6322"], blanco: ["#fdfcf8", "#b4b0a6", "#f1efe9", "#8c887f"] };
    var diam = $("[data-diam]"), grab = $("[data-grab]");
    var talla = 14, mm = 17.2;
    var actual = { r: 0, g: 0 }, meta = { r: 0, g: 0 }, anim = null;
    var tallaDeMm = function (d) { return Math.round(Math.PI * d - 40); };
    var mmDeTalla = function (t) { return Math.round((t + 40) / Math.PI * 10) / 10; };
    var sel = function (n) { var x = form.querySelector('input[name="' + n + '"]:checked'); return x ? x.value : null; };
    function dibujar() {
      var cx = 200, cy = 240, rIn = actual.r, g = actual.g, rMid = rIn + g / 2;
      $("[data-aro]").setAttribute("r", rMid.toFixed(1)); $("[data-aro]").setAttribute("stroke-width", g.toFixed(1));
      $("[data-sombra]").setAttribute("r", rMid.toFixed(1)); $("[data-sombra]").setAttribute("stroke-width", (g * .9).toFixed(1));
      $("[data-brillo]").setAttribute("r", (rIn + 1).toFixed(1));
      var ra = rIn - 14;
      $("[data-arco]").setAttribute("d", "M " + (cx - ra).toFixed(1) + " " + cy + " A " + ra.toFixed(1) + " " + ra.toFixed(1) + " 0 0 1 " + (cx + ra).toFixed(1) + " " + cy);
      var x1 = cx - rIn + 2, x2 = cx + rIn - 2;
      $("[data-cota]").setAttribute("x1", x1); $("[data-cota]").setAttribute("x2", x2);
      ["a", "b"].forEach(function (s, i) { var l = $("[data-cota-" + s + "]"); var x = i ? x2 : x1; l.setAttribute("x1", x); l.setAttribute("x2", x); });
    }
    function animar() {
      if (anim) return;
      var paso = function () {
        var hecho = true;
        ["r", "g"].forEach(function (k) { var d = meta[k] - actual[k]; if (Math.abs(d) > .05) { actual[k] += d * .16; hecho = false; } else actual[k] = meta[k]; });
        dibujar();
        anim = hecho ? null : requestAnimationFrame(paso);
      };
      anim = requestAnimationFrame(paso);
    }
    function actualizar(origen) {
      var modelo = sel("modelo"), metal = sel("metal");
      if (origen === "diam") { mm = +diam.value; talla = tallaDeMm(mm); }
      else if (origen === "talla") { mm = mmDeTalla(talla); diam.value = mm; }
      var mmTxt = coma(mm.toFixed(1)) + " mm";
      $("[data-talla-n]").textContent = talla;
      $("[data-mm]").textContent = mmTxt;
      $("[data-mm-pie]").textContent = mmTxt;
      $("[data-cota-txt]").textContent = mmTxt;
      $("[data-talla-pie]").textContent = T.talla_tpl.replace("{t}", talla);
      diam.setAttribute("aria-valuetext", mmTxt + " · " + T.talla_tpl.replace("{t}", talla));
      var c = METAL[metal];
      ["s0", "s1", "s2", "s3"].forEach(function (s, i) { $("[data-" + s + "]").setAttribute("stop-color", c[i]); });
      var g = (grab.value || "").trim().toUpperCase();
      $("[data-grabado-svg]").textContent = g;
      var precio = T.alianzas[metal][MODELOS.indexOf(modelo)];
      var pTxt = T.precio_tpl.replace("{n}", precio);
      $("[data-precio-enc]").textContent = pTxt; $("[data-precio-pie]").textContent = pTxt;
      var msg = T.msg_enc_tpl
        .replace("{alianza}", T.alianza[modelo].replace("{metal}", T.metal_msg[metal]))
        .replace("{t}", talla).replace("{mm}", coma(mm.toFixed(1)))
        .replace("{grab}", g ? T.grab_con.replace("{g}", g) : T.grab_sin);
      $("[data-msg]").textContent = msg;
      $("[data-wa-enc]").href = T.wa + "?text=" + encodeURIComponent(msg);
      meta.r = mm / 2 * K * 2; meta.g = GROSOR[modelo];
      if (reducir || !actual.r) { actual.r = meta.r; actual.g = meta.g; dibujar(); } else animar();
    }
    $$("[data-talla]").forEach(function (b) {
      b.addEventListener("click", function () {
        talla = Math.max(4, Math.min(32, talla + +b.dataset.talla));
        var n = $("[data-talla-n]"); if (!reducir) { n.classList.remove("salta"); void n.offsetWidth; n.classList.add("salta"); }
        actualizar("talla");
      });
    });
    diam.addEventListener("input", function () { actualizar("diam"); });
    grab.addEventListener("input", function () { actualizar(); });
    $$('input[type="radio"]', form).forEach(function (r) { r.addEventListener("change", function () { actualizar(); }); });
    talla = tallaDeMm(+diam.value); mm = +diam.value;
    actualizar();
  }

  /* ---------- abierto o cerrado, con la hora de Tolosa ---------- */
  var H = { 0: [], 1: [[600, 810], [990, 1200]], 2: [[600, 810], [990, 1200]], 3: [[600, 810], [990, 1200]], 4: [[600, 810], [990, 1200]], 5: [[600, 810], [990, 1200]], 6: [[600, 840]] };
  function ahora() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: +o.hour * 60 + +o.minute };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes() }; }
  }
  var hm = function (m) { var mm = String(m % 60).padStart(2, "0"); return Math.floor(m / 60) + ":" + mm + (T.suf_hora[mm] || ""); };
  function estado() {
    var a = ahora(), f = H[a.dia], i;
    for (i = 0; i < f.length; i++) if (a.min >= f[i][0] && a.min < f[i][1]) return { on: true, t: T.estado.abierto.replace("{h}", hm(f[i][1])) };
    for (i = 0; i < f.length; i++) if (a.min < f[i][0]) return { on: false, t: T.estado.hoy.replace("{h}", hm(f[i][0])) };
    for (var d = 1; d <= 7; d++) {
      var dd = (a.dia + d) % 7;
      if (H[dd].length) return { on: false, t: (d === 1 ? T.estado.manana : T.estado.dia.replace("{d}", T.dias[dd])).replace("{h}", hm(H[dd][0][0])) };
    }
    return { on: false, t: "" };
  }
  var est = $("[data-estado]");
  function pintarEstado() { var e = estado(); est.textContent = e.t; est.classList.toggle("abierto", e.on); }
  if (est) { pintarEstado(); setInterval(pintarEstado, 60000); }

  /* ---------- fotos y paneles que entran al asomar (por tiempo, no atados al scroll) ---------- */
  if (window.gsap && window.ScrollTrigger && !reducir) {
    gsap.registerPlugin(ScrollTrigger);
    $$("[data-panel]").forEach(function (p) {
      var img = p.querySelector("img");
      var marco = p.classList.contains("marco") ? p : p.querySelector(".marco");
      var pie = p.querySelector(".pie");
      var tl = gsap.timeline({ scrollTrigger: { trigger: p, start: "top 90%", once: true } });
      tl.from(marco, { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "expo.out", clearProps: "clipPath" });
      if (img) tl.from(img, { scale: 1.12, duration: 1.6, ease: "expo.out", clearProps: "transform" }, 0);
      if (pie) tl.from(pie, { y: 10, opacity: 0, duration: .8, ease: "expo.out", clearProps: "all" }, .3);
    });
    $$(".cuatro").forEach(function (g) {
      var hijos = g.querySelectorAll("[data-panel]");
      hijos.forEach(function (h, i) { var st = ScrollTrigger.getAll().filter(function (s) { return s.trigger === h; })[0]; if (st && st.animation) st.animation.delay(i * .08); });
    });
    $$(".fila-tit p, .fila").forEach(function (e) {
      if (e.closest(".cajon")) return;
      gsap.from(e, { y: 14, opacity: 0, duration: .9, ease: "expo.out", clearProps: "all", scrollTrigger: { trigger: e, start: "top 92%", once: true } });
    });
    gsap.from(".col li", { opacity: 0, y: 8, duration: .7, ease: "expo.out", stagger: .03, clearProps: "all", scrollTrigger: { trigger: ".pie-web", start: "top 92%", once: true } });
  }
})();
