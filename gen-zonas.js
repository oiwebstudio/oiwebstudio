/* Generador de páginas de zona (SEO local).
   Cada localidad tiene contenido propio: contexto económico real, sectores
   dominantes, distancia y referencias locales. NO son plantillas clonadas
   cambiando el nombre — Google penaliza eso como doorway pages. */
const fs = require('fs');

const FONTS = 'https://fonts.googleapis.com/css2?family=Geist:wght@400;450;500;600;700&family=Geist+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@1,9..144,500&display=swap';
const CSS_V = 'assets/styles.css?v=9';
const JS_V = 'assets/main.js?v=6';

const ZONAS = [
  {
    slug: 'ibarra', name: 'Ibarra', eu: 'Ibarra', comarca: 'Tolosaldea',
    dist: '2 km de Tolosa', pob: '4.300 habitantes',
    lede: 'Ibarra y Tolosa comparten calle, comercio y clientela. Trabajo con negocios de Ibarra desde aquí al lado: puedo pasarme a hacer las fotos y volver por la tarde si hace falta.',
    contexto: 'Ibarra está pegada a Tolosa: mucha gente vive en una y compra en la otra. Eso significa que tu web no compite solo con los negocios de Ibarra, sino con los de Tolosa que salen antes en Google. Trabajar bien el SEO local aquí es especialmente rentable, porque el término "Ibarra" tiene mucha menos competencia que "Tolosa" y la clientela es la misma.',
    sectores: ['Comercio de barrio y alimentación', 'Talleres y servicios técnicos', 'Hostelería y sidrerías', 'Servicios profesionales'],
    gancho: 'Al estar a dos kilómetros, las reuniones son presenciales sin coste añadido y las fotos del negocio las hago yo mismo.',
    ejemplo: 'panaderia', ejemploTxt: 'Panadería artesana', ejemploImg: 'pan-desk'
  },
  {
    slug: 'villabona', name: 'Villabona', eu: 'Billabona', comarca: 'Tolosaldea',
    dist: '9 km de Tolosa', pob: '6.000 habitantes (con Amasa)',
    lede: 'Villabona-Amasa tiene tejido industrial y comercio de proximidad. Diseño webs para negocios de aquí con precio cerrado y propuesta en 48 horas.',
    contexto: 'Villabona combina polígono industrial con comercio de calle, y son dos públicos que buscan de forma muy distinta. Una empresa industrial necesita una web que transmita solvencia técnica a otras empresas; una tienda del centro necesita salir en el móvil de quien busca "cerca de mí". Enfoco cada proyecto según cuál de los dos eres.',
    sectores: ['Industria y subcontratación', 'Comercio de proximidad', 'Hostelería', 'Construcción y reformas'],
    gancho: 'Si tienes empresa en el polígono, la web puede funcionar como catálogo técnico y captación B2B, no solo como tarjeta de visita.',
    ejemplo: 'taller', ejemploTxt: 'Taller mecánico', ejemploImg: 'taller-desk'
  },
  {
    slug: 'anoeta', name: 'Anoeta', eu: 'Anoeta', comarca: 'Tolosaldea',
    dist: '4 km de Tolosa', pob: '2.000 habitantes',
    lede: 'En un pueblo de 2.000 habitantes el boca a boca funciona, pero solo llega hasta donde llega. Una web te abre a toda Tolosaldea.',
    contexto: 'En Anoeta ya te conoce quien te tiene que conocer. El problema es el cliente nuevo: el que se acaba de mudar, el que viene de Tolosa o Irura, el que busca en Google antes de llamar. Para un negocio de pueblo pequeño, la web no sustituye al boca a boca — lo amplía a los pueblos de al lado.',
    sectores: ['Servicios a domicilio', 'Hostelería y ocio', 'Oficios y reformas', 'Comercio local'],
    gancho: 'Para negocios pequeños suele bastar una landing bien hecha a 199€: una página, tus servicios, tu teléfono y salir en Google Maps.',
    ejemplo: 'floristeria', ejemploTxt: 'Floristería', ejemploImg: 'flor-desk'
  },
  {
    slug: 'alegia', name: 'Alegia', eu: 'Alegia', comarca: 'Tolosaldea',
    dist: '8 km de Tolosa', pob: '1.800 habitantes',
    lede: 'Alegia y el alto Oria: negocios que sirven a varios pueblos a la vez y necesitan que se les encuentre desde todos ellos.',
    contexto: 'Los negocios de Alegia rara vez viven solo de Alegia: dan servicio a Ikaztegieta, Orendain, Baliarrain o Altzo. Eso cambia cómo hay que plantear la web — el área de servicio tiene que quedar explícita, tanto en los textos como en la ficha de Google, o solo apareces cuando alguien busca literalmente el nombre de tu pueblo.',
    sectores: ['Servicios rurales y agrícolas', 'Oficios y mantenimiento', 'Hostelería de carretera', 'Comercio y alimentación'],
    gancho: 'Configuro el área de servicio para que aparezcas en las búsquedas de todos los pueblos a los que realmente das servicio.',
    ejemplo: 'restaurante', ejemploTxt: 'Restaurante', ejemploImg: 'rest-desk'
  },
  {
    slug: 'andoain', name: 'Andoain', eu: 'Andoain', comarca: 'Buruntzaldea',
    dist: '15 km de Tolosa', pob: '15.000 habitantes',
    lede: 'Andoain tiene volumen suficiente para que el SEO local marque diferencia real: hay competencia, y quien la trabaja se lleva las llamadas.',
    contexto: 'Con 15.000 habitantes y un tejido comercial denso, en Andoain sí hay competencia por las búsquedas. Aquí no basta con existir en internet: si buscas "fisioterapeuta Andoain" o "reformas Andoain" hay varias opciones, y las tres primeras del mapa se llevan la mayoría de los clics. La diferencia la marcan la ficha de Google, las reseñas y la velocidad de la web.',
    sectores: ['Salud y bienestar', 'Reformas y construcción', 'Hostelería', 'Comercio y moda', 'Automoción'],
    gancho: 'En mercados con competencia real reviso también tu ficha de Google Business, no solo la web — es donde se decide el orden en el mapa.',
    ejemplo: 'gimnasio', ejemploTxt: 'Gimnasio', ejemploImg: 'gym-desk'
  },
  {
    slug: 'lasarte-oria', name: 'Lasarte-Oria', eu: 'Lasarte-Oria', comarca: 'Buruntzaldea',
    dist: '20 km de Tolosa', pob: '18.000 habitantes',
    lede: 'Lasarte-Oria es zona de paso y de comercio fuerte. Webs rápidas para negocios que compiten por el cliente que decide en el móvil.',
    contexto: 'Lasarte-Oria concentra mucho comercio y servicios en poco espacio, con clientela propia y de Donostia. La búsqueda dominante aquí es desde el móvil y con intención inmediata: horarios, teléfono, cómo llegar. Si tu web tarda tres segundos en cargar en 4G, pierdes justo al cliente que ya había decidido comprarte.',
    sectores: ['Comercio y retail', 'Hostelería y restauración', 'Servicios profesionales', 'Estética y peluquería', 'Deporte y ocio'],
    gancho: 'Optimizo para móvil primero: horarios y teléfono visibles sin hacer scroll, y carga por debajo de dos segundos.',
    ejemplo: 'peluqueria', ejemploTxt: 'Peluquería', ejemploImg: 'pelu-desk'
  },
  {
    slug: 'hernani', name: 'Hernani', eu: 'Hernani', comarca: 'Donostialdea',
    dist: '22 km de Tolosa', pob: '20.000 habitantes',
    lede: 'Hernani tiene sidrerías, comercio de calle y mucho negocio familiar con años de oficio y ninguna presencia en internet.',
    contexto: 'En Hernani me encuentro mucho negocio con veinte o treinta años de trayectoria y sin web, o con una hecha hace una década que ya no abre bien en el móvil. El valor no está en "modernizar por modernizar": está en que la reputación que ya tienes en la calle también exista cuando alguien te busca en Google por primera vez.',
    sectores: ['Sidrerías y hostelería', 'Comercio tradicional', 'Oficios y reformas', 'Servicios profesionales', 'Alimentación'],
    gancho: 'Si ya tienes web pero es antigua, te digo gratis si merece la pena rehacerla o solo arreglarla.',
    ejemplo: 'restaurante', ejemploTxt: 'Restaurante', ejemploImg: 'rest-desk'
  },
  {
    slug: 'beasain', name: 'Beasain', eu: 'Beasain', comarca: 'Goierri',
    dist: '20 km de Tolosa', pob: '14.000 habitantes',
    lede: 'Beasain y el Goierri: industria potente y una red de proveedores y servicios que también necesita explicarse bien online.',
    contexto: 'Beasain es el corazón industrial del Goierri, y alrededor de la industria hay todo un ecosistema de talleres, ingenierías, transporte y servicios. Para estos negocios la web tiene un papel distinto: no busca volumen de visitas, busca credibilidad ante un responsable de compras que te está comparando con otros dos proveedores.',
    sectores: ['Industria y metal', 'Ingeniería y servicios técnicos', 'Transporte y logística', 'Hostelería', 'Comercio'],
    gancho: 'Para empresas B2B priorizo claridad técnica y prueba de solvencia por encima de la estética llamativa.',
    ejemplo: 'taller', ejemploTxt: 'Taller mecánico', ejemploImg: 'taller-desk'
  },
  {
    slug: 'ordizia', name: 'Ordizia', eu: 'Ordizia', comarca: 'Goierri',
    dist: '22 km de Tolosa', pob: '9.500 habitantes',
    lede: 'Ordizia vive de su mercado y del producto local. Webs para productores y comercios que quieren vender más allá del miércoles.',
    contexto: 'El mercado de Ordizia trae clientela de toda Gipuzkoa un día a la semana. La oportunidad está en el resto de días: un productor o un comercio con web y pedidos online deja de depender del puesto físico y del calendario. He montado sistemas de encargos para panadería y alimentación que funcionan exactamente con esa lógica.',
    sectores: ['Alimentación y producto local', 'Caseríos y productores', 'Comercio de calle', 'Hostelería', 'Servicios'],
    gancho: 'Puedo integrar encargos o reservas para que el cliente pida desde casa el resto de la semana.',
    ejemplo: 'panaderia', ejemploTxt: 'Panadería artesana', ejemploImg: 'pan-desk'
  },
  {
    slug: 'azpeitia', name: 'Azpeitia', eu: 'Azpeitia', comarca: 'Urola Erdia',
    dist: '30 km de Tolosa', pob: '15.000 habitantes',
    lede: 'Azpeitia recibe visitantes todo el año por Loiola. Si tu negocio depende de gente de fuera, la web deja de ser opcional.',
    contexto: 'En Azpeitia hay dos clientelas: la de siempre, que ya te conoce, y la que llega de fuera y no ha oído hablar de ti en su vida. Esa segunda te busca en el móvil con criterios muy concretos: horarios, si hay que reservar, si tienes menú, cómo llegar. Un negocio que responde bien a eso capta visitantes; uno que no, los pierde ante el de al lado.',
    sectores: ['Hostelería y restauración', 'Alojamiento y turismo', 'Comercio', 'Servicios y salud', 'Industria'],
    gancho: 'Para negocios con clientela de paso trabajo la web en dos idiomas y con la información práctica siempre visible.',
    ejemplo: 'cafeteria', ejemploTxt: 'Cafetería', ejemploImg: 'cafe-desk'
  },

  /* ---- Ciudades principales de Gipuzkoa ---- */
  {
    slug: 'donostia-san-sebastian', name: 'Donostia-San Sebastián', eu: 'Donostia', comarca: 'Donostialdea',
    dist: '26 km de Tolosa', pob: '190.000 habitantes',
    lede: 'En Donostia hay agencias de sobra y presupuestos de cinco cifras. Yo trabajo con el negocio de barrio que necesita una web buena sin pagar precio de capital.',
    contexto: 'Donostia es el mercado más competido de Gipuzkoa: hay estudios grandes, agencias con equipo comercial y presupuestos que empiezan donde los míos acaban. Mi hueco no es competir con ellos por la cuenta de una multinacional, sino atender al comercio de Gros, Egia o Amara que necesita una web rápida y bien posicionada en su barrio, con precio cerrado y sin proyecto de seis meses.',
    sectores: ['Hostelería y restauración', 'Comercio y moda', 'Turismo y alojamiento', 'Servicios profesionales', 'Salud y bienestar', 'Estética'],
    gancho: 'En Donostia la búsqueda relevante casi nunca es "Donostia" a secas, sino el barrio: trabajo el SEO a ese nivel.',
    ejemplo: 'cafeteria', ejemploTxt: 'Cafetería', ejemploImg: 'cafe-desk'
  },
  {
    slug: 'irun', name: 'Irun', eu: 'Irun', comarca: 'Bidasoa',
    dist: '45 km de Tolosa', pob: '63.000 habitantes',
    lede: 'Irun es frontera, logística y comercio con clientela de dos países. La web tiene que funcionar igual de bien para quien busca desde Hendaia.',
    contexto: 'Irun tiene una particularidad que no comparte con ningún otro sitio de Gipuzkoa: parte de tu clientela busca en francés y desde el otro lado de la muga. Si tu web solo existe en castellano, estás renunciando a un mercado que tienes a cinco minutos. Añadir una versión en francés y trabajar la ficha de Google para las dos zonas suele ser la mejora más rentable en negocios de aquí.',
    sectores: ['Comercio y retail', 'Logística y transporte', 'Hostelería', 'Servicios transfronterizos', 'Automoción'],
    gancho: 'Puedo montar la web en castellano, euskera y francés — mismo diseño, tres públicos.',
    ejemplo: 'restaurante', ejemploTxt: 'Restaurante', ejemploImg: 'rest-desk'
  },
  {
    slug: 'errenteria', name: 'Errenteria', eu: 'Errenteria', comarca: 'Oarsoaldea',
    dist: '32 km de Tolosa', pob: '39.000 habitantes',
    lede: 'Errenteria tiene comercio de calle denso y clientela fiel. El reto no es que te conozcan: es que te encuentren cuando buscan en el móvil.',
    contexto: 'En Errenteria el comercio local aguanta bien y hay negocios con clientela de toda la vida. El problema aparece con la generación que no pregunta a nadie: busca en Google, mira las reseñas y decide. Para esos negocios la web no es marketing, es asegurar que quien ya te compraría te encuentre antes que a la cadena de Donostia.',
    sectores: ['Comercio de proximidad', 'Hostelería', 'Servicios profesionales', 'Reformas y oficios', 'Salud'],
    gancho: 'Si llevas años funcionando de boca a boca, la web solo tiene que evitar que pierdas al cliente que no pregunta.',
    ejemplo: 'peluqueria', ejemploTxt: 'Peluquería', ejemploImg: 'pelu-desk'
  },
  {
    slug: 'eibar', name: 'Eibar', eu: 'Eibar', comarca: 'Debabarrena',
    dist: '55 km de Tolosa', pob: '27.000 habitantes',
    lede: 'Eibar es industria y precisión desde hace un siglo. Webs que hablan a ingenieros y responsables de compras, no a turistas.',
    contexto: 'En Eibar y el Bajo Deba el tejido es industrial: mecanizado, matricería, componentes. Aquí la web no tiene que ser bonita, tiene que ser creíble. Un responsable de compras que te está comparando con otros dos proveedores busca capacidades técnicas, certificaciones, maquinaria y ejemplos de trabajos — y lo busca en treinta segundos. Si no lo encuentra, pasa al siguiente.',
    sectores: ['Industria y metal', 'Mecanizado y matricería', 'Ingeniería', 'Servicios industriales', 'Comercio'],
    gancho: 'Para industria priorizo ficha técnica clara y prueba de capacidad por encima de la estética.',
    ejemplo: 'taller', ejemploTxt: 'Taller mecánico', ejemploImg: 'taller-desk'
  },
  {
    slug: 'arrasate-mondragon', name: 'Arrasate-Mondragón', eu: 'Arrasate', comarca: 'Debagoiena',
    dist: '50 km de Tolosa', pob: '22.000 habitantes',
    lede: 'Arrasate vive rodeada de cooperativas y empresas técnicas. Webs para el proveedor y el comercio que orbitan alrededor de ese ecosistema.',
    contexto: 'Arrasate tiene un entorno empresarial muy particular: cooperativas, universidad y una red densa de proveedores especializados. Eso significa que la clientela local está acostumbrada a un nivel de profesionalidad alto, y una web descuidada resta credibilidad más rápido aquí que en otros sitios. También significa que hay mucho negocio B2B para el que la web es una herramienta comercial, no un escaparate.',
    sectores: ['Industria y cooperativas', 'Servicios a empresas', 'Formación y consultoría', 'Comercio', 'Hostelería'],
    gancho: 'Si vendes a empresas, la web puede filtrar clientes antes de la primera llamada y ahorrarte reuniones inútiles.',
    ejemplo: 'gimnasio', ejemploTxt: 'Gimnasio', ejemploImg: 'gym-desk'
  },
  {
    slug: 'zarautz', name: 'Zarautz', eu: 'Zarautz', comarca: 'Urola Kosta',
    dist: '35 km de Tolosa', pob: '23.000 habitantes',
    lede: 'Zarautz multiplica su población en verano. Si tu negocio depende de la temporada, la web trabaja cuando tú no puedes atender el teléfono.',
    contexto: 'En Zarautz la estacionalidad lo condiciona todo: en agosto no das abasto y en febrero el pueblo es otro. La web tiene que servir para las dos realidades — en temporada alta, para filtrar y automatizar (reservas, horarios, disponibilidad) porque no tienes tiempo de coger el teléfono; en temporada baja, para que la clientela local sepa que sigues abierto y con qué horario.',
    sectores: ['Hostelería y restauración', 'Alojamiento y apartamentos', 'Surf y deporte', 'Comercio y moda', 'Servicios'],
    gancho: 'Para negocios de temporada, las reservas automáticas son lo que más se nota: en agosto responden solas.',
    ejemplo: 'restaurante', ejemploTxt: 'Restaurante', ejemploImg: 'rest-desk'
  },
  {
    slug: 'hondarribia', name: 'Hondarribia', eu: 'Hondarribia', comarca: 'Bidasoa',
    dist: '48 km de Tolosa', pob: '17.000 habitantes',
    lede: 'Hondarribia vive del visitante que llega buscando dónde comer y dónde dormir. Y busca desde el móvil, en la calle, en varios idiomas.',
    contexto: 'En Hondarribia una parte importante de tus clientes no vive aquí y no volverá el mes que viene: decide en el momento, con el móvil, comparando dos o tres opciones que ha encontrado en Google. Eso pone toda la presión en cosas muy concretas: fotos reales, horarios correctos, reservar en dos toques y que la página cargue rápido con cobertura irregular en el casco viejo.',
    sectores: ['Hostelería y restauración', 'Alojamiento y turismo', 'Comercio y artesanía', 'Náutica y ocio', 'Servicios'],
    gancho: 'Trabajo la web multiidioma y optimizada para conexiones lentas: en el casco histórico la cobertura no siempre acompaña.',
    ejemplo: 'restaurante', ejemploTxt: 'Restaurante', ejemploImg: 'rest-desk'
  },
  {
    slug: 'zumarraga', name: 'Zumarraga', eu: 'Zumarraga', comarca: 'Urola Garaia',
    dist: '30 km de Tolosa', pob: '10.000 habitantes',
    lede: 'Zumarraga y Urretxu funcionan casi como un solo núcleo, con industria alrededor y comercio compartido.',
    contexto: 'Zumarraga y Urretxu comparten calle, comercio y clientela, así que un negocio de aquí trabaja de hecho para los dos municipios — y también para Legazpi y Ezkio. Plantear la web solo alrededor del nombre de tu pueblo deja fuera a la mitad de tus clientes potenciales; hay que trabajar el área completa del alto Urola.',
    sectores: ['Industria y metal', 'Comercio de proximidad', 'Salud y servicios', 'Hostelería', 'Oficios'],
    gancho: 'Configuro el SEO para todo el alto Urola, no solo para el nombre de un municipio.',
    ejemplo: 'floristeria', ejemploTxt: 'Floristería', ejemploImg: 'flor-desk'
  },
  {
    slug: 'bergara', name: 'Bergara', eu: 'Bergara', comarca: 'Debagoiena',
    dist: '48 km de Tolosa', pob: '14.500 habitantes',
    lede: 'Bergara combina casco histórico, universidad e industria. Tres públicos distintos que buscan cosas distintas en Google.',
    contexto: 'En Bergara conviven el comercio del casco histórico, el entorno universitario y el tejido industrial de Debagoiena. Cada uno busca de una forma: el visitante busca qué ver y dónde comer, el estudiante busca servicios y precio, y la empresa busca proveedores. Merece la pena decidir a cuál de los tres le hablas antes de escribir una sola línea de la web.',
    sectores: ['Industria y talleres', 'Comercio y hostelería', 'Servicios educativos', 'Turismo y patrimonio', 'Oficios'],
    gancho: 'Antes de diseñar decidimos a qué público le habla la web — intentar hablarles a todos es lo que no funciona.',
    ejemplo: 'panaderia', ejemploTxt: 'Panadería artesana', ejemploImg: 'pan-desk'
  },
  {
    slug: 'onati', name: 'Oñati', eu: 'Oñati', comarca: 'Debagoiena',
    dist: '55 km de Tolosa', pob: '11.000 habitantes',
    lede: 'Oñati atrae visitantes por Arantzazu, la universidad y el entorno natural. Negocios pequeños con clientela de fuera.',
    contexto: 'Oñati tiene un flujo constante de visitantes por Arantzazu, las cuevas y el patrimonio universitario, pero es un flujo repartido durante todo el año en vez de concentrado en verano. Para el comercio y la hostelería de aquí, eso significa que la web trabaja los doce meses: el visitante que llega el martes de noviembre también busca en el móvil dónde comer.',
    sectores: ['Hostelería y restauración', 'Turismo rural y alojamiento', 'Comercio y artesanía', 'Servicios', 'Industria'],
    gancho: 'Para negocios con visitante de paso, la información práctica y las fotos reales pesan más que cualquier animación.',
    ejemplo: 'cafeteria', ejemploTxt: 'Cafetería', ejemploImg: 'cafe-desk'
  }
];

