/* Generador de páginas de zona (SEO local) — salida en /zonas/.
   Cada localidad tiene contenido propio: contexto económico real, sectores
   dominantes, distancia y referencias locales. NO son plantillas clonadas
   cambiando el nombre — Google penaliza eso como doorway pages.

   Diseño compacto: hero partido con imagen, tira de datos, sectores en
   chips, mosaico de portfolio y CTA. Sin secciones de relleno. */
const fs = require('fs');
const path = require('path');

const OUT = 'zonas';
const UP = '../';                       // las páginas viven un nivel más abajo
const FONTS = 'https://fonts.googleapis.com/css2?family=Geist:wght@400;450;500;600;700&family=Geist+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@1,9..144,500&display=swap';
const CSS_V = UP + 'assets/styles.css?v=10';
const JS_V = UP + 'assets/main.js?v=6';

const ZONAS = [
  { slug:'ibarra', name:'Ibarra', comarca:'Tolosaldea', dist:'2 km', pob:'4.300',
    lede:'Ibarra y Tolosa comparten calle, comercio y clientela. Puedo pasarme a hacer las fotos y volver por la tarde si hace falta.',
    contexto:'Ibarra está pegada a Tolosa: mucha gente vive en una y compra en la otra. Tu web no compite solo con los negocios de Ibarra, sino con los de Tolosa que salen antes en Google. Trabajar el SEO local aquí es especialmente rentable, porque "Ibarra" tiene mucha menos competencia que "Tolosa" y la clientela es la misma.',
    sectores:['Comercio y alimentación','Talleres y servicios técnicos','Hostelería y sidrerías','Servicios profesionales'],
    gancho:'A dos kilómetros: reuniones presenciales sin coste añadido y fotos del negocio hechas por mí.',
    hero:'pan', mosaico:['pan','taller','cafe'] },

  { slug:'villabona', name:'Villabona', comarca:'Tolosaldea', dist:'9 km', pob:'6.000',
    lede:'Villabona-Amasa tiene tejido industrial y comercio de proximidad. Dos públicos que buscan de forma muy distinta.',
    contexto:'Villabona combina polígono industrial con comercio de calle. Una empresa industrial necesita una web que transmita solvencia técnica a otras empresas; una tienda del centro necesita salir en el móvil de quien busca "cerca de mí". Enfoco cada proyecto según cuál de los dos eres.',
    sectores:['Industria y subcontratación','Comercio de proximidad','Hostelería','Construcción y reformas'],
    gancho:'Si tienes empresa en el polígono, la web puede funcionar como catálogo técnico y captación B2B.',
    hero:'taller', mosaico:['taller','pan','gym'] },

  { slug:'anoeta', name:'Anoeta', comarca:'Tolosaldea', dist:'4 km', pob:'2.000',
    lede:'En un pueblo de 2.000 habitantes el boca a boca funciona, pero solo llega hasta donde llega.',
    contexto:'En Anoeta ya te conoce quien te tiene que conocer. El problema es el cliente nuevo: el que se acaba de mudar, el que viene de Tolosa o Irura, el que busca en Google antes de llamar. La web no sustituye al boca a boca — lo amplía a los pueblos de al lado.',
    sectores:['Servicios a domicilio','Hostelería y ocio','Oficios y reformas','Comercio local'],
    gancho:'Para negocios pequeños suele bastar una landing a 199€: una página, tus servicios y salir en Google Maps.',
    hero:'flor', mosaico:['flor','cafe','pelu'] },

  { slug:'alegia', name:'Alegia', comarca:'Tolosaldea', dist:'8 km', pob:'1.800',
    lede:'Negocios que sirven a varios pueblos a la vez y necesitan que se les encuentre desde todos ellos.',
    contexto:'Los negocios de Alegia rara vez viven solo de Alegia: dan servicio a Ikaztegieta, Orendain, Baliarrain o Altzo. El área de servicio tiene que quedar explícita, en los textos y en la ficha de Google, o solo apareces cuando alguien busca literalmente el nombre de tu pueblo.',
    sectores:['Servicios rurales y agrícolas','Oficios y mantenimiento','Hostelería de carretera','Comercio y alimentación'],
    gancho:'Configuro el área de servicio para que aparezcas en las búsquedas de todos los pueblos a los que sirves.',
    hero:'rest', mosaico:['rest','taller','pan'] },

  { slug:'andoain', name:'Andoain', comarca:'Buruntzaldea', dist:'15 km', pob:'15.000',
    lede:'Volumen suficiente para que el SEO local marque diferencia real: hay competencia, y quien la trabaja se lleva las llamadas.',
    contexto:'Con 15.000 habitantes y un tejido comercial denso, en Andoain sí hay competencia por las búsquedas. Si buscas "fisioterapeuta Andoain" o "reformas Andoain" hay varias opciones, y las tres primeras del mapa se llevan la mayoría de los clics. La diferencia la marcan la ficha de Google, las reseñas y la velocidad.',
    sectores:['Salud y bienestar','Reformas y construcción','Hostelería','Comercio y moda','Automoción'],
    gancho:'En mercados con competencia real reviso también tu ficha de Google Business, no solo la web.',
    hero:'gym', mosaico:['gym','pelu','vet'] },

  { slug:'lasarte-oria', name:'Lasarte-Oria', comarca:'Buruntzaldea', dist:'20 km', pob:'18.000',
    lede:'Zona de paso y comercio fuerte. Webs rápidas para negocios que compiten por el cliente que decide en el móvil.',
    contexto:'Lasarte-Oria concentra mucho comercio y servicios en poco espacio, con clientela propia y de Donostia. La búsqueda dominante es desde el móvil y con intención inmediata: horarios, teléfono, cómo llegar. Si tu web tarda tres segundos en cargar en 4G, pierdes justo al cliente que ya había decidido comprarte.',
    sectores:['Comercio y retail','Hostelería','Servicios profesionales','Estética y peluquería','Deporte y ocio'],
    gancho:'Móvil primero: horarios y teléfono visibles sin scroll, y carga por debajo de dos segundos.',
    hero:'pelu', mosaico:['pelu','cafe','rest'] },

  { slug:'hernani', name:'Hernani', comarca:'Donostialdea', dist:'22 km', pob:'20.000',
    lede:'Sidrerías, comercio de calle y mucho negocio familiar con años de oficio y ninguna presencia en internet.',
    contexto:'En Hernani me encuentro mucho negocio con veinte o treinta años de trayectoria y sin web, o con una hecha hace una década que ya no abre bien en el móvil. El valor no está en modernizar por modernizar: está en que la reputación que ya tienes en la calle también exista cuando alguien te busca en Google por primera vez.',
    sectores:['Sidrerías y hostelería','Comercio tradicional','Oficios y reformas','Servicios profesionales','Alimentación'],
    gancho:'Si ya tienes web pero es antigua, te digo gratis si merece la pena rehacerla o solo arreglarla.',
    hero:'rest', mosaico:['rest','pan','taller'] },

  { slug:'beasain', name:'Beasain', comarca:'Goierri', dist:'20 km', pob:'14.000',
    lede:'Industria potente y una red de proveedores y servicios que también necesita explicarse bien online.',
    contexto:'Beasain es el corazón industrial del Goierri, y alrededor hay todo un ecosistema de talleres, ingenierías, transporte y servicios. Para estos negocios la web tiene un papel distinto: no busca volumen de visitas, busca credibilidad ante un responsable de compras que te está comparando con otros dos proveedores.',
    sectores:['Industria y metal','Ingeniería y servicios técnicos','Transporte y logística','Hostelería','Comercio'],
    gancho:'Para empresas B2B priorizo claridad técnica y prueba de solvencia por encima de la estética llamativa.',
    hero:'taller', mosaico:['taller','gym','cafe'] },

  { slug:'ordizia', name:'Ordizia', comarca:'Goierri', dist:'22 km', pob:'9.500',
    lede:'Ordizia vive de su mercado y del producto local. Webs para quien quiere vender más allá del miércoles.',
    contexto:'El mercado de Ordizia trae clientela de toda Gipuzkoa un día a la semana. La oportunidad está en el resto de días: un productor o un comercio con web y pedidos online deja de depender del puesto físico y del calendario. He montado sistemas de encargos que funcionan exactamente con esa lógica.',
    sectores:['Alimentación y producto local','Caseríos y productores','Comercio de calle','Hostelería','Servicios'],
    gancho:'Puedo integrar encargos o reservas para que el cliente pida desde casa el resto de la semana.',
    hero:'pan', mosaico:['pan','flor','rest'] },

  { slug:'azpeitia', name:'Azpeitia', comarca:'Urola Erdia', dist:'30 km', pob:'15.000',
    lede:'Azpeitia recibe visitantes todo el año por Loiola. Si tu negocio depende de gente de fuera, la web deja de ser opcional.',
    contexto:'En Azpeitia hay dos clientelas: la de siempre, que ya te conoce, y la que llega de fuera y no ha oído hablar de ti en su vida. Esa segunda te busca en el móvil con criterios muy concretos: horarios, si hay que reservar, si tienes menú, cómo llegar. Un negocio que responde bien a eso capta visitantes.',
    sectores:['Hostelería y restauración','Alojamiento y turismo','Comercio','Servicios y salud','Industria'],
    gancho:'Para negocios con clientela de paso trabajo la web en dos idiomas y con la información práctica visible.',
    hero:'cafe', mosaico:['cafe','rest','pelu'] },

  { slug:'donostia-san-sebastian', name:'Donostia-San Sebastián', comarca:'Donostialdea', dist:'26 km', pob:'190.000',
    lede:'Aquí hay agencias de sobra y presupuestos de cinco cifras. Yo trabajo con el negocio de barrio que necesita una web buena sin pagar precio de capital.',
    contexto:'Donostia es el mercado más competido de Gipuzkoa: estudios grandes, agencias con equipo comercial y presupuestos que empiezan donde los míos acaban. Mi hueco no es competir por la cuenta de una multinacional, sino atender al comercio de Gros, Egia o Amara que necesita una web rápida y bien posicionada en su barrio, con precio cerrado.',
    sectores:['Hostelería y restauración','Comercio y moda','Turismo y alojamiento','Servicios profesionales','Salud y bienestar','Estética'],
    gancho:'En Donostia la búsqueda relevante casi nunca es "Donostia" a secas, sino el barrio: trabajo el SEO a ese nivel.',
    hero:'cafe', mosaico:['cafe','pelu','rest'] },

  { slug:'irun', name:'Irun', comarca:'Bidasoa', dist:'45 km', pob:'63.000',
    lede:'Frontera, logística y comercio con clientela de dos países. La web tiene que funcionar igual de bien para quien busca desde Hendaia.',
    contexto:'Irun tiene una particularidad que no comparte con ningún otro sitio de Gipuzkoa: parte de tu clientela busca en francés y desde el otro lado de la muga. Si tu web solo existe en castellano, renuncias a un mercado que tienes a cinco minutos. Añadir una versión en francés suele ser la mejora más rentable aquí.',
    sectores:['Comercio y retail','Logística y transporte','Hostelería','Servicios transfronterizos','Automoción'],
    gancho:'Puedo montar la web en castellano, euskera y francés — mismo diseño, tres públicos.',
    hero:'rest', mosaico:['rest','cafe','taller'] },

  { slug:'errenteria', name:'Errenteria', comarca:'Oarsoaldea', dist:'32 km', pob:'39.000',
    lede:'Comercio de calle denso y clientela fiel. El reto no es que te conozcan: es que te encuentren cuando buscan en el móvil.',
    contexto:'En Errenteria el comercio local aguanta bien y hay negocios con clientela de toda la vida. El problema aparece con la generación que no pregunta a nadie: busca en Google, mira las reseñas y decide. Para esos negocios la web no es marketing, es asegurar que quien ya te compraría te encuentre antes que a la cadena de Donostia.',
    sectores:['Comercio de proximidad','Hostelería','Servicios profesionales','Reformas y oficios','Salud'],
    gancho:'Si llevas años funcionando de boca a boca, la web solo tiene que evitar que pierdas al que no pregunta.',
    hero:'pelu', mosaico:['pelu','vet','flor'] },

  { slug:'eibar', name:'Eibar', comarca:'Debabarrena', dist:'55 km', pob:'27.000',
    lede:'Industria y precisión desde hace un siglo. Webs que hablan a ingenieros y responsables de compras, no a turistas.',
    contexto:'En Eibar y el Bajo Deba el tejido es industrial: mecanizado, matricería, componentes. Aquí la web no tiene que ser bonita, tiene que ser creíble. Un responsable de compras que te compara con otros dos proveedores busca capacidades técnicas, maquinaria y ejemplos de trabajos — y lo busca en treinta segundos. Si no lo encuentra, pasa al siguiente.',
    sectores:['Industria y metal','Mecanizado y matricería','Ingeniería','Servicios industriales','Comercio'],
    gancho:'Para industria priorizo ficha técnica clara y prueba de capacidad por encima de la estética.',
    hero:'taller', mosaico:['taller','gym','vet'] },

  { slug:'arrasate-mondragon', name:'Arrasate-Mondragón', comarca:'Debagoiena', dist:'50 km', pob:'22.000',
    lede:'Rodeada de cooperativas y empresas técnicas. Webs para el proveedor y el comercio que orbitan ese ecosistema.',
    contexto:'Arrasate tiene un entorno empresarial muy particular: cooperativas, universidad y una red densa de proveedores especializados. La clientela local está acostumbrada a un nivel de profesionalidad alto, y una web descuidada resta credibilidad más rápido aquí que en otros sitios. También hay mucho negocio B2B para el que la web es herramienta comercial, no escaparate.',
    sectores:['Industria y cooperativas','Servicios a empresas','Formación y consultoría','Comercio','Hostelería'],
    gancho:'Si vendes a empresas, la web puede filtrar clientes antes de la primera llamada.',
    hero:'gym', mosaico:['gym','taller','cafe'] },

  { slug:'zarautz', name:'Zarautz', comarca:'Urola Kosta', dist:'35 km', pob:'23.000',
    lede:'Zarautz multiplica su población en verano. Si dependes de la temporada, la web trabaja cuando tú no puedes coger el teléfono.',
    contexto:'En Zarautz la estacionalidad lo condiciona todo: en agosto no das abasto y en febrero el pueblo es otro. La web tiene que servir para las dos realidades — en temporada alta para filtrar y automatizar (reservas, horarios, disponibilidad), y en temporada baja para que la clientela local sepa que sigues abierto y con qué horario.',
    sectores:['Hostelería y restauración','Alojamiento y apartamentos','Surf y deporte','Comercio y moda','Servicios'],
    gancho:'Para negocios de temporada, las reservas automáticas son lo que más se nota: en agosto responden solas.',
    hero:'rest', mosaico:['rest','cafe','gym'] },

  { slug:'hondarribia', name:'Hondarribia', comarca:'Bidasoa', dist:'48 km', pob:'17.000',
    lede:'Vive del visitante que llega buscando dónde comer y dónde dormir. Y busca desde el móvil, en la calle, en varios idiomas.',
    contexto:'En Hondarribia una parte importante de tus clientes no vive aquí y no volverá el mes que viene: decide en el momento, con el móvil, comparando dos o tres opciones que ha encontrado en Google. Eso pone toda la presión en cosas concretas: fotos reales, horarios correctos, reservar en dos toques y cargar rápido con cobertura irregular en el casco viejo.',
    sectores:['Hostelería y restauración','Alojamiento y turismo','Comercio y artesanía','Náutica y ocio','Servicios'],
    gancho:'Web multiidioma y optimizada para conexiones lentas: en el casco histórico la cobertura no siempre acompaña.',
    hero:'rest', mosaico:['rest','cafe','flor'] },

  { slug:'zumarraga', name:'Zumarraga', comarca:'Urola Garaia', dist:'30 km', pob:'10.000',
    lede:'Zumarraga y Urretxu funcionan casi como un solo núcleo, con industria alrededor y comercio compartido.',
    contexto:'Zumarraga y Urretxu comparten calle, comercio y clientela, así que un negocio de aquí trabaja de hecho para los dos municipios — y también para Legazpi y Ezkio. Plantear la web solo alrededor del nombre de tu pueblo deja fuera a la mitad de tus clientes potenciales; hay que trabajar el área completa del alto Urola.',
    sectores:['Industria y metal','Comercio de proximidad','Salud y servicios','Hostelería','Oficios'],
    gancho:'Configuro el SEO para todo el alto Urola, no solo para el nombre de un municipio.',
    hero:'flor', mosaico:['flor','taller','vet'] },

  { slug:'bergara', name:'Bergara', comarca:'Debagoiena', dist:'48 km', pob:'14.500',
    lede:'Casco histórico, universidad e industria. Tres públicos distintos que buscan cosas distintas en Google.',
    contexto:'En Bergara conviven el comercio del casco histórico, el entorno universitario y el tejido industrial de Debagoiena. Cada uno busca de una forma: el visitante busca qué ver y dónde comer, el estudiante busca servicios y precio, y la empresa busca proveedores. Merece la pena decidir a cuál le hablas antes de escribir una sola línea.',
    sectores:['Industria y talleres','Comercio y hostelería','Servicios educativos','Turismo y patrimonio','Oficios'],
    gancho:'Antes de diseñar decidimos a qué público le habla la web — hablarles a todos es lo que no funciona.',
    hero:'pan', mosaico:['pan','cafe','taller'] },

  { slug:'onati', name:'Oñati', comarca:'Debagoiena', dist:'55 km', pob:'11.000',
    lede:'Atrae visitantes por Arantzazu, la universidad y el entorno natural. Negocios pequeños con clientela de fuera.',
    contexto:'Oñati tiene un flujo constante de visitantes por Arantzazu, las cuevas y el patrimonio universitario, pero repartido durante todo el año en vez de concentrado en verano. Para el comercio y la hostelería de aquí, eso significa que la web trabaja los doce meses: el visitante que llega el martes de noviembre también busca en el móvil dónde comer.',
    sectores:['Hostelería y restauración','Turismo rural y alojamiento','Comercio y artesanía','Servicios','Industria'],
    gancho:'Para negocios con visitante de paso, la información práctica y las fotos reales pesan más que cualquier animación.',
    hero:'cafe', mosaico:['cafe','rest','pan'] }
];

