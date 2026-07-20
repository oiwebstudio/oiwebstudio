/* FAQs contextuales por negocio para el widget de reservas (widget.js).
   Se carga ANTES que widget.js con: <script src="../scripts/oib-faq.js" data-business="X"></script>
   El widget comprueba window.OIB_FAQ antes que sus respuestas genéricas.
   Ojo: las palabras reserv/cita/encargo las captura el flujo de reserva del widget,
   así que aquí solo van dudas informativas.

   Todos los datos (horarios, teléfono, dirección) están tomados literalmente
   del index.html de cada negocio — no inventar cifras nuevas al editar esto. */
(function () {
  var el = document.currentScript;
  var negocio = el && el.getAttribute("data-business");

  var FAQS = {
    gimnasio: [
      { k: ["plan", "precio", "tarifa", "cuota", "mensualidad", "cuanto"],
        a: "Sin permanencia, cancela cuando quieras:\n▸ FLEX — 29€/mes · sala + cardio, 24h\n▸ PULSE — 45€/mes · + clases ilimitadas (el más popular)\n▸ IRON — 69€/mes · + entrenador personal y nutrición\n\nY el primer día es gratis 💪" },
      { k: ["clase", "hiit", "spinning", "boxeo", "cross", "wod"],
        a: "28 clases a la semana: HIIT, spinning, movilidad, boxeo y cross training con WOD diario. Grupos de máximo 14 personas y la primera clase va incluida en tu día gratis." },
      { k: ["prueba", "gratis", "probar"],
        a: "El primer día es gratis y sin compromiso 🔥 Trae ropa de deporte y te enseñamos las instalaciones. Escribe \"reservar\" y te apunto." },
      { k: ["horario", "abierto", "hora", "24"],
        a: "⏰ Abierto 24 horas. Entras con tu tarjeta de acceso cuando quieras, sin esperas ni horarios cerrados." },
      { k: ["donde", "ubicacion", "direccion", "llegar"],
        a: "📍 Polígono Apattaerreka, s/n · 20400 Tolosa, Gipuzkoa." },
      { k: ["principiante", "experiencia", "empezar", "nunca he"],
        a: "No necesitas experiencia: principiantes y atletas entrenan en el mismo espacio y los entrenadores adaptan cada plan a tu nivel." }
    ],

    panaderia: [
      { k: ["pan", "hogaza", "masa madre", "integral", "barra"],
        a: "Todo con masa madre, fermentación lenta y harinas del país 🥖 Horneado cada día desde 1962." },
      { k: ["tarta", "reposteria", "dulce", "celebracion", "cumpleanos"],
        a: "Hacemos tartas y repostería de encargo 🎂 Escribe \"encargo\" y te decimos con cuánta antelación necesitamos el pedido." },
      { k: ["horario", "abierto", "hora", "domingo"],
        a: "⏰ Lunes a sábado: 7:00–14:00 y 17:00–20:00\nDomingo: 8:00–13:00" },
      { k: ["donde", "ubicacion", "direccion"],
        a: "📍 Tolosa, Gipuzkoa." },
      { k: ["gluten", "celiaco", "alergia"],
        a: "Para alergias o pan sin gluten, pregúntanos directamente y te decimos qué días los horneamos." }
    ],

    floristeria: [
      { k: ["ramo", "flores", "temporada", "cuanto"],
        a: "Ramos de temporada personalizados según ocasión y presupuesto 🌸 Escribe \"encargar\" y lo vemos." },
      { k: ["boda", "evento", "novia", "ceremonia"],
        a: "Hacemos ramo de novia, prendidos y decoración de ceremonia. Cuéntanos la fecha por WhatsApp y lo hablamos con calma." },
      { k: ["envio", "domicilio", "sorpresa", "mandar", "enviar"],
        a: "🚗 Encargos y envíos en Tolosaldea: pedidos antes de las 12:00, entrega el mismo día." },
      { k: ["horario", "abierto", "hora", "domingo"],
        a: "⏰ Lunes a sábado: 9:30–13:30 y 16:30–19:30\nDomingo: cerrado" },
      { k: ["donde", "ubicacion", "direccion"],
        a: "📍 Plaza Verdura 4, Tolosa (Gipuzkoa)." }
    ],

    cafeteria: [
      { k: ["carta", "menu", "que teneis", "comer", "bowl", "tostada"],
        a: "☕ Café, desayunos y algo dulce en un espacio tranquilo. Pregúntanos por lo que tenemos hoy en la vitrina." },
      { k: ["horario", "abierto", "hora"],
        a: "⏰ Lunes a viernes: 8:00–19:00\nSábado y domingo: 9:00–14:30" },
      { k: ["donde", "ubicacion", "direccion"],
        a: "📍 Calle Rondilla 3, Tolosa (Gipuzkoa)." },
      { k: ["trabajar", "portatil", "wifi", "estudiar"],
        a: "Es un buen sitio para sentarte con calma. Si necesitas mesa para rato, mejor entre semana fuera de las horas punta." }
    ],

    restaurante: [
      { k: ["carta", "menu", "plato", "que teneis"],
        a: "🍽️ Consulta la carta completa desde el botón \"Ver la carta completa\" de la web, o pregúntame algo concreto." },
      { k: ["horario", "abierto", "hora", "lunes", "martes"],
        a: "⏰ Miércoles a domingo: 13:00–15:30\nViernes y sábado también noche: 20:30–23:00\nLunes y martes: cerrado" },
      { k: ["grupo", "celebracion", "evento", "empresa"],
        a: "Para grupos de más de 8 personas, mejor llamar directamente: +34 600 00 00 00." },
      { k: ["donde", "ubicacion", "direccion", "aparcar"],
        a: "📍 Plaza Euskal Herria 2, Tolosa (Gipuzkoa)." }
    ],

    peluqueria: [
      { k: ["servicio", "precio", "cuanto", "tarifa", "corte"],
        a: "✂️ Escríbenos con el servicio que buscas (corte, color, tratamiento) y te confirmamos precio y disponibilidad." },
      { k: ["horario", "abierto", "hora", "lunes", "domingo"],
        a: "⏰ Martes a viernes: 9:30–19:00\nSábado: 9:00–14:00\nLunes: cerrado" },
      { k: ["donde", "ubicacion", "direccion"],
        a: "📍 Calle Correo 8, Tolosa (Gipuzkoa)." },
      { k: ["cancelar", "anular", "cambiar"],
        a: "Para cambiar o anular tu cita, escríbenos por WhatsApp o llama y la movemos sin problema." }
    ],

    taller: [
      { k: ["presupuesto", "precio", "cuanto", "tarifa"],
        a: "💶 Presupuesto cerrado por escrito antes de tocar una sola pieza — sin sorpresas. Cuéntanos qué le pasa al coche." },
      { k: ["averia", "ruido", "freno", "aceite", "neumatico", "rueda", "motor", "embrague", "bateria"],
        a: "🔧 Diagnóstico honesto y presupuesto cerrado antes de empezar. Te enseñamos con fotos lo que se cambia." },
      { k: ["horario", "abierto", "hora", "sabado"],
        a: "⏰ Lunes a viernes: 8:30–13:00 y 15:00–18:30" },
      { k: ["donde", "ubicacion", "direccion", "aparcar"],
        a: "📍 Polígono Usabal 12, Tolosa (Gipuzkoa)." }
    ],

    veterinaria: [
      { k: ["urgencia", "emergencia", "grave", "intoxica", "atropell"],
        a: "🚨 Urgencias 24 horas: 900 123 456. Llama antes de venir para que lo tengamos todo preparado." },
      { k: ["horario", "abierto", "hora"],
        a: "⏰ Consultas:\nLunes a viernes: 09:00–20:30\nSábados: 10:00–14:00\n\n🚨 Urgencias: 900 123 456, 24 horas." },
      { k: ["donde", "ubicacion", "direccion", "aparcar"],
        a: "📍 Calle Mayor 12, 20400 Tolosa, Gipuzkoa." },
      { k: ["vacuna", "desparasita", "cartilla", "servicio", "consulta"],
        a: "🐾 Consultas generales, vacunación y urgencias. Cuéntame qué necesita tu mascota y te oriento." }
    ]
  };

  if (negocio && FAQS[negocio]) {
    window.OIB_FAQ = FAQS[negocio];
  }
})();