const nav = (active) => `<div class="nav-wrap">
<nav class="nav">
<a href="index.html" class="nav__logo"><img src="assets/logo-nav-black.png" alt="OI Studio" class="nav__logo-img"/></a>
<ul class="nav__links">
<li><a href="index.html" data-t="nav_inicio">Inicio</a></li>
<li><a href="sobre-mi.html" data-t="nav_sobre">Sobre mí</a></li>
<li><a href="trabajos.html" data-t="nav_trabajos">Trabajos</a></li>
<li><a href="precios.html" data-t="nav_precios">Precios</a></li>
<li><a href="zonas.html"${active === 'zonas' ? ' class="is-active"' : ''} data-t="nav_zonas">Zonas</a></li>
<li><a href="articulos.html" data-t="nav_articulos">Artículos</a></li>
</ul>
<div class="nav__right">
<a href="tel:+34680956755" class="nav__phone" aria-label="Llamar al 680 95 67 55">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>
<span>680 95 67 55</span>
</a>
<div class="lang-switch" role="group" aria-label="Idioma / Hizkuntza">
<button type="button" data-lang="es">ES</button>
<button type="button" data-lang="eu">EU</button>
</div>
<a href="contacto.html" class="btn btn--accent nav__cta" data-t="btn_presupuesto">Solicitar presupuesto</a>
<button class="nav__toggle" aria-label="Abrir menú" aria-expanded="false">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
</button>
</div>
</nav>
</div>
<div class="mobile-menu">
<ul>
<li><a href="index.html" data-t="nav_inicio">Inicio</a></li>
<li><a href="sobre-mi.html" data-t="nav_sobre">Sobre mí</a></li>
<li><a href="trabajos.html" data-t="nav_trabajos">Trabajos</a></li>
<li><a href="precios.html" data-t="nav_precios">Precios</a></li>
<li><a href="zonas.html" data-t="nav_zonas">Zonas</a></li>
<li><a href="articulos.html" data-t="nav_articulos">Artículos</a></li>
<li><a href="contacto.html" data-t="nav_contacto">Contacto</a></li>
</ul>
</div>`;

