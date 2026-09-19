/**
 * Traducciones al euskera de las páginas de zona.
 *
 * Por qué existen: Search Console (jul–sep 2026) daba impresiones para
 * búsquedas en euskera como «web diseinua donostia» sin ninguna página en
 * euskera que las recogiera. Se empieza por las tres zonas con más
 * impresiones: Donostia, Irun y Zarautz.
 *
 * Cómo funciona: scripts/generar-euskera.mjs toma la página en castellano y
 * sustituye cada fragmento de la izquierda por el de la derecha. Si un
 * fragmento en castellano ya no está en la página (porque alguien lo ha
 * editado), o si queda texto en castellano sin traducir, el despliegue se
 * para con el aviso. Así la versión en euskera no puede quedarse a medias ni
 * desincronizada sin que nadie se entere.
 *
 * Los fragmentos pueden llevar HTML en línea (enlaces): las rutas relativas se
 * reescriben después, igual que en el resto de páginas en euskera.
 *
 * REVISAR con un hablante antes de darlas por definitivas, igual que los
 * títulos de generar-euskera.mjs.
 */

/* Textos que se repiten en todas las páginas de zona. */
export const COMUNES = [
  // Cabecera y migas
  [`Inicio`, `Hasiera`],
  [`Zonas`, `Eremuak`],
  [`Solicitar presupuesto`, `Aurrekontua eskatu`],
  [`Ver trabajos`, `Lanak ikusi`],
  [`Llamar al 680 95 67 55`, `680 95 67 55 zenbakira deitu`],
  [`Abrir menú`, `Menua ireki`],
  [`Escribir por WhatsApp`, `WhatsApp bidez idatzi`],

  // Cifras
  [`Desde Tolosa`, `Tolosatik`],
  [`Habitantes`, `Biztanle`],
  [`Desde, precio cerrado`, `Gutxienez, prezio itxia`],
  [`Propuesta`, `Proposamena`],

  // Sectores
  [`Sectores`, `Sektoreak`],
  [`Con quién trabajo`, `Norekin lan egiten dudan`],
  [`¿El tuyo no está? Escríbeme igual — trabajo con cualquier negocio local.`,
   `Zurea ez dago zerrendan? Idatzi berdin-berdin — edozein tokiko negoziorekin lan egiten dut.`],
  [`Hostelería y restauración`, `Ostalaritza eta jatetxeak`],
  [`Comercio y moda`, `Merkataritza eta moda`],

  // Portfolio
  [`Portfolio`, `Portfolioa`],
  [`Webs reales, publicadas y navegables`, `Benetako webguneak, argitaratuak eta nabigagarriak`],
  [`Cafetería`, `Kafetegia`],
  [`Peluquería`, `Ile-apaindegia`],
  [`Restaurante`, `Jatetxea`],
  [`Taller mecánico`, `Tailer mekanikoa`],
  [`Gimnasio`, `Gimnasioa`],
  [`Cafetería, ejemplo de web para negocio local`, `Kafetegia, tokiko negozio baterako web adibidea`],
  [`Peluquería, ejemplo de web para negocio local`, `Ile-apaindegia, tokiko negozio baterako web adibidea`],
  [`Restaurante, ejemplo de web para negocio local`, `Jatetxea, tokiko negozio baterako web adibidea`],
  [`Taller mecánico, ejemplo de web para negocio local`, `Tailer mekanikoa, tokiko negozio baterako web adibidea`],
  [`Gimnasio, ejemplo de web para negocio local`, `Gimnasioa, tokiko negozio baterako web adibidea`],
  [`No enseño maquetas: las ocho webs del <a href="../trabajos.html" class="link-terra">portfolio</a> están online y puedes abrirlas.`,
   `Ez dut maketarik erakusten: <a href="../trabajos.html" class="link-terra">portfolioko</a> zortzi webguneak sarean daude eta ireki ditzakezu.`],

  // Proceso
  [`Proceso`, `Prozesua`],
  [`De la primera llamada a la web publicada`, `Lehen deitik webgunea argitaratu arte`],
  [`Hablamos 15 min`, `15 minutuz hitz egiten dugu`],
  [`Propuesta en 48h`, `Proposamena 48 ordutan`],
  [`Estructura, referencias y precio cerrado por escrito.`, `Egitura, erreferentziak eta prezio itxia, idatziz.`],
  [`Construyo la web`, `Webgunea eraikitzen dut`],
  [`Rápida, adaptada a móvil y con SEO local desde el primer día.`, `Azkarra, mugikorrera egokitua eta lehen egunetik tokiko SEOarekin.`],
  [`Publico y acompaño`, `Argitaratu eta ondoan jarraitzen dut`],
  [`Dominio a tu nombre y 30 días de ajustes gratis.`, `Domeinua zure izenean eta 30 egunez doikuntzak doan.`],

  // Cercanos, dudas y pie
  [`También trabajo en estos municipios`, `Udalerri hauetan ere lan egiten dut`],
  [`Dudas`, `Zalantzak`],
  [`Preguntas frecuentes`, `Ohiko galderak`],
  [`También trabajo en:`, `Hauetan ere lan egiten dut:`],
  [`ver todas`, `guztiak ikusi`],
  [`Tolosa, País Vasco`, `Tolosa, Euskal Herria`],
];

