"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Locale = "es" | "eu";

export type Dictionary = {
  nav: { sections: { label: string; href: string }[]; menu: string; close: string };
  hero: { eyebrow: string; lines: string[]; subtitle: string; cta: string; cta2: string; badge: string; location: string; ratingLabel: string; secondaryAlt: string };
  marquee: { items: string[] };
  tiendas: {
    eyebrow: string;
    title: string[];
    intro: string;
    stores: Record<string, { tagline: string; imageAlt: string }>;
    routeCta: string;
    callCta: string;
    unverifiedHours: string;
    ratingLabel: string;
    opensAt: string;
  };
  mapa: {
    eyebrow: string;
    title: string[];
    intro: string;
  };
  horarios: {
    eyebrow: string;
    title: string[];
    intro: string;
    storeCol: string;
    todayLabel: string;
    note: string;
  };
  cronologia: {
    eyebrow: string;
    title: string[];
    steps: { year: string; title: string; text: string }[];
  };
  valores: {
    eyebrow: string;
    title: string[];
    items: { title: string; text: string }[];
  };
  historia: { eyebrow: string; title: string[]; paragraphs: string[]; imageAlt: string; accentAlt: string };
  horno: { eyebrow: string; title: string[]; paragraphs: string[]; imageAlt: string };
  pan: { eyebrow: string; title: string[]; paragraphs: string[]; imageAlt: string };
  proceso: {
    eyebrow: string;
    title: string;
    steps: { n: string; title: string; text: string }[];
  };
  productos: {
    eyebrow: string;
    title: string[];
    items: { name: string; description: string }[];
  };
  galeria: { eyebrow: string; title: string; alts: string[] };
  opiniones: {
    eyebrow: string;
    title: string[];
    avgLabel: string;
    reviewCount: string;
    readReviews: string;
    disclaimer: string;
    quotes: { text: string; name: string; role: string }[];
  };
  ubicacion: {
    eyebrow: string;
    hours: { day: string; time: string }[];
    cta: string;
    storesTitle: string;
    storesSubtitle: string;
    weekdayLabel: string;
    weekendLabel: string;
    tempClosed: string;
    unpublished: string;
    viewOnMaps: string;
    checkWeekend: string;
    openNow: string;
    closedNow: string;
  };
  contacto: {
    eyebrow: string;
    title: string[];
    text: string;
    follow: string;
    call: string;
    quickReply: string;
    form: {
      name: string;
      email: string;
      message: string;
      submit: string;
      sending: string;
      sentTitle: string;
      sentText: string;
    };
  };
  footer: { tagline: string; horario: string; navegacion: string; contacto: string; rights: string };
  common: { theme: string; whatsapp: string; backToTop: string; close: string; prev: string; next: string; view: string };
  pages: {
    historia: PageMeta;
    productos: PageMeta;
    tiendas: PageMeta;
    contacto: PageMeta;
  };
  explore: {
    eyebrow: string;
    title: string[];
    cards: { href: string; label: string; title: string; text: string }[];
    cta: string;
  };
  smart?: {
    nearestLabel: string;
    breadCounterLabel: string;
  };
};

type PageMeta = {
  eyebrow: string;
  title: string[];
  intro: string;
  stats: { value: string; suffix?: string; label: string }[];
};

