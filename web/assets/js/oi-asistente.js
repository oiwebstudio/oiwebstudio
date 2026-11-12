/*! Asistente de OI Studio · widget sin dependencias.
 * Uso: <script src="https://…/widget.js" data-negocio="oiwebstudio" defer></script>
 * Opcional: data-boton="no" (sin botón flotante; se abre con window.OIAsistente.abrir()), data-idioma="es|eu".
 * Las respuestas se pintan SIEMPRE como texto (textContent). Los únicos enlaces los pone el widget
 * (WhatsApp y teléfono del negocio, que vienen de su configuración). No guarda nada en el navegador.
 */
(function () {
  "use strict";
  if (window.OIAsistente && window.OIAsistente.__listo) return;

  var script = document.currentScript || document.querySelector("script[data-negocio][src*='widget.js'], script[data-negocio][src*='oi-asistente']");
  if (!script) return;
  // M4 (auditoría 11/11): data-api permite servir este fichero desde la propia web (p. ej. /assets/js/oi-asistente.js)
  // y llamar a la API del worker. Sin data-api, la API es el origen del propio script.
  var BASE = script.getAttribute("data-api") || new URL(script.src, location.href).origin;
  if (!/^https:\/\/[a-z0-9.-]+$/.test(BASE) && !/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(BASE)) return;
  var NEGOCIO = String(script.getAttribute("data-negocio") || "").toLowerCase();
  if (!/^[a-z0-9-]{2,40}$/.test(NEGOCIO)) return;
  var CON_BOTON = script.getAttribute("data-boton") !== "no";
  var langAttr = (script.getAttribute("data-idioma") || document.documentElement.lang || "es").toLowerCase();
  var IDIOMA = langAttr.indexOf("eu") === 0 ? "eu" : "es";
  var MAX = 500;
  var reducir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var cola = [];           // llamadas a abrir() antes de cargar la configuración
  var api = {
    __listo: true,
    abrir: function () { cola.push("abrir"); },
    cerrar: function () { cola.push("cerrar"); },
    alternar: function () { cola.push("alternar"); }
  };
  window.OIAsistente = api;

  function el(tag, attrs, hijos) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "class") e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    (hijos || []).forEach(function (h) { if (h) e.appendChild(h); });
    return e;
  }
  function svg(d, extra) {
    var ns = "http://www.w3.org/2000/svg";
    var s = document.createElementNS(ns, "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false");
    var p = document.createElementNS(ns, "path"); p.setAttribute("d", d);
    if (extra) for (var k in extra) p.setAttribute(k, extra[k]);
    s.appendChild(p);
    return s;
  }
  function t(c, clave, vars) {
    var s = (c.textos && c.textos[clave]) || "";
    if (vars) for (var v in vars) s = s.split("{" + v + "}").join(vars[v]);
    return s;
  }

  fetch(BASE + "/v1/config?negocio=" + encodeURIComponent(NEGOCIO) + "&idioma=" + IDIOMA, { credentials: "omit", mode: "cors" })
    .then(function (r) { if (!r.ok) throw new Error("config " + r.status); return r.json(); })
    .then(montar)
    .catch(function (e) { if (window.console) console.warn("[OIAsistente] no disponible en esta página:", e.message); });

  function montar(c) {
    var est = c.estilo || {};
    var host = el("div", { id: "oi-asistente" });
    host.style.cssText = "position:static;";
    var raiz = host.attachShadow({ mode: "open" });
    var css = document.createElement("style");
    css.textContent = CSS
      .replace("%FONDO%", est.fondo || "#fff").replace("%TEXTO%", est.texto || "#191712")
      .replace("%SUAVE%", est.suave || "#67655e").replace("%LINEA%", est.linea || "#e9e8e4")
      .replace("%ACENTO%", est.acento || "#191712").replace("%TEXTOACENTO%", est.textoAcento || "#fff")
      .replace("%BURBUJA%", est.burbuja || "#f6f6f4").replace("%RADIO%", est.radio || "18px");
    raiz.appendChild(css);
    if (reducir) host.setAttribute("data-quieto", "");

    var conversacion = []; // { rol: "usuario"|"asistente", texto, firma }
    var esperando = false;
    var anterior = null;

    // ---------- Estructura ----------
    var lanzador = CON_BOTON ? el("button", { class: "lanzador", type: "button", "aria-expanded": "false", "aria-controls": "oia-panel", "aria-label": t(c, "abrirEtiqueta") }, [
      svg("M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z", { fill: "none", stroke: "currentColor", "stroke-width": "1.7", "stroke-linejoin": "round" }),
      el("span", { text: t(c, "abrir") })
    ]) : null;

    var nombre = t(c, "titulo", { nombre: c.nombre });
    var titulo = el("h2", { class: "titulo", id: "oia-titulo", "aria-label": nombre });
    nombre.split(/(\s+)/).forEach(function (trozo, i) {
      if (/^\s+$/.test(trozo)) { titulo.appendChild(document.createTextNode(" ")); return; }
      var s = el("span", { class: "pal", "aria-hidden": "true", text: trozo });
      s.style.setProperty("--i", String(i / 2));
      titulo.appendChild(s);
    });
    var cerrarBtn = el("button", { class: "cerrar", type: "button", "aria-label": t(c, "cerrar") }, [svg("M6 6l12 12M18 6 6 18", { fill: "none", stroke: "currentColor", "stroke-width": "1.8", "stroke-linecap": "round" })]);
    var cabecera = el("div", { class: "cabecera" }, [
      el("div", { class: "cab-txt" }, [titulo, el("p", { class: "sub", text: t(c, "subtitulo") })]),
      cerrarBtn
    ]);
    var aviso = el("p", { class: "aviso", id: "oia-aviso", text: t(c, "aviso") });
    var log = el("div", { class: "log", role: "log", "aria-live": "polite", "aria-relevant": "additions", tabindex: "0", "aria-label": t(c, "titulo", { nombre: c.nombre }) });
    var sugs = el("div", { class: "sugs" });
    ["sug1", "sug2", "sug3"].forEach(function (k) {
      var q = t(c, k);
      if (!q) return;
      var b = el("button", { class: "sug", type: "button", text: q });
      b.addEventListener("click", function () { enviar(q); });
      sugs.appendChild(b);
    });

    var campo = el("textarea", { id: "oia-campo", class: "campo", rows: "1", maxlength: String(MAX), placeholder: t(c, "placeholder"), autocomplete: "off", enterkeyhint: "send" });
    var etiqueta = el("label", { class: "oculto", for: "oia-campo", text: t(c, "campo") });
    var quedan = el("p", { class: "quedan", "aria-live": "polite" });
    var enviarBtn = el("button", { class: "enviar", type: "submit", "aria-label": t(c, "enviar") }, [svg("M5 12h13M12 5l7 7-7 7", { fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" })]);
    var form = el("form", { class: "escribir" }, [etiqueta, campo, enviarBtn]);

    var waBtn = el("button", { class: "wa", type: "button" }, [svg(WA, { fill: "currentColor" }), el("span", { text: t(c, "whatsapp") })]);
    var telLink = c.contacto && c.contacto.telefono ? el("a", { class: "tel", href: "tel:" + c.contacto.telefono, text: t(c, "llamar") + (c.contacto.telefonoVisible ? " · " + c.contacto.telefonoVisible : "") }) : null;
    var pie = el("div", { class: "pie" }, [waBtn, telLink]);

    // Vista del mensaje para WhatsApp
    var resTit = el("h3", { class: "res-tit", id: "oia-res-tit", text: t(c, "resumenTitulo") });
    var resAyuda = el("p", { class: "res-ayuda", text: t(c, "resumenAyuda") });
    var resCampo = el("textarea", { class: "res-campo", rows: "5", maxlength: "600", "aria-labelledby": "oia-res-tit" });
    var resAbrir = el("a", { class: "res-abrir", target: "_blank", rel: "noopener noreferrer" }, [svg(WA, { fill: "currentColor" }), el("span", { text: t(c, "abrirWhatsapp") })]);
    var resVolver = el("button", { class: "res-volver", type: "button", text: t(c, "volver") });
    var resumen = el("div", { class: "resumen", hidden: "" }, [resTit, resAyuda, resCampo, el("div", { class: "res-acciones" }, [resAbrir, resVolver])]);

    var chat = el("div", { class: "chat" }, [log, sugs, form, quedan]);
    var panel = el("section", { class: "panel", id: "oia-panel", role: "dialog", "aria-modal": "false", "aria-labelledby": "oia-titulo", "aria-describedby": "oia-aviso", hidden: "" }, [cabecera, aviso, chat, resumen, pie]);
    var envoltura = el("div", { class: "oia" + (CON_BOTON ? "" : " sin-boton"), lang: IDIOMA }, [panel, lanzador]);
    raiz.appendChild(envoltura);
    document.body.appendChild(host);

    // ---------- Mensajes ----------
    function burbuja(rol, texto, conTraspaso) {
      var b = el("div", { class: "msg " + (rol === "usuario" ? "yo" : "ia") });
      b.appendChild(el("p", { text: texto }));       // SIEMPRE texto, nunca HTML
      if (conTraspaso && c.contacto && c.contacto.whatsapp) {
        var w = el("button", { class: "wa-inline", type: "button" }, [svg(WA, { fill: "currentColor" }), el("span", { text: t(c, "whatsapp") })]);
        w.addEventListener("click", abrirResumen);
        b.appendChild(w);
      }
      log.appendChild(b);
      requestAnimationFrame(function () { b.classList.add("dentro"); });
      log.scrollTop = log.scrollHeight;
      return b;
    }
    var escribiendo = null;
    function ponerEscribiendo(si) {
      if (si && !escribiendo) {
        escribiendo = el("div", { class: "msg ia escribiendo" }, [
          el("span", { class: "esc-txt", text: t(c, "escribiendo") }),
          el("span", { class: "puntos", "aria-hidden": "true" }, [el("i"), el("i"), el("i")])
        ]);
        log.appendChild(escribiendo);
        requestAnimationFrame(function () { if (escribiendo) escribiendo.classList.add("dentro"); });
        log.scrollTop = log.scrollHeight;
      } else if (!si && escribiendo) { escribiendo.remove(); escribiendo = null; }
    }

    burbuja("asistente", t(c, "bienvenida", { nombre: c.nombre }), false);

    function actualizarQuedan() {
      var n = MAX - campo.value.length;
      quedan.textContent = n <= 80 ? t(c, "quedan", { n: String(n) }) : "";
    }
    function ajustarAltura() { campo.style.height = "auto"; campo.style.height = Math.min(campo.scrollHeight, 120) + "px"; }
    campo.addEventListener("input", function () { actualizarQuedan(); ajustarAltura(); });
    campo.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : enviar(campo.value); }
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); enviar(campo.value); });

    function enviar(texto) {
      texto = String(texto || "").trim();
      if (!texto || esperando) return;
      if (texto.length > MAX) { burbuja("asistente", t(c, "mensajeLargo", { n: String(MAX) }), false); return; }
      sugs.hidden = true;
      campo.value = ""; actualizarQuedan(); ajustarAltura();
      conversacion.push({ rol: "usuario", texto: texto });
      burbuja("usuario", texto, false);
      esperando = true; enviarBtn.disabled = true; ponerEscribiendo(true);
      var t0 = Date.now();
      fetch(BASE + "/v1/chat", {
        method: "POST", mode: "cors", credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ negocio: NEGOCIO, idioma: IDIOMA, mensajes: conversacion.slice(-12) })
      })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (d) {
          var espera = Math.max(0, 450 - (Date.now() - t0)); // que se lea «escribiendo…» aunque conteste rápido
          setTimeout(function () {
            ponerEscribiendo(false);
            var txt = typeof d.texto === "string" && d.texto ? d.texto : t(c, "error");
            if (d.firma) conversacion.push({ rol: "asistente", texto: txt, firma: d.firma });
            burbuja("asistente", txt, !!d.traspaso || !d.firma);
            terminar();
          }, espera);
        })
        .catch(function () { ponerEscribiendo(false); burbuja("asistente", t(c, "error"), true); terminar(); });
    }
    function terminar() { esperando = false; enviarBtn.disabled = false; if (!esTactil()) campo.focus(); }

    // ---------- WhatsApp con el resumen ----------
    function enlaceWa(texto) { return "https://wa.me/" + c.contacto.whatsapp + "?text=" + encodeURIComponent(texto); }
    function abrirResumen() {
      if (!c.contacto || !c.contacto.whatsapp) return;
      chat.hidden = true; pie.hidden = true; resumen.hidden = false;
      var base = t(c, "resumenBase");
      var hayPreguntas = conversacion.some(function (m) { return m.rol === "usuario"; });
      resCampo.value = hayPreguntas ? t(c, "preparando") : base;
      resCampo.disabled = hayPreguntas;
      resAbrir.href = enlaceWa(base);
      resAbrir.setAttribute("aria-disabled", hayPreguntas ? "true" : "false");
      resTit.setAttribute("tabindex", "-1"); resTit.focus();
      if (!hayPreguntas) return;
      fetch(BASE + "/v1/resumen", {
        method: "POST", mode: "cors", credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ negocio: NEGOCIO, idioma: IDIOMA, mensajes: conversacion.slice(-12) })
      })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (d) { listo(typeof d.texto === "string" && d.texto ? d.texto : resumenLocal(base)); })
        .catch(function () { listo(resumenLocal(base)); });
      function listo(txt) {
        resCampo.disabled = false; resCampo.value = txt; resAbrir.href = enlaceWa(txt); resAbrir.setAttribute("aria-disabled", "false");
      }
    }
    function resumenLocal(base) {
      var preguntas = conversacion.filter(function (m) { return m.rol === "usuario"; }).slice(-3).map(function (m) { return "«" + m.texto.slice(0, 160) + "»"; });
      return base + " " + preguntas.join(" ");
    }
    resCampo.addEventListener("input", function () { resAbrir.href = enlaceWa(resCampo.value); });
    resAbrir.addEventListener("click", function (e) { if (resAbrir.getAttribute("aria-disabled") === "true") e.preventDefault(); });
    resVolver.addEventListener("click", function () { resumen.hidden = true; chat.hidden = false; pie.hidden = false; if (!esTactil()) campo.focus(); });
    waBtn.addEventListener("click", abrirResumen);

    // ---------- Abrir y cerrar ----------
    var abierto = false;
    function esTactil() { return window.matchMedia && window.matchMedia("(pointer: coarse)").matches; }
    function abrir() {
      if (abierto) return;
      abierto = true;
      anterior = document.activeElement;
      panel.hidden = false;
      if (lanzador) lanzador.setAttribute("aria-expanded", "true");
      envoltura.classList.add("abierto");
      requestAnimationFrame(function () { requestAnimationFrame(function () { panel.classList.add("visible"); }); });
      setTimeout(function () {
        if (!esTactil()) { campo.focus(); return; }
        titulo.setAttribute("tabindex", "-1");
        titulo.focus({ preventScroll: true });
      }, reducir ? 0 : 60);
    }
    function cerrar() {
      if (!abierto) return;
      abierto = false;
      panel.classList.remove("visible");
      envoltura.classList.remove("abierto");
      if (lanzador) lanzador.setAttribute("aria-expanded", "false");
      setTimeout(function () { if (!abierto) panel.hidden = true; }, reducir ? 0 : 320);
      var volverA = lanzador || anterior;
      if (volverA && volverA.focus) try { volverA.focus({ preventScroll: true }); } catch (e) {}
    }
    if (lanzador) lanzador.addEventListener("click", function () { abierto ? cerrar() : abrir(); });
    cerrarBtn.addEventListener("click", cerrar);
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.stopPropagation(); cerrar(); } });

    api.abrir = abrir; api.cerrar = cerrar; api.alternar = function () { abierto ? cerrar() : abrir(); };
    cola.forEach(function (accion) { api[accion](); });
    cola = [];
    try { document.dispatchEvent(new CustomEvent("oiasistente:listo")); } catch (e) {}
  }

  var WA = "M12.04 2C6.58 2 2.14 6.44 2.14 11.9c0 1.75.46 3.45 1.32 4.95L2.05 22l5.27-1.38a9.86 9.86 0 0 0 4.72 1.21c5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2zm5.8 14.04c-.25.69-1.45 1.32-1.99 1.36-.51.05-.99.24-3.33-.69-2.82-1.11-4.6-4-4.74-4.18-.14-.19-1.13-1.5-1.13-2.87 0-1.36.71-2.03.97-2.31.25-.28.55-.35.73-.35l.53.01c.17.01.4-.06.62.48.24.56.8 1.94.86 2.08.07.14.12.3.02.48-.09.19-.14.3-.28.46-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.73 1.2 1.56 1.94 1.07.96 1.98 1.25 2.26 1.39.28.14.44.12.6-.07.17-.19.7-.81.88-1.09.19-.28.37-.23.62-.14.26.09 1.62.76 1.9.9.28.14.46.21.53.32.07.12.07.67-.18 1.36z";

  var CSS = [
    ":host{all:initial;font-family:inherit}",
    ".oia{--fondo:%FONDO%;--texto:%TEXTO%;--suave:%SUAVE%;--linea:%LINEA%;--acento:%ACENTO%;--texto-acento:%TEXTOACENTO%;--burbuja:%BURBUJA%;--radio:%RADIO%;",
    "  font-family:var(--oia-letra,inherit);font-size:15px;line-height:1.45;color:var(--texto);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}",
    ".oia *,.oia *::before,.oia *::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent}",
    ":where(.oia) :where(button,a,textarea){font:inherit;color:inherit}",
    ":where(.oia) :focus{outline:none}",
    ".oia :focus-visible{outline:2px solid var(--acento);outline-offset:2px}",
    ".oia [hidden]{display:none!important}",
    ".oculto{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}",
    // lanzador
    ".lanzador{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:inline-flex;align-items:center;gap:9px;height:50px;padding:0 20px 0 16px;border:0;border-radius:999px;background:var(--acento);color:var(--texto-acento);cursor:pointer;font-weight:600;box-shadow:0 8px 24px -10px rgba(0,0,0,.45);transition:transform .35s cubic-bezier(.2,.7,.2,1),opacity .3s ease}",
    ".lanzador svg{width:21px;height:21px}",
    ".lanzador:hover{transform:translateY(-2px)}",
    ".abierto .lanzador{opacity:0;transform:translateY(8px) scale(.96);pointer-events:none}",
    // panel
    ".panel{position:fixed;right:20px;bottom:20px;z-index:2147483001;width:384px;height:min(620px,calc(100vh - 40px));height:min(620px,calc(100dvh - 40px));display:flex;flex-direction:column;background:var(--fondo);border:1px solid var(--linea);border-radius:var(--radio);box-shadow:0 24px 60px -24px rgba(0,0,0,.35);overflow:hidden;",
    "  opacity:0;transform:translateY(16px) scale(.98);transform-origin:100% 100%;transition:opacity .32s ease,transform .45s cubic-bezier(.2,.75,.2,1)}",
    ".panel.visible{opacity:1;transform:none}",
    ".cabecera{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:18px 18px 10px}",
    ".titulo{margin:0;font-size:17px;line-height:1.15;font-weight:700;letter-spacing:.02em;text-transform:uppercase;color:var(--texto)}",
    ".pal{display:inline-block;opacity:0;transform:translateY(.55em);transition:opacity .5s ease,transform .6s cubic-bezier(.2,.75,.2,1);transition-delay:calc(.12s + var(--i) * .07s)}",
    ".panel.visible .pal{opacity:1;transform:none}",
    ".sub{margin:3px 0 0;font-size:13px;color:var(--suave)}",
    ".cerrar{flex:none;display:grid;place-items:center;width:38px;height:38px;margin:-6px -6px 0 0;border:0;border-radius:50%;background:transparent;cursor:pointer;color:var(--texto)}",
    ".cerrar:hover{background:var(--burbuja)}",
    ".cerrar svg{width:20px;height:20px}",
    ".aviso{margin:0 18px 6px;padding:9px 12px;font-size:12.5px;line-height:1.4;color:var(--suave);background:var(--burbuja);border-radius:12px}",
    ".chat{flex:1;min-height:0;display:flex;flex-direction:column}",
    ".log{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:10px 18px 6px;display:flex;flex-direction:column;gap:8px;scroll-behavior:smooth}",
    ".msg{max-width:86%;padding:10px 13px;border-radius:16px;opacity:0;transform:translateY(8px);transition:opacity .35s ease,transform .45s cubic-bezier(.2,.75,.2,1)}",
    ".msg.dentro{opacity:1;transform:none}",
    ".msg p{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}",
    ".msg.ia{align-self:flex-start;background:var(--burbuja);border-bottom-left-radius:6px}",
    ".msg.yo{align-self:flex-end;background:var(--acento);color:var(--texto-acento);border-bottom-right-radius:6px}",
    ".escribiendo{display:inline-flex;align-items:center;gap:8px;color:var(--suave);font-size:13.5px}",
    ".puntos{display:inline-flex;gap:3px}",
    ".puntos i{width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.3;animation:oia-punto 1.2s ease-in-out infinite}",
    ".puntos i:nth-child(2){animation-delay:.15s}.puntos i:nth-child(3){animation-delay:.3s}",
    "@keyframes oia-punto{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}",
    ".wa-inline{display:inline-flex;align-items:center;gap:7px;margin-top:9px;padding:8px 13px;border:0;border-radius:999px;background:var(--acento);color:var(--texto-acento);font-size:14px;font-weight:600;cursor:pointer}",
    ".wa-inline svg,.wa svg,.res-abrir svg{width:17px;height:17px}",
    ".sugs{display:flex;flex-wrap:wrap;gap:6px;padding:4px 18px 8px}",
    ".sug{border:0;border-radius:999px;padding:7px 12px;background:var(--burbuja);font-size:13.5px;cursor:pointer;text-align:left;transition:transform .25s ease}",
    ".sug:hover{transform:translateY(-1px)}",
    ".escribir{display:flex;align-items:flex-end;gap:8px;margin:4px 14px 0;padding:6px 6px 6px 14px;border:1px solid var(--linea);border-radius:22px;background:var(--fondo)}",
    ".escribir:focus-within{border-color:var(--suave)}",
    ".campo{flex:1;min-height:36px;max-height:120px;padding:8px 0;border:0;background:transparent;resize:none;font-size:16px;line-height:1.35}",
    ".campo::placeholder{color:var(--suave);opacity:1}",
    ".campo:focus-visible{outline:none}",
    ".enviar{flex:none;display:grid;place-items:center;width:38px;height:38px;border:0;border-radius:50%;background:var(--acento);color:var(--texto-acento);cursor:pointer;transition:opacity .2s ease}",
    ".enviar svg{width:18px;height:18px}",
    ".enviar:disabled{opacity:.45;cursor:default}",
    ".quedan{min-height:0;margin:3px 22px 0;font-size:12px;color:var(--suave)}",
    ".pie{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 14px 14px}",
    ".wa{display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 16px;border:0;border-radius:999px;background:var(--acento);color:var(--texto-acento);font-size:14.5px;font-weight:600;cursor:pointer}",
    ".tel{white-space:nowrap;font-size:14px;color:var(--texto);text-decoration:underline;text-underline-offset:3px;padding:10px 4px}",
    ".resumen{flex:1;min-height:0;overflow-y:auto;padding:10px 18px 16px;display:flex;flex-direction:column;gap:10px}",
    ".res-tit{margin:0;font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:.02em}",
    ".res-ayuda{margin:0;font-size:13.5px;color:var(--suave)}",
    ".res-campo{width:100%;padding:11px 12px;border:1px solid var(--linea);border-radius:14px;background:var(--fondo);font-size:16px;line-height:1.4;resize:vertical}",
    ".res-campo:disabled{color:var(--suave)}",
    ".res-acciones{display:flex;align-items:center;gap:14px;flex-wrap:wrap}",
    ".res-abrir{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border-radius:999px;background:var(--acento);color:var(--texto-acento);text-decoration:none;font-weight:600}",
    ".res-abrir[aria-disabled=true]{opacity:.45;pointer-events:none}",
    ".res-volver{border:0;background:none;padding:10px 2px;text-decoration:underline;text-underline-offset:3px;cursor:pointer}",
    ".sin-boton .panel{bottom:20px}",
    "@media (max-width:520px){",
    "  .lanzador{right:14px;bottom:14px}",
    "  .panel{right:0;left:0;bottom:0;width:auto;height:88vh;height:88dvh;border-radius:var(--radio) var(--radio) 0 0;border-bottom:0;transform-origin:50% 100%;transform:translateY(24px)}",
    "  .panel.visible{transform:none}",
    "  .pie{padding-bottom:max(14px,env(safe-area-inset-bottom))}",
    "}",
    "@media (prefers-reduced-motion:reduce){.panel,.pal,.msg,.lanzador,.sug,.puntos i{transition:none!important;animation:none!important}.pal{opacity:1;transform:none}.msg{opacity:1;transform:none}.puntos i{opacity:.6}.log{scroll-behavior:auto}}",
    ":host([data-quieto]) .panel,:host([data-quieto]) .pal,:host([data-quieto]) .msg{transition:none}"
  ].join("\n");
})();
