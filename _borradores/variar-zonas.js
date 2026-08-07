/* Diferencia las 20 páginas de zona.
 *
 * La auditoría midió un 62% de similitud léxica media entre ellas: la FAQ y el
 * CTA eran la misma plantilla con el nombre del pueblo cambiado. Google puede
 * leer eso como contenido reaprovechado y dejar de indexar la mitad.
 *
 * La variación NO es de sinónimos: se apoya en datos que ya estaban en cada
 * página y son ciertos — distancia a Tolosa, comarca y población. Una respuesta
 * para Ibarra (2 km, 4.300 hab.) dice algo distinto de una para Eibar (55 km,
 * 27.000 hab.) porque la realidad es distinta. Los datos de servicio (precios,
 * plazos, portfolio) son idénticos en todas, porque también lo son de verdad.
 *
 * Uso:  node _borradores/variar-zonas.js          (aplica)
 *       node _borradores/variar-zonas.js --dry    (solo enseña el resultado)
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'zonas');
const SOLO_VER = process.argv.includes('--dry');

/* ---- lectura de los datos que ya viven en cada página ---- */
function leerDatos(html, fichero) {
  const nombre = (html.match(/<h2[^>]*>¿Tienes un negocio en ([^<?]+)\?<\/h2>/) || [])[1];
  const km = +(html.match(/(\d+)\s*km/) || [])[1];
  const comarca = (html.match(/trabajo habitualmente con negocios de ([A-Za-zÁÉÍÓÚáéíóúñÑ-]+)/) || [])[1];
  const habTxt = (html.match(/>([\d.]+)<\/b>\s*<span[^>]*>\s*habitantes/i) || [])[1];
  const hab = habTxt ? +habTxt.replace(/\./g, '') : null;
  if (!nombre || !km || !comarca || !hab) throw new Error('faltan datos en ' + fichero);
  return { nombre, km, comarca, hab, habTxt };
}

/* ---- bandas: la distancia cambia cómo se trabaja, la población cómo compite ---- */
const banda = km => (km <= 5 ? 'pegado' : km <= 15 ? 'cerca' : km <= 30 ? 'medio' : 'lejos');
const tamano = h => (h < 5000 ? 'pueblo' : h < 20000 ? 'villa' : 'ciudad');

/* Q1 — trabajar en la zona. Varía con la distancia real, dos redacciones por
 * banda para que dos pueblos igual de lejos no lean lo mismo. */
const q1 = {
  pegado: [
    d => [`¿Trabajas con negocios de ${d.nombre}?`,
      `Constantemente. Estoy a ${d.km} km: puedo acercarme a ver el local, hacer las fotos del negocio y volver la misma mañana. Para ${d.comarca} es prácticamente trabajo de casa.`],
    d => [`¿Te mueves hasta ${d.nombre}?`,
      `Es que casi no hay que moverse: ${d.km} km. Me paso por tu negocio cuando haga falta, sin cita eterna ni papeleo, y lo del día a día lo resolvemos por WhatsApp.`],
  ],
  cerca: [
    d => [`¿Llegas hasta ${d.nombre}?`,
      `Sí, es zona habitual. Con ${d.km} km de por medio, quedar en persona no supone ningún problema: nos vemos en tu negocio o donde te venga bien, y el resto lo llevamos por WhatsApp.`],
    d => [`¿Atiendes a negocios de ${d.nombre}?`,
      `Sin problema. Son ${d.km} km desde Tolosa, media hora larga como mucho, así que la primera reunión la hacemos en tu local si te apetece. En ${d.comarca} me muevo a menudo.`],
  ],
  medio: [
    d => [`¿Trabajas con negocios de ${d.nombre}?`,
      `Sí. Estoy a ${d.km} km, así que lo normal es una primera visita presencial para ver el negocio y seguir por videollamada y WhatsApp. En ${d.comarca} trabajo así habitualmente.`],
    d => [`¿Cómo trabajas si estoy en ${d.nombre}?`,
      `Con ${d.km} km de distancia lo eficaz es mezclar: nos vemos en persona al principio, cuando hay que entender el negocio y hacer fotos, y a partir de ahí videollamada y WhatsApp. Da igual que estés en Tolosa o en ${d.comarca}.`],
  ],
  lejos: [
    d => [`¿Cubres ${d.nombre} desde Tolosa?`,
      `Sí. A ${d.km} km lo práctico es arrancar por videollamada y reservar el viaje para cuando aporte algo de verdad: ver el local o hacer las fotos. El seguimiento va por WhatsApp, que es más rápido para los dos.`],
    d => [`Estoy en ${d.nombre}, ¿es un problema?`,
      `Ninguno. Son ${d.km} km, así que trabajo en remoto salvo cuando merece la pena acercarse. Que esté en Tolosa y tú en ${d.comarca} no cambia ni el resultado ni el trato: hablamos por WhatsApp casi a diario.`],
  ],
};