const IMG = {
  pan:   ['pan-desk','Panadería artesana'],
  gym:   ['gym-desk','Gimnasio'],
  cafe:  ['cafe-desk','Cafetería'],
  pelu:  ['pelu-desk','Peluquería'],
  flor:  ['flor-desk','Floristería'],
  rest:  ['rest-desk','Restaurante'],
  taller:['taller-desk','Taller mecánico'],
  vet:   ['vet-desk','Veterinaria']
};

const pic = (key, cls, alt, eager) => {
  const [file, label] = IMG[key];
  return `<picture><source srcset="${UP}assets/${file}.webp" type="image/webp"/><img src="${UP}assets/${file}.jpg" alt="${alt || label + ', web para negocio local diseñada por OI Studio'}" width="900" height="562"${cls ? ` class="${cls}"` : ''}${eager ? ' fetchpriority="high"' : ' loading="lazy"'}/></picture>`;
};

/* CSS propio de las páginas de zona: compacto, sin huecos muertos */
const ZONA_CSS = `
  .zh{padding:118px 0 0;}
  .zh__grid{display:grid;grid-template-columns:1.05fr .95fr;gap:44px;align-items:center;}
  @media(max-width:900px){.zh__grid{grid-template-columns:1fr;gap:28px;}}
  .zh__crumbs{font-family:var(--font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-faint);margin-bottom:14px;}
  .zh__crumbs a{color:inherit;text-decoration:none;}
  .zh__crumbs a:hover{color:var(--terra);}
  .zh h1{font-size:clamp(32px,4.6vw,52px);line-height:1.04;letter-spacing:-.03em;margin:0;}
  .zh__lede{font-size:17px;color:var(--text-muted);line-height:1.6;margin:16px 0 0;max-width:46ch;}
  .zh__cta{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px;}
  .zh__shot{position:relative;border-radius:var(--r-lg);overflow:hidden;border:1px solid var(--border);box-shadow:0 26px 60px -28px rgba(25,23,18,.45);}
  .zh__shot img{width:100%;height:auto;display:block;}
  .zh__tag{position:absolute;left:14px;bottom:14px;background:rgba(251,250,246,.94);backdrop-filter:blur(8px);border-radius:var(--r-pill);padding:7px 14px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);}

  .zfacts{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin:38px 0 0;border-top:1px solid var(--border-strong);border-bottom:1px solid var(--border-strong);}
  @media(max-width:720px){.zfacts{grid-template-columns:repeat(2,1fr);}}
  .zfact{padding:18px 20px;border-right:1px solid var(--border);}
  .zfact:last-child{border-right:none;}
  @media(max-width:720px){.zfact:nth-child(2){border-right:none;}.zfact:nth-child(-n+2){border-bottom:1px solid var(--border);}}
  .zfact b{display:block;font-size:22px;letter-spacing:-.02em;color:var(--ink);line-height:1.1;}
  .zfact span{display:block;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--text-faint);margin-top:6px;}

  .zsec{padding:56px 0;}
  .zsec--tight{padding:44px 0;}
  .zhead{display:flex;align-items:baseline;gap:14px;margin-bottom:22px;flex-wrap:wrap;}
  .zhead h2{font-size:clamp(23px,3vw,30px);letter-spacing:-.025em;margin:0;line-height:1.12;}
  .zhead .k{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--terra);}

  .zsplit{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start;}
  @media(max-width:860px){.zsplit{grid-template-columns:1fr;gap:24px;}}
  .zsplit p{font-size:16.5px;line-height:1.72;color:var(--text-muted);margin:0 0 14px;}
  .zpull{border-left:3px solid var(--terra);padding:2px 0 2px 18px;font-size:16px;line-height:1.6;color:var(--ink);}

  .zchips{display:flex;flex-wrap:wrap;gap:9px;}
  .zchip{display:inline-flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-pill);padding:9px 16px;font-size:14px;color:var(--text);}
  .zchip::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--terra);flex-shrink:0;}

  /* 3 columnas a 16:10, la proporción nativa de las capturas: no recorta nada */
  .zmosaic{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
  @media(max-width:820px){.zmosaic{grid-template-columns:1fr 1fr;}}
  @media(max-width:520px){.zmosaic{grid-template-columns:1fr;}}
  .zshot{position:relative;display:block;aspect-ratio:16/10;border-radius:var(--r-md);overflow:hidden;border:1px solid var(--border);background:var(--surface-2);text-decoration:none;}
  .zshot img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.16,1,.3,1);}
  .zshot:hover img{transform:scale(1.05);}
  .zshot__lbl{position:absolute;left:10px;bottom:10px;background:rgba(251,250,246,.94);border-radius:var(--r-pill);padding:6px 12px;font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);}

  .zsteps{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
  @media(max-width:860px){.zsteps{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:480px){.zsteps{grid-template-columns:1fr;}}
  .zstep{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:18px;}
  .zstep i{font-style:normal;font-family:var(--font-mono);font-size:11px;color:var(--terra);letter-spacing:.1em;}
  .zstep h3{font-size:15px;margin:8px 0 6px;letter-spacing:-.01em;}
  .zstep p{font-size:13.5px;color:var(--text-muted);line-height:1.55;margin:0;}

  .zfaq{display:grid;gap:10px;}
  .zfaq details{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:2px 20px;}
  .zfaq details[open]{border-color:var(--border-strong);}
  .zfaq summary{cursor:pointer;padding:15px 26px 15px 0;font-weight:500;color:var(--ink);list-style:none;position:relative;font-size:15.5px;}
  .zfaq summary::-webkit-details-marker{display:none;}
  .zfaq summary::after{content:"+";position:absolute;right:0;top:11px;font-size:21px;font-weight:400;color:var(--terra);transition:transform .25s;}
  .zfaq details[open] summary::after{transform:rotate(45deg);}
  .zfaq p{padding:0 0 16px;font-size:14.5px;color:var(--text-muted);line-height:1.65;margin:0;}
  .zfaq a{color:var(--terra);}

  .zcta{background:var(--ink);color:#fff;border-radius:var(--r-lg);padding:34px 36px;display:flex;align-items:center;justify-content:space-between;gap:22px;flex-wrap:wrap;}
  .zcta h2{color:#fff;font-size:24px;margin:0 0 6px;letter-spacing:-.02em;}
  .zcta p{color:#c9c2b2;margin:0;font-size:14.5px;max-width:46ch;}
  .zcta__btns{display:flex;gap:10px;flex-wrap:wrap;}

  .znear{margin-top:26px;font-size:13.5px;color:var(--text-faint);line-height:1.9;}
  .znear a{color:var(--text-muted);text-decoration:none;border-bottom:1px solid var(--border-strong);}
  .znear a:hover{color:var(--terra);}

  /* Hub */
  .zgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;}
  .zcard{display:block;border:1px solid var(--border);border-radius:var(--r-md);overflow:hidden;background:var(--surface);text-decoration:none;color:inherit;transition:transform .3s var(--ease),box-shadow .3s var(--ease),border-color .3s;}
  .zcard:hover{transform:translateY(-4px);box-shadow:0 22px 44px -24px rgba(25,23,18,.4);border-color:var(--border-strong);}
  .zcard__img{aspect-ratio:16/10;overflow:hidden;background:var(--surface-2);}
  .zcard__img img{width:100%;height:100%;object-fit:cover;display:block;}
  .zcard__b{padding:15px 17px 17px;}
  .zcard__b h3{font-size:17px;margin:0;letter-spacing:-.015em;}
  .zcard__meta{font-family:var(--font-mono);font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--terra);margin-top:5px;}
  .zcard__b p{font-size:13.5px;color:var(--text-muted);line-height:1.55;margin:9px 0 0;}`;

