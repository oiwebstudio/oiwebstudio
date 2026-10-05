/**
 * Páginas fuera de Gipuzkoa: la de toda España (trabajo a distancia) y las
 * tres comunidades limítrofes. Textos a mano; nada que no se pueda sostener.
 * El plan de pago, el dominio y el hosting repiten lo que ya dice precios.html.
 */
const PAGO = "La mitad al aceptar la propuesta y la otra mitad cuando la web está publicada. Si te viene mejor, lo hablamos y se paga a plazos. Los precios son sin IVA.";
const DOMINIO = "El primer año van incluidos: registro el dominio a tu nombre y dejo la web publicada con https. La web es tuya, no queda atada a mí. Desde el segundo año entran en el mantenimiento o, si no lo quieres, pagas solo dominio y alojamiento: 15 € al año.";
const VER = "Sí. Las webs del portfolio están publicadas y se pueden abrir y recorrer, y además te preparo una muestra con tu negocio, gratis y sin compromiso. Solo si te convence, seguimos.";
const REMOTO = "El precio es el mismo estés donde estés: landing desde 199€, Web Negocio desde 299€ y tienda online desde 790€ (+ IVA).";
const PRECIO = (donde) => ["¿Cuánto cuesta una web para un negocio de " + donde + "?", "Landing desde 199€, Web Negocio desde 299€ y tienda online desde 790€ (+ IVA), con precio cerrado por escrito y 30 días de ajustes incluidos. El precio es el mismo que en Gipuzkoa."];

