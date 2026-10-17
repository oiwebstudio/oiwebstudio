/* «¿Cuánto tarda tu web?» (revision-web-gratis.html, #velocidad). 17/10/2026.
   Consulta la API pública de PageSpeed Insights v5 (Google) en móvil, para la web
   del visitante y para oiwebstudio.com a la vez, y enseña la nota de rendimiento
   y el LCP (lo que tarda en verse lo principal). No se guarda nada.

   Sin clave, la cuota es la compartida de Google y casi siempre está agotada
   (responde 429). Para que funcione de verdad hay que crear una clave gratuita de
   la API de PageSpeed Insights en Google Cloud, restringida por referer a
   https://oiwebstudio.com/* y solo a esa API, y ponerla en CLAVE. Una clave
   restringida así puede ir en el código de una web pública. */
(function () {
  "use strict";
  var CLAVE = "";
  var NUESTRA = "https://oiwebstudio.com/";
  var form = document.getElementById("v-form");
  if (!form) return;
  var campo = document.getElementById("v-url");
  var boton = form.querySelector("button");
  var estado = document.getElementById("v-estado");
  var medidas = document.getElementById("v-medidas");
  var cajas = { tuya: document.querySelector('.medida[data-quien="tuya"]'), oi: document.querySelector('.medida[data-quien="oi"]') };
  var enlacePsi = document.getElementById("v-psi");
  var siguiente = document.getElementById("v-siguiente");

  var normalizar = function (texto) {
    texto = String(texto || "").trim().replace(/\s+/g, "");
    if (!texto) return null;
    if (!/^https?:\/\//i.test(texto)) texto = "https://" + texto;
    try {
      var u = new URL(texto);
      if (!/^https?:$/.test(u.protocol) || !/\.[a-z]{2,}$/i.test(u.hostname) || /^(localhost|127\.|10\.|192\.168\.)/.test(u.hostname)) return null;
      return u.href;
    } catch (e) { return null; }
  };
  var bonita = function (url) { return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, ""); };
  var segundos = function (ms) { return (ms / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + " s"; };
  var tramo = function (nota) { return nota >= 90 ? "buena" : nota >= 50 ? "media" : "mala"; };
  var veredicto = function (nota) {
    if (nota >= 90) return "Rápida: Google la da por buena.";
    if (nota >= 50) return "Mejorable: podría cargar bastante antes.";
    return "Lenta: en el móvil se hace esperar.";
  };

  var pedir = function (url) {
    var api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&category=performance&url=" + encodeURIComponent(url) + (CLAVE ? "&key=" + encodeURIComponent(CLAVE) : "");
    var ctrl = "AbortController" in window ? new AbortController() : null;
    var reloj = setTimeout(function () { if (ctrl) ctrl.abort(); }, 90000);
    return fetch(api, ctrl ? { signal: ctrl.signal } : {}).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        clearTimeout(reloj);
        if (!r.ok || j.error) {
          var msg = (j.error && j.error.message) || "";
          var err = new Error(msg);
          err.tipo = r.status === 429 || /quota|rate/i.test(msg) ? "cuota"
            : /FAILED_DOCUMENT_REQUEST|ERRORED_DOCUMENT_REQUEST|DNS|NOT_HTML|unreachable|NO_FCP|Invalid URL|INVALID_URL|ERR_/i.test(msg) || r.status === 400 ? "abrir"
            : r.status >= 500 ? "google" : "otro";
          throw err;
        }
        var lh = j.lighthouseResult || {};
        var cat = lh.categories && lh.categories.performance;
        var lcp = lh.audits && lh.audits["largest-contentful-paint"];
        if (!cat || cat.score == null) { var e2 = new Error("sin nota"); e2.tipo = "abrir"; throw e2; }
        return { nota: Math.round(cat.score * 100), lcp: lcp ? lcp.numericValue : null };
      });
    }, function (e) {
      clearTimeout(reloj);
      var err = new Error("red");
      err.tipo = e && e.name === "AbortError" ? "tiempo" : "red";
      throw err;
    });
  };

  var MENSAJES = {
    cuota: "Google limita las mediciones gratuitas y ahora mismo no deja hacer más. Puedes medirla directamente en PageSpeed Insights con el enlace de abajo, o inténtalo aquí dentro de un rato.",
    abrir: "Google no ha podido abrir esa dirección. Comprueba que está bien escrita y que la web funciona.",
    tiempo: "Google está tardando demasiado en responder. Inténtalo de nuevo en un par de minutos.",
    google: "El servicio de Google ha fallado. Inténtalo de nuevo en un par de minutos.",
    red: "No hay conexión con Google. Comprueba tu conexión e inténtalo de nuevo.",
    otro: "Google no ha devuelto la medida. Inténtalo de nuevo en un par de minutos."
  };

  var preparar = function (caja, url) {
    caja.className = "medida midiendo";
    caja.querySelector(".medida__url").textContent = bonita(url);
    caja.querySelector(".medida__nota b").textContent = "…";
    caja.querySelector(".medida__lcp").textContent = "…";
    caja.querySelector(".medida__barra span").style.setProperty("--p", 0);
    caja.querySelector(".medida__veredicto").textContent = "Midiendo…";
  };
  var poner = function (caja, r) {
    caja.className = "medida " + (r ? "medida--" + tramo(r.nota) : "medida--sin");
    caja.querySelector(".medida__nota b").textContent = r ? r.nota : "—";
    caja.querySelector(".medida__lcp").textContent = r && r.lcp != null ? segundos(r.lcp) : "—";
    caja.querySelector(".medida__barra span").style.setProperty("--p", r ? r.nota / 100 : 0);
    caja.querySelector(".medida__veredicto").textContent = r ? veredicto(r.nota) : "No disponible ahora.";
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var url = normalizar(campo.value);
    if (!url) {
      estado.textContent = "Escribe la dirección de tu web, por ejemplo tunegocio.com.";
      campo.setAttribute("aria-invalid", "true");
      campo.focus();
      return;
    }
    campo.removeAttribute("aria-invalid");
    if (enlacePsi) enlacePsi.href = "https://pagespeed.web.dev/analysis?url=" + encodeURIComponent(url) + "&form_factor=mobile";
    var webForm = document.getElementById("rv-web");
    if (webForm && !webForm.value) webForm.value = bonita(url);
    boton.disabled = true;
    medidas.hidden = false;
    if (siguiente) siguiente.hidden = true;
    estado.textContent = "Google está midiendo las dos webs en un móvil simulado. Suele tardar entre 15 y 40 segundos.";
    preparar(cajas.tuya, url);
    preparar(cajas.oi, NUESTRA);

    var a = pedir(url).then(function (r) { poner(cajas.tuya, r); return r; }, function (err) { poner(cajas.tuya, null); throw err; });
    var b = pedir(NUESTRA).then(function (r) { poner(cajas.oi, r); return r; }, function () { poner(cajas.oi, null); return null; });
    Promise.all([a, b]).then(function (res) {
      var t = res[0], o = res[1];
      if (o && t.nota < o.nota) estado.textContent = "Tu web saca " + t.nota + " de 100 en el móvil y la mía " + o.nota + ". Si quieres, te cuento qué la frena: pide la revisión gratis aquí abajo.";
      else if (o) estado.textContent = "Tu web saca " + t.nota + " de 100 en el móvil. Si quieres que la revise entera, pídemelo aquí abajo.";
      else estado.textContent = "Tu web saca " + t.nota + " de 100 en el móvil. La medida de oiwebstudio.com no ha llegado; inténtalo de nuevo en un rato para comparar.";
      if (siguiente) siguiente.hidden = false;
    }, function (err) {
      estado.textContent = MENSAJES[err.tipo] || MENSAJES.otro;
      medidas.hidden = true;
      if (err.tipo === "abrir") { campo.setAttribute("aria-invalid", "true"); }
    }).then(function () { boton.disabled = false; });
  });
})();
