/* Calculadora de precio (precios.html, #calculadora). Rehecha el 23/10/2026 con la
   oferta nueva; precios del 25/10/2026: presencia en Google 120, web bonita +
   presencia 540, landing 420, tienda 880, packs con reservas 580/740/740;
   cuotas: mantenimiento 28 €/mes (38 con tienda) o presencia 40 €/mes. Las reservas solo van en un pack, y en
   un pack la cuota es obligatoria. Todo + IVA, pago único al final.
   Los importes son EXACTAMENTE los de precios.html: si cambia uno en la página,
   hay que cambiarlo aquí también, y en el JSON-LD de index.html.
   Los textos salen de [data-t] de la página: en /eu/ ya vienen traducidos.
   No se guarda ni se envía nada: el botón solo abre WhatsApp con el texto escrito. */
(function () {
  "use strict";
  var form = document.getElementById("calc");
  if (!form) return;

  /* web: lleva una web hecha por mí · reservas: es un pack (cuota obligatoria) */
  var TIPOS = {
    presencia:        { precio: 120, web: false },
    landing:          { precio: 420, web: true },
    negocio:          { precio: 540, web: true, secciones: true },
    tienda:           { precio: 880, web: true, secciones: true, tienda: true },
    pack_reservas:    { precio: 580, web: true, reservas: true },
    pack_restaurante: { precio: 740, web: true, reservas: true, secciones: true },
    pack_rural:       { precio: 740, web: true, reservas: true, secciones: true }
  };
  var CUOTA = { mant: 28, mantTienda: 38, presencia: 40 };

  var $ = function (id) { return document.getElementById(id); };
  var txt = function (k) { var el = form.querySelector('[data-k="' + k + '"]'); return el ? el.textContent.trim() : ""; };
  var rellenar = function (p, d) { return p.replace(/\{(\w+)\}/g, function (_, k) { return d[k] != null ? d[k] : ""; }); };
  var eur = function (n) { return n.toLocaleString("es-ES") + " €"; };
  var nombreDe = function (caja) { var n = caja.closest(".calc__op").querySelector(".calc__n"); return n ? n.textContent.trim() : caja.name; };

  var lineas = $("c-lineas"), total = $("c-total"), mes = $("c-mes"), aparte = $("c-aparte"), dominio = $("c-dominio");
  var wa = $("c-wa"), cant = $("c-cant"), num = $("c-num"), pMant = $("c-p-mant"), flota = $("c-flota");
  var notas = { ninguna: $("c-nota-ninguna"), mant: $("c-nota-mant"), presencia: $("c-nota-presencia") };

  var fila = function (izq, der) {
    var d = document.createElement("div");
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
  var cuotaCaja = function (v) { return form.querySelector('input[name="cuota"][value="' + v + '"]'); };

  var calcular = function () {
    var tipo = (form.querySelector('input[name="tipo"]:checked') || {}).value || "negocio";
    var t = TIPOS[tipo];

    /* 1. extras que tienen sentido con lo elegido */
    apagar(form.elements.productos, !t.tienda);
    apagar(form.elements.paginas, !t.secciones);
    apagar(form.elements.idiomas, !t.web);
    cant.hidden = !form.elements.productos.checked;
    var unidades = form.elements.productos.checked ? Math.max(0, Math.min(5000, Math.floor(Number(num.value) || 0))) : 0;

    /* 2. cuota: con reservas, obligatoria; sin web mía, no hay mantenimiento;
          con tienda, la de presencia se prepara a medida */
    var cNinguna = cuotaCaja("ninguna"), cMant = cuotaCaja("mant"), cPres = cuotaCaja("presencia");
    apagar(cNinguna, t.reservas);
    apagar(cMant, !t.web);
    apagar(cPres, t.tienda);
    if (!form.querySelector('input[name="cuota"]:checked')) (t.reservas ? cMant : cNinguna).checked = true;
    notas.ninguna.textContent = t.reservas ? txt("ninguna_obl") : txt("ninguna_opc");
    notas.mant.textContent = !t.web ? txt("mant_no") : t.reservas ? txt("mant_obl") : txt("mant_opc");
    notas.presencia.textContent = t.tienda ? txt("pres_tienda") : txt("pres_opc");
    var precioMant = t.tienda ? CUOTA.mantTienda : CUOTA.mant;
    pMant.textContent = precioMant + " " + txt("pormes");
    var cuota = (form.querySelector('input[name="cuota"]:checked') || {}).value || "ninguna";

    /* 3. desglose */
    lineas.textContent = "";
    var suma = t.precio, partes = [txt(tipo) + " (" + eur(t.precio) + ")"], porPresupuestar = [];
    lineas.appendChild(fila(txt(tipo), eur(t.precio)));
    if (unidades) {
      var np = rellenar(txt("productos"), { n: unidades });
      lineas.appendChild(fila(np, "+" + eur(unidades)));
      partes.push(np + " (+" + eur(unidades) + ")");
      suma += unidades;
    }
    ["paginas", "idiomas"].forEach(function (k) {
      if (form.elements[k].checked) porPresupuestar.push(nombreDe(form.elements[k]).toLowerCase());
    });

    /* 4. total, cuota y lo que va aparte */
    var mensual = cuota === "mant" ? precioMant : cuota === "presencia" ? CUOTA.presencia : 0;
    var que = cuota === "mant" ? txt("que_mant") : txt("que_pres");
    total.textContent = eur(suma) + " " + txt("iva");
    if (flota) flota.textContent = total.textContent;
    mes.hidden = mensual === 0;
    mes.textContent = mensual ? rellenar(txt("mes"), { mes: eur(mensual), que: que }) : "";
    aparte.hidden = !porPresupuestar.length;
    aparte.textContent = porPresupuestar.length ? rellenar(txt("aparte"), { cosas: porPresupuestar.join(", ") }) : "";
    dominio.hidden = !t.web;

    var texto = rellenar(txt("wa"), {
      lineas: partes.join(", "),
      total: eur(suma),
      mes: mensual ? " " + mes.textContent : "",
      aparte: porPresupuestar.length ? " " + rellenar(txt("wa_aparte"), { cosas: porPresupuestar.join(", ") }) : ""
    });
    wa.href = "https://wa.me/34611497409?text=" + encodeURIComponent(texto);
  };

  form.addEventListener("change", calcular);
  form.addEventListener("input", function (e) { if (e.target === num) calcular(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); });

  /* ?plan=presencia|landing|negocio|tienda|pack_reservas… (también «web») para llegar con la opción ya elegida */
  var plan = new URLSearchParams(location.search).get("plan");
  if (plan === "web") plan = "negocio";
  if (plan && TIPOS[plan]) { var r = form.querySelector('input[name="tipo"][value="' + plan + '"]'); if (r) r.checked = true; }
  calcular();
})();