const navLink = (active) => `<div class="nav-wrap">
<nav class="nav">
<a href="${UP}index.html" class="nav__logo"><img src="${UP}assets/logo-nav-black.png" alt="OI Studio" class="nav__logo-img"/></a>
<ul class="nav__links">
<li><a href="${UP}index.html" data-t="nav_inicio">Inicio</a></li>
<li><a href="${UP}sobre-mi.html" data-t="nav_sobre">Sobre mí</a></li>
<li><a href="${UP}trabajos.html" data-t="nav_trabajos">Trabajos</a></li>
<li><a href="${UP}precios.html" data-t="nav_precios">Precios</a></li>
<li><a href="${UP}zonas.html"${active === 'zonas' ? ' class="is-active"' : ''} data-t="nav_zonas">Zonas</a></li>
<li><a href="${UP}chatbot-reservas.html" data-t="nav_chatbot">Chatbot</a></li>
<li><a href="${UP}articulos.html" data-t="nav_articulos">Artículos</a></li>
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
<a href="${UP}contacto.html" class="btn btn--accent nav__cta" data-t="btn_presupuesto">Solicitar presupuesto</a>
<button class="nav__toggle" aria-label="Abrir menú" aria-expanded="false">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
</button>
</div>
</nav>
</div>
<div class="mobile-menu">
<ul>
<li><a href="${UP}index.html" data-t="nav_inicio">Inicio</a></li>
<li><a href="${UP}sobre-mi.html" data-t="nav_sobre">Sobre mí</a></li>
<li><a href="${UP}trabajos.html" data-t="nav_trabajos">Trabajos</a></li>
<li><a href="${UP}precios.html" data-t="nav_precios">Precios</a></li>
<li><a href="${UP}zonas.html" data-t="nav_zonas">Zonas</a></li>
<li><a href="${UP}chatbot-reservas.html" data-t="nav_chatbot">Chatbot</a></li>
<li><a href="${UP}articulos.html" data-t="nav_articulos">Artículos</a></li>
<li><a href="${UP}contacto.html" data-t="nav_contacto">Contacto</a></li>
</ul>
</div>`;