/* Q2 — precio. El dato es el mismo; lo que cambia es cómo afecta la distancia. */
const q2 = {
  pegado: [
    d => [`¿Cuesta lo mismo que en Tolosa?`,
      `Exactamente lo mismo. Landing desde 199€ y Web Negocio desde 299€, precio cerrado por escrito y 30 días de ajustes incluidos. A ${d.km} km no hay desplazamiento que repercutir ni excusa para cobrarlo.`],
    d => [`¿Hay algún recargo por no ser de Tolosa?`,
      `No. Misma tarifa para todo el mundo: 199€ la Landing, 299€ la Web Negocio, cerrado por escrito antes de empezar y con 30 días de ajustes. Estando a ${d.km} km, cobrar desplazamiento sería un poco cara dura.`],
  ],
  cerca: [
    d => [`¿El precio cambia por estar fuera de Tolosa?`,
      `No. Precio cerrado e idéntico en toda Gipuzkoa: 199€ la Landing, 299€ la Web Negocio, con 30 días de ajustes gratis. Los ${d.km} km los pongo yo.`],
    d => [`¿Me sale más caro por la distancia?`,
      `No, la tarifa es única: Landing 199€ y Web Negocio 299€, con 30 días de ajustes incluidos. Los ${d.km} km de ida y vuelta son cosa mía, no tuya, y el precio te lo doy cerrado por escrito antes de arrancar.`],
  ],
  medio: [
    d => [`¿Se encarece por la distancia?`,
      `En absoluto. La tarifa es la misma para toda Gipuzkoa — Landing 199€, Web Negocio 299€, 30 días de ajustes incluidos — y los desplazamientos van por mi cuenta. Lo que te paso por escrito antes de empezar es lo que pagas.`],
    d => [`¿Cuánto cuesta una web para un negocio de ${d.nombre}?`,
      `Lo mismo que para uno de Tolosa: 199€ una Landing y 299€ una Web Negocio, pago único y 30 días de ajustes gratis. Ni los ${d.km} km ni la comarca cambian la cifra, y la recibes cerrada por escrito.`],
  ],
  lejos: [
    d => [`¿Cobras desplazamiento hasta ${d.nombre}?`,
      `No. Ni desplazamiento ni recargo por comarca: Landing desde 199€ y Web Negocio desde 299€, igual que para un negocio de la calle de al lado, con 30 días de ajustes gratis.`],
    d => [`¿Los ${d.km} km se pagan aparte?`,
      `No se pagan. El precio es cerrado y único en toda Gipuzkoa — 199€ Landing, 299€ Web Negocio, 30 días de ajustes incluidos — y los viajes corren de mi cuenta. Lo que firmas es lo que hay.`],
  ],
};