const footer = () => `<footer class="footer">
<div class="container">
<div class="footer__grid">
<div>
<a href="index.html" class="footer__logo"><img src="assets/logo-nav-black.png" alt="OI Studio" class="footer__logo-img"/></a>
<p class="footer__desc" data-t="foot_desc" style="margin-top:20px;">Webs rápidas, modernas y efectivas para negocios locales que quieren destacar en internet.</p>
</div>
<div>
<h4 data-t="foot_secciones">Secciones</h4>
<ul>
<li><a href="sobre-mi.html" data-t="nav_sobre">Sobre mí</a></li>
<li><a href="trabajos.html" data-t="foot_portfolio">Portfolio</a></li>
<li><a href="precios.html" data-t="nav_precios">Precios</a></li>
<li><a href="zonas.html" data-t="nav_zonas">Zonas</a></li>
<li><a href="articulos.html" data-t="nav_articulos">Artículos</a></li>
<li><a href="contacto.html" data-t="nav_contacto">Contacto</a></li>
</ul>
</div>
<div>
<h4 data-t="nav_contacto">Contacto</h4>
<ul>
<li><a href="mailto:contactoiwebstudio@gmail.com">contactoiwebstudio@gmail.com</a></li>
<li><a href="https://wa.me/34680956755">+34 680 95 67 55</a></li>
<li><a href="https://instagram.com/oi.webstudio" target="_blank" rel="noopener">Instagram · @oi.webstudio</a></li>
<li>Tolosa, País Vasco</li>
</ul>
</div>
</div>
<div class="footer__bottom">
<p>© 2026 OI Studio · <a href="legal.html" data-t="foot_legal">Aviso legal y privacidad</a></p>
<p data-t="foot_made">Diseñado y desarrollado en Tolosa</p>
</div>
</div>
<div class="footer__mark" aria-hidden="true">OI STUDIO</div>
</footer>

<script src="assets/i18n.js"></script>
<script src="${JS_V}"></script>
<a class="wa-float" href="https://wa.me/34680956755?text=Hola%2C%20quiero%20informaci%C3%B3n%20para%20la%20web%20de%20mi%20negocio." target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2.05 22l5.27-1.38c1.45.79 3.08 1.21 4.72 1.21 5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.23 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29z"/></svg>
</a>
</body>
</html>`;