const footer = () => `<footer class="footer">
<div class="container">
<div class="footer__grid">
<div>
<a href="${UP}index.html" class="footer__logo"><img src="${UP}assets/logo-nav-black.png" alt="OI Studio" class="footer__logo-img"/></a>
<p class="footer__desc" data-t="foot_desc" style="margin-top:20px;">Webs rápidas, modernas y efectivas para negocios locales que quieren destacar en internet.</p>
</div>
<div>
<h4 data-t="foot_secciones">Secciones</h4>
<ul>
<li><a href="${UP}sobre-mi.html" data-t="nav_sobre">Sobre mí</a></li>
<li><a href="${UP}trabajos.html" data-t="foot_portfolio">Portfolio</a></li>
<li><a href="${UP}precios.html" data-t="nav_precios">Precios</a></li>
<li><a href="${UP}zonas.html" data-t="nav_zonas">Zonas</a></li>
<li><a href="${UP}articulos.html" data-t="nav_articulos">Artículos</a></li>
<li><a href="${UP}contacto.html" data-t="nav_contacto">Contacto</a></li>
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
<p>© 2026 OI Studio · <a href="${UP}legal.html" data-t="foot_legal">Aviso legal y privacidad</a></p>
<p data-t="foot_made">Diseñado y desarrollado en Tolosa</p>
</div>
</div>
<div class="footer__mark" aria-hidden="true">OI STUDIO</div>
</footer>

<script src="${UP}assets/i18n.js"></script>
<script src="${JS_V}"></script>
<a class="wa-float" href="https://wa.me/34680956755?text=Hola%2C%20quiero%20informaci%C3%B3n%20para%20la%20web%20de%20mi%20negocio." target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2.05 22l5.27-1.38c1.45.79 3.08 1.21 4.72 1.21 5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.23 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29z"/></svg>
</a>
</body>
</html>`;

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