/* Una entrada por página: título y descripción de la cabecera, y los textos
   propios de esa zona. */
export const ZONAS_EU = {
  "zonas/donostia-san-sebastian.html": {
    title: "Web diseinua Donostian: webguneak negozioentzat | OI Studio",
    desc: "Web diseinua eta webguneak Donostiako negozioentzat. Prezio itxia 199€-tik eta proposamena 48 ordutan. Estudioa Tolosan, 26 km-ra.",
    pares: [
      [`Páginas web para negocios de Donostia-San Sebastián. Precio cerrado desde 199€ y propuesta en 48h. Estudio en Tolosa, a 26 km.`,
       `Web diseinua eta webguneak Donostiako negozioentzat. Prezio itxia 199€-tik eta proposamena 48 ordutan. Estudioa Tolosan, 26 km-ra.`],
      [`OI Studio — Diseño web en Donostia-San Sebastián`, `OI Studio — Web diseinua Donostian`],
      [`Diseño web en Donostia-San Sebastián`, `Web diseinua Donostian`],
      [`Diseño web en <span class="grad">Donostia-San Sebastián</span>`, `Web diseinua <span class="grad">Donostian</span>`],
      [`Aquí hay agencias de sobra y presupuestos de cinco cifras. Yo trabajo con el negocio de barrio que necesita una web buena sin pagar precio de capital.`,
       `Hemen agentzia ugari dago, eta bost zifrako aurrekontuak. Nik auzoko negozioarekin lan egiten dut: web on bat behar duenarekin, hiriburuko preziorik ordaindu gabe.`],
      [`Cafetería en Donostia-San Sebastián`, `Kafetegia Donostian`],
      [`Qué necesita un negocio de Donostia-San Sebastián`, `Zer behar du Donostiako negozio batek`],
      [`Donostia es el mercado más competido de Gipuzkoa: estudios grandes, agencias con equipo comercial y presupuestos que empiezan donde los míos acaban. Mi hueco no es competir por la cuenta de una multinacional, sino atender al comercio de Gros, Egia o Amara que necesita una web rápida y bien posicionada en su barrio, con precio cerrado.`,
       `Donostia da Gipuzkoako merkaturik lehiatuena: estudio handiak, salmenta-taldea duten agentziak eta nire aurrekontuak amaitzen diren tokian hasten diren aurrekontuak. Nire tokia ez da multinazional baten kontua lortzeko lehiatzea, baizik eta Gros, Egia edo Amarako dendari erantzutea: webgune azkar bat behar du, bere auzoan ondo kokatua eta prezio itxiarekin.`],
      [`En Donostia la búsqueda relevante casi nunca es "Donostia" a secas, sino el barrio: trabajo el SEO a ese nivel.`,
       `Donostian bilaketa garrantzitsua ia inoiz ez da "Donostia" hutsa, auzoa baizik: SEOa maila horretan lantzen dut.`],
      [`Turismo y alojamiento`, `Turismoa eta ostatuak`],
      [`Servicios profesionales`, `Zerbitzu profesionalak`],
      [`Salud y bienestar`, `Osasuna eta ongizatea`],
      [`Estética`, `Estetika`],
      [`Entiendo tu negocio en Donostia-San Sebastián y si de verdad puedo ayudarte.`,
       `Donostiako zure negozioa ulertzen dut, eta benetan lagun zaitzakedan ala ez.`],
      [`Cerca de Donostia-San Sebastián`, `Donostiatik gertu`],
      [`¿Trabajas con negocios de Donostia-San Sebastián?`, `Donostiako negozioekin lan egiten duzu?`],
      [`Sí. Estoy a 26 km, así que lo normal es una primera visita presencial para ver el negocio y seguir por videollamada y WhatsApp. En Donostialdea trabajo así habitualmente.`,
       `Bai. 26 km-ra nago; beraz, ohikoena lehen bisita aurrez aurre egitea da, negozioa ikusteko, eta gero bideodeiz eta WhatsApp bidez jarraitzea. Donostialdean horrela lan egiten dut normalean.`],
      [`¿Cuánto cuesta una web para un negocio de Donostia-San Sebastián?`, `Zenbat balio du Donostiako negozio baten webguneak?`],
      [`Lo mismo que para uno de Tolosa: 199€ una Landing y 299€ una Web Negocio, pago único y 30 días de ajustes gratis. Ni los 26 km ni la comarca cambian la cifra, y la recibes cerrada por escrito.`,
       `Tolosako batenak adina: 199€ Landing batek eta 299€ Negozio Web batek, ordainketa bakarrean eta 30 egunez doikuntzak doan. Ez 26 km-ek ez eskualdeak ez dute zifra aldatzen, eta idatziz jasotzen duzu, itxita.`],
      [`¿Puedo competir en Google en Donostia-San Sebastián?`, `Lehiatu naiteke Googlen Donostian?`],
      [`Sí, pero con los pies en el suelo: 190.000 habitantes significan más negocios peleando por las mismas búsquedas, así que aquí el SEO local pesa más que en un pueblo. La web sale preparada para Donostia-San Sebastián y el resto lo hace tu ficha de Google Business, que trabajo contigo siguiendo <a href="../google-business-profile-guia.html">esta guía</a>.`,
       `Bai, baina oinak lurrean: 190.000 biztanlek esan nahi du negozio gehiago daudela bilaketa berberengatik lehian; beraz, hemen tokiko SEOak herri batean baino pisu handiagoa du. Webgunea Donostiarako prestatuta ateratzen da, eta gainerakoa zure Google Business fitxak egiten du: zurekin lantzen dut, <a href="../google-business-profile-guia.html">gida honi</a> jarraituz.`],
      [`Sí, pero con los pies en el suelo: 190.000 habitantes significan más negocios peleando por las mismas búsquedas, así que aquí el SEO local pesa más que en un pueblo. La web sale preparada para Donostia-San Sebastián y el resto lo hace tu ficha de Google Business, que trabajo contigo siguiendo esta guía.`,
       `Bai, baina oinak lurrean: 190.000 biztanlek esan nahi du negozio gehiago daudela bilaketa berberengatik lehian; beraz, hemen tokiko SEOak herri batean baino pisu handiagoa du. Webgunea Donostiarako prestatuta ateratzen da, eta gainerakoa zure Google Business fitxak egiten du: zurekin lantzen dut, gida honi jarraituz.`],
      [`¿Hay algún compromiso por pedir presupuesto?`, `Aurrekontua eskatzeak konpromisoren bat dakar?`],
      [`Ninguno. Me cuentas el negocio, te devuelvo una propuesta con precio cerrado en 48h y decides. Mientras tanto puedes juzgar el trabajo por ti mismo: las ocho webs del <a href="../trabajos.html">portfolio</a> son navegables.`,
       `Bat ere ez. Zure negozioa kontatzen didazu, prezio itxidun proposamena itzultzen dizut 48 ordutan eta zuk erabakitzen duzu. Bitartean, lana zeuk epai dezakezu: <a href="../trabajos.html">portfolioko</a> zortzi webguneak nabigagarriak dira.`],
      [`Ninguno. Me cuentas el negocio, te devuelvo una propuesta con precio cerrado en 48h y decides. Mientras tanto puedes juzgar el trabajo por ti mismo: las ocho webs del portfolio son navegables.`,
       `Bat ere ez. Zure negozioa kontatzen didazu, prezio itxidun proposamena itzultzen dizut 48 ordutan eta zuk erabakitzen duzu. Bitartean, lana zeuk epai dezakezu: portfolioko zortzi webguneak nabigagarriak dira.`],
      [`¿Tienes un negocio en Donostia-San Sebastián?`, `Negozioren bat duzu Donostian?`],
      [`Te preparo el presupuesto en menos de 48 horas, cerrado y por escrito. No cuesta nada preguntar.`,
       `Aurrekontua 48 ordu baino gutxiagotan prestatzen dizut, itxita eta idatziz. Galdetzeak ez du ezer kostatzen.`],
    ],
  },

  "zonas/irun.html": {
    title: "Web diseinua Irunen: webguneak negozioentzat | OI Studio",
    desc: "Web diseinua eta webguneak Irungo negozioentzat (Bidasoa). Prezio itxia 199€-tik eta proposamena 48 ordutan. Estudioa Tolosan, 45 km-ra.",
    pares: [
      [`Diseño y desarrollo de páginas web para negocios de Irun (Bidasoa). Precio cerrado desde 199€, propuesta en 48h. Estudio en Tolosa, a 45 km.`,
       `Web diseinua eta webguneak Irungo negozioentzat (Bidasoa). Prezio itxia 199€-tik eta proposamena 48 ordutan. Estudioa Tolosan, 45 km-ra.`],
      [`OI Studio — Diseño web en Irun`, `OI Studio — Web diseinua Irunen`],
      [`Diseño web en Irun`, `Web diseinua Irunen`],
      [`Diseño web en <span class="grad">Irun</span>`, `Web diseinua <span class="grad">Irunen</span>`],
      [`Frontera, logística y comercio con clientela de dos países. La web tiene que funcionar igual de bien para quien busca desde Hendaia.`,
       `Muga, logistika eta bi herrialdetako bezeroak dituen merkataritza. Webguneak berdin funtzionatu behar du Hendaiatik bilatzen duenarentzat ere.`],
      [`Restaurante en Irun`, `Jatetxea Irunen`],
      [`Qué necesita un negocio de Irun`, `Zer behar du Irungo negozio batek`],
      [`Irun tiene una particularidad que no comparte con ningún otro sitio de Gipuzkoa: parte de tu clientela busca en francés y desde el otro lado de la muga. Si tu web solo existe en castellano, renuncias a un mercado que tienes a cinco minutos. Añadir una versión en francés suele ser la mejora más rentable aquí.`,
       `Irunek Gipuzkoako beste inongo tokik ez duen berezitasun bat du: zure bezeroen zati batek frantsesez bilatzen du, mugaren beste aldetik. Zure webgunea gaztelaniaz bakarrik badago, bost minutura duzun merkatu bati uko egiten diozu. Frantsesezko bertsio bat gehitzea izan ohi da hemen hobekuntzarik errentagarriena.`],
      [`Puedo montar la web en castellano, euskera y francés — mismo diseño, tres públicos.`,
       `Webgunea gaztelaniaz, euskaraz eta frantsesez munta dezaket — diseinu bera, hiru publiko.`],
      [`Comercio y retail`, `Merkataritza eta txikizkako salmenta`],
      [`Logística y transporte`, `Logistika eta garraioa`],
      [`Hostelería`, `Ostalaritza`],
      [`Servicios transfronterizos`, `Mugaz gaindiko zerbitzuak`],
      [`Automoción`, `Automobilgintza`],
      [`Entiendo tu negocio en Irun y si de verdad puedo ayudarte.`,
       `Irungo zure negozioa ulertzen dut, eta benetan lagun zaitzakedan ala ez.`],
      [`Cerca de Irun`, `Irundik gertu`],
      [`Estoy en Irun, ¿es un problema?`, `Irunen nago; arazoa al da?`],
      [`Ninguno. Son 45 km, así que trabajo en remoto salvo cuando merece la pena acercarse. Que esté en Tolosa y tú en Bidasoa no cambia ni el resultado ni el trato: hablamos por WhatsApp casi a diario.`,
       `Bat ere ez. 45 km dira; beraz, urrutitik lan egiten dut, hurbiltzea merezi duenean izan ezik. Ni Tolosan egoteak eta zu Bidasoan egoteak ez du aldatzen ez emaitza ez tratua: WhatsApp bidez ia egunero hitz egiten dugu.`],
      [`¿Cobras desplazamiento hasta Irun?`, `Irunera joateagatik kobratzen duzu?`],
      [`No. Ni desplazamiento ni recargo por comarca: Landing desde 199€ y Web Negocio desde 299€, igual que para un negocio de la calle de al lado, con 30 días de ajustes gratis.`,
       `Ez. Ez joan-etorririk, ez eskualdeagatiko gainkosturik: Landing 199€-tik eta Negozio Weba 299€-tik, ondoko kaleko negozio batentzat bezala, 30 egunez doikuntzak doan.`],
      [`¿Es más difícil posicionar en una ciudad como Irun?`, `Zailagoa da Irun bezalako hiri batean posizionatzea?`],
      [`Más disputado, sí. Con 63.000 habitantes tienes competencia de verdad, y ahí el truco no es aparecer para todo, sino para tu barrio y tu especialidad. La web va preparada para eso; la ficha de Google Business hace el resto del trabajo y la explico paso a paso en <a href="../google-business-profile-guia.html">esta guía</a>.`,
       `Lehiatuagoa bai. 63.000 biztanlerekin benetako lehia duzu, eta hor gakoa ez da denetarako agertzea, zure auzorako eta zure espezialitaterako baizik. Webgunea horretarako prestatuta dator; Google Business fitxak egiten du gainerako lana, eta urratsez urrats azaltzen dut <a href="../google-business-profile-guia.html">gida honetan</a>.`],
      [`Más disputado, sí. Con 63.000 habitantes tienes competencia de verdad, y ahí el truco no es aparecer para todo, sino para tu barrio y tu especialidad. La web va preparada para eso; la ficha de Google Business hace el resto del trabajo y la explico paso a paso en esta guía.`,
       `Lehiatuagoa bai. 63.000 biztanlerekin benetako lehia duzu, eta hor gakoa ez da denetarako agertzea, zure auzorako eta zure espezialitaterako baizik. Webgunea horretarako prestatuta dator; Google Business fitxak egiten du gainerako lana, eta urratsez urrats azaltzen dut gida honetan.`],
      [`¿Cómo sé que me va a gustar?`, `Nola jakin gustatuko zaidan?`],
      [`Porque puedes verlo antes. Las ocho webs del <a href="../trabajos.html">portfolio</a> están online y abiertas: entra, navégalas y mira si ese acabado es el que quieres para tu negocio. La propuesta llega en 48h y no compromete a nada.`,
       `Aurretik ikus dezakezulako. <a href="../trabajos.html">Portfolioko</a> zortzi webguneak sarean eta irekita daude: sartu, nabigatu eta begiratu akabera hori zure negoziorako nahi duzuna den. Proposamena 48 ordutan iristen da eta ez zaitu ezertara behartzen.`],
      [`Porque puedes verlo antes. Las ocho webs del portfolio están online y abiertas: entra, navégalas y mira si ese acabado es el que quieres para tu negocio. La propuesta llega en 48h y no compromete a nada.`,
       `Aurretik ikus dezakezulako. Portfolioko zortzi webguneak sarean eta irekita daude: sartu, nabigatu eta begiratu akabera hori zure negoziorako nahi duzuna den. Proposamena 48 ordutan iristen da eta ez zaitu ezertara behartzen.`],
      [`¿Tienes un negocio en Irun?`, `Negozioren bat duzu Irunen?`],
      [`Cuéntame qué haces y te devuelvo una propuesta con precio cerrado en 48 horas. Sin compromiso.`,
       `Kontatu zer egiten duzun eta prezio itxidun proposamena itzuliko dizut 48 ordutan. Konpromisorik gabe.`],
    ],
  },

  "zonas/zarautz.html": {
    title: "Web diseinua Zarautzen: webguneak negozioentzat | OI Studio",
    desc: "Web diseinua eta webguneak Zarautzko negozioentzat (Urola Kosta). Prezio itxia 199€-tik eta proposamena 48 ordutan. Estudioa Tolosan, 35 km-ra.",
    pares: [
      [`Diseño y desarrollo de páginas web para negocios de Zarautz (Urola Kosta). Precio cerrado desde 199€, propuesta en 48h. Estudio en Tolosa, a 35 km.`,
       `Web diseinua eta webguneak Zarautzko negozioentzat (Urola Kosta). Prezio itxia 199€-tik eta proposamena 48 ordutan. Estudioa Tolosan, 35 km-ra.`],
      [`OI Studio — Diseño web en Zarautz`, `OI Studio — Web diseinua Zarautzen`],
      [`Diseño web en Zarautz`, `Web diseinua Zarautzen`],
      [`Diseño web en <span class="grad">Zarautz</span>`, `Web diseinua <span class="grad">Zarautzen</span>`],
      [`Zarautz multiplica su población en verano. Si dependes de la temporada, la web trabaja cuando tú no puedes coger el teléfono.`,
       `Zarautzek biztanleria biderkatzen du udan. Denboraldiaren menpe bazaude, webguneak lan egiten du zuk telefonoa hartu ezin duzunean.`],
      [`Restaurante en Zarautz`, `Jatetxea Zarautzen`],
      [`Qué necesita un negocio de Zarautz`, `Zer behar du Zarautzko negozio batek`],
      [`En Zarautz la estacionalidad lo condiciona todo: en agosto no das abasto y en febrero el pueblo es otro. La web tiene que servir para las dos realidades — en temporada alta para filtrar y automatizar (reservas, horarios, disponibilidad), y en temporada baja para que la clientela local sepa que sigues abierto y con qué horario.`,
       `Zarautzen denboraldiak dena baldintzatzen du: abuztuan ez zara iristen, eta otsailean herria beste bat da. Webguneak bi errealitateetarako balio behar du — denboraldi betean iragazteko eta automatizatzeko (erreserbak, ordutegiak, erabilgarritasuna), eta denboraldi baxuan tokiko bezeroek jakin dezaten irekita jarraitzen duzula eta zein ordutegirekin.`],
      [`Para negocios de temporada, las reservas automáticas son lo que más se nota: en agosto responden solas.`,
       `Denboraldiko negozioetan, erreserba automatikoak dira gehien nabaritzen direnak: abuztuan bakarrik erantzuten dute.`],
      [`Alojamiento y apartamentos`, `Ostatuak eta apartamentuak`],
      [`Surf y deporte`, `Surfa eta kirola`],
      [`Servicios`, `Zerbitzuak`],
      [`Entiendo tu negocio en Zarautz y si de verdad puedo ayudarte.`,
       `Zarautzko zure negozioa ulertzen dut, eta benetan lagun zaitzakedan ala ez.`],
      [`Cerca de Zarautz`, `Zarautztik gertu`],
      [`¿Cubres Zarautz desde Tolosa?`, `Tolosatik Zarautzen ere lan egiten duzu?`],
      [`Sí. A 35 km lo práctico es arrancar por videollamada y reservar el viaje para cuando aporte algo de verdad: ver el local o hacer las fotos. El seguimiento va por WhatsApp, que es más rápido para los dos.`,
       `Bai. 35 km-ra, praktikoena bideodeiz hastea da, eta bidaia benetan zerbait ekartzen duenerako gordetzea: lokala ikusteko edo argazkiak egiteko. Jarraipena WhatsApp bidez egiten da, bientzat azkarragoa baita.`],
      [`¿Los 35 km se pagan aparte?`, `35 km-ak aparte ordaintzen dira?`],
      [`No se pagan. El precio es cerrado y único en toda Gipuzkoa — 199€ Landing, 299€ Web Negocio, 30 días de ajustes incluidos — y los viajes corren de mi cuenta. Lo que firmas es lo que hay.`,
       `Ez dira ordaintzen. Prezioa itxia eta bakarra da Gipuzkoa osoan — Landing 199€, Negozio Weba 299€, 30 egunez doikuntzak barne — eta bidaiak nire kontura dira. Sinatzen duzuna da dagoena.`],
      [`¿Puedo competir en Google en Zarautz?`, `Lehiatu naiteke Googlen Zarautzen?`],
      [`Sí, pero con los pies en el suelo: 23.000 habitantes significan más negocios peleando por las mismas búsquedas, así que aquí el SEO local pesa más que en un pueblo. La web sale preparada para Zarautz y el resto lo hace tu ficha de Google Business, que trabajo contigo siguiendo <a href="../google-business-profile-guia.html">esta guía</a>.`,
       `Bai, baina oinak lurrean: 23.000 biztanlek esan nahi du negozio gehiago daudela bilaketa berberengatik lehian; beraz, hemen tokiko SEOak herri txiki batean baino pisu handiagoa du. Webgunea Zarautzerako prestatuta ateratzen da, eta gainerakoa zure Google Business fitxak egiten du: zurekin lantzen dut, <a href="../google-business-profile-guia.html">gida honi</a> jarraituz.`],
      [`Sí, pero con los pies en el suelo: 23.000 habitantes significan más negocios peleando por las mismas búsquedas, así que aquí el SEO local pesa más que en un pueblo. La web sale preparada para Zarautz y el resto lo hace tu ficha de Google Business, que trabajo contigo siguiendo esta guía.`,
       `Bai, baina oinak lurrean: 23.000 biztanlek esan nahi du negozio gehiago daudela bilaketa berberengatik lehian; beraz, hemen tokiko SEOak herri txiki batean baino pisu handiagoa du. Webgunea Zarautzerako prestatuta ateratzen da, eta gainerakoa zure Google Business fitxak egiten du: zurekin lantzen dut, gida honi jarraituz.`],
      [`¿Puedo ver algo antes de decidir?`, `Erabaki aurretik zerbait ikus dezaket?`],
      [`Sí, y es lo que recomiendo. Las ocho webs del <a href="../trabajos.html">portfolio</a> están publicadas y se navegan enteras, no son capturas. Después te preparo la propuesta en 48h, gratis y sin compromiso.`,
       `Bai, eta hori da gomendatzen dudana. <a href="../trabajos.html">Portfolioko</a> zortzi webguneak argitaratuta daude eta osorik nabigatzen dira, ez dira pantaila-argazkiak. Ondoren proposamena prestatzen dizut 48 ordutan, doan eta konpromisorik gabe.`],
      [`Sí, y es lo que recomiendo. Las ocho webs del portfolio están publicadas y se navegan enteras, no son capturas. Después te preparo la propuesta en 48h, gratis y sin compromiso.`,
       `Bai, eta hori da gomendatzen dudana. Portfolioko zortzi webguneak argitaratuta daude eta osorik nabigatzen dira, ez dira pantaila-argazkiak. Ondoren proposamena prestatzen dizut 48 ordutan, doan eta konpromisorik gabe.`],
      [`¿Tienes un negocio en Zarautz?`, `Negozioren bat duzu Zarautzen?`],
      [`Propuesta con precio cerrado en menos de 48 horas. Gratis y sin compromiso.`,
       `Prezio itxidun proposamena 48 ordu baino gutxiagotan. Doan eta konpromisorik gabe.`],
    ],
  },
};

/* Palabras que no se traducen: nombres propios, marcas y unidades. El
   comprobador de restos de castellano las ignora. */
export const NEUTRAS = [
  "OI Studio", "OI STUDIO", "WhatsApp", "Instagram", "@oi.webstudio", "Google", "Business", "SEO",
  "Landing", "km", "h", "ES", "EU", "Idioma / Hizkuntza",
  // Etiquetas del selector de idioma: cada una va en la lengua a la que lleva.
  "Ver en castellano", "Euskaraz ikusi",
  "Tolosa", "Tolosaldea", "Gipuzkoa", "Donostialdea", "Bidasoa", "Urola Kosta", "Goierri",
  "Donostia-San Sebastián", "Donostia", "Irun", "Zarautz", "Hondarribia", "Errenteria", "Hernani",
  "Lasarte-Oria", "Ibarra", "Villabona", "Anoeta", "Alegia", "Andoain", "Beasain", "Azpeitia",
  "Zumarraga", "Ordizia", "Eibar", "Bergara", "Oñati", "Arrasate-Mondragón",
];