const head = (title, desc, canonical, keywords, crumbName, extraLd) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="theme-color" content="#f6f3ea"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<meta name="keywords" content="${keywords}"/>
<meta name="robots" content="index, follow"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="OI Studio"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image" content="https://oiwebstudio.com/assets/logo-nav-black.png"/>
<meta property="og:locale" content="es_ES"/>
<meta property="og:locale:alternate" content="eu_ES"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="canonical" href="${canonical}"/>
<link rel="icon" href="assets/logo-mark-bw.png" type="image/png"/>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"Inicio","item":"https://oiwebstudio.com/"},
    {"@type":"ListItem","position":2,"name":"Zonas","item":"https://oiwebstudio.com/zonas.html"},
    {"@type":"ListItem","position":3,"name":"${crumbName}","item":"${canonical}"}
  ]
}
</script>
${extraLd}
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link rel="preload" as="style" href="${FONTS}"/>
<link href="${FONTS}" rel="stylesheet" media="print" onload="this.media='all'"/>
<noscript><link href="${FONTS}" rel="stylesheet"/></noscript>
<link rel="stylesheet" href="${CSS_V}"/>
</head>
<body>
`;

// ---------- páginas de localidad ----------
for (const z of ZONAS) {
  const canonical = `https://oiwebstudio.com/diseno-web-${z.slug}.html`;
  const title = `Diseño web en ${z.name} — Páginas web para negocios | OI Studio`;
  const desc = `Diseño y desarrollo de páginas web para negocios de ${z.name} (${z.comarca}). Precio cerrado desde 199€, propuesta en 48h. Estudio en Tolosa, a ${z.dist}.`;
  const kw = `diseño web ${z.name}, páginas web ${z.name}, desarrollo web ${z.comarca}, web negocio ${z.name}, diseñador web Gipuzkoa`;

  const ld = `<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"ProfessionalService",
  "name":"OI Studio — Diseño web en ${z.name}",
  "url":"${canonical}",
  "image":"https://oiwebstudio.com/assets/logo-nav-black.png",
  "description":"${desc.replace(/"/g, '\\"')}",
  "email":"contactoiwebstudio@gmail.com",
  "telephone":"+34680956755",
  "priceRange":"199€ - 299€",
  "address":{"@type":"PostalAddress","addressLocality":"Tolosa","addressRegion":"Gipuzkoa","addressCountry":"ES"},
  "areaServed":{"@type":"City","name":"${z.name}","containedInPlace":{"@type":"AdministrativeArea","name":"Gipuzkoa"}},
  "sameAs":["https://instagram.com/oi.webstudio"]
}
</script>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity":[
    {"@type":"Question","name":"¿Trabajáis con negocios de ${z.name}?","acceptedAnswer":{"@type":"Answer","text":"Sí. El estudio está en Tolosa, a ${z.dist}, y trabajo habitualmente con negocios de ${z.comarca}. Las reuniones pueden ser presenciales o por videollamada, como prefieras."}},
    {"@type":"Question","name":"¿Cuánto cuesta una página web para un negocio de ${z.name}?","acceptedAnswer":{"@type":"Answer","text":"El precio es cerrado y no cambia según el pueblo: Landing desde 199€ y Web Negocio desde 299€, con propuesta en 48 horas y 30 días de ajustes gratis."}},
    {"@type":"Question","name":"¿Saldrá mi negocio en Google cuando busquen en ${z.name}?","acceptedAnswer":{"@type":"Answer","text":"Todas las webs llevan SEO local básico: títulos y descripciones orientados a ${z.name}, datos estructurados de negocio local y conexión con tu ficha de Google Business, que es lo que decide tu posición en el mapa."}}
  ]
}
</script>`;

  const sectoresHtml = z.sectores.map((s, i) => `<div class="card reveal"${i ? ` data-d="${i}"` : ''}><h3>${s}</h3></div>`).join('\n');

  const otras = ZONAS.filter(o => o.slug !== z.slug).slice(0, 6)
    .map(o => `<a href="diseno-web-${o.slug}.html">${o.name}</a>`).join(' · ');

  const html = head(title, desc, canonical, kw, `Diseño web en ${z.name}`, ld) + nav() + `
<header class="hero" style="padding-bottom:40px;">
<div class="hero__bg"><div class="hero__grid"></div></div>
<div class="container">
<div class="hero__inner">
<span class="eyebrow reveal">${z.comarca} · ${z.dist}</span>
<h1 class="reveal" data-d="1" style="font-size:clamp(36px,5.6vw,60px); margin-top:18px;">Diseño web en <span class="grad">${z.name}</span></h1>
<p class="hero__lede reveal" data-d="2">${z.lede}</p>
<div class="hero__actions reveal" data-d="3">
<a href="contacto.html" class="btn btn--accent btn--lg">Solicitar presupuesto</a>
<a href="trabajos.html" class="btn btn--ghost btn--lg">Ver trabajos</a>
</div>
<div class="hero__trust reveal" data-d="4">
<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span>Propuesta en 48h</span></span>
<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span>Precio cerrado desde 199€</span></span>
<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span>Estudio a ${z.dist}</span></span>
</div>
</div>
</div>
</header>

<section class="section">
<div class="container">
<div class="section-head reveal">
<span class="eyebrow">El contexto</span>
<h2>Qué necesita un negocio de ${z.name}</h2>
</div>
<div style="max-width:720px;margin:0 auto;">
<p class="par-cascade" style="font-size:18px;line-height:1.75;color:var(--text);">${z.contexto}</p>
<p class="par-cascade" style="font-size:18px;line-height:1.75;color:var(--text);margin-top:18px;">${z.gancho}</p>
</div>
</div>
</section>

<section class="section" style="padding-top:0;">
<div class="container">
<div class="section-head reveal">
<span class="eyebrow">Sectores</span>
<h2>Con quién trabajo en ${z.name}</h2>
<p>Estos son los perfiles de negocio más habituales en ${z.name} y ${z.comarca}. Si el tuyo no está en la lista, escríbeme igual.</p>
</div>
<div class="cards">
${sectoresHtml}
</div>
</div>
</section>

<section class="section" style="padding-top:0;">
<div class="container">
<div class="section-head reveal">
<span class="eyebrow">Ejemplo</span>
<h2>Un proyecto real, navegable</h2>
<p>No enseño maquetas: las ocho webs del portfolio están publicadas y puedes abrirlas.</p>
</div>
<div style="max-width:820px;margin:0 auto;">
<a href="trabajos.html" style="display:block;border-radius:var(--r-lg);overflow:hidden;border:1px solid var(--border);box-shadow:var(--shadow-md);">
<picture><source srcset="assets/${z.ejemploImg}.webp" type="image/webp"/><img src="assets/${z.ejemploImg}.jpg" alt="${z.ejemploTxt}, ejemplo de web para negocio local diseñada por OI Studio" width="900" height="562" loading="lazy" style="width:100%;height:auto;display:block;"/></picture>
</a>
<p style="text-align:center;margin-top:16px;font-size:14.5px;color:var(--text-muted);">${z.ejemploTxt} — <a href="trabajos.html" style="color:var(--terra);">ver las 8 webs del portfolio</a></p>
</div>
</div>
</section>

<section class="section dark-section">
<div class="container">
<div class="section-head reveal">
<span class="eyebrow eyebrow--light">Cómo trabajo</span>
<h2>De la primera llamada a la web publicada</h2>
</div>
<div class="pillars">
<div class="pillar reveal"><span class="pillar__num">01</span><h3>Hablamos 15 minutos</h3><p>Entiendo tu negocio en ${z.name}, a quién quieres llegar y si de verdad puedo ayudarte.</p></div>
<div class="pillar reveal" data-d="1"><span class="pillar__num">02</span><h3>Propuesta en 48h</h3><p>Estructura, referencias visuales y precio cerrado por escrito. Sin sorpresas después.</p></div>
<div class="pillar reveal" data-d="2"><span class="pillar__num">03</span><h3>Construyo la web</h3><p>Rápida, adaptada a móvil y con SEO local orientado a ${z.name} desde el primer día.</p></div>
<div class="pillar reveal" data-d="3"><span class="pillar__num">04</span><h3>Publico y acompaño</h3><p>Dominio y hosting a tu nombre, y 30 días de ajustes gratis tras la entrega.</p></div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="section-head reveal">
<span class="eyebrow">Dudas</span>
<h2>Preguntas frecuentes</h2>
</div>
<div class="faq" style="max-width:760px;margin:0 auto;display:grid;gap:12px;">
<div class="faq-item"><button class="faq-trigger">¿Trabajas con negocios de ${z.name}?<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button><div class="faq-panel"><p>Sí. El estudio está en Tolosa, a ${z.dist}, y trabajo habitualmente con negocios de ${z.comarca}. Las reuniones pueden ser presenciales o por videollamada, como te venga mejor.</p></div></div>
<div class="faq-item"><button class="faq-trigger">¿El precio cambia por estar fuera de Tolosa?<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button><div class="faq-panel"><p>No. El precio es cerrado y el mismo para toda Gipuzkoa: Landing desde 199€ y Web Negocio desde 299€, con 30 días de ajustes gratis incluidos.</p></div></div>
<div class="faq-item"><button class="faq-trigger">¿Saldré en Google cuando busquen en ${z.name}?<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button><div class="faq-panel"><p>Todas las webs llevan SEO local básico orientado a ${z.name}. Aparecer arriba depende también de tu ficha de Google Business y de las reseñas — te explico cómo trabajarlo en <a href="seo-local-tolosa-google-maps.html" style="color:var(--terra);">esta guía</a>.</p></div></div>
<div class="faq-item"><button class="faq-trigger">¿Puedo verlo antes de decidir?<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button><div class="faq-panel"><p>Sí: las ocho webs del <a href="trabajos.html" style="color:var(--terra);">portfolio</a> están publicadas y son navegables. Y la propuesta en 48h es gratis y sin compromiso.</p></div></div>
</div>
</div>
</section>

<section class="section" style="padding-top:0;">
<div class="container">
<div style="max-width:760px;margin:0 auto;text-align:center;padding:34px;border:1px solid var(--border);border-radius:var(--r-lg);background:var(--surface);">
<h2 style="font-size:26px;">¿Tienes un negocio en ${z.name}?</h2>
<p style="color:var(--text-muted);margin-top:12px;">Te preparo una propuesta con precio cerrado en menos de 48 horas. Gratis y sin compromiso.</p>
<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:22px;">
<a href="contacto.html" class="btn btn--accent btn--lg">Solicitar presupuesto</a>
<a href="https://wa.me/34680956755" target="_blank" rel="noopener" class="btn btn--ghost btn--lg">Escribir por WhatsApp</a>
</div>
</div>
<p style="text-align:center;margin-top:34px;font-size:14px;color:var(--text-faint);">También trabajo en: ${otras} · <a href="zonas.html" style="color:var(--terra);">ver todas las zonas</a></p>
</div>
</section>
` + footer();

  fs.writeFileSync(`diseno-web-${z.slug}.html`, html, 'utf8');
  console.log(`✓ diseno-web-${z.slug}.html`);
}

