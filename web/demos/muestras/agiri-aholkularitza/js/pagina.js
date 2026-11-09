/* AGIRI · muestra de asesoría y gestoría (OI Studio, 8/11/2026).
   Cabecera negra sobre el bloque negro; la foto de la portada se vuelve a tramar al mover el ratón (solo con ratón);
   los dos próximos plazos de Hacienda Foral de Gipuzkoa calculados con el día de hoy (hora de Madrid, orientativos);
   el formulario de cita: eliges trámite → papeles que hacen falta, próximo plazo y mensaje de WhatsApp ya escrito;
   y los paneles que entran al asomar. Sin JS o con «reducir movimiento»: todo se ve quieto y completo.
   Es una muestra: no se envía nada a ningún sitio (el botón abre WhatsApp con el mensaje). */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EU = T.lang === "eu";
  var EASE = "cubic-bezier(.2,.75,.25,1)";
  var anima = function (el, k, o) { if (!R && el && el.animate) return el.animate(k, o); };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  var pad = function (n) { return ("0" + n).slice(-2); };

  /* ---------- cabecera: negra mientras el bloque negro pasa por debajo ---------- */
  var cab = document.querySelector("[data-cab]"), osc = document.querySelector("[data-oscura]");
  if (cab && osc && "IntersectionObserver" in window) {
    var io = null;
    var mira = function () {
      if (io) io.disconnect();
      var h = cab.offsetHeight;
      io = new IntersectionObserver(function (e) { cab.classList.toggle("osc", e[0].isIntersecting); }, { rootMargin: "0px 0px " + -(innerHeight - Math.round(h / 2)) + "px 0px" });
      io.observe(osc);
    };
    mira(); addEventListener("resize", function () { clearTimeout(mira.t); mira.t = setTimeout(mira, 200); });
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
  var dias = function (d) { return Math.round((d - HOY) / 864e5); };
  var lun0 = function (d) { return (d.getDay() + 6) % 7; };
  /* si el último día cae en sábado, domingo, 1 o 6 de enero o 25 de julio (fiesta en Euskadi), pasa al siguiente día hábil */
  function habil(d) {
    d = new Date(d);
    while (d.getDay() === 0 || d.getDay() === 6 || (d.getMonth() === 6 && d.getDate() === 25) || (d.getMonth() === 0 && (d.getDate() === 1 || d.getDate() === 6))) d.setDate(d.getDate() + 1);
    return d;
  }
  function masMeses(d, n) { /* 31 de agosto + 6 meses = 28 de febrero, no 3 de marzo */
    var x = new Date(d.getFullYear(), d.getMonth() + n, 1), ult = new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate();
    x.setDate(Math.min(d.getDate(), ult)); return x;
  }
  function fecha(d, conDia) { /* «martes 10 de noviembre» (y el año si no es este) · «asteartea, 2026/11/10» */
    if (EU) return (conDia ? T.dias[lun0(d)] + ", " : "") + d.getFullYear() + "/" + pad(d.getMonth() + 1) + "/" + pad(d.getDate());
    return (conDia ? T.dias[lun0(d)] + " " : "") + d.getDate() + " de " + T.meses[d.getMonth()] + (d.getFullYear() !== HOY.getFullYear() ? " de " + d.getFullYear() : "");
  }
  function cuenta(d) { var n = dias(d); return n < 0 ? T.ya_paso : n === 0 ? T.es_hoy : n === 1 ? T.es_manana : T.faltan.replace("{n}", n); }
  /* calendario fiscal de Gipuzkoa: modelo 130 el día 10 de febrero, mayo, agosto y noviembre;
     modelos 300 y 110 el 25 de abril, julio y octubre y el 31 de enero */
  function siguiente(tipo) {
    var y = HOY.getFullYear(), c = [];
    for (var a = y - 1; a <= y + 1; a++) {
      if (tipo === "130") [1, 4, 7, 10].forEach(function (m) { c.push(habil(new Date(a, m, 10))); });
      else { c.push(habil(new Date(a, 0, 31))); [3, 6, 9].forEach(function (m) { c.push(habil(new Date(a, m, 25))); }); }
    }
    c.sort(function (p, q) { return p - q; });
    for (var i = 0; i < c.length; i++) if (c[i] >= HOY) return c[i];
    return c[c.length - 1];
  }

  /* ---------- las dos fichas de plazos, ordenadas por fecha ---------- */
  var fichas = document.querySelector("[data-fichas]");
  if (fichas) {
    var lis = [].slice.call(fichas.children);
    lis.forEach(function (li) {
      var d = siguiente(li.dataset.ficha); li._d = d;
      li.querySelector("[data-fecha]").innerHTML = "<b>" + esc(fecha(d, false)) + "</b>" + esc(T.dias[lun0(d)]);
      li.querySelector("[data-falta]").textContent = cuenta(d);
    });
    lis.sort(function (a, b) { return a._d - b._d; }).forEach(function (li) { fichas.appendChild(li); });
  }

  /* ---------- la foto de la portada se vuelve a tramar al mover el ratón ---------- */
  var cv = document.querySelector("[data-trama]"), foto = document.querySelector("[data-portada-foto]");
  if (cv && foto && !R && matchMedia("(hover: hover) and (pointer: fine)").matches && matchMedia("(min-width: 700px)").matches) {
    var src = new Image();
    src.onload = function () {
      var W = src.naturalWidth, H = src.naturalHeight;
      var off = document.createElement("canvas"); off.width = W; off.height = H;
      var oc = off.getContext("2d", { willReadFrequently: true }); oc.drawImage(src, 0, 0);
      var px = oc.getImageData(0, 0, W, H).data, gris = new Float32Array(W * H);
      for (var i = 0; i < W * H; i++) gris[i] = px[i * 4] / 255;
      /* el mismo umbral que fotos.mjs (0,5 movido por un ruido fijo, hash lowbias32 del índice): en reposo, la trama sale igual que la imagen */
      var J = +cv.dataset.j || 0.4, umbral = new Float64Array(W * H);
      for (i = 0; i < W * H; i++) { var hx = i + 1; hx ^= hx >>> 16; hx = Math.imul(hx, 0x7feb352d); hx ^= hx >>> 15; hx = Math.imul(hx, 0x846ca68b); hx ^= hx >>> 16; umbral[i] = 0.5 + ((hx >>> 0) / 4294967296 - 0.5) * J; }
      cv.width = W; cv.height = H; cv.hidden = false;
      var ctx = cv.getContext("2d"), out = ctx.createImageData(W, H), f = new Float32Array(W * H), d8 = out.data;
      var caja = null, obj = { x: 0.5, y: 0.5, on: 0 }, cur = { x: 0.5, y: 0.5, on: 0 }, raf = 0;
      var medir = function () { caja = foto.getBoundingClientRect(); };
      function pinta() {
        var dx = (cur.x - 0.5) * 7, dy = (cur.y - 0.5) * 4, cx = cur.x * W, cy = cur.y * H, r2 = (W * 0.07) * (W * 0.07), k = 0.3 * cur.on;
        for (var y = 0; y < H; y++) {
          var sy = Math.min(H - 1.001, Math.max(0, y - dy)), y0 = sy | 0, fy = sy - y0;
          for (var x = 0; x < W; x++) {
            var sx = Math.min(W - 1.001, Math.max(0, x - dx)), x0 = sx | 0, fx = sx - x0, j = y0 * W + x0;
            var v = (gris[j] * (1 - fx) + gris[j + 1] * fx) * (1 - fy) + (gris[j + W] * (1 - fx) + gris[j + W + 1] * fx) * fy;
            var ex = x - cx, ey = y - cy;
            f[y * W + x] = v + k * Math.exp(-(ex * ex + ey * ey) / r2);
          }
        }
        for (y = 0; y < H; y++) { /* Floyd-Steinberg en zigzag con el umbral movido, el mismo que fotos.mjs */
          var rev = y & 1, s = rev ? -1 : 1;
          for (var n = 0; n < W; n++) {
            x = rev ? W - 1 - n : n; var p = y * W + x, val = f[p], q = val < umbral[p] ? 0 : 1, e = val - q, o4 = p * 4;
            d8[o4] = q ? 249 : 8; d8[o4 + 1] = q ? 250 : 10; d8[o4 + 2] = q ? 251 : 11; d8[o4 + 3] = 255;
            if (x + s >= 0 && x + s < W) f[p + s] += e * 7 / 16;
            if (y + 1 < H) {
              if (x - s >= 0 && x - s < W) f[p + W - s] += e * 3 / 16;
              f[p + W] += e * 5 / 16;
              if (x + s >= 0 && x + s < W) f[p + W + s] += e / 16;
            }
          }
        }
        ctx.putImageData(out, 0, 0);
      }
      function paso() {
        cur.x += (obj.x - cur.x) * 0.12; cur.y += (obj.y - cur.y) * 0.12; cur.on += (obj.on - cur.on) * 0.1;
        pinta();
        if (Math.abs(obj.x - cur.x) + Math.abs(obj.y - cur.y) + Math.abs(obj.on - cur.on) > 0.002) raf = requestAnimationFrame(paso);
        else { raf = 0; if (!obj.on) cv.classList.remove("on"); }
      }
      var arranca = function () { if (!raf) raf = requestAnimationFrame(paso); };
      foto.addEventListener("pointerenter", function () { medir(); });
      foto.addEventListener("pointermove", function (ev) {
        if (!caja) medir();
        /* la foto va con object-fit: cover (centrada en horizontal, al 42 % en vertical): se pasa el puntero a coordenadas de la trama */
        var esc2 = Math.max(caja.width / W, caja.height / H), ox = (caja.width - W * esc2) * 0.5, oy = (caja.height - H * esc2) * 0.42;
        obj.x = Math.min(1, Math.max(0, (ev.clientX - caja.left - ox) / (W * esc2)));
        obj.y = Math.min(1, Math.max(0, (ev.clientY - caja.top - oy) / (H * esc2)));
        obj.on = 1; cv.classList.add("on"); arranca();
      });
      foto.addEventListener("pointerleave", function () { obj.x = 0.5; obj.y = 0.5; obj.on = 0; arranca(); });
      addEventListener("scroll", function () { caja = null; }, { passive: true });
      addEventListener("resize", function () { caja = null; });
    };
    src.src = cv.dataset.trama;
  }

  /* ---------- cita: trámite → papeles, plazo y mensaje ---------- */
  var form = document.querySelector("[data-cita]");
  if (form) {
    var radios = [].slice.call(form.querySelectorAll('input[name="tramite"]'));
    var papEl = form.querySelector("[data-papeles]"), campoF = form.querySelector("[data-campo-fecha]"), etF = form.querySelector("[data-fecha-et]"), inF = form.querySelector("[data-fecha-in]");
    var plazoEl = form.querySelector("[data-plazo]"), pzF = form.querySelector("[data-plazo-fecha]"), pzQ = form.querySelector("[data-plazo-que]"), pzS = form.querySelector("[data-plazo-sub]");
    var nombre = form.querySelector("[data-nombre]"), msg = form.querySelector("[data-mensaje]"), mcaja = form.querySelector(".mensaje-caja");
    var was = [].slice.call(document.querySelectorAll("[data-wa]"));
    var marcado = radios.filter(function (r) { return r.checked; })[0] || radios[0];
    var st = { t: marcado.value, tengo: {}, editado: false, alta: null, her: null };
    var iso = function (d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
    var deIso = function (s) { var p = (s || "").split("-"); return p.length === 3 && p[0] ? new Date(+p[0], p[1] - 1, +p[2]) : null; };
    /* primera letra en minúscula dentro del mensaje, salvo siglas («IVA», «NAN») y nombres propios («Gizarte Segurantza») */
    var minus = function (s) { var w = s.split(" "); return /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]/.test(w[0]) && !(w[1] && /^[A-ZÁÉÍÓÚÑ]/.test(w[1])) ? s.charAt(0).toLowerCase() + s.slice(1) : s; };
    /* alta: por defecto el día 1 del mes que viene (o del siguiente si falta menos de una semana) */
    st.alta = new Date(HOY.getFullYear(), HOY.getMonth() + 1, 1);
    if (dias(st.alta) < 7) st.alta = new Date(HOY.getFullYear(), HOY.getMonth() + 2, 1);

    var tengo = function () { return st.tengo[st.t] || (st.tengo[st.t] = {}); };
    function plazo() {
      var t = st.t, r = { d: null, que: "", sub: T.orientativo };
      if (t === "iva") { r.d = siguiente("300"); r.que = T.pz_iva; }
      else if (t === "nominas") { r.d = siguiente("300"); r.que = T.pz_nom; r.sub = T.pz_nom_sub + " " + T.orientativo; }
      else if (t === "alta") { r.d = st.alta; r.que = r.d ? T.pz_alta_f : T.pz_alta; r.sub = T.pz_alta_sub; }
      else if (t === "herencia") { if (st.her) { r.d = habil(masMeses(st.her, 6)); r.que = T.pz_her_f; } else { r.que = T.pz_her; r.sub = ""; } }
      else if (t === "renta") { var a = HOY.getMonth() >= 6 ? HOY.getFullYear() : HOY.getFullYear() - 1; r.que = T.pz_ren.replace("{a}", a).replace("{b}", a + 1); r.sub = T.pz_ren_sub; }
      return r;
    }
    function pintaPlazo(animar) {
      var r = plazo();
      if (r.d) { pzF.innerHTML = esc(fecha(r.d, true)) + '<span class="falta">' + esc(cuenta(r.d)) + "</span>"; pzQ.textContent = r.que; pzQ.hidden = false; }
      else { pzF.textContent = r.que; pzQ.textContent = ""; pzQ.hidden = true; }
      pzS.textContent = r.sub; pzS.hidden = !r.sub;
      if (animar) [pzF, pzQ, pzS].forEach(function (el, i) { anima(el, [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 520, delay: i * 50, easing: EASE, fill: "backwards" }); });
    }
    function pintaPapeles(animar) {
      var tr = T.tramites[st.t], tg = tengo();
      papEl.innerHTML = tr.docs.map(function (d, i) {
        return '<li><label><input class="caja" type="checkbox" value="' + i + '"' + (tg[i] ? " checked" : "") + '><span>' + esc(d) + "</span></label></li>";
      }).join("");
      if (animar) [].forEach.call(papEl.children, function (li, i) { anima(li, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 480, delay: 40 + i * 55, easing: EASE, fill: "backwards" }); });
    }
    function pintaFecha() {
      var t = st.t, ver = t === "alta" || t === "herencia";
      campoF.hidden = !ver;
      if (!ver) return;
      etF.textContent = t === "alta" ? T.f_fecha_alta : T.f_fecha_herencia;
      if (t === "alta") { inF.min = iso(HOY); inF.removeAttribute("max"); inF.value = st.alta ? iso(st.alta) : ""; }
      else { inF.max = iso(HOY); inF.removeAttribute("min"); inF.value = st.her ? iso(st.her) : ""; }
    }
    function mensaje() {
      var tr = T.tramites[st.t], l = [T.wa_hola], n = nombre.value.trim();
      if (n) l.push(T.wa_soy.replace("{n}", n));
      l.push(T.wa_quiero.replace("{t}", minus(tr.nombre)));
      if (st.t === "alta" && st.alta) l.push(T.wa_empiezo + " " + fecha(st.alta, true) + ".");
      if (st.t === "herencia" && st.her) l.push(T.wa_fallecio + " " + fecha(st.her, false) + ".");
      var si = [], no = [], tg = tengo();
      tr.docs.forEach(function (d, i) { (tg[i] ? si : no).push(minus(d)); });
      if (si.length) { l.push(T.wa_tengo.replace("{l}", si.join(", "))); if (no.length) l.push(T.wa_falta.replace("{l}", no.join(", "))); }
      l.push(T.wa_cuando);
      return l.join("\n");
    }
    var enlace = function () { return T.wa + "?text=" + encodeURIComponent(msg.value); };
    var ponWa = function () { var h = enlace(); was.forEach(function (a) { a.href = h; }); };
    var tEsc = 0;
    function escribe(animar) {
      if (st.editado) { ponWa(); return; }
      var txt = mensaje();
      clearTimeout(tEsc);
      if (!animar || R) { msg.value = txt; ponWa(); return; }
      mcaja.classList.add("escribe"); /* «Escribiendo…» y después el mensaje */
      tEsc = setTimeout(function () { msg.value = txt; mcaja.classList.remove("escribe"); anima(msg, [{ opacity: 0.35 }, { opacity: 1 }], { duration: 320, easing: "linear" }); ponWa(); }, 650);
    }
    function todo(animar) { pintaFecha(); pintaPapeles(animar); pintaPlazo(animar); escribe(animar); }

    radios.forEach(function (r) {
      r.addEventListener("change", function () {
        if (!r.checked) return;
        st.t = r.value; st.editado = false; todo(true);
        anima(r.parentNode, [{ transform: "scale(.94)" }, { transform: "scale(1.04)" }, { transform: "none" }], { duration: 360, easing: EASE });
      });
    });
    /* los trámites de las listas de arriba eligen el trámite aquí y bajan */
    [].forEach.call(document.querySelectorAll("[data-tramite]"), function (a) {
      a.addEventListener("click", function () {
        var r = radios.filter(function (x) { return x.value === a.dataset.tramite; })[0];
        if (r && !r.checked) { r.checked = true; st.t = r.value; st.editado = false; todo(false); }
      });
    });
    inF.addEventListener("change", function () {
      var d = deIso(inF.value);
      if (st.t === "alta") st.alta = d && d >= HOY ? d : st.alta;
      else st.her = d && d <= HOY ? d : null;
      pintaPlazo(true); escribe(true);
    });
    papEl.addEventListener("change", function (e) {
      if (!e.target.matches("input[type=checkbox]")) return;
      tengo()[e.target.value] = e.target.checked; escribe(false);
    });
    var tNom = 0;
    nombre.addEventListener("input", function () { clearTimeout(tNom); tNom = setTimeout(function () { escribe(false); }, 350); });
    msg.addEventListener("input", function () { st.editado = true; ponWa(); });
    form.addEventListener("submit", function (e) { e.preventDefault(); window.open(enlace(), "_blank", "noopener"); });
    todo(false);
  }

  /* ---------- paneles que entran al asomar (por tiempo, no atados al scroll) ---------- */
  if (!window.gsap || !window.ScrollTrigger || R) return;
  gsap.registerPlugin(ScrollTrigger);
  var visto = function (el) { return el.getBoundingClientRect().top < innerHeight; };
  var alAsomar = function (el, empieza) { return { trigger: el, start: empieza || "top 86%", once: true }; };
  /* reglas de las listas que se dibujan de izquierda a derecha, como en la referencia, y los trámites detrás */
  [].forEach.call(document.querySelectorAll("[data-lista]"), function (ul) {
    if (visto(ul)) return;
    gsap.from(ul.querySelectorAll(".regla"), { scaleX: 0, duration: 1.3, ease: "power3.out", stagger: 0.09, scrollTrigger: alAsomar(ul) });
    var enl = ul.querySelectorAll("a"); /* la lista de precios no lleva enlaces: solo las reglas */
    if (enl.length) gsap.from(enl, { y: 14, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.09, delay: 0.15, clearProps: "transform,opacity", scrollTrigger: alAsomar(ul) });
  });
  /* fotos tramadas que se «imprimen» de arriba abajo, como un fax */
  [].forEach.call(document.querySelectorAll("[data-foto]"), function (f) {
    if (visto(f)) return;
    gsap.fromTo(f, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power2.inOut", scrollTrigger: alAsomar(f) });
  });
  /* las dos fichas de plazos */
  if (fichas && !visto(fichas)) gsap.from(fichas.children, { y: 36, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.12, delay: 0.45, clearProps: "transform,opacity", scrollTrigger: alAsomar(fichas, "top 80%") });
  /* mapa: las líneas salen de Tolosa */
  var tol = document.querySelector(".m-tolosa"), mapa = document.querySelector(".mapa");
  if (tol && mapa && !visto(mapa)) {
    var tx = +tol.getAttribute("x") + 6, ty = +tol.getAttribute("y") + 6;
    gsap.from(".m-lineas line", { scale: 0, svgOrigin: tx + " " + ty, duration: 1.3, ease: "power3.out", stagger: 0.05, scrollTrigger: alAsomar(mapa, "top 72%") });
    gsap.from(".m-puntos rect", { opacity: 0, duration: 0.6, stagger: 0.05, delay: 0.6, scrollTrigger: alAsomar(mapa, "top 72%") });
    gsap.from(tol, { scale: 0, svgOrigin: tx + " " + ty, duration: 0.9, ease: "back.out(2.2)", scrollTrigger: alAsomar(mapa, "top 72%") });
  }
  /* el formulario de cita, campo a campo; las notas y los datos de contacto */
  var cf = document.querySelector(".cita-form");
  if (cf && !visto(cf)) gsap.from(cf.children, { y: 24, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.06, clearProps: "transform,opacity", scrollTrigger: alAsomar(cf) });
  [].forEach.call(document.querySelectorAll(".srv-nota, .cita-datos, .epe-izq p"), function (el) {
    if (visto(el)) return;
    gsap.from(el, { y: 20, opacity: 0, duration: 1.1, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: alAsomar(el) });
  });
})();