// ---------- páginas de localidad ----------
for (const z of ZONAS) {
  const canonical = `https://oiwebstudio.com/zonas/${z.slug}.html`;
  const title = `Diseño web en ${z.name} — Páginas web para negocios | OI Studio`;
  const desc = `Diseño y desarrollo de páginas web para negocios de ${z.name} (${z.comarca}). Precio cerrado desde 199€, propuesta en 48h. Estudio en Tolosa, a ${z.dist}.`;
  const kw = `diseño web ${z.name}, páginas web ${z.name}, desarrollo web ${z.comarca}, web negocio ${z.name}, diseñador web Gipuzkoa`;

  const otras = ZONAS.filter(o => o.slug !== z.slug).slice(0, 8)
    .map(o => `<a href="${o.slug}.html">${o.name}</a>`).join(' · ');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="theme-color" content="#f6f3ea"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<meta name="keywords" content="${kw}"/>
<meta name="robots" content="index, follow"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="OI Studio"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image" content="https://oiwebstudio.com/assets/${IMG[z.hero][0]}.jpg"/>
<meta property="og:locale" content="es_ES"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="canonical" href="${canonical}"/>
<link rel="icon" href="${UP}assets/logo-mark-bw.png" type="image/png"/>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"Inicio","item":"https://oiwebstudio.com/"},
    {"@type":"ListItem","position":2,"name":"Zonas","item":"https://oiwebstudio.com/zonas.html"},
    {"@type":"ListItem","position":3,"name":"Diseño web en ${z.name}","item":"${canonical}"}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"ProfessionalService",
  "name":"OI Studio — Diseño web en ${z.name}",
  "url":"${canonical}",
  "image":"https://oiwebstudio.com/assets/${IMG[z.hero][0]}.jpg",
  "description":${JSON.stringify(desc)},
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
    {"@type":"Question","name":"¿Trabajas con negocios de ${z.name}?","acceptedAnswer":{"@type":"Answer","text":"Sí. El estudio está en Tolosa, a ${z.dist} de ${z.name}, y trabajo habitualmente con negocios de ${z.comarca}. Las reuniones pueden ser presenciales o por videollamada."}},
    {"@type":"Question","name":"¿Cuánto cuesta una página web para un negocio de ${z.name}?","acceptedAnswer":{"@type":"Answer","text":"El precio es cerrado y no cambia según el municipio: Landing desde 199€ y Web Negocio desde 299€, con propuesta en 48 horas y 30 días de ajustes gratis."}},
    {"@type":"Question","name":"¿Saldrá mi negocio en Google cuando busquen en ${z.name}?","acceptedAnswer":{"@type":"Answer","text":"Todas las webs llevan SEO local básico: títulos y descripciones orientados a ${z.name}, datos estructurados de negocio local y conexión con tu ficha de Google Business, que es lo que decide tu posición en el mapa."}}
  ]
}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link rel="preload" as="style" href="${FONTS}"/>
<link href="${FONTS}" rel="stylesheet" media="print" onload="this.media='all'"/>
<noscript><link href="${FONTS}" rel="stylesheet"/></noscript>
<link rel="stylesheet" href="${CSS_V}"/>
<style>${ZONA_CSS}</style>
</head>
<body>