/* Q3 — SEO local. Varía con el tamaño real del municipio. */
const q3 = {
  pueblo: [
    d => [`¿Saldré en Google si busco desde ${d.nombre}?`,
      `Con ${d.habTxt} habitantes hay poquísima competencia digital: muchos negocios de ${d.nombre} ni siquiera tienen web. Bien planteado, aparecer arriba en las búsquedas locales suele notarse rápido. La otra mitad es tu ficha de Google Business — lo cuento en <a href="../google-business-profile-guia.html">esta guía</a>.`],
    d => [`¿Merece la pena el SEO en un pueblo de ${d.habTxt} habitantes?`,
      `Precisamente ahí es donde más rinde. Son pocos negocios peleando y muchos sin web, así que hacerlo bien te pone por delante sin gran esfuerzo. La web sale orientada a búsquedas de ${d.nombre} y ${d.comarca}, y el complemento es tu ficha de Google Business, que repaso en <a href="../google-business-profile-guia.html">esta guía</a>.`],
  ],
  villa: [
    d => [`¿Me encontrarán en Google buscando en ${d.nombre}?`,
      `Todas las webs salen con el SEO local orientado a ${d.nombre} y a ${d.comarca}: estructura, textos y velocidad. En un municipio de ${d.habTxt} habitantes la competencia es abarcable, pero la posición depende también de tu ficha de Google Business, que explico en <a href="../google-business-profile-guia.html">esta guía</a>.`],
    d => [`¿Qué hace falta para posicionar en ${d.nombre}?`,
      `Dos cosas que van juntas. Una es la web: la entrego con los textos y la estructura apuntando a ${d.nombre}, y cargando rápido, que Google lo mide. La otra es tu ficha de Google Business, y con ${d.habTxt} habitantes de mercado esa ficha decide más de lo que parece — la desmenuzo en <a href="../google-business-profile-guia.html">esta guía</a>.`],
  ],
  ciudad: [
    d => [`¿Puedo competir en Google en ${d.nombre}?`,
      `Sí, pero con los pies en el suelo: ${d.habTxt} habitantes significan más negocios peleando por las mismas búsquedas, así que aquí el SEO local pesa más que en un pueblo. La web sale preparada para ${d.nombre} y el resto lo hace tu ficha de Google Business, que trabajo contigo siguiendo <a href="../google-business-profile-guia.html">esta guía</a>.`],
    d => [`¿Es más difícil posicionar en una ciudad como ${d.nombre}?`,
      `Más disputado, sí. Con ${d.habTxt} habitantes tienes competencia de verdad, y ahí el truco no es aparecer para todo, sino para tu barrio y tu especialidad. La web va preparada para eso; la ficha de Google Business hace el resto del trabajo y la explico paso a paso en <a href="../google-business-profile-guia.html">esta guía</a>.`],
  ],
};

/* Q4 — ver antes de decidir. Cuatro redacciones que rotan. */
const q4 = [
  d => [`¿Puedo ver algo antes de decidir?`,
    `Sí, y es lo que recomiendo. Las ocho webs del <a href="../trabajos.html">portfolio</a> están publicadas y se navegan enteras, no son capturas. Después te preparo la propuesta en 48h, gratis y sin compromiso.`],
  d => [`¿Cómo sé que me va a gustar?`,
    `Porque puedes verlo antes. Las ocho webs del <a href="../trabajos.html">portfolio</a> están online y abiertas: entra, navégalas y mira si ese acabado es el que quieres para tu negocio. La propuesta llega en 48h y no compromete a nada.`],
  d => [`¿Hay algún compromiso por pedir presupuesto?`,
    `Ninguno. Me cuentas el negocio, te devuelvo una propuesta con precio cerrado en 48h y decides. Mientras tanto puedes juzgar el trabajo por ti mismo: las ocho webs del <a href="../trabajos.html">portfolio</a> son navegables.`],
  d => [`¿Puedo verlo antes de decidir?`,
    `Claro. No enseño maquetas: las ocho webs del <a href="../trabajos.html">portfolio</a> están publicadas y se pueden abrir y recorrer. Con eso y la propuesta en 48h tienes de sobra para decidir sin compromiso.`],
];

