/* «Escribe tu negocio y mira tu web» (portada, #prueba). 17/10/2026.
   Todo pasa en el navegador: no se envía ni se guarda nada.
   También se rellena desde el enlace: /?negocio=Nombre&sector=peluqueria&pueblo=Tolosa
   Los textos salen de los [data-t] de la página (así la versión en euskera,
   que se genera con esos mismos textos, también funciona). Las letras de cada
   sector se cargan solo al elegirlo. Créditos de las fotos: assets/stock/manifest.json
   y assets/prueba/creditos.json. */
(function () {
  "use strict";
  var raiz = document.getElementById("prueba");
  if (!raiz) return;

  var F = "/assets/fonts/";
  var SECTORES = {
    restaurante:  { foto: "/assets/stock/sec-rest-1.webp",   credito: "Jay Wennington / Unsplash",       acento: "#9b2a1b", sobre: "#fff", letra: ["prb-dmserif", "dm-serif-display-latin-6e4e3d44.woff2", "400"], peso: 400 },
    peluqueria:   { foto: "/assets/stock/sec-pelu-1.webp",   credito: "Greg Trowman / Unsplash",         acento: "#e9c9c1", sobre: "#1a1a1a", letra: ["prb-syne", "syne-latin-c0b6673b.woff2", "400 800"], peso: 700 },
    fisioterapia: { foto: "/assets/stock/sec-gym-2.webp",    credito: "S. Aji W / Unsplash",             acento: "#2f6b57", sobre: "#fff", letra: ["prb-manrope", "manrope-latin-bcbadccc.woff2", "200 800"], peso: 800 },
    tienda:       { foto: "/assets/stock/sec-flor-1.webp",   credito: "Alisa Anton / Unsplash",          acento: "#b8452a", sobre: "#fff", letra: ["prb-archivo", "archivo-black-latin-45f5d465.woff2", "400"], peso: 400 },
    "casa-rural": { foto: "/assets/prueba/casa-rural.webp",  credito: "Makoki20 / Wikimedia Commons (CC0)", acento: "#2f4a3a", sobre: "#fff", letra: ["prb-marcellus", "marcellus-latin-396e4dd6.woff2", "400"], peso: 400 },
    taller:       { foto: "/assets/stock/sec-taller-3.webp", credito: "Quilia / Unsplash",               acento: "#f2c200", sobre: "#111", letra: ["prb-anton", "anton-latin-f043da41.woff2", "400"], peso: 400 },
    inmobiliaria: { foto: "/assets/prueba/inmobiliaria.webp", credito: "Caroline Badran / Unsplash",     acento: "#14304f", sobre: "#fff", letra: ["prb-jost", "jost-latin-b58a5805.woff2", "300 600"], peso: 500 },
    psicologia:   { foto: "/assets/prueba/psicologia.webp",  credito: "note thanun / Unsplash",          acento: "#5b4a7a", sobre: "#fff", letra: ["prb-lora", "lora-latin-1ace0d36.woff2", "400 700"], peso: 500 },
    otro:         { foto: "/assets/stock/sec-cafe-3.webp",   credito: "RR Abrot / Unsplash",             acento: "#2f6db0", sobre: "#fff", letra: null, peso: 650 }
  };

  var campo = {
    nombre: document.getElementById("p-nombre"),
    sector: document.getElementById("p-sector"),
    pueblo: document.getElementById("p-pueblo")
  };
  var maquetas = raiz.querySelectorAll(".maq");
  var barraUrl = raiz.querySelector(".marco-portatil__barra span");
  var escena = raiz.querySelector(".prueba__marcos");
  var credito = document.getElementById("p-credito");
  var quiero = document.getElementById("p-quiero");
  var copiar = document.getElementById("p-copiar");
  var aviso = document.getElementById("p-aviso");
  var cargadas = {};
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* textos de la página (traducidos en /eu/) */
  var txt = function (k) { var el = raiz.querySelector('[data-k="' + k + '"]'); return el ? el.textContent.trim() : ""; };
  var nombreSector = function (clave) { var o = campo.sector.querySelector('option[value="' + clave + '"]'); return o ? o.textContent.trim() : clave; };
  var rellenar = function (plantilla, datos) { return plantilla.replace(/\{(\w+)\}/g, function (_, k) { return datos[k] != null ? datos[k] : ""; }); };

  var limpio = function (s, max) { return String(s || "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max); };
  var sinAcentos = function (s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
  var dominio = function (s) { return (sinAcentos(s).replace(/&/g, "eta").replace(/[^a-z0-9]+/g, "") || "tunegocio") + ".com"; };

  var cargarLetra = function (l) {
    if (!l || cargadas[l[0]] || !window.FontFace) return;
    cargadas[l[0]] = true;
    try {
      var ff = new FontFace(l[0], "url(" + F + l[1] + ") format('woff2')", { weight: l[2], style: "normal", display: "swap" });
      ff.load().then(function (x) { document.fonts.add(x); }, function () {});
    } catch (e) {}
  };

  var ultimoNombre = "";
  var pintar = function () {
    var clave = SECTORES[campo.sector.value] ? campo.sector.value : "restaurante";
    var s = SECTORES[clave];
    var propio = limpio(campo.nombre.value, 40);
    var nombre = propio || txt("nombre");
    var pueblo = limpio(campo.pueblo.value, 30) || campo.pueblo.getAttribute("placeholder") || "Tolosa";
    var sector = nombreSector(clave);
    cargarLetra(s.letra);
    maquetas.forEach(function (m) {
      m.style.setProperty("--acento", s.acento);
      m.style.setProperty("--sobre", s.sobre);
      m.style.setProperty("--fuente", s.letra ? '"' + s.letra[0] + '", var(--font-sans)' : "var(--font-sans)");
      m.style.setProperty("--peso", s.peso);
      m.style.setProperty("--n", Math.max(6, nombre.length));
      m.style.setProperty("--w", Math.max(5, nombre.split(/\s+/).reduce(function (x, p) { return Math.max(x, p.length); }, 0)));
      var foto = m.querySelector(".maq__foto");
      if (foto.getAttribute("src") !== s.foto) foto.setAttribute("src", s.foto);
      m.querySelector(".maq__marca").textContent = nombre;
      m.querySelector(".maq__nombre").textContent = nombre;
      var menu = m.querySelector(".maq__menu"); if (menu) menu.textContent = txt(clave + ".menu");
      m.querySelector(".maq__lugar").textContent = sector + " · " + pueblo;
      m.querySelector(".maq__linea").textContent = txt(clave + ".linea");
      m.querySelector(".maq__boton").textContent = txt(clave + ".boton");
    });
    if (barraUrl) barraUrl.textContent = dominio(nombre);
    if (credito) credito.textContent = s.credito;
    if (escena) escena.setAttribute("aria-label", rellenar(txt("alt"), { negocio: nombre, sector: sector, pueblo: pueblo }));

    /* un pequeño golpe en el nombre cuando cambia (no a cada letra seguida) */
    if (!reduce && nombre !== ultimoNombre) {
      raiz.classList.remove("prueba--cambia");
      void raiz.offsetWidth;
      raiz.classList.add("prueba--cambia");
    }
    ultimoNombre = nombre;

    var texto = propio
      ? rellenar(txt("wa"), { negocio: propio, sector: sector.toLowerCase(), pueblo: pueblo })
      : rellenar(txt("wa0"), { sector: sector.toLowerCase(), pueblo: pueblo });
    quiero.href = "https://wa.me/34611497409?text=" + encodeURIComponent(texto);
  };

  /* Rellenar desde el enlace */
  var q = new URLSearchParams(location.search);
  if (q.get("negocio")) campo.nombre.value = limpio(q.get("negocio"), 40);
  if (q.get("pueblo")) campo.pueblo.value = limpio(q.get("pueblo"), 30);
  if (q.get("sector")) {
    var pedido = sinAcentos(q.get("sector")).replace(/[\s_]+/g, "-");
    var hallado = Object.keys(SECTORES).filter(function (k) {
      return k === pedido || sinAcentos(nombreSector(k)).replace(/\s+/g, "-") === pedido || pedido.indexOf(k.slice(0, 5)) === 0;
    })[0];
    campo.sector.value = hallado || "otro";
  }

  var form = raiz.querySelector(".prueba__form");
  var espera = null;
  form.addEventListener("input", function () { clearTimeout(espera); espera = setTimeout(pintar, 120); });
  form.addEventListener("change", pintar);
  form.addEventListener("submit", function (e) { e.preventDefault(); pintar(); });
  pintar();

  /* si vienen del enlace con su negocio, bajar sola hasta la prueba */
  if (q.get("negocio") || q.get("sector")) {
    var bajar = function () { raiz.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); };
    if (document.readyState === "complete") setTimeout(bajar, 250);
    else window.addEventListener("load", function () { setTimeout(bajar, 250); });
  }

  /* Copiar el enlace de esta prueba (para mandárselo a alguien) */
  if (copiar) copiar.addEventListener("click", function () {
    var p = new URLSearchParams();
    if (limpio(campo.nombre.value, 40)) p.set("negocio", limpio(campo.nombre.value, 40));
    p.set("sector", campo.sector.value);
    if (limpio(campo.pueblo.value, 30)) p.set("pueblo", limpio(campo.pueblo.value, 30));
    var enlace = location.origin + location.pathname + "?" + p.toString();
    var hecho = function () { aviso.textContent = txt("copiado"); setTimeout(function () { aviso.textContent = ""; }, 3500); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(enlace).then(hecho, function () { aviso.textContent = enlace; });
    else aviso.textContent = enlace;
  });

  /* Si i18n.js cambia el idioma en la misma página, se vuelve a pintar */
  document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("[data-lang]")) setTimeout(pintar, 60); });
})();