const es: Dictionary = {
  nav: {
    menu: "Menú",
    close: "Cerrar",
    sections: [
      { label: "Inicio", href: "/" },
      { label: "Nuestra historia", href: "/historia" },
      { label: "Productos", href: "/productos" },
      { label: "Tiendas", href: "/tiendas" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  hero: {
    eyebrow: "Okindegia · Gozotegia · Tolosa",
    lines: ["Pan artesanal", "elaborado cada día"],
    subtitle: "Tradición, calidad y sabor desde el corazón de Tolosa.",
    cta: "Ver productos",
    cta2: "Dónde estamos",
    badge: "Desde Tolosa · Obrador propio",
    location: "Tolosa, Gipuzkoa",
    ratingLabel: "Valoración media en Google · Tolosa y Anoeta",
    secondaryAlt: "Detalle de la miga del pan artesanal",
  },
  marquee: {
    items: [
      "Pan artesanal",
      "Tradición vasca",
      "Producto local",
      "Tolosa y Anoeta",
      "Elaboración diaria",
    ],
  },
  tiendas: {
    eyebrow: "Nuestras tiendas",
    title: ["Tres tiendas,", "un mismo obrador"],
    intro:
      "Tres tiendas en el valle del Oria. El mismo pan, la misma masa y la misma gente detrás del mostrador desde 1996.",
    stores: {
      "tolosa-andia": {
        tagline: "En pleno casco viejo, a un paso de la plaza. La tienda donde empezó todo.",
        imageAlt: "Fachada de la tienda de Errotatxo en Andia Kalea, Tolosa",
      },
      "tolosa-san-frantzisko": {
        tagline:
          "Junto al paseo, camino del río. La panadería de los que pasan cada día a la misma hora.",
        imageAlt: "Pan de molde recién hecho en la tienda de San Frantzisko",
      },
      anoeta: {
        tagline: "En Anoeta no somos una panadería más: somos la del pueblo.",
        imageAlt: "Hogazas de pan tradicional en la tienda de Anoeta",
      },
    },
    routeCta: "Cómo llegar",
    callCta: "Llamar",
    unverifiedHours: "Horario orientativo — confírmalo antes de venir",
    ratingLabel: "en Google",
    opensAt: "Abre a las {time}",
  },
  mapa: {
    eyebrow: "En el mapa",
    title: ["Dónde", "encontrarnos"],
    intro: "Tolosa y Anoeta, a menos de cinco kilómetros la una de la otra.",
  },
  horarios: {
    eyebrow: "Horarios",
    title: ["A qué hora", "abrimos"],
    intro: "El pan sale del horno a primera hora. Estos son los horarios de cada tienda.",
    storeCol: "Tienda",
    todayLabel: "Hoy",
    note: "Los festivos pueden alterar el horario. Si vienes de lejos, llámanos antes.",
  },
  cronologia: {
    eyebrow: "Cronología",
    title: ["Del molino", "al mostrador"],
    steps: [
      {
        year: "1996",
        title: "Empieza Errotatxo",
        text: "Se constituye Okindegia Errotatxo en Andia Kalea, en el casco viejo de Tolosa. Un obrador, un horno y una tienda.",
      },
      {
        year: "El nombre",
        title: "Errota txo — el molinito",
        text: "En euskera, errota es molino. El nombre no es un invento comercial: viene del oficio de moler y amasar, que es de donde venimos.",
      },
      {
        year: "Tolosa",
        title: "Una segunda tienda",
        text: "San Frantzisko Pasealekua, junto al río. La misma masa, otro barrio y otra clientela: la de los que pasan cada día a la misma hora.",
      },
      {
        year: "Anoeta",
        title: "Fuera de Tolosa",
        text: "En un pueblo de dos mil habitantes, la panadería no es una tienda más. Es la del pueblo, y se trabaja como tal.",
      },
      {
        year: "Hoy",
        title: "Tres tiendas, un solo obrador",
        text: "Treinta años después seguimos amasando en casa y abriendo a las siete. Nada de eso ha cambiado, y no está previsto que cambie.",
      },
    ],
  },
  valores: {
    eyebrow: "Nuestros valores",
    title: ["Lo que nos define,", "pieza a pieza"],
    items: [
      { title: "Elaboración artesanal", text: "Elaboración propia en nuestro obrador, sin prisas ni atajos, como se ha hecho siempre en Errotatxo." },
      { title: "Ingredientes de calidad", text: "Harinas seleccionadas y materias primas cuidadas, sin aditivos innecesarios." },
      { title: "Tradición", text: "Recetas y técnicas transmitidas de generación en generación en el corazón de Gipuzkoa." },
      { title: "Producto local", text: "Tres tiendas que forman parte del día a día de Tolosa y Anoeta." },
    ],
  },
  historia: {
    eyebrow: "El origen",
    title: ["Desde 1996,", "en Andia Kalea"],
    paragraphs: [
      "Errotatxo abrió en 1996 en Andia Kalea, en el casco viejo de Tolosa. Aquella primera tienda sigue en el mismo sitio, con el mismo horno encendido antes de que amanezca y el mismo oficio detrás del mostrador.",
      "El nombre viene del euskera: errota es molino, y el diminutivo lo convierte en el molinito. No es una marca pensada en una reunión, es de donde venimos — de moler, amasar y hornear.",
      "Hoy somos tres tiendas: dos en Tolosa y una en Anoeta. Tres barrios distintos, un solo obrador y una manera de trabajar que no ha cambiado en treinta años.",
    ],
    imageAlt: "Fachada del obrador Errotatxo en Tolosa",
    accentAlt: "Pan artesanal recién horneado",
  },
  horno: {
    eyebrow: "El horno",
    title: ["El calor que", "despierta Tolosa"],
    paragraphs: [
      "Antes de que amanezca, el horno ya está encendido. Es el corazón silencioso del obrador: el que transforma masa, tiempo y paciencia en algo que solo se puede describir oliendo el aire de la calle.",
    ],
    imageAlt: "Calor del horno de Errotatxo, pan recién hecho",
  },
  pan: {
    eyebrow: "El pan",
    title: ["Corteza crujiente,", "miga honesta"],
    paragraphs: [
      "Largas fermentaciones, harinas de proximidad y ningún atajo. Así conseguimos un pan que se sostiene por sí solo: sin aditivos, sin prisa, sin artificios.",
    ],
    imageAlt: "Detalle de la corteza del pan artesanal de Errotatxo",
  },
  proceso: {
    eyebrow: "Proceso artesanal",
    title: "De la harina a la mesa",
    steps: [
      { n: "01", title: "Amasado", text: "Harinas seleccionadas y agua justa, trabajadas con el tiempo que cada masa necesita." },
      { n: "02", title: "Fermentación", text: "Reposos largos y lentos que desarrollan sabor, aroma y una miga alveolada y honesta." },
      { n: "03", title: "Formado", text: "Cada pieza se forma una a una, antes de su último reposo previo al horno." },
      { n: "04", title: "Horneado", text: "Calor intenso y constante hasta lograr una corteza dorada y crujiente, recién hecha cada día." },
    ],
  },
  productos: {
    eyebrow: "Productos",
    title: ["Lo que horneamos", "cada día"],
    items: [
      { name: "Pan tradicional", description: "Hogazas de corteza crujiente y miga alveolada, de fermentación lenta." },
      { name: "Bollería", description: "Piezas horneadas a diario y glaseadas de forma artesanal." },
      { name: "Pan de molde", description: "Masa madre propia, tierno por dentro, corteza dorada suave." },
      { name: "Pastelería", description: "Galletas y dulces preparados con mantequilla y chocolate seleccionados." },
      { name: "Especialidades de temporada", description: "Recetas vascas que cambian con el calendario y la proximidad." },
    ],
  },
  galeria: {
    eyebrow: "Un vistazo al obrador",
    title: "Galería",
    alts: [
      "Fachada de Errotatxo en Tolosa",
      "Hogazas de pan artesanal recién horneadas",
      "Bandeja de donuts artesanales",
      "Pastelería artesanal rellena de chocolate",
      "Galletas artesanales recién horneadas",
    ],
  },
  opiniones: {
    eyebrow: "Reseñas",
    title: ["Lo que dicen", "nuestros clientes"],
    avgLabel: "Valoración media en Google",
    reviewCount: "reseñas",
    readReviews: "Leer reseñas en Google",
    disclaimer: "Valoración y reseñas reales de la ficha de Google. Las tiendas sin ficha propia todavía no aparecen aquí.",
    // Reseñas reales de la ficha de Google de Tolosa — Andia. No se inventan
    // testimonios: si el cliente aporta más, se añaden aquí.
    quotes: [
      { text: "Excelente panadería y confitería en el corazón de Tolosa. Buen servicio.", name: "Reseña en Google", role: "Tolosa — Andia" },
      { text: "Buen servicio y productos, gente amable.", name: "Reseña en Google", role: "Tolosa — Andia" },
    ],
  },
  ubicacion: {
    eyebrow: "Visítanos",
    hours: [
      { day: "Lunes – Viernes", time: "7:00 – 19:00" },
      { day: "Sábado y domingo", time: "7:00 – 14:00" },
    ],
    cta: "Cómo llegar",
    storesTitle: "Nuestras tiendas",
    storesSubtitle: "Nuestras tiendas en Tolosa y Anoeta.",
    weekdayLabel: "Lunes a viernes",
    weekendLabel: "Sábado y domingo",
    tempClosed: "Cerrada temporalmente",
    unpublished: "Horario sin confirmar — llama antes de ir",
    viewOnMaps: "Ver en Google Maps",
    checkWeekend: "Fin de semana: consultar en Google Maps",
    openNow: "Abierto ahora",
    closedNow: "Cerrado ahora",
  },
  contacto: {
    eyebrow: "Hablemos",
    title: ["Hablemos"],
    text: "¿Quieres preguntarnos algo o consultar sobre nuestros productos? Escríbenos o llámanos y te atendemos encantados.",
    follow: "Síguenos",
    call: "Llámanos",
    quickReply: "Respuesta rápida",
    form: {
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      submit: "Enviar mensaje",
      sending: "Enviando...",
      sentTitle: "¡Mensaje enviado!",
      sentText: "Gracias por escribirnos, te responderemos muy pronto.",
    },
  },
  footer: {
    tagline: "Pan artesanal de Tolosa desde siempre.",
    horario: "Horario",
    navegacion: "Navegación",
    contacto: "Contacto",
    rights: "Todos los derechos reservados.",
  },
  common: {
    theme: "Cambiar modo de color",
    whatsapp: "Contactar por WhatsApp",
    backToTop: "Volver arriba",
    close: "Cerrar",
    prev: "Anterior",
    next: "Siguiente",
    view: "Ver",
  },
  pages: {
    historia: {
      eyebrow: "Nuestra historia",
      title: ["Treinta años", "amasando en Tolosa"],
      intro:
        "Errotatxo empezó en 1996 en Andia Kalea. Hoy son tres tiendas en Tolosa y Anoeta, y el mismo obrador detrás de todas.",
      stats: [
        { value: "1996", label: "Abrimos en Andia Kalea" },
        { value: "3", label: "Tiendas en el valle del Oria" },
        { value: "2", label: "Municipios: Tolosa y Anoeta" },
        { value: "1", label: "Obrador para las tres" },
      ],
    },
    productos: {
      eyebrow: "Productos",
      title: ["Lo que sale", "del horno"],
      intro:
        "Pan, bollería y pastelería elaborados cada día en nuestro obrador de Tolosa.",
      stats: [
        { value: "5", label: "Familias de producto" },
        { value: "100", suffix: " %", label: "Elaboración propia" },
        { value: "7", suffix: ":00", label: "Recién hecho cada mañana" },
        { value: "0", label: "Conservantes añadidos" },
      ],
    },
    tiendas: {
      eyebrow: "Tiendas",
      title: ["Cerca", "de ti"],
      intro:
        "Tres tiendas en Tolosa y Anoeta. Pasa a vernos: el pan sale del horno cada mañana.",
      stats: [
        { value: "3", label: "Tiendas en Gipuzkoa" },
        { value: "2", label: "Municipios" },
        { value: "7", suffix: ":00", label: "Abrimos cada mañana" },
        { value: "1996", label: "Desde" },
      ],
    },
    contacto: {
      eyebrow: "Contacto",
      title: ["Hablemos"],
      intro:
        "¿Quieres preguntarnos algo o consultar sobre nuestros productos? Escríbenos o llámanos y te atendemos encantados.",
      stats: [],
    },
  },
  explore: {
    eyebrow: "Descubre Errotatxo",
    title: ["Conoce", "la casa"],
    cards: [
      {
        href: "/historia",
        label: "01",
        title: "Nuestra historia",
        text: "Desde 1996 en Andia Kalea: de dónde viene el nombre y de dónde el oficio.",
      },
      {
        href: "/productos",
        label: "02",
        title: "Productos",
        text: "Pan tradicional, bollería, pan de molde y pastelería del día.",
      },
      {
        href: "/tiendas",
        label: "03",
        title: "Tiendas",
        text: "Tolosa y Anoeta: horarios, teléfonos y cómo llegar.",
      },
    ],
    cta: "Ver más",
  },
  smart: {
    nearestLabel: "Tu tienda más cercana",
    breadCounterLabel: "panes horneados hoy",
  },
};

const eu: Dictionary = {
  nav: {
    menu: "Menua",
    close: "Itxi",
    sections: [
      { label: "Hasiera", href: "/" },
      { label: "Gure historia", href: "/historia" },
      { label: "Produktuak", href: "/productos" },
      { label: "Dendak", href: "/tiendas" },
      { label: "Kontaktua", href: "/contacto" },
    ],
  },
  hero: {
    eyebrow: "Okindegia · Gozotegia · Tolosa",
    lines: ["Artisau-ogia,", "egunero egina"],
    subtitle: "Tradizioa, kalitatea eta zaporea Tolosako bihotzetik.",
    cta: "Ikusi produktuak",
    cta2: "Non gauden",
    badge: "Tolosatik · Gure lantegia",
    location: "Tolosa, Gipuzkoa",
    ratingLabel: "Googleko batez besteko balorazioa · Tolosa eta Anoeta",
    secondaryAlt: "Artisau-ogiaren mamiaren xehetasuna",
  },
  marquee: {
    items: [
      "Artisau-ogia",
      "Euskal tradizioa",
      "Bertako produktua",
      "Tolosa eta Anoeta",
      "Eguneroko elaborazioa",
    ],
  },
  tiendas: {
    eyebrow: "Gure dendak",
    title: ["Hiru denda,", "labe bera"],
    intro:
      "Hiru denda Oria bailaran. Ogi bera, ore bera eta jende bera mostradorearen atzean 1996tik.",
    stores: {
      "tolosa-andia": {
        tagline: "Alde Zaharraren erdian, plazatik pauso batera. Dena hasi zen denda.",
        imageAlt: "Errotatxoren fatxada Tolosako Andia Kalean",
      },
      "tolosa-san-frantzisko": {
        tagline:
          "Pasealekuaren ondoan, ibaira bidean. Egunero ordu berean pasatzen direnen okindegia.",
        imageAlt: "Moldeko ogi egin berria San Frantzisko dendan",
      },
      anoeta: {
        tagline: "Anoetan ez gara okindegi bat gehiago: herrikoa gara.",
        imageAlt: "Ogi tradizionala Anoetako dendan",
      },
    },
    routeCta: "Nola iritsi",
    callCta: "Deitu",
    unverifiedHours: "Ordutegi orientagarria — baieztatu etorri aurretik",
    ratingLabel: "Googlen",
    opensAt: "{time}etan irekitzen du",
  },
  mapa: {
    eyebrow: "Mapan",
    title: ["Non", "gauden"],
    intro: "Tolosa eta Anoeta, bata bestetik bost kilometro baino gutxiagora.",
  },
  horarios: {
    eyebrow: "Ordutegiak",
    title: ["Zer ordutan", "irekitzen dugun"],
    intro: "Ogia goizean goiz ateratzen da labetik. Hauek dira denda bakoitzaren ordutegiak.",
    storeCol: "Denda",
    todayLabel: "Gaur",
    note: "Jaiegunek ordutegia alda dezakete. Urrutitik bazatoz, deitu aurretik.",
  },
  cronologia: {
    eyebrow: "Kronologia",
    title: ["Errotatik", "mostradorera"],
    steps: [
      {
        year: "1996",
        title: "Errotatxo hasten da",
        text: "Okindegia Errotatxo Andia Kalean sortzen da, Tolosako Alde Zaharrean. Lantegi bat, labe bat eta denda bat.",
      },
      {
        year: "Izena",
        title: "Errota txo — errota txikia",
        text: "Euskaraz errota da izenaren erroa. Ez da bilera batean asmatutako marka: ehotzetik eta oratzetik dator, gu gatozen lekutik.",
      },
      {
        year: "Tolosa",
        title: "Bigarren denda",
        text: "San Frantzisko Pasealekua, ibaiaren ondoan. Ore bera, beste auzo bat eta beste bezeria: egunero ordu berean pasatzen direnena.",
      },
      {
        year: "Anoeta",
        title: "Tolosatik kanpo",
        text: "Bi mila biztanleko herri batean, okindegia ez da denda bat gehiago. Herrikoa da, eta horrela lan egiten da.",
      },
      {
        year: "Gaur",
        title: "Hiru denda, lantegi bakarra",
        text: "Hogeita hamar urte geroago, etxean oratzen jarraitzen dugu eta zazpietan irekitzen. Ez da ezer aldatu, eta ez dugu aldatzeko asmorik.",
      },
    ],
  },
  valores: {
    eyebrow: "Gure balioak",
    title: ["Definitzen gaituena,", "piezaz pieza"],
    items: [
      { title: "Artisau-elaborazioa", text: "Gure lantegiko elaborazio propioa, presarik eta lasterbiderik gabe, Errotatxon beti egin izan den bezala." },
      { title: "Kalitatezko osagaiak", text: "Irin hautatuak eta lehengai zainduak, beharrezkoak ez diren gehigarririk gabe." },
      { title: "Tradizioa", text: "Belaunaldiz belaunaldi Gipuzkoako bihotzean transmititutako errezetak eta teknikak." },
      { title: "Bertako produktua", text: "Tolosan eta Anoetan, euren herrietako egunerokotasuna osatzen duten hiru denda." },
    ],
  },
  historia: {
    eyebrow: "Jatorria",
    title: ["1996tik,", "Andia Kalean"],
    paragraphs: [
      "Errotatxo 1996an ireki zen Andia Kalean, Tolosako Alde Zaharrean. Lehen denda hura leku berean dago oraindik, labea eguna argitu aurretik piztuta eta ofizio bera mostradorearen atzean.",
      "Izena euskaratik dator: errota, eta txikigarriak errota txiki bihurtzen du. Ez da bilera batean asmatutako marka; ehotzetik, oratzetik eta laberatzetik gatoz.",
      "Gaur hiru denda gara: bi Tolosan eta bat Anoetan. Hiru auzo desberdin, lantegi bakarra eta hogeita hamar urtean aldatu ez den lan egiteko modu bat.",
    ],
    imageAlt: "Errotatxo lantegiaren fatxada Tolosan",
    accentAlt: "Artisau-ogi laberatu berria",
  },
  horno: {
    eyebrow: "Labea",
    title: ["Beroa,", "Tolosa esnatzen duena"],
    paragraphs: [
      "Eguna argitu baino lehen, labea piztuta dago. Lantegiaren bihotz isila da: masa, denbora eta pazientzia kaleko airea usainduz bakarrik deskriba daitekeen zerbait bihurtzen duena.",
    ],
    imageAlt: "Errotatxoko labearen beroa, ogi egin berria",
  },
  pan: {
    eyebrow: "Ogia",
    title: ["Azal karraskaria,", "mami zintzoa"],
    paragraphs: [
      "Hartzidura luzeak, hurbileko irinak eta lasterbiderik ez. Horrela, berez eusten zaion ogia lortzen dugu: gehigarririk gabe, presarik gabe, artifiziorik gabe.",
    ],
    imageAlt: "Errotatxoko artisau-ogiaren azalaren xehetasuna",
  },
  proceso: {
    eyebrow: "Artisau-prozesua",
    title: "Irinetik mahaira",
    steps: [
      { n: "01", title: "Oratzea", text: "Hautatutako irinak eta ur zuzena, masa bakoitzak behar duen denborarekin landuak." },
      { n: "02", title: "Hartzidura", text: "Atseden luze eta geldoak, zaporea, usaina eta mami albeolatu eta zintzoa garatzen dituztenak." },
      { n: "03", title: "Moldaketa", text: "Pieza bakoitza banan-banan sortzen da, labearen aurreko azken atsedena hartu aurretik." },
      { n: "04", title: "Laberatzea", text: "Bero handia eta etengabea, urre-koloreko azal kurruskaria lortu arte, egunero egin berria." },
    ],
  },
  productos: {
    eyebrow: "Produktuak",
    title: ["Egunero labean", "egiten duguna"],
    items: [
      { name: "Ogi tradizionala", description: "Azal karraskariko eta mami albeolatuko ogiak, hartzidura motelekoak." },
      { name: "Opilgintza", description: "Egunero laberatutako piezak, artisau erara glasatuak." },
      { name: "Moldeko ogia", description: "Ama-masa propioa, barrutik samurra, urre koloreko azal leuna." },
      { name: "Pastelgintza", description: "Aukeratutako gurin eta txokolatez prestatutako galletak eta gozokiak." },
      { name: "Sasoiko espezialitateak", description: "Egutegiarekin eta hurbiltasunarekin aldatzen diren euskal errezetak." },
    ],
  },
  galeria: {
    eyebrow: "Lantegiari begiratu bat",
    title: "Galeria",
    alts: [
      "Errotatxoko fatxada Tolosan",
      "Labetik atera berri diren ogi artisauak",
      "Artisau-donuten erretilua",
      "Txokolatez betetako artisau-pastelgintza",
      "Labetik atera berri diren artisau-galletak",
    ],
  },
  opiniones: {
    eyebrow: "Iritziak",
    title: ["Gure bezeroek", "diotena"],
    avgLabel: "Googleko batez besteko balorazioa",
    reviewCount: "iritzi",
    readReviews: "Irakurri iritziak Googlen",
    disclaimer: "Googleko fitxako benetako balorazioa eta iritziak. Fitxa propiorik ez duten dendak oraindik ez dira hemen agertzen.",
    // Google-ko iritzi errealak, jatorrizko hizkuntzan (ez dira itzultzen).
    quotes: [
      { text: "Excelente panadería y confitería en el corazón de Tolosa. Buen servicio.", name: "Iritzia Googlen", role: "Tolosa — Andia" },
      { text: "Buen servicio y productos, gente amable.", name: "Iritzia Googlen", role: "Tolosa — Andia" },
    ],
  },
  ubicacion: {
    eyebrow: "Bisitatu gaitzazu",
    hours: [
      { day: "Astelehena – Ostirala", time: "7:00 – 19:00" },
      { day: "Larunbata eta igandea", time: "7:00 – 14:00" },
    ],
    cta: "Nola iritsi",
    storesTitle: "Gure dendak",
    storesSubtitle: "Tolosa eta Anoetako gure dendak.",
    weekdayLabel: "Astelehenetik ostiralera",
    weekendLabel: "Larunbata eta igandea",
    tempClosed: "Aldi baterako itxita",
    unpublished: "Ordutegia baieztatu gabe — deitu joan aurretik",
    viewOnMaps: "Ikusi Google Maps-en",
    checkWeekend: "Asteburuan: kontsultatu Google Maps-en",
    openNow: "Orain irekita",
    closedNow: "Orain itxita",
  },
  contacto: {
    eyebrow: "Hitz egin dezagun",
    title: ["Hitz egin", "dezagun"],
    text: "Zerbait galdetu edo gure produktuei buruz kontsultatu nahi diguzu? Idatzi edo deitu, eta gustura lagunduko dizugu.",
    follow: "Jarraitu gaitzazu",
    call: "Deitu iezaguzu",
    quickReply: "Erantzun azkarra",
    form: {
      name: "Izena",
      email: "Emaila",
      message: "Mezua",
      submit: "Mezua bidali",
      sending: "Bidaltzen...",
      sentTitle: "Bidalitako mezua!",
      sentText: "Eskerrik asko idazteagatik. Laster erantzungo dizugu.",
    },
  },
  footer: {
    tagline: "Tolosako artisau-ogia betidanik.",
    horario: "Ordutegia",
    navegacion: "Nabigazioa",
    contacto: "Kontaktua",
    rights: "Eskubide guztiak erreserbatuta.",
  },
  common: {
    theme: "Kolore-modua aldatzea",
    whatsapp: "WhatsApp bidez harremanetan jartzea",
    backToTop: "Itzuli gora",
    close: "Itxi",
    prev: "Aurrekoa",
    next: "Hurrengoa",
    view: "Ikusi",
  },
  pages: {
    historia: {
      eyebrow: "Gure historia",
      title: ["Hogeita hamar urte", "Tolosan oratzen"],
      intro:
        "Errotatxo 1996an hasi zen Andia Kalean. Gaur hiru denda dira, Tolosan eta Anoetan, eta lantegi bera guztien atzean.",
      stats: [
        { value: "1996", label: "Andia Kalean ireki genuen" },
        { value: "3", label: "Denda Oria bailaran" },
        { value: "2", label: "Udalerri: Tolosa eta Anoeta" },
        { value: "1", label: "Lantegi hiruentzat" },
      ],
    },
    productos: {
      eyebrow: "Produktuak",
      title: ["Labetik", "ateratzen dena"],
      intro:
        "Ogia, opilgintza eta pastelgintza, egunero eginak Tolosako gure lantegian.",
      stats: [
        { value: "5", label: "Produktu familia" },
        { value: "100", suffix: " %", label: "Elaborazio propioa" },
        { value: "7", suffix: ":00", label: "Goizero egin berria" },
        { value: "0", label: "Kontserbatzaile gehiturik" },
      ],
    },
    tiendas: {
      eyebrow: "Dendak",
      title: ["Zure", "ondoan"],
      intro:
        "Hiru denda Tolosan eta Anoetan. Zatoz gurera: ogia goizero ateratzen da labetik.",
      stats: [
        { value: "3", label: "Denda Gipuzkoan" },
        { value: "2", label: "Udalerri" },
        { value: "7", suffix: ":00", label: "Goizero irekitzen dugu" },
        { value: "1996", label: "Urtetik" },
      ],
    },
    contacto: {
      eyebrow: "Kontaktua",
      title: ["Hitz egin", "dezagun"],
      intro:
        "Zerbait galdetu edo gure produktuei buruz kontsultatu nahi diguzu? Idatzi edo deitu, eta gustura lagunduko dizugu.",
      stats: [],
    },
  },
  explore: {
    eyebrow: "Ezagutu Errotatxo",
    title: ["Ezagutu", "etxea"],
    cards: [
      {
        href: "/historia",
        label: "01",
        title: "Gure historia",
        text: "1996tik Andia Kalean: nondik datorren izena eta nondik ofizioa.",
      },
      {
        href: "/productos",
        label: "02",
        title: "Produktuak",
        text: "Ogi tradizionala, opilgintza, moldeko ogia eta eguneko pastelgintza.",
      },
      {
        href: "/tiendas",
        label: "03",
        title: "Dendak",
        text: "Tolosa eta Anoeta: ordutegiak, telefonoak eta nola iritsi.",
      },
    ],
    cta: "Ikusi gehiago",
  },
  smart: {
    nearestLabel: "Zure denda hurbilena",
    breadCounterLabel: "gaur labetik ateratako ogiak",
  },
};

const dictionaries: Record<Locale, Dictionary> = { es, eu };

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const stored = window.localStorage.getItem("errotatxo-locale");
    if (stored === "es" || stored === "eu") setLocaleState(stored);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("errotatxo-locale", next);
    document.documentElement.lang = next;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: dictionaries[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}