${navLink()}

<header class="zh">
<div class="container">
<div class="zh__grid">
<div>
<p class="zh__crumbs"><a href="${UP}index.html">Inicio</a> / <a href="${UP}zonas.html">Zonas</a> / ${z.name}</p>
<h1>Diseño web en <span class="grad">${z.name}</span></h1>
<p class="zh__lede">${z.lede}</p>
<div class="zh__cta">
<a href="${UP}contacto.html" class="btn btn--accent">Solicitar presupuesto</a>
<a href="${UP}trabajos.html" class="btn btn--ghost">Ver trabajos</a>
</div>
</div>
<div class="zh__shot">
${pic(z.hero, null, `${IMG[z.hero][1]} — ejemplo de web para un negocio de ${z.name}`, true)}
<span class="zh__tag">${IMG[z.hero][1]} · proyecto real</span>
</div>
</div>

<div class="zfacts">
<div class="zfact"><b>${z.dist}</b><span>Desde Tolosa</span></div>
<div class="zfact"><b>${z.pob}</b><span>Habitantes</span></div>
<div class="zfact"><b>199€</b><span>Desde, precio cerrado</span></div>
<div class="zfact"><b>48h</b><span>Propuesta</span></div>
</div>
</div>
</header>

<section class="zsec">
<div class="container">
<div class="zsplit">
<div>
<div class="zhead"><span class="k">${z.comarca}</span><h2>Qué necesita un negocio de ${z.name}</h2></div>
<p>${z.contexto}</p>
<p class="zpull">${z.gancho}</p>
</div>
<div>
<div class="zhead"><span class="k">Sectores</span><h2>Con quién trabajo</h2></div>
<div class="zchips">
${z.sectores.map(s => `<span class="zchip">${s}</span>`).join('\n')}
</div>
<p style="font-size:14px;color:var(--text-faint);margin-top:16px;">¿El tuyo no está? Escríbeme igual — trabajo con cualquier negocio local.</p>
</div>
</div>
</div>
</section>