// ---------- página hub de zonas ----------
const zonasCards = ZONAS.map((z, i) => `<a class="card reveal"${i % 4 ? ` data-d="${i % 4}"` : ''} href="diseno-web-${z.slug}.html" style="text-decoration:none;color:inherit;">
<h3>${z.name}</h3>
<p style="font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--terra);margin-top:4px;">${z.comarca} · ${z.dist}</p>
<p style="margin-top:10px;">${z.lede.split('.')[0]}.</p>
</a>`).join('\n');

const zonasLd = `<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"CollectionPage",
  "name":"Zonas donde trabajo — OI Studio",
  "url":"https://oiwebstudio.com/zonas.html",
  "description":"Diseño web para negocios de Tolosaldea, Goierri, Buruntzaldea y Donostialdea.",
  "isPartOf":{"@type":"WebSite","name":"OI Studio","url":"https://oiwebstudio.com/"}
}
</script>`;

const zonasHtml = head(
  'Diseño web en Gipuzkoa — Tolosaldea, Goierri y alrededores | OI Studio',
  'Estudio de diseño web en Tolosa que trabaja con negocios de toda Gipuzkoa: Tolosaldea, Goierri, Buruntzaldea y Donostialdea. Precio cerrado desde 199€.',
  'https://oiwebstudio.com/zonas.html',
  'diseño web Gipuzkoa, páginas web Tolosaldea, diseño web Goierri, web negocios Euskadi',
  'Zonas',
  zonasLd
).replace(
  /{"@type":"ListItem","position":2,"name":"Zonas","item":"https:\/\/oiwebstudio\.com\/zonas\.html"},\n    {"@type":"ListItem","position":3,"name":"Zonas","item":"https:\/\/oiwebstudio\.com\/zonas\.html"}/,
  '{"@type":"ListItem","position":2,"name":"Zonas","item":"https://oiwebstudio.com/zonas.html"}'
) + nav('zonas') + `
<header class="hero" style="padding-bottom:40px;">
<div class="hero__bg"><div class="hero__grid"></div></div>
<div class="container">
<div class="hero__inner">
<span class="eyebrow reveal">Gipuzkoa</span>
<h1 class="reveal" data-d="1" style="font-size:clamp(36px,5.6vw,60px); margin-top:18px;">Dónde <span class="grad">trabajo</span></h1>
<p class="hero__lede reveal" data-d="2">El estudio está en Tolosa, pero trabajo con negocios de toda Gipuzkoa. Estas son las zonas que conozco bien, con lo que he aprendido de cada una.</p>
</div>
</div>
</header>

<section class="section" style="padding-top:20px;">
<div class="container">
<div class="cards">
${zonasCards}
</div>
<p style="text-align:center;margin-top:40px;font-size:15px;color:var(--text-muted);">¿Tu pueblo no está en la lista? Trabajo en toda Gipuzkoa — <a href="contacto.html" style="color:var(--terra);">escríbeme igualmente</a>.</p>
</div>
</section>

<section class="section dark-section">
<div class="container">
<div class="section-head reveal">
<span class="eyebrow eyebrow--light">Cómo funciona a distancia</span>
<h2>Estar cerca ayuda, pero no es imprescindible</h2>
</div>
<div class="pillars">
<div class="pillar reveal"><span class="pillar__num">01</span><h3>Reunión inicial</h3><p>Presencial si estás cerca de Tolosa, por videollamada si te pilla lejos. El resultado es el mismo.</p></div>
<div class="pillar reveal" data-d="1"><span class="pillar__num">02</span><h3>Materiales</h3><p>Fotos y textos por WhatsApp o email. Si necesitas fotos y estás en Tolosaldea, puedo ir yo.</p></div>
<div class="pillar reveal" data-d="2"><span class="pillar__num">03</span><h3>Revisiones</h3><p>Te paso un enlace en pruebas y comentamos los cambios sobre la web real, no sobre un PDF.</p></div>
<div class="pillar reveal" data-d="3"><span class="pillar__num">04</span><h3>Soporte</h3><p>Por WhatsApp y email, respondo en menos de 24 horas estés donde estés.</p></div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div style="max-width:760px;margin:0 auto;text-align:center;padding:34px;border:1px solid var(--border);border-radius:var(--r-lg);background:var(--surface);">
<h2 style="font-size:26px;">Cuéntame dónde estás</h2>
<p style="color:var(--text-muted);margin-top:12px;">Propuesta con precio cerrado en menos de 48 horas, gratis y sin compromiso.</p>
<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:22px;">
<a href="contacto.html" class="btn btn--accent btn--lg">Solicitar presupuesto</a>
<a href="https://wa.me/34680956755" target="_blank" rel="noopener" class="btn btn--ghost btn--lg">Escribir por WhatsApp</a>
</div>
</div>
</div>
</section>
` + footer();

fs.writeFileSync('zonas.html', zonasHtml, 'utf8');
console.log('✓ zonas.html');
console.log(`\nTotal: ${ZONAS.length} páginas de zona + 1 hub`);
