/**
 * Muro de fotos estilo Pinterest (sección Muro). Solo fotos reales del cliente:
 * recortes de detalle de las que mandó por WhatsApp y del interior de la
 * cafetería. donuts, pan-molde y hero-horno son de stock y no entran aquí.
 *
 * Los rótulos describen lo que se ve, sin afirmar de más: las trufas y las
 * cajas son de marca (Bolçi), así que se presentan "para regalar", no como
 * elaboración propia.
 */
export type PinTag = "pan" | "dulce" | "cafe" | "tiendas";

export type Pin = {
  src: string;
  w: number;
  h: number;
  tag: PinTag;
  es: string;
  eu: string;
  /** Tienda donde se hizo la foto, si se sabe: enlaza a su página. */
  store?: string;
};

export const pins: Pin[] = [
  { src: "/images/pins/pan-avena.webp", w: 512, h: 1106, tag: "pan", es: "Barra de avena", eu: "Olo-barra" },
  { src: "/images/pins/cafe-barra.webp", w: 900, h: 790, tag: "cafe", es: "La cafetería de San Frantzisko", eu: "San Frantziskoko kafetegia", store: "tolosa-san-frantzisko" },
  { src: "/images/pins/galletas-mermelada.webp", w: 696, h: 880, tag: "dulce", es: "Pastas con mermelada y chocolate", eu: "Marmelada eta txokolatezko pastak" },
  { src: "/images/pins/fachada-abierto.webp", w: 389, h: 451, tag: "tiendas", es: "Abierto, en Andia Kalea", eu: "Irekita, Andia Kalean", store: "tolosa-andia" },
  { src: "/images/pins/palmeras.webp", w: 538, h: 532, tag: "dulce", es: "Palmeras", eu: "Palmerak" },
  { src: "/images/pins/bolsa-errotatxo.webp", w: 451, h: 553, tag: "pan", es: "El pan, en su bolsa de siempre", eu: "Ogia, betiko poltsan" },
  { src: "/images/pins/trufas.webp", w: 451, h: 819, tag: "dulce", es: "Trufas para regalar", eu: "Oparitzeko trufak" },
  { src: "/images/pins/escaparate.webp", w: 532, h: 747, tag: "tiendas", es: "El mostrador de Andia", eu: "Andiako mostradorea", store: "tolosa-andia" },
  { src: "/images/pins/galletas-estrellas.webp", w: 410, h: 737, tag: "dulce", es: "Estrellas bañadas en chocolate", eu: "Txokolatez bainatutako izarrak" },
  { src: "/images/pins/pan-pasas.webp", w: 783, h: 666, tag: "pan", es: "Panecillos del día", eu: "Eguneko ogitxoak" },
  { src: "/images/pins/cafe-mesas.webp", w: 424, h: 480, tag: "cafe", es: "Mesas para sentarse con calma", eu: "Lasai esertzeko mahaiak", store: "tolosa-san-frantzisko" },
  { src: "/images/pins/cajas-regalo.webp", w: 717, h: 635, tag: "dulce", es: "Cajas con lazo para regalar", eu: "Oparitzeko kaxak, lazoarekin" },
  { src: "/images/pins/galletas-blancas.webp", w: 492, h: 522, tag: "dulce", es: "Pastas de chocolate blanco", eu: "Txokolate zurizko pastak" },
  { src: "/images/pins/fachada-andia.webp", w: 900, h: 675, tag: "tiendas", es: "La tienda de Andia Kalea", eu: "Andia Kaleko denda", store: "tolosa-andia" },
  { src: "/images/pins/pan-sesamo.webp", w: 532, h: 635, tag: "pan", es: "Barras de sésamo", eu: "Sesamo-barrak" },
  { src: "/images/pins/galletas-chocolate.webp", w: 850, h: 573, tag: "dulce", es: "Galletas de chocolate", eu: "Txokolatezko galletak" },
  { src: "/images/pins/bombones-sueltos.webp", w: 307, h: 451, tag: "dulce", es: "Bombones", eu: "Bonboiak" },
  { src: "/images/pins/fachada-rotulo.webp", w: 900, h: 550, tag: "tiendas", es: "Okindegia Errotatxo, Tolosa", eu: "Errotatxo okindegia, Tolosa", store: "tolosa-andia" },
  { src: "/images/pins/galletas-alargadas.webp", w: 379, h: 399, tag: "dulce", es: "Pastas con hilos de chocolate", eu: "Txokolate-hariko pastak" },
  { src: "/images/pins/bandejas-pastas.webp", w: 900, h: 675, tag: "dulce", es: "Las bandejas del mostrador", eu: "Mostradoreko erretiluak" },
  { src: "/images/pins/bolsas-regalo.webp", w: 900, h: 389, tag: "dulce", es: "Bolsas para regalo", eu: "Opari-poltsak" },
];