<section class="zsec--tight zsec" style="padding-top:0;">
<div class="container">
<div class="zhead"><span class="k">Portfolio</span><h2>Webs reales, publicadas y navegables</h2></div>
<div class="zmosaic">
${z.mosaico.map(k => `<a class="zshot" href="${UP}trabajos.html">${pic(k, null, `${IMG[k][1]}, ejemplo de web para negocio local`)}<span class="zshot__lbl">${IMG[k][1]}</span></a>`).join('\n')}
</div>
<p style="text-align:center;margin-top:16px;font-size:14px;color:var(--text-muted);">No enseño maquetas: las ocho webs del <a href="${UP}trabajos.html" style="color:var(--terra);">portfolio</a> están online y puedes abrirlas.</p>
</div>
</section>

<section class="zsec" style="padding-top:0;">
<div class="container">
<div class="zhead"><span class="k">Proceso</span><h2>De la primera llamada a la web publicada</h2></div>
<div class="zsteps">
<div class="zstep"><i>01</i><h3>Hablamos 15 min</h3><p>Entiendo tu negocio en ${z.name} y si de verdad puedo ayudarte.</p></div>
<div class="zstep"><i>02</i><h3>Propuesta en 48h</h3><p>Estructura, referencias y precio cerrado por escrito.</p></div>
<div class="zstep"><i>03</i><h3>Construyo la web</h3><p>Rápida, adaptada a móvil y con SEO local desde el primer día.</p></div>
<div class="zstep"><i>04</i><h3>Publico y acompaño</h3><p>Dominio a tu nombre y 30 días de ajustes gratis.</p></div>
</div>
</div>
</section>