export const ESPANA = [
  {
    slug: "diseno-web-negocios-espana", ambito: "España", nombre: "toda España",
    titulo: "Diseño web para negocios en toda España | OI Studio",
    desc: "Diseño y desarrollo de páginas web para negocios de toda España, a distancia y con precio cerrado desde 199€. Propuesta en 48h. Estudio en Tolosa (Gipuzkoa).",
    h1: "Diseño web para negocios en", acento: "toda España",
    lede: "Trabajo desde Tolosa, pero tu web no necesita que estemos en la misma ciudad. Videollamada, WhatsApp y una propuesta por escrito en 48 horas.",
    kw: "diseño web España, páginas web para negocios, diseñador web freelance, diseño web a distancia, página web autónomos, web para pymes",
    hechos: [["100 %", "A distancia, si quieres"], ["199€", "Desde, precio cerrado"], ["48h", "Propuesta"], ["30 días", "Ajustes incluidos"]],
    k: "A distancia", h2: "Cómo se hace una web sin vernos en persona",
    texto: [
      "Muchos negocios me escriben desde fuera de Gipuzkoa y el proceso es el mismo: hablamos 15 minutos por videollamada o por WhatsApp, te mando la propuesta con el precio cerrado y, cuando la aceptas, voy enseñándote la web por un enlace privado hasta que está lista.",
      "La web no depende de dónde estés tú, pero sí de dónde está tu cliente. Por eso cada proyecto se escribe para tu ciudad y tu comarca —con los nombres con los que la gente busca de verdad— y la ficha de Google Business se prepara para tu zona de servicio.",
    ],
    pull: REMOTO,
    sectores: ["Comercio y alimentación", "Hostelería y restauración", "Salud y estética", "Talleres y oficios", "Despachos y servicios profesionales", "Turismo rural y alojamiento"],
    pasos: [["Videollamada de 15 min", "Me cuentas qué haces y qué necesitas. Sin compromiso."], ["Propuesta en 48h", "Estructura, referencias y precio cerrado por escrito."], ["Revisas con un enlace privado", "Ves la web mientras se construye y me dices qué cambiarías."], ["Publico y acompaño", "Dominio a tu nombre y 30 días de ajustes gratis."]],
    faq: [
      ["¿Trabajas con negocios de fuera de Gipuzkoa?", "Sí. El estudio está en Tolosa, pero una web se puede hacer a distancia sin perder nada: videollamada, WhatsApp y un enlace privado para revisar. El precio es el mismo que para un negocio de Tolosa."],
      ["¿Necesito reunirme en persona?", "No. Si estás en Gipuzkoa y prefieres vernos, quedamos; si no, con una videollamada y las fotos y textos que ya tengas es suficiente. Si no tienes fotos buenas, te oriento sobre cómo hacerlas con el móvil o puedes contratar a un fotógrafo de tu zona."],
      ["¿Cómo se paga?", PAGO],
      ["¿Qué pasa con el dominio y el hosting?", DOMINIO],
      ["¿Puedo ver ejemplos antes de decidir?", VER],
      ["¿Hay ayudas para pagar la web fuera de Gipuzkoa?", "Las ayudas que tengo recopiladas son de ayuntamientos y entidades de Gipuzkoa. Fuera, cada comunidad y cada ayuntamiento tiene lo suyo: conviene mirar en el tuyo o en tu cámara de comercio antes de empezar la web."],
    ],
  },
  {
    slug: "diseno-web-bizkaia", ambito: "Bizkaia", nombre: "Bizkaia",
    titulo: "Diseño web en Bizkaia | Páginas web para negocios | OI Studio",
    desc: "Diseño y desarrollo de páginas web para negocios de Bizkaia (Bilbao, Uribe, Urdaibai, Durangaldea), a distancia y con precio cerrado desde 199€. Propuesta en 48h.",
    h1: "Diseño web en", acento: "Bizkaia",
    lede: "Bilbao, la costa de Uribe, Urdaibai y el Duranguesado: cuatro formas distintas de buscar en Google. Webs a distancia con precio cerrado.",
    kw: "diseño web Bizkaia, páginas web Bilbao, diseño web Vizcaya, diseñador web Bilbao, web negocio Bizkaia",
    hechos: [["A distancia", "Videollamada y WhatsApp"], ["199€", "Desde, precio cerrado"], ["48h", "Propuesta"], ["Euskera", "Y castellano si lo pides"]],
    k: "Bizkaia", h2: "Cómo se busca en Bizkaia",
    texto: [
      "Bizkaia es el mercado más grande de Euskadi y también el más competido. Bilbao y su área metropolitana concentran agencias y estudios de todos los tamaños; fuera de ahí, cada comarca tiene su propia realidad: la costa de Uribe y Urdaibai viven mucho del visitante, con Getxo, Mundaka o Bermeo; Durangaldea tiene un tejido industrial fuerte, y Enkarterri un comercio muy de pueblo.",
      "Mi hueco no son las cuentas grandes, sino el negocio local que necesita una web clara, rápida y bien encontrada en su zona, sin pagar precio de capital. Trabajo a distancia: videollamada, WhatsApp y un enlace privado para revisar la web mientras se construye.",
    ],
    pull: REMOTO,
    sectores: ["Hostelería y turismo de costa", "Industria y servicios técnicos", "Comercio de proximidad", "Salud y estética", "Oficios y reformas"],
    faq: [
      ["¿Trabajas en Bizkaia si el estudio está en Tolosa?", "Sí. Una web se hace a distancia sin perder nada: videollamada, WhatsApp y un enlace privado para revisar. Si prefieres vernos en persona, lo hablamos y quedamos a medio camino."],
      ["¿Compites con las agencias de Bilbao?", "No por las cuentas grandes. Trabajo con el comercio, la hostelería y los servicios que necesitan una web clara y bien posicionada en su zona, con precio cerrado y propuesta en 48 horas."],
      PRECIO("Bizkaia"),
      ["¿Puedes hacerla en euskera?", "Sí: en castellano, en euskera o en las dos lenguas con el mismo diseño. Lo vemos en la propuesta."],
    ],
  },
  {
    slug: "diseno-web-alava-araba", ambito: "Álava", nombre: "Álava (Araba)",
    titulo: "Diseño web en Álava (Araba) | OI Studio",
    desc: "Diseño y desarrollo de páginas web para negocios de Álava (Araba): Vitoria-Gasteiz, Rioja Alavesa, Llanada y Ayala. A distancia, desde 199€ y con propuesta en 48h.",
    h1: "Diseño web en", acento: "Álava",
    lede: "Vitoria-Gasteiz, la Llanada, la Rioja Alavesa y el valle de Ayala. Webs a distancia para negocios locales, con precio cerrado.",
    kw: "diseño web Álava, diseño web Araba, páginas web Vitoria-Gasteiz, diseñador web Vitoria, web bodega Rioja Alavesa",
    hechos: [["A distancia", "Videollamada y WhatsApp"], ["199€", "Desde, precio cerrado"], ["48h", "Propuesta"], ["Euskera", "Y castellano si lo pides"]],
    k: "Álava", h2: "Cómo se busca en Araba",
    texto: [
      "Álava tiene a Vitoria-Gasteiz, capital de Euskadi, con comercio, servicios e industria, y alrededor territorios muy distintos: la Llanada con su tejido industrial y agroalimentario, la Rioja Alavesa con bodegas y enoturismo —Laguardia, Elciego—, Añana con sus salinas y el valle de Ayala. Una bodega, un alojamiento rural y una tienda de barrio en Vitoria buscan en Google de maneras distintas, y la web tiene que estar escrita para cada una.",
      "Trabajo a distancia: videollamada, WhatsApp y un enlace privado para revisar la web mientras se construye. Para bodegas y alojamientos, la información práctica —visitas, reservas, cómo llegar— va al frente y en más de un idioma si tu visitante lo pide.",
    ],
    pull: REMOTO,
    sectores: ["Bodegas y enoturismo", "Hostelería y alojamiento rural", "Comercio y servicios en Vitoria-Gasteiz", "Industria y agroalimentación", "Oficios y reformas"],
    faq: [
      ["¿Haces webs para negocios de Álava?", "Sí, a distancia. El estudio está en Tolosa, pero el proceso funciona igual por videollamada y WhatsApp, con un enlace privado para revisar la web."],
      ["¿Haces webs para bodegas y alojamientos de la Rioja Alavesa?", "Sí. Es un tipo de negocio que vive del visitante: la web muestra las visitas, los horarios y la reserva con claridad, con fotos propias y en varios idiomas si hace falta."],
      PRECIO("Álava"),
    ],
  },
  {
    slug: "diseno-web-navarra", ambito: "Navarra", nombre: "Navarra",
    titulo: "Diseño web en Navarra | Páginas web para negocios | OI Studio",
    desc: "Diseño y desarrollo de páginas web para negocios de Navarra: Pamplona, Ribera, Tierra Estella y Pirineo. A distancia, desde 199€ y con propuesta en 48h.",
    h1: "Diseño web en", acento: "Navarra",
    lede: "Iruña-Pamplona, la Ribera, Tierra Estella y el Pirineo. Webs a distancia para negocios locales, con precio cerrado.",
    kw: "diseño web Navarra, páginas web Pamplona, diseñador web Pamplona, diseño web Iruña, web negocio Navarra",
    hechos: [["A distancia", "Videollamada y WhatsApp"], ["199€", "Desde, precio cerrado"], ["48h", "Propuesta"], ["Euskera", "Y castellano si lo pides"]],
    k: "Navarra", h2: "Cómo se busca en Navarra",
    texto: [
      "Navarra se busca de formas muy distintas según la zona: en Iruña-Pamplona hay comercio, servicios y mucha competencia; la Ribera, con Tudela, tiene agroalimentación y comercio de pueblo; Tierra Estella vive en buena parte del Camino de Santiago y del turismo; y el Pirineo —Roncal, Baztan, Salazar— depende del visitante de fin de semana y de vacaciones. Cada zona pide una web con el foco puesto en lo que busca su cliente.",
      "Trabajo a distancia: videollamada, WhatsApp y un enlace privado para revisar la web mientras se construye. Si tu negocio está en una zona vascófona, la preparo en castellano y euskera con el mismo diseño.",
    ],
    pull: REMOTO,
    sectores: ["Turismo rural y alojamiento", "Hostelería y bodegas", "Comercio y servicios", "Agroalimentación", "Oficios y reformas"],
    faq: [
      ["¿Haces webs para negocios de Navarra?", "Sí, a distancia. El estudio está en Tolosa, a una hora de Pamplona, pero el proceso funciona igual por videollamada y WhatsApp, con un enlace privado para revisar la web."],
      ["¿Puedes hacer la web en euskera y castellano?", "Sí: las dos lenguas con el mismo diseño, o solo una de ellas. Lo vemos en la propuesta."],
      PRECIO("Navarra"),
    ],
  },
];
