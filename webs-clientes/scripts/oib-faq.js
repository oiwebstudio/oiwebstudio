/* FAQs contextuales por negocio para el widget de reservas (widget.js).
   Se carga ANTES que widget.js con: <script src="../scripts/oib-faq.js" data-business="X"></script>
   El widget comprueba window.OIB_FAQ antes que sus respuestas genéricas.
   Ojo: las palabras reserv/cita/encargo las captura el flujo de reserva del widget,
   así que aquí solo van dudas informativas. */
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
        a: "El primer día es gratis y sin compromiso 🔥 Trae ropa de deporte y te enseñamos las 4 zonas: fuerza, cardio, clases y cross. Escribe \"reservar\" y te apunto." },
      { k: ["horario", "abierto", "hora", "24"],
        a: "⏰ Abierto 24 horas, 365 días. Entras con tu tarjeta cuando quieras, sin esperas para usar la máquina." },
      { k: ["donde", "ubicacion", "direccion", "llegar"],
        a: "📍 Polígono Apattaerreka, s/n · 20400 Tolosa. Tienes el mapa al final de la web." },
      { k: ["principiante", "experiencia", "empezar", "nunca he"],
        a: "No necesitas experiencia: principiantes y atletas entrenan en el mismo espacio y los entrenadores adaptan cada plan a tu nivel. La clase de iniciación de las 18:00 es perfecta para empezar." }
    ],

    panaderia: [
      { k: ["pan", "hogaza", "masa madre", "integral", "barra"],
        a: "Todo con masa madre, fermentación lenta y harinas del país 🥖 Hogaza, integral de 24h, barra de caserío, croissants y bollería artesana. Cada día desde 1962." },
      { k: ["tarta", "reposteria", "dulce", "celebracion", "cumpleanos"],
        a: "Hacemos tartas y repostería de encargo 🎂 Para celebraciones avísanos con 2-3 días. Escribe \"encargo\" y lo preparamos." },
      { k: ["hornada", "recien hecho", "caliente", "cuando sale"],
        a: "Salen dos hornadas al día 🔥 Primera a las 7:00 y segunda a las 17:30. Si vienes a esas horas, el pan aún está caliente." },
      { k: ["horario", "abierto", "hora", "domingo"],
        a: "⏰ Lunes a sábado: 7:00–14:00 y 17:00–20:30. Domingos cerrado — el horno también descansa." },
      { k: ["donde", "ubicacion", "direccion"],
        a: "📍 En el centro de Tolosa, al lado del mercado." },
      { k: ["gluten", "celiaco", "alergia"],
        a: "Trabajamos con harinas del país y algunos panes especiales por encargo. Para alergias o sin gluten, pregúntanos directamente y te decimos qué días los horneamos." }
    ],

    floristeria: [
      { k: ["ramo", "flores", "temporada", "cuanto"],
        a: "Trabajamos con flor de temporada y proximidad 🌿 Ramos desde 25€, personalizados según ocasión y presupuesto. Cada ramo se hace al momento — no hay dos iguales." },
      { k: ["boda", "evento", "novia", "ceremonia"],
        a: "Las bodas son lo nuestro 💐 Ramo de novia, prendidos, decoración de ceremonia y centros de mesa. Cuéntanos la fecha escribiendo \"encargo\" y lo hablamos con calma." },
      { k: ["envio", "domicilio", "sorpresa", "mandar", "enviar"],
        a: "🚗 Envíos a domicilio: mismo día en Tolosa si pides antes de las 12:00, resto de Gipuzkoa en 24h. Con tarjeta y dedicatoria escrita a mano." },
      { k: ["horario", "abierto", "hora", "domingo"],
        a: "⏰ Lunes a sábado: 9:00–14:00 y 16:00–19:30. Domingos y festivos, con encargo previo." },
      { k: ["donde", "ubicacion", "direccion"],
        a: "📍 En Tolosa. Pásate a ver la flor de la semana 🌸" },
      { k: ["suscripcion", "semanal", "cada semana"],
        a: "Tenemos suscripción de flores semanal o quincenal: flor fresca de temporada en tu casa o negocio sin tener que pensarlo. Pregúntanos y la montamos a tu medida." }
    ],

    cafeteria: [
      { k: ["carta", "menu", "que teneis", "comer", "bowl", "tostada"],
        a: "☕ Espresso, flat white, filtrados (V60, Aeropress, cold brew), tés, tostadas, bowls y repostería casera. Todo con nuestro tueste de la semana." },
      { k: ["tueste", "filtrado", "v60", "aeropress", "grano", "origen", "cafe para casa"],
        a: "Tostamos en pequeños lotes cada semana 🔥 Origen único rotativo y filtrados hechos al momento. También vendemos el café en grano o molido para casa — dinos cómo lo preparas y te recomendamos." },
      { k: ["tarta", "reposteria", "dulce", "cookie", "queso"],
        a: "Repostería casera horneada aquí 🍰 La tarta de queso es la que vuela primero; también carrot cake, cookies y cinnamon rolls. Opciones sin gluten según el día." },
      { k: ["horario", "abierto", "hora"],
        a: "⏰ Lunes a viernes: 8:00–21:00 · Sábados y domingos: 10:00–22:00. Un sitio para quedarse: wifi y enchufes." },
      { k: ["donde", "ubicacion", "direccion"],
        a: "📍 En Tolosa. Búscanos por el olor a tueste ☕" },
      { k: ["trabajar", "portatil", "wifi", "estudiar"],
        a: "Sí — wifi, enchufes y mesas tranquilas entre semana. Ven con el portátil; el café te lo vamos rellenando." }
    ],

    restaurante: [
      { k: ["carta", "menu", "plato", "chuleton", "pescado", "que teneis"],
        a: "Carta corta que cambia con el mercado 🔥 Chuletón madurado a la brasa, pescado del día según lonja, verduras a la parrilla, postres caseros y vinos naturales. Pregunta al llegar qué entró del mercado." },
      { k: ["horario", "abierto", "hora", "lunes"],
        a: "⏰ Martes a domingo · Comidas: 13:00–16:00 · Cenas: 19:30–23:00. Lunes cerrado — la brasa también descansa." },
      { k: ["grupo", "celebracion", "evento", "empresa"],
        a: "Para grupos de más de 8 lo organizamos aparte: menú cerrado y mesa tranquila. Escribe \"reservar\" con la fecha y os lo montamos." },
      { k: ["donde", "ubicacion", "direccion", "aparcar"],
        a: "📍 En el casco viejo de Tolosa. Los fines de semana la brasa se llena — mejor con reserva." },
      { k: ["vegetariano", "vegano", "alergia", "celiaco"],
        a: "La parrilla de verduras de temporada es plato principal por derecho propio 🥬 Avísanos de alergias al reservar y la cocina lo tiene en cuenta." },
      { k: ["vino", "bodega", "maridaje"],
        a: "Vinos naturales y de la tierra, carta corta y viva como la de cocina 🍷 Si te dejas aconsejar, el maridaje con la brasa es nuestra parte favorita." }
    ],

    peluqueria: [
      { k: ["servicio", "precio", "cuanto", "tarifa", "corte"],
        a: "✂️ Corte de autor, color (balayage, babylights), tratamientos de hidratación y keratina, peinados para eventos. Precio exacto tras diagnóstico — cada pelo es distinto." },
      { k: ["color", "tinte", "balayage", "mechas", "babylights"],
        a: "El color es lo nuestro 🎨 Balayage y babylights a mano, correcciones de color y siempre diagnóstico previo gratuito. Trae fotos de referencia y te decimos qué es viable para tu base." },
      { k: ["horario", "abierto", "hora", "lunes", "domingo"],
        a: "⏰ Martes a viernes: 10:00–20:00 · Sábado: 9:00–19:00 · Domingo y lunes cerrado. Solo con cita previa." },
      { k: ["donde", "ubicacion", "direccion"],
        a: "📍 En Tolosa." },
      { k: ["cuanto dura", "tiempo", "cuanto tarda"],
        a: "Un corte son 45–60 min; el color, 2–3 h con diagnóstico incluido. Si es tu primera visita, ven 10 min antes para hablar de tu pelo." },
      { k: ["cancelar", "anular", "cambiar"],
        a: "Para cambiar o anular tu cita avísanos con 24h y la movemos sin problema." }
    ],

    taller: [
      { k: ["presupuesto", "precio", "cuanto", "tarifa"],
        a: "Presupuesto sin compromiso 💶 Mándanos marca, modelo y qué le pasa (un vídeo del ruido ayuda mucho). Precio cerrado antes de tocar nada y garantía por escrito." },
      { k: ["averia", "ruido", "freno", "aceite", "neumatico", "rueda", "motor", "embrague", "bateria"],
        a: "🔧 Mecánica general, diagnosis electrónica, aceite y filtros, frenos, embrague, distribución, neumáticos, batería y aire acondicionado. Coche de cortesía según disponibilidad." },
      { k: ["itv", "inspeccion"],
        a: "Pre-ITV completa 📋 Revisamos luces, frenos, gases y holguras, arreglamos lo que fallaría y, si quieres, lo llevamos nosotros. Así vas una sola vez y a la primera." },
      { k: ["horario", "abierto", "hora", "sabado"],
        a: "⏰ Lunes a viernes: 9:00–13:30 y 15:30–19:30 · Sábado: 9:00–13:00. Puedes dejar el coche a primera hora sin cita." },
      { k: ["donde", "ubicacion", "direccion", "aparcar"],
        a: "📍 Polígono industrial de Tolosa. Entrada amplia — aparca dentro." },
      { k: ["garantia", "pieza"],
        a: "Garantía por escrito en piezas y mano de obra. Solo cambiamos lo que hace falta, y las piezas sustituidas te las enseñamos." }
    ],

    veterinaria: [
      { k: ["urgencia", "emergencia", "grave", "intoxica", "atropell"],
        a: "🚨 URGENCIAS 24H: llama al teléfono de la web a cualquier hora. Si ha ingerido algo tóxico, respira mal o ha sufrido un golpe fuerte, llama de camino y preparamos todo para su llegada." },
      { k: ["servicio", "que haceis", "cirugia", "rayos", "analisis"],
        a: "🐾 Medicina general, vacunas, cirugía, hospitalización, radiografía, ecografía, laboratorio propio (resultados en el día), dental y peluquería. Perros, gatos y exóticos." },
      { k: ["vacuna", "desparasita", "cartilla"],
        a: "💉 Vacunación y desparasitación con recordatorio por WhatsApp para que no se te pase ninguna. Si es la primera visita, trae su cartilla." },
      { k: ["horario", "abierto", "hora"],
        a: "⏰ Consultas con cita: lunes a viernes 9:00–14:00 y 16:00–20:00 · Sábado 10:00–14:00.\n🚨 Urgencias: 24h todos los días del año." },
      { k: ["donde", "ubicacion", "direccion", "aparcar"],
        a: "📍 En Tolosa, con aparcamiento fácil en la puerta." },
      { k: ["exotico", "conejo", "loro", "tortuga", "huron"],
        a: "Sí, atendemos exóticos: conejos, aves, reptiles y hurones. Dinos qué animal es al pedir cita para asignarte al veterinario adecuado 🦜" }
    ]
  };

  if (negocio && FAQS[negocio]) {
    window.OIB_FAQ = FAQS[negocio];
  }
})();