/* CTA final — cuatro variantes que rotan */
const ctas = [
  d => `Propuesta con precio cerrado en menos de 48 horas. Gratis y sin compromiso.`,
  d => `Cuéntame qué haces y te devuelvo una propuesta con precio cerrado en 48 horas. Sin compromiso.`,
  d => `Te preparo el presupuesto en menos de 48 horas, cerrado y por escrito. No cuesta nada preguntar.`,
  d => `En 48 horas tienes la propuesta con el precio cerrado. Gratis, y si no encaja no pasa nada.`,
];

/* índice estable por nombre de fichero, para que la rotación no se agrupe */
const idx = (f, n) => [...f].reduce((a, c) => a + c.charCodeAt(0), 0) % n;

const det = (p, r) => `<details><summary>${p}</summary><p>${r}</p></details>`;

let cambiadas = 0;
for (const f of fs.readdirSync(DIR).filter(x => x.endsWith('.html'))) {
  const ruta = path.join(DIR, f);
  let html = fs.readFileSync(ruta, 'utf8');
  const d = leerDatos(html, f);

  const v = idx(f, 2);            // variante dentro de la banda
  const bloque = [
    det(...q1[banda(d.km)][v](d)),
    det(...q2[banda(d.km)][1 - v](d)),   // invertida, para no encadenar la misma voz
    det(...q3[tamano(d.hab)][v](d)),
    det(...q4[idx(f, 4)](d)),
  ].join('\n');

  const reFaq = /(<div class="zfaq"[^>]*>)[\s\S]*?(<\/div>)/;
  // Ojo: comprobar que el patrón CASA, no que el texto cambie. El script es
  // idempotente: al reejecutarlo el resultado es idéntico, y eso es un éxito,
  // no un fallo.
  if (!reFaq.test(html)) { console.log('  !! no se encontró el bloque de FAQ en', f); continue; }
  const nuevo = html.replace(reFaq, (m, ini, fin) => `${ini}\n${bloque}\n${fin}`);

  const conCta = nuevo.replace(
    /(<h2[^>]*>¿Tienes un negocio en [^<]*<\/h2>\s*<p>)[\s\S]*?(<\/p>)/,
    (m, ini, fin) => ini + ctas[idx(f, 4)](d) + fin
  );

  /* El JSON-LD de FAQPage tiene que decir exactamente lo mismo que la FAQ
   * visible. Ya no coincidía antes de tocar nada (tenía 3 preguntas y otra
   * redacción), y Google desestima —o penaliza— el marcado que no se
   * corresponde con el contenido. Se regenera de la misma fuente. */
  const escapar = t => t.replace(/<[^>]+>/g, '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').trim();
  const preguntas = [
    q1[banda(d.km)][v](d),
    q2[banda(d.km)][1 - v](d),
    q3[tamano(d.hab)][v](d),
    q4[idx(f, 4)](d),
  ].map(([p, r]) =>
    `    {"@type":"Question","name":"${escapar(p)}","acceptedAnswer":{"@type":"Answer","text":"${escapar(r)}"}}`
  ).join(',\n');

  const conSchema = conCta.replace(
    /("@type":"FAQPage",\s*\n\s*"mainEntity":\[)[\s\S]*?(\n\s*\])/,
    (m, ini, fin) => `${ini}\n${preguntas}${fin}`
  );
  if (conSchema === conCta) console.log('  !! aviso: no se pudo sincronizar el schema en', f);

  if (!SOLO_VER) fs.writeFileSync(ruta, conSchema, 'utf8');
  cambiadas++;
}
console.log(SOLO_VER ? `(simulación) ${cambiadas} páginas` : `${cambiadas} páginas de zona actualizadas`);
