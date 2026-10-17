/* Calculadora de precio (precios.html, #calculadora). 17/10/2026.
   Los importes son EXACTAMENTE los de precios.html (tarifa del 17/10, todo + IVA,
   pago único al final). Si cambia un precio en la página, hay que cambiarlo aquí
   también, y en el JSON-LD de index.html si es uno de los planes.
   Los textos salen de [data-t] de la página: en /eu/ ya vienen traducidos.
   No se guarda ni se envía nada: el botón solo abre WhatsApp con el texto escrito. */
(function () {
  "use strict";
  var form = document.getElementById("calc");
  if (!form) return;

  var TIPOS = {
    landing: { precio: 399, mant: 25 },
    negocio: { precio: 499, mant: 25 },
    tienda:  { precio: 850, mant: 35 },
    ninguna: { precio: 0,   mant: 25 }
  };
  /* reservas: +190 con una web hecha por mí, 290 solas (sin tocar tu web) */
  var EXTRAS = {
    reservas: { precio: 190, solas: 290, obligaMant: true },
    senal:    { precio: 49, necesita: "reservas" },
    carta:    { precio: 79, necesitaWebOReservas: true },
    qr:       { precio: 49 },
    chatbot:  { precio: 190, mes: 15, obligaMant: true, necesitaWebOReservas: true },
    productos:{ porUnidad: 1, soloTienda: true },
    paginas:  { presupuesto: true, soloCon: ["negocio", "tienda"] },
    idiomas:  { presupuesto: true, necesitaWeb: true }
  };
  /* packs de la página: si la elección los contiene, se cobra el precio del pack */
  var PACKS = [
    { k: "pack_reservas",    tipo: "landing", extras: ["reservas"], precio: 549 },
    { k: "pack_restaurante", tipo: "negocio", extras: ["reservas", "carta"], precio: 699 },
    { k: "pack_rural",       tipo: "negocio", extras: ["reservas", "senal"], precio: 699 }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var txt = function (k) { var el = form.querySelector('[data-k="' + k + '"]'); return el ? el.textContent.trim() : ""; };
  var rellenar = function (p, d) { return p.replace(/\{(\w+)\}/g, function (_, k) { return d[k] != null ? d[k] : ""; }); };
  var eur = function (n) { return n.toLocaleString("es-ES") + " €"; };
  var nombreDe = function (caja) { var n = caja.closest(".calc__op").querySelector(".calc__n"); return n ? n.textContent.trim() : caja.name; };

  var lineas = $("c-lineas"), total = $("c-total"), mes = $("c-mes"), aparte = $("c-aparte"), dominio = $("c-dominio");
  var wa = $("c-wa"), cant = $("c-cant"), num = $("c-num"), pReservas = $("c-p-reservas"), pMant = $("c-p-mant"), mantNota = $("c-mant-nota");
  var mantCaja = form.elements.mant;
  var flota = $("c-flota");

  var fila = function (izq, der, clase) {
    var d = document.createElement("div");
    if (clase) d.className = clase;
    var a = document.createElement("span"); a.textContent = izq;
    var b = document.createElement("span"); b.textContent = der;
    d.appendChild(a); d.appendChild(b);
    return d;
  };
  var apagar = function (caja, si) {
    si = !!si;
    caja.disabled = si;
    if (si) caja.checked = false;
    caja.closest(".calc__op").classList.toggle("apagada", si);
  };

  var calcular = function () {
    var tipo = (form.querySelector('input[name="tipo"]:checked') || {}).value || "negocio";
    var t = TIPOS[tipo];
    var webNueva = tipo !== "ninguna";

    /* 1. qué extras se pueden elegir con esta web */
    Object.keys(EXTRAS).forEach(function (k) {
      var x = EXTRAS[k], caja = form.elements[k];
      if (!caja) return;
      var no = (x.soloTienda && tipo !== "tienda") ||
               (x.soloCon && x.soloCon.indexOf(tipo) < 0) ||
               (x.necesitaWeb && !webNueva) ||
               (x.necesita && !form.elements[x.necesita].checked) ||
               (x.necesitaWebOReservas && !webNueva && !form.elements.reservas.checked);
      apagar(caja, no);
    });
    /* una segunda vuelta por si al quitar las reservas se cae algo que dependía de ellas */
    ["senal", "carta", "chatbot"].forEach(function (k) {
      var x = EXTRAS[k];
      if ((x.necesita && !form.elements[x.necesita].checked) || (x.necesitaWebOReservas && !webNueva && !form.elements.reservas.checked)) apagar(form.elements[k], true);
    });
    pReservas.textContent = webNueva ? "+" + eur(EXTRAS.reservas.precio) : eur(EXTRAS.reservas.solas);
    cant.hidden = !form.elements.productos.checked;
    var unidades = form.elements.productos.checked ? Math.max(0, Math.min(5000, Math.floor(Number(num.value) || 0))) : 0;

    var elegidos = Object.keys(EXTRAS).filter(function (k) { return form.elements[k] && form.elements[k].checked; });

    /* 2. mantenimiento: obligatorio con reservas o chatbot; sin web mía ni reservas, no hace falta */
    var obliga = elegidos.some(function (k) { return EXTRAS[k].obligaMant; });
    var sinSentido = !webNueva && !obliga;
    if (obliga) mantCaja.checked = true;
    if (sinSentido) mantCaja.checked = false;
    mantCaja.disabled = obliga || sinSentido;
    mantCaja.closest(".calc__op").classList.toggle("apagada", sinSentido);
    mantNota.textContent = obliga ? txt("mant_obl") : sinSentido ? txt("mant_no") : txt("mant_opc");
    pMant.textContent = t.mant + " " + txt("pormes");

    /* 3. desglose */
    lineas.textContent = "";
    var suma = 0, partes = [], mensual = 0, porPresupuestar = [];
    if (webNueva) {
      lineas.appendChild(fila(txt(tipo), eur(t.precio)));
      partes.push(txt(tipo) + " (" + eur(t.precio) + ")");
      suma += t.precio;
    }
    elegidos.forEach(function (k) {
      var x = EXTRAS[k];
      if (x.presupuesto) { porPresupuestar.push(nombreDe(form.elements[k]).toLowerCase()); return; }
      if (k === "productos") {
        if (!unidades) return;
        var np = rellenar(txt("productos"), { n: unidades });
        lineas.appendChild(fila(np, "+" + eur(unidades * x.porUnidad)));
        partes.push(np + " (+" + eur(unidades * x.porUnidad) + ")");
        suma += unidades * x.porUnidad;
        return;
      }
      var precio = k === "reservas" && !webNueva ? x.solas : x.precio;
      var nombre = k === "reservas" && !webNueva ? txt("reservas_solas") : nombreDe(form.elements[k]);
      var signo = (k === "qr" || (k === "reservas" && !webNueva)) ? "" : "+";
      lineas.appendChild(fila(nombre, signo + eur(precio)));
      partes.push(nombre + " (" + signo + eur(precio) + (x.mes ? ", " + x.mes + " " + txt("pormes") : "") + ")");
      suma += precio;
      if (x.mes) mensual += x.mes;
    });

    /* 4. pack: el que más ahorra entre los que encajan; lo que sobra se suma aparte */
    var ahorro = function (p) { return TIPOS[p.tipo].precio + p.extras.reduce(function (s, k) { return s + EXTRAS[k].precio; }, 0) - p.precio; };
    var pack = PACKS.filter(function (p) {
      return p.tipo === tipo && p.extras.every(function (k) { return elegidos.indexOf(k) >= 0; });
    }).sort(function (a, b) { return ahorro(b) - ahorro(a); })[0];
    if (pack && ahorro(pack) > 0) {
      var antes = pack.precio + ahorro(pack);
      var np2 = rellenar(txt("en_vez"), { pack: txt(pack.k), antes: eur(antes) });
      lineas.appendChild(fila(np2, "−" + eur(ahorro(pack)), "ahorro"));
      partes.push(txt(pack.k) + " (−" + eur(ahorro(pack)) + ")");
      suma -= ahorro(pack);
    }

    /* 5. total, cuota y lo que va aparte */
    var nada = suma === 0 && !porPresupuestar.length;
    if (mantCaja.checked) mensual += t.mant;
    total.textContent = nada ? "—" : eur(suma) + " " + txt("iva");
    if (flota) flota.textContent = total.textContent;
    if (nada) lineas.appendChild(fila(txt("nada"), ""));
    var ques = [];
    if (mantCaja.checked) ques.push(txt("que_mant"));
    if (form.elements.chatbot.checked) ques.push(txt("que_chat"));
    mes.hidden = mensual === 0;
    mes.textContent = mensual ? rellenar(txt("mes"), { mes: eur(mensual), que: ques.join(" " + txt("y") + " ") }) : "";
    aparte.hidden = !porPresupuestar.length;
    aparte.textContent = porPresupuestar.length ? rellenar(txt("aparte"), { cosas: porPresupuestar.join(", ") }) : "";
    dominio.hidden = !webNueva;

    var texto = rellenar(txt("wa"), {
      lineas: partes.join(", "),
      total: eur(suma),
      mes: mensual ? " " + rellenar(txt("wa_mes"), { mes: eur(mensual) }) : "",
      aparte: porPresupuestar.length ? " " + rellenar(txt("wa_aparte"), { cosas: porPresupuestar.join(", ") }) : ""
    });
    wa.href = "https://wa.me/34611497409?text=" + encodeURIComponent(texto);
    wa.setAttribute("aria-disabled", nada ? "true" : "false");
    wa.style.pointerEvents = nada ? "none" : "";
    wa.style.opacity = nada ? ".5" : "";
  };

  form.addEventListener("change", calcular);
  form.addEventListener("input", function (e) { if (e.target === num) calcular(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); });

  /* ?plan=landing|negocio|tienda (también «web») para llegar con la web ya elegida */
  var plan = new URLSearchParams(location.search).get("plan");
  if (plan === "web") plan = "negocio";
  if (plan && TIPOS[plan]) { var r = form.querySelector('input[name="tipo"][value="' + plan + '"]'); if (r) r.checked = true; }
  calcular();
})();