<section class="zsec" style="padding-top:0;">
<div class="container">
<div class="zsplit">
<div>
<div class="zhead"><span class="k">Dudas</span><h2>Preguntas frecuentes</h2></div>
<div class="zfaq">
<details><summary>¿Trabajas con negocios de ${z.name}?</summary><p>Sí. El estudio está en Tolosa, a ${z.dist}, y trabajo habitualmente con negocios de ${z.comarca}. Las reuniones pueden ser presenciales o por videollamada, como te venga mejor.</p></details>
<details><summary>¿El precio cambia por estar fuera de Tolosa?</summary><p>No. Precio cerrado e igual para toda Gipuzkoa: Landing desde 199€ y Web Negocio desde 299€, con 30 días de ajustes gratis.</p></details>
<details><summary>¿Saldré en Google cuando busquen en ${z.name}?</summary><p>Todas las webs llevan SEO local orientado a ${z.name}. Aparecer arriba depende también de tu ficha de Google Business — lo explico en <a href="${UP}google-business-profile-guia.html">esta guía</a>.</p></details>
<details><summary>¿Puedo verlo antes de decidir?</summary><p>Sí: las ocho webs del <a href="${UP}trabajos.html">portfolio</a> están publicadas y son navegables. La propuesta en 48h es gratis y sin compromiso.</p></details>
</div>
</div>
<div>
<div class="zcta">
<div>
<h2>¿Tienes un negocio en ${z.name}?</h2>
<p>Propuesta con precio cerrado en menos de 48 horas. Gratis y sin compromiso.</p>
</div>
<div class="zcta__btns">
<a href="${UP}contacto.html" class="btn btn--light">Solicitar presupuesto</a>
<a href="https://wa.me/34680956755" target="_blank" rel="noopener" class="btn btn--dark-ghost">WhatsApp</a>
</div>
</div>
<p class="znear"><strong style="color:var(--text-muted);font-weight:500;">También trabajo en:</strong><br/>${otras} · <a href="${UP}zonas.html">ver todas</a></p>
</div>
</div>
</div>
</section>

${footer()}`;

  fs.writeFileSync(path.join(OUT, `${z.slug}.html`), html, 'utf8');
  console.log(`✓ zonas/${z.slug}.html`);
}
console.log(`\n${ZONAS.length} páginas en /zonas/`);
module.exports = { ZONAS, IMG };
