# Catálogo de animaciones — OI Studio

Biblioteca visual: `biblioteca-animaciones/index.html`

Cada animación tiene un **nombre clave** único. Decí el nombre y se aplica ese efecto sin más explicación.
Ejemplo: *"el hero con `hero-saas-aurora`, testimonios `testi-coverflow` y el mapa `loc-route-draw`"*.

Todo es CSS/JS vanilla salvo lo marcado GSAP. Lo marcado **CSS 2026** usa APIs nuevas (scroll-timeline, view-timeline, anchor positioning, Popover, View Transitions, OKLCH) y requiere Chrome/Edge reciente.

---

**954 piezas en 19 secciones.**

| Sección | Nº | Prefijo |
|---|---|---|
| Secciones hero | 50 | `hero-` |
| Animaciones de texto | 50 | `text-` |
| Párrafos y texto largo | 50 | `par-` |
| Testimonios y reseñas | 50 | `testi-` |
| Animaciones para imágenes | 50 | `img-` |
| Botones y CTAs | 50 | `btn-` |
| Tarjetas | 50 | `card-` |
| Efectos de scroll | 50 | `scroll-` |
| Ubicación y cómo llegar | 50 | `loc-` |
| Microinteracciones | 50 | `micro-` |
| Animaciones modernas | 54 | `adv-` |
| Patrones que ya usás | 50 | `prod-` |
| Heroes premium | 50 | `heropro-` |
| Heroes minimalistas | 50 | `heromin-` |
| Heroes por esquema | 50 | `heroesq-` |
| Estilos de fuente | 50 | `font-` |
| Cabeceras y menús | 50 | `head-` |
| Estructuras de contenido | 50 | `body-` |
| Pies de página | 50 | `foot-` |

---

## Secciones hero  `heroes`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `hero-gradient-cascade` | Gradiente animado + entrada en cascada | CSS |
| `hero-letters-spin` | Título con letras que entran giradas | JS + CSS |
| `hero-orbs-parallax` | Orbes con parallax al mover el mouse | JS |
| `hero-gsap-timeline` | Timeline con blur + escala | GSAP |
| `hero-conic-grain` | Mesh cónico giratorio con grano | CSS |
| `hero-scroll-native` | Parallax nativo con scroll-timeline (sin JS) | CSS 2026 |
| `hero-gradient-flow` | Titular con degradado en flujo continuo | CSS |
| `hero-marquee-dual` | Titular marquee a dos direcciones | CSS |
| `hero-spotlight` | Spotlight que sigue al cursor | JS |
| `hero-retrowave` | Grid 3D en perspectiva (retrowave) | CSS |
| `hero-collage` | Collage de imágenes en cascada | CSS |
| `hero-words-blur` | Palabras con desenfoque escalonado | JS |
| `hero-typewriter` | Headline que se escribe solo | JS |
| `hero-split-screen` | Split screen que se abre (clic) | JS |
| `hero-waves` | Olas SVG animadas al pie | SVG |
| `hero-constellation` | Constelación de partículas conectadas | Canvas |
| `hero-conic-border` | Borde cónico giratorio | CSS |
| `hero-shrink` | Hero que encoge al scrollear | JS |
| `hero-kinetic-slot` | Tipografía cinética (slot vertical) | CSS |
| `hero-saas-aurora` | SaaS premium: aurora + nav glass | CSS |
| `hero-light-lines` | Líneas de luz que ascienden | JS |
| `hero-diagonal-wave` | Corte diagonal que ondula | CSS |
| `hero-floating-cards` | Tarjetas flotantes de fondo | JS |
| `hero-tag-ticker` | Ticker de etiquetas bajo el titular | JS |
| `hero-blob-bg` | Blobs orgánicos de fondo | CSS |
| `hero-dot-grid` | Rejilla de puntos con fundido radial | CSS |
| `hero-image-columns` | Columnas de imágenes en direcciones opuestas | JS |
| `hero-scale-blur` | Entrada con escala y desenfoque | JS |
| `hero-glow-sweep` | Líneas de brillo cruzadas | JS |
| `hero-terminal` | Terminal que escribe comandos | JS |
| `hero-cta-float` | CTA que flota y llama la atención | CSS |
| `hero-geo-shapes` | Formas geométricas que rotan | CSS |
| `hero-gradient-frame` | Caja con borde degradado animado | CSS |
| `hero-stats-bar` | Barra de estadísticas al pie | JS |
| `hero-scroll-hue` | Fondo que cambia con el scroll de la página | JS |
| `hero-split-image` | Mitad texto, mitad imagen | CSS |
| `hero-video-overlay` | Capa sobre vídeo de fondo | CSS |
| `hero-scroll-word` | La palabra cambia con el scroll | JS |
| `hero-badge-row` | Sellos sobre el titular | CSS |
| `hero-mask-reveal` | Máscara que revela el titular | CSS |
| `hero-diagonal-cards` | Tarjetas en diagonal de fondo | JS |
| `hero-offset-shadow` | Sombra de color desplazada | CSS |
| `hero-3d-text` | Titular con relieve 3D | CSS |
| `hero-noise-lines` | Líneas de ruido horizontales | JS |
| `hero-metrics` | Hero con métricas al pie | JS |
| `hero-slider` | Carrusel de heroes | JS |
| `hero-mesh-cursor` | Mesh que sigue al cursor | JS |
| `hero-typing-role` | Rol que se escribe solo | JS |
| `hero-glass-cards` | Tarjetas de cristal flotantes | JS |
| `hero-editorial` | Composición editorial asimétrica | CSS |

## Animaciones de texto  `texto`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `text-typewriter` | Máquina de escribir | JS |
| `text-shimmer` | Texto con brillo animado | CSS |
| `text-word-focus` | Palabras que se enfocan al hacer scroll (hacé scroll dentro del recuadro) | JS |
| `text-gsap-words` | Palabras que se iluminan con scroll interno | GSAP |
| `text-lines-up` | Líneas que suben al entrar en vista (hacé scroll de la página) | JS |
| `text-underline-draw` | Subrayado que se dibuja al entrar en vista | JS |
| `text-counter` | Contador animado (números que suben) | JS |
| `text-scramble-hover` | Texto "scramble" (se decodifica) | JS |
| `text-word-rotator` | Palabra rotativa | CSS |
| `text-weight-wave` | Onda de peso variable en hover | JS |
| `text-shuffle` | Barajado de letras en hover | JS |
| `text-lines-diagonal` | Líneas con corte diagonal (scroll) | JS |
| `text-outline-fill` | Contorno que se rellena (scroll) | JS |
| `text-flip-3d` | Letras que giran en 3D | JS |
| `text-highlighter` | Marcador fluorescente (scroll) | JS |
| `text-scramble-scroll` | Scramble al entrar en vista | JS |
| `text-wave` | Texto ondulante continuo | JS |
| `text-gradient-cursor` | Degradado que sigue al cursor | JS |
| `text-elastic` | Letras elásticas (hover una a una) | JS |
| `text-odometer` | Odómetro de números | JS |
| `text-gradient-wipe` | Máscara de degradado que barre (scroll) | JS |
| `text-letters-fall` | Letras que caen en bucle | JS |
| `text-neon` | Neón parpadeante | CSS |
| `text-long-shadow` | Sombra larga animada | CSS |
| `text-tracking-breathe` | Compresión y expansión | CSS |
| `text-split-flap` | Tablero split-flap (aeropuerto) | JS |
| `text-bounce-letters` | Rebote letra a letra | JS |
| `text-brush-underline` | Subrayado tipo pincel (scroll) | SVG |
| `text-gradient-mesh` | Recorte de degradado en movimiento | CSS |
| `text-countdown` | Cuenta atrás | JS |
| `text-repel` | Las letras se apartan del cursor | JS |
| `text-dock` | Efecto dock: crece la letra apuntada | JS |
| `text-underline-side` | Subrayado que nace por donde entrás | JS |
| `text-rainbow` | Arcoíris por letra | JS |
| `text-rgb-split` | Separación RGB según la distancia | JS |
| `text-gravity` | Las letras caen y vuelven | JS |
| `text-fill-hover` | Relleno progresivo al pasar | CSS |
| `text-rotate-3d` | Letras que giran en 3D al pasar | JS |
| `text-spacing-open` | El espaciado se abre bajo el cursor | JS |
| `text-word-underline` | Palabras que se subrayan una a una | JS |
| `text-focus-letter` | Todo se desenfoca salvo la letra apuntada | JS |
| `text-shadow-follow` | Sombra que sigue al cursor | JS |
| `text-jump-chain` | Salto en cadena desde el cursor | JS |
| `text-reveal-spot` | Foco que revela un segundo texto | JS |
| `text-stretch` | El texto se estira hacia el cursor | JS |
| `text-weight-hover` | Peso y espaciado al pasar | CSS |
| `text-shuffle-hover` | Barajado por letra al pasar | JS |
| `text-shine-follow` | Brillo que sigue al cursor | JS |
| `text-word-accordion` | Palabras tipo acordeón | JS |
| `text-ghost-trail` | Estela de letras al pasar | JS |

## Párrafos y texto largo  `parrafos`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `par-lines-rise` | Líneas que suben tras una máscara | JS |
| `par-word-cascade` | Palabras en cascada | JS |
| `par-blur-in` | De desenfocado a nítido | JS |
| `par-mask-wipe` | Barrido de máscara diagonal | JS |
| `par-typewriter` | Máquina de escribir por frases | JS |
| `par-scroll-highlight` | Se ilumina palabra a palabra (scroll) | JS |
| `par-drop-cap` | Capital ornamental | CSS |
| `par-drop-cap-block` | Capital sobre bloque de color | CSS |
| `par-columns` | Dos columnas editoriales | CSS |
| `par-columns-rule` | Columnas con filete que se abre | CSS |
| `par-lead-in` | Entrada en versalitas | JS |
| `par-read-bar` | Barra de progreso del propio texto | JS |
| `par-read-time` | Tiempo de lectura calculado | JS |
| `par-expand-more` | Leer más / leer menos | JS |
| `par-clamp-fade` | Recorte con degradado | CSS |
| `par-marker-hover` | Marcador que se pinta | CSS |
| `par-link-underline` | Enlaces con subrayado dibujado | CSS |
| `par-term-tooltip` | Término con definición al pasar | CSS |
| `par-margin-note` | Nota al margen | JS |
| `par-pull-quote` | Cita destacada intercalada | JS |
| `par-side-reveal` | Nota lateral que aparece | CSS |
| `par-annotation` | Anotación dibujada a mano | JS |
| `par-underline-draw` | Subrayado a mano alzada | CSS |
| `par-circle-word` | Palabra rodeada con un círculo | CSS |
| `par-strike-swap` | Tachado y sustituido | CSS |
| `par-focus-line` | La línea bajo el cursor se enfoca | JS |
| `par-speed-read` | Lectura rápida palabra a palabra | JS |
| `par-balance-compare` | Equilibrado de líneas comparado | CSS |
| `par-justify-toggle` | Justificado activable | JS |
| `par-selection-style` | Estilo de selección propio | CSS |
| `par-tracking-open` | El tracking se abre al entrar | JS |
| `par-weight-scroll` | El peso tipográfico cambia con el scroll | JS |
| `par-size-scroll` | El tamaño crece con el scroll | JS |
| `par-color-scroll` | El color cambia con el scroll | JS |
| `par-gradient-text` | Degradado animado en el texto | CSS |
| `par-scan-line` | Barra que escanea el texto | CSS |
| `par-numbers-count` | Las cifras del texto cuentan | JS |
| `par-keyword-chips` | Palabras clave que se vuelven etiquetas | CSS |
| `par-lang-toggle` | Cambio de idioma con transición | JS |
| `par-summary-toggle` | Resumen o texto completo | JS |
| `par-audio-follow` | Resaltado sincronizado con el audio | JS |
| `par-list-reveal` | Lista con viñetas animadas | JS |
| `par-quote-mark-grow` | Las comillas crecen al entrar | JS |
| `par-two-tone` | Dos tonos por jerarquía | CSS |
| `par-scramble-in` | Las letras se descifran | JS |
| `par-print-lines` | Las líneas se imprimen | JS |
| `par-word-lift` | Las palabras se elevan al pasar el cursor | JS |
| `par-cursor-spot` | Foco de luz sobre el texto | JS |
| `par-first-indent` | Sangría de primera línea | JS |
| `par-footnote-pop` | Nota al pie que emerge | JS |

## Testimonios y reseñas  `testimonios`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `testi-carousel` | Carrusel deslizante horizontal | JS |
| `testi-big-quotes` | Comillas gigantes flotantes | CSS |
| `testi-marquee` | Marquee infinito de tarjetas | CSS |
| `testi-stack-swipe` | Pila tipo tarjetas (clic para pasar) | JS |
| `testi-avatars` | Avatares que cambian el testimonio | JS |
| `testi-coverflow` | Coverflow 3D rotativo | JS |
| `testi-typewriter` | Cita que se escribe sola | JS |
| `testi-chat` | Conversación tipo chat | JS |
| `testi-accordion` | Acordeón de reseñas | JS |
| `testi-grid-reveal` | Grid con reveal escalonado (scroll) | JS |
| `testi-autoplay-bar` | Auto-avance con barra de progreso | JS |
| `testi-photo-crossfade` | Foto y texto con crossfade | JS |
| `testi-stars-fill` | Estrellas que se llenan (scroll) | JS |
| `testi-vertical-loop` | Deslizamiento vertical infinito | CSS |
| `testi-blur-in` | Desenfoque que se aclara (scroll) | JS |
| `testi-expand-hover` | Tarjetas que se expanden en hover | CSS |
| `testi-logo-quote` | Logo de cliente + cita | JS |
| `testi-deck-fan` | Baraja que se separa en hover | CSS |
| `testi-rating-bars` | Valoración media con barras | JS |
| `testi-sticky-stack` | Tarjetas que se apilan al scrollear | CSS |
| `testi-video-card` | Tarjeta con botón de vídeo | CSS |
| `testi-tabs` | Pestañas por cliente | JS |
| `testi-name-photo` | Foto que aparece al pasar por el nombre | JS |
| `testi-metric` | Métrica destacada con contador | JS |
| `testi-vertical-arrows` | Carrusel vertical con flechas | JS |
| `testi-crossfade` | Crossfade simple de citas | JS |
| `testi-masonry` | Masonry de reseñas | CSS |
| `testi-verified` | Insignia de verificado | CSS |
| `testi-orbit` | Avatares en órbita | JS |
| `testi-split-photo` | Pantalla partida foto / cita | CSS |
| `testi-progress-dots` | Puntos con anillo de progreso | JS |
| `testi-flip-card` | Tarjeta que voltea | CSS |
| `testi-highlight-word` | Palabra clave resaltada (scroll) | JS |
| `testi-compact-list` | Lista compacta con estrellas (scroll) | JS |
| `testi-featured` | Testimonio destacado grande | JS |
| `testi-video-thumb` | Vídeo testimonial con miniatura | CSS |
| `testi-brand-quote` | Logo del cliente junto a la cita | JS |
| `testi-wall-dim` | Muro que atenúa el resto | CSS |
| `testi-dual-columns` | Dos columnas en movimiento continuo | JS |
| `testi-rating-summary` | Resumen de valoraciones | JS |
| `testi-giant-quote` | Comilla gigante de fondo | CSS |
| `testi-sector-tabs` | Pestañas por sector | JS |
| `testi-before-after` | Métrica antes y después | JS |
| `testi-audio-wave` | Testimonio en audio | JS |
| `testi-card-discard` | Pila de tarjetas que se descarta | JS |
| `testi-timeline` | Línea temporal de clientes | JS |
| `testi-avatar-orbit` | Avatares en órbita | JS |
| `testi-typing-quote` | La cita se escribe sola | JS |
| `testi-google-review` | Reseña con estrellas escalonadas | JS |
| `testi-wall-infinite` | Muro infinito en tres filas | JS |

## Animaciones para imágenes  `imagenes`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `img-ken-burns` | Ken Burns (zoom lento infinito) | CSS |
| `img-clip-reveal` | Revelado con clip-path (hacé scroll de la página) | JS |
| `img-compare-drag` | Comparador antes / después (arrastrá) | JS |
| `img-grayscale` | Blanco y negro a color | CSS |
| `img-cursor-trail` | Rastro de imágenes en el cursor | JS |
| `img-tilt-shine` | Tilt con brillo | JS |
| `img-logo-marquee` | Marquee infinito de imágenes/logos | CSS |
| `img-panel-slide` | Panel que se desliza y revela la imagen (hacé scroll de la página) | JS |
| `img-blinds` | Persianas verticales (scroll) | JS |
| `img-pixel-mosaic` | Mosaico de píxeles (scroll) | JS |
| `img-duotone` | Duotono en hover | CSS |
| `img-circle-mask` | Máscara circular que crece (scroll) | JS |
| `img-inner-parallax` | Parallax interno con el mouse | JS |
| `img-curtain-split` | Cortina doble desde el centro (scroll) | JS |
| `img-shine-sweep` | Barrido de brillo diagonal | CSS |
| `img-frame-draw` | Marco que se dibuja en hover | CSS |
| `img-text-mask` | Zoom con máscara de texto | CSS |
| `img-deck-fan` | Baraja que se despliega en hover | CSS |
| `img-compare-hover` | Comparador antes/después con hover | CSS |
| `img-grid-assemble` | Rejilla que se ensambla (scroll) | JS |
| `img-split-hover` | La imagen se parte en dos | CSS |
| `img-caption-slide` | Pie de foto que sube | CSS |
| `img-zoom-rotate` | Zoom con giro suave | CSS |
| `img-inner-border` | Borde interior que aparece | CSS |
| `img-progressive-load` | Carga progresiva con desenfoque | JS |
| `img-color-veil` | Velo de color al pasar | CSS |
| `img-blob-mask` | Máscara con forma orgánica | CSS |
| `img-scale-in` | Escala al entrar en vista | JS |
| `img-hover-gallery` | Galería que cambia al pasar | JS |
| `img-polaroid` | Polaroids que se enderezan | CSS |
| `img-tilt-stack` | Pila 3D que se inclina | JS |
| `img-diagonal-clip` | Recorte diagonal al entrar | JS |
| `img-spotlight` | Foco de luz que sigue el cursor | JS |
| `img-cell-grid` | Rejilla que se separa en celdas | JS |
| `img-vertical-wipe` | Barrido vertical de revelado (scroll) | JS |
| `img-shutter-open` | Obturador que abre desde el centro | JS |
| `img-caption-rise` | Pie de foto que sube | CSS |
| `img-duotone-hover` | Duotono que vuelve a color | CSS |
| `img-cursor-parallax` | Parallax interno con el cursor | JS |
| `img-siblings-blur` | El resto se desenfoca | CSS |
| `img-mosaic-build` | Mosaico que se construye | JS |
| `img-scroll-scale` | La imagen escala con el scroll | JS |
| `img-frame-stroke` | Marco que se dibuja | CSS |
| `img-swap-clip` | Cambia a la segunda imagen | CSS |
| `img-circle-expand` | Círculo que se expande | CSS |
| `img-tilt-shadow` | Inclinación con reflejo | JS |
| `img-strips-wave` | Tiras verticales desplazadas | JS |
| `img-click-zoom` | Clic para ampliar | JS |
| `img-cells-random` | Revelado por celdas al azar | JS |
| `img-corner-ribbon` | Cinta en la esquina | CSS |

## Botones y CTAs  `botones`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `btn-magnetic` | Magnético | JS |
| `btn-fill-slide` | Relleno deslizante | CSS |
| `btn-border-draw` | Borde dibujado | SVG |
| `btn-arrow-slide` | Flecha que se desliza | CSS |
| `btn-ripple` | Ripple al hacer click | JS |
| `btn-text-roll` | Texto que rota verticalmente | CSS |
| `btn-conic-border` | Borde con gradiente giratorio | CSS |
| `btn-fill-cursor` | Relleno que nace del cursor | JS |
| `btn-icon-bounce` | Icono que rebota | CSS |
| `btn-loading-bar` | Barra de carga al hacer clic | JS |
| `btn-check-confirm` | Confirmación con check | JS |
| `btn-shadow-3d` | Sombra 3D pulsable | CSS |
| `btn-dashed` | Borde discontinuo | CSS |
| `btn-underline-sweep` | Subrayado que va y viene | CSS |
| `btn-expand-form` | Expansión a formulario | JS |
| `btn-confetti` | Partículas al hacer clic | JS |
| `btn-glass-shine` | Brillo interno glass | CSS |
| `btn-text-split` | Texto que se parte y revela flecha | CSS |
| `btn-pulse-rings` | Anillos concéntricos de pulso | CSS |
| `btn-runaway` | Botón que huye del cursor | JS |
| `btn-icon-swap` | El icono sustituye al texto | CSS |
| `btn-liquid-fill` | Relleno líquido desde abajo | CSS |
| `btn-border-spark` | Destello recorriendo el borde | CSS |
| `btn-flip-3d` | Giro 3D con dos caras | CSS |
| `btn-heartbeat` | Latido continuo | CSS |
| `btn-arrow-circle` | Flecha en círculo que gira | CSS |
| `btn-decrypt` | Texto que se descifra | JS |
| `btn-brackets` | Esquinas tipo corchete | CSS |
| `btn-diagonal-fill` | Relleno diagonal | CSS |
| `btn-shadow-rings` | Sombra que se expande en anillos | CSS |
| `btn-outline-glow` | Contorno que se ilumina | CSS |
| `btn-tooltip` | Etiqueta emergente al pasar | CSS |
| `btn-double-layer` | Doble capa desplazada | CSS |
| `btn-gradient-shift` | Degradado en movimiento | CSS |
| `btn-skew` | Inclinación al pasar el cursor | CSS |
| `btn-magnetic-arrow` | Flecha magnética | JS |
| `btn-scramble` | Texto que se descifra | JS |
| `btn-hold-confirm` | Mantener pulsado para confirmar | JS |
| `btn-orbit-dot` | Punto que orbita el borde | CSS |
| `btn-split-halves` | Se parte en dos mitades | CSS |
| `btn-cursor-glow` | Brillo que sigue el cursor | JS |
| `btn-underline-center` | Subrayado desde el centro | CSS |
| `btn-cart-counter` | Contador que rebota | JS |
| `btn-shine-sweep` | Destello que barre | CSS |
| `btn-morph-circle` | De píldora a círculo con check | JS |
| `btn-letters-jump` | Letras que saltan escalonadas | JS |
| `btn-corners-close` | Esquinas que se cierran | CSS |
| `btn-dots-fill` | Relleno de puntos | CSS |
| `btn-download-state` | Estado de descarga | JS |
| `btn-group-slide` | Grupo con indicador deslizante | JS |

## Tarjetas  `cards`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `card-tilt-3d` | Tilt 3D | JS |
| `card-zoom-overlay` | Zoom + overlay | CSS |
| `card-cursor-glow` | Glow que sigue el cursor | JS |
| `card-flip-3d` | Flip 3D | CSS |
| `card-content-rise` | Contenido que sube en hover | CSS |
| `card-border-draw` | Borde que se dibuja | SVG |
| `card-conic-glow` | Gradiente cónico bajo el contenido | CSS |
| `card-lift-shadow` | Elevación con sombra de color | CSS |
| `card-bg-parallax` | Fondo con paralaje en hover | CSS |
| `card-big-number` | Número gigante de fondo | CSS |
| `card-book-open` | Apertura tipo libro | CSS |
| `card-ribbon` | Cinta diagonal | CSS |
| `card-layers-3d` | Capas 3D que se separan | CSS |
| `card-siblings-blur` | Los hermanos se desenfocan al enfocar una | CSS |
| `card-progress-bar` | Barra de progreso en hover | CSS |
| `card-circle-flood` | Círculo que inunda la tarjeta | CSS |
| `card-icon-spin` | Icono que rota y crece | CSS |
| `card-glass-sheen` | Reflejo tipo cristal | CSS |
| `card-panel-slide` | Panel que se desliza lateral | CSS |
| `card-magnetic` | Magnética con inclinación suave | JS |
| `card-image-rise` | Imagen que se revela desde abajo | CSS |
| `card-corner-fold` | Esquina doblada que crece | CSS |
| `card-stat-count` | Estadística que cuenta al entrar | JS |
| `card-thumb-lift` | Miniatura que se eleva | CSS |
| `card-badge-pop` | Badge que salta | CSS |
| `card-split-open` | Se parte en dos mitades | CSS |
| `card-gradient-title` | Título con degradado al hover | CSS |
| `card-outline-pop` | Contorno exterior que aparece | CSS |
| `card-timeline-step` | Paso de línea de tiempo | CSS |
| `card-price-lift` | Plan de precios que se eleva | CSS |
| `card-avatar-row` | Fila de avatares que se despliega | CSS |
| `card-tags-cascade` | Etiquetas en cascada | CSS |
| `card-side-notch` | Muesca lateral que crece | CSS |
| `card-halo` | Halo de color detrás | CSS |
| `card-content-swap` | El contenido se sustituye | CSS |
| `card-depth-parallax` | Capas con profundidad real | JS |
| `card-corner-peel` | Esquina que se despega | CSS |
| `card-gradient-ring` | Borde degradado que gira | CSS |
| `card-expand-details` | Se expande con los detalles | CSS |
| `card-counter-spark` | Contador al entrar en vista | JS |
| `card-image-split` | La imagen se abre por la mitad | CSS |
| `card-drag-tilt` | Se inclina al arrastrar | JS |
| `card-stack-fan` | Pila que se abanica | CSS |
| `card-progress-ring` | Anillo de progreso | JS |
| `card-preview-motion` | Vista previa animada | JS |
| `card-icon-morph` | El icono cambia de forma | CSS |
| `card-price-toggle` | Precio mensual o anual | JS |
| `card-glass-follow` | Cristal con reflejo que sigue el cursor | JS |
| `card-list-cascade` | Lista que aparece en cascada | CSS |
| `card-quote-rise` | Cita que sube desde abajo | CSS |

## Efectos de scroll  `scroll`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `scroll-grid-stagger` | Grilla con aparición en cascada (hacé scroll de la página) | JS |
| `scroll-parallax-layers` | Parallax de capas (hacé scroll de la página) | JS |
| `scroll-horizontal-gsap` | Scroll horizontal (hacé scroll de la página) | GSAP |
| `scroll-native-reveal` | Reveal nativo con view-timeline (sin JS) | CSS 2026 |
| `scroll-sticky-stack` | Tarjetas que se apilan (sticky stack) | CSS |
| `scroll-text-highlight` | Texto que se ilumina línea a línea | JS |
| `scroll-image-zoom` | Zoom de imagen ligado al scroll | JS |
| `scroll-rotate-3d` | Rotación 3D según el scroll | JS |
| `scroll-timeline-draw` | Línea de tiempo que se dibuja | JS |
| `scroll-counter` | Contador ligado a la posición de scroll | JS |
| `scroll-curtain` | Cortina que revela la sección | JS |
| `scroll-alternate-sides` | Entradas alternas izquierda/derecha | JS |
| `scroll-section-dots` | Indicador lateral de sección activa | JS |
| `scroll-mosaic` | Mosaico que aparece en cascada | JS |
| `scroll-blur-in` | Desenfoque que se aclara al entrar | JS |
| `scroll-title-scale` | Titular que se escala con el scroll | JS |
| `scroll-snap-vertical` | Snap vertical entre secciones | CSS |
| `scroll-bg-shift` | Fondo que cambia por sección | JS |
| `scroll-rotate-in` | Elementos que rotan al entrar | JS |
| `scroll-progress-ring` | Anillo de progreso SVG | SVG |
| `scroll-word-by-word` | Texto palabra por palabra | JS |
| `scroll-frame-sequence` | Secuencia de fotogramas | JS |
| `scroll-pinned-steps` | Sección fijada con contenido que cambia | JS |
| `scroll-card-fan` | Abanico de tarjetas | JS |
| `scroll-marquee-speed` | Marquee que acelera con el scroll | JS |
| `scroll-perspective-cards` | Tarjetas en perspectiva | JS |
| `scroll-faded-edges` | Lista con bordes difuminados | JS |
| `scroll-header-shrink` | Cabecera que encoge | JS |
| `scroll-list-active` | Lista que resalta el elemento activo | JS |
| `scroll-zoom-out` | Alejamiento progresivo | JS |
| `scroll-panels-open` | Dos paneles que se abren | JS |
| `scroll-text-slide` | Texto que se desplaza lateralmente | JS |
| `scroll-icons-spin` | Iconos que giran al entrar | JS |
| `scroll-vertical-bar` | Barra vertical de progreso | JS |
| `scroll-images-cross` | Imágenes que se cruzan | JS |
| `scroll-clip-grow` | La imagen crece desde un recorte | JS |
| `scroll-stats-count` | Números que suben al entrar | JS |
| `scroll-steps-line` | Línea temporal que se dibuja | JS |
| `scroll-focus-text` | El texto entra en foco | JS |
| `scroll-color-sections` | El fondo cambia por secciones | JS |
| `scroll-cards-stack-3d` | Tarjetas que se apilan en 3D | JS |
| `scroll-svg-path` | Trazo SVG que se dibuja | JS |
| `scroll-columns-split` | Columnas en direcciones opuestas | JS |
| `scroll-zoom-pin` | Sección fijada con zoom | JS |
| `scroll-gallery-rotate` | Galería que rota en 3D | JS |
| `scroll-side-dots` | Puntos indicadores laterales | JS |
| `scroll-words-mask` | Palabras con máscara vertical | JS |
| `scroll-quote-parallax` | Cita con fondo en parallax | JS |
| `scroll-reading-ring` | Círculo de progreso de lectura | JS |
| `scroll-snap-steps` | Secciones con anclaje de scroll | CSS |

## Ubicación y cómo llegar  `ubicacion`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `loc-pin-drop` | Pin que cae y rebota | CSS |
| `loc-coverage-radius` | Radio de cobertura | CSS |
| `loc-route-draw` | Ruta que se dibuja | SVG |
| `loc-multi-pins` | Varios puntos que aparecen (scroll) | JS |
| `loc-floating-card` | Tarjeta flotante sobre el mapa (scroll) | JS |
| `loc-map-zoom` | Mapa que hace zoom al entrar (scroll) | JS |
| `loc-hours-today` | Horario con el día actual resaltado | JS |
| `loc-directions-btn` | Botón "cómo llegar" con destello | CSS |
| `loc-distance-stats` | Distancia y tiempo con contador (scroll) | JS |
| `loc-pin-tooltip` | Pin con globo informativo | CSS |
| `loc-transport-icons` | Iconos de cómo llegar | CSS |
| `loc-address-card` | Tarjeta de dirección que se eleva | CSS |
| `loc-city-list` | Lista de ciudades que resalta el punto | JS |
| `loc-map-form` | Mapa + formulario de contacto | CSS |
| `loc-route-steps` | Pasos para llegar (scroll) | JS |
| `loc-globe` | Globo terráqueo que gira | CSS |
| `loc-qr-scan` | QR con línea de escaneo | CSS |
| `loc-coverage-zone` | Zona de cobertura que late | CSS |
| `loc-venue-chips` | Chips de servicios del local (scroll) | JS |
| `loc-nearby-activity` | Aviso de actividad cercana | JS |
| `loc-circle-reveal` | Mapa que se revela en círculo (scroll) | JS |
| `loc-car-path` | Coche que recorre la ruta | CSS |
| `loc-night-map` | Mapa nocturno con luces | JS |
| `loc-branch-tabs` | Sucursales en pestañas | JS |
| `loc-copy-address` | Dirección con botón de copiar | JS |
| `loc-map-card` | Tarjeta con mapa y acción | CSS |
| `loc-turn-by-turn` | Indicaciones paso a paso (scroll) | JS |
| `loc-live-status` | Estado en vivo con próxima apertura | JS |
| `loc-parking-spots` | Plazas de parking libres | JS |
| `loc-transit-line` | Línea de transporte | JS |
| `loc-area-highlight` | Zonas que se resaltan en el mapa | JS |
| `loc-map-tilt` | Mapa con inclinación 3D | JS |
| `loc-marker-cluster` | Cluster que se expande (clic) | JS |
| `loc-radius-slider` | Radio ajustable con deslizador | JS |
| `loc-geolocate` | Botón "usar mi ubicación" | JS |
| `loc-storefront` | Fachada tipo street view | JS |
| `loc-map-theme` | Mapa claro / oscuro | JS |
| `loc-route-compare` | Comparar dos rutas | SVG |
| `loc-eta-badges` | Tiempos estimados por transporte | CSS |
| `loc-checkins` | Check-ins con avatares | JS |
| `loc-heatmap` | Mapa de calor de actividad | JS |
| `loc-address-search` | Buscador de dirección | JS |
| `loc-mini-map-hover` | Mini mapa al pasar por el texto | JS |
| `loc-floor-plan` | Plano de planta interactivo | SVG |
| `loc-delivery-track` | Seguimiento de pedido | JS |
| `loc-city-tags` | Ciudades donde trabajamos | CSS |
| `loc-photo-pin` | Pin con foto del local | CSS |
| `loc-compass` | Brújula que apunta al local | JS |
| `loc-region-map` | Regiones que se resaltan | SVG |
| `loc-contact-tabs` | Pestañas contacto / mapa / horario | JS |

## Microinteracciones  `micro`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `micro-custom-cursor` | Cursor personalizado | JS |
| `micro-hamburger` | Menú hamburguesa | CSS |
| `micro-toggle` | Switch animado | CSS |
| `micro-page-curtain` | Transición tipo cortina | CSS |
| `micro-loaders` | Loaders | CSS |
| `micro-heart-burst` | Corazón con estallido | JS |
| `micro-star-rating` | Valoración con estrellas | JS |
| `micro-anchor-tooltip` | Tooltip con anchor positioning | CSS 2026 |
| `micro-floating-label` | Etiqueta flotante en input | CSS |
| `micro-checkbox-draw` | Checkbox que se dibuja | JS |
| `micro-toast` | Notificación toast | JS |
| `micro-skeleton` | Skeleton de carga | CSS |
| `micro-accordion` | Acordeón con altura fluida | JS |
| `micro-segmented` | Segmented control con píldora | JS |
| `micro-tabs-slide` | Tabs con subrayado deslizante | JS |
| `micro-copy-clipboard` | Copiar al portapapeles | JS |
| `micro-avatar-stack` | Avatares apilados que se abren | CSS |
| `micro-slide-confirm` | Deslizar para confirmar | JS |
| `micro-theme-toggle` | Modo claro / oscuro | CSS |
| `micro-popover-menu` | Menú con Popover API | CSS 2026 |
| `micro-radio-fill` | Radio buttons con relleno | JS |
| `micro-stepper` | Stepper de cantidad | JS |
| `micro-password-meter` | Fuerza de contraseña | JS |
| `micro-removable-chips` | Chips que se eliminan | JS |
| `micro-file-upload` | Subida de archivo con progreso | JS |
| `micro-search-expand` | Buscador que se expande | JS |
| `micro-badge-count` | Badge de contador que salta | JS |
| `micro-dropdown` | Desplegable de opciones | JS |
| `micro-range-slider` | Deslizador de rango | JS |
| `micro-three-state` | Interruptor de tres estados | JS |
| `micro-icon-to-check` | Icono que se convierte en check | JS |
| `micro-dismiss-card` | Tarjeta que se descarta | JS |
| `micro-side-panels` | Paneles laterales tipo acordeón | JS |
| `micro-otp-code` | Código de verificación OTP | JS |
| `micro-error-expand` | Mensaje de error que se despliega | JS |
| `micro-cursor-tooltip` | Tooltip que sigue al cursor | JS |
| `micro-reorder-list` | Lista reordenable | JS |
| `micro-sound-bars` | Barras de sonido reactivas | CSS |
| `micro-tabs-content` | Pestañas con contenido deslizante | JS |
| `micro-like-count` | Botón de like con contador | JS |
| `micro-circle-progress` | Progreso circular con porcentaje | SVG |
| `micro-stacked-toasts` | Notificaciones apiladas | JS |
| `micro-btn-spinner` | Botón que se convierte en spinner | JS |
| `micro-icon-switch` | Interruptor con iconos | JS |
| `micro-breadcrumbs` | Migas de pan en cascada | JS |
| `micro-color-picker` | Selector de color | JS |
| `micro-drawer` | Panel lateral que entra | JS |
| `micro-status-list` | Lista de estados del sistema | CSS |
| `micro-card-to-modal` | Tarjeta que se expande a modal | JS |
| `micro-live-clock` | Reloj en vivo | JS |

## Animaciones modernas  `avanzado`

> Las cuatro últimas (`circuit-board`, `digital-loom`, `ascii-wave`, `vapour-text`) vienen
> del registro de 21st.dev, portadas de React + Tailwind a CSS/JS vanilla. Son estética
> tecnológica: encajan en SaaS, producto digital o estudio, y **no** en bar, peluquería o
> taller. Para negocio local, la sección que toca es `heroesq`.

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `adv-aurora` | Fondo aurora (mesh gradient animado) | CSS |
| `adv-glass-spotlight` | Card glass con spotlight del cursor | JS |
| `adv-blob-morph` | Blob orgánico morfeando | CSS |
| `adv-glitch` | Texto glitch (hover) | CSS |
| `adv-film-grain` | Grano de película animado | SVG |
| `adv-bento-expand` | Bento grid con expansión en hover | CSS |
| `adv-displacement` | Distorsión de imagen (hover) | SVG |
| `adv-carousel-3d` | Carrusel 3D auto-rotativo (hover pausa) | CSS |
| `adv-scroll-progress` | Barra de progreso de scroll interno | JS |
| `adv-cursor-ring` | Cursor magnético con anillo | JS |
| `adv-cursor-blend` | Cursor con inversión de color (blend) | JS |
| `adv-mesh-scroll` | Mesh que reacciona al scroll | JS |
| `adv-liquid-svg` | Forma líquida con filtro SVG | SVG |
| `adv-conic-text` | Texto con conic gradient + hue-rotate | CSS |
| `adv-oklch-gradient` | Degradado animado en OKLCH | CSS 2026 |
| `adv-holographic` | Tarjeta holográfica (mix-blend color-dodge) | JS |
| `adv-view-transition` | View Transitions API (clic para expandir) | CSS 2026 |
| `adv-dot-grid` | Rejilla de puntos reactiva al cursor | Canvas |
| `adv-tunnel-3d` | Túnel 3D infinito | CSS |
| `adv-text-disintegrate` | Texto que se desintegra | Canvas |
| `adv-grain-gradient` | Grano sobre gradiente vivo | CSS |
| `adv-flow-field` | Campo de flujo en canvas | Canvas |
| `adv-liquid-cursor` | Cursor líquido (metaball) | SVG |
| `adv-scroll-morph` | Forma que muta con el scroll | JS |
| `adv-card-deck-3d` | Pila 3D con perspectiva real | JS |
| `adv-ripple-grid` | Ondas en rejilla (clic) | JS |
| `adv-shader-gradient` | Gradiente tipo shader | Canvas |
| `adv-marquee-3d` | Marquee curvado en 3D | JS |
| `adv-scroll-text-fill` | Texto recortado por el scroll | JS |
| `adv-gallery-tilt` | Galería con tilt global | JS |
| `adv-path-morph` | Morphing de trazado SVG | SVG |
| `adv-noise-distort` | Distorsión por ruido en hover | Canvas |
| `adv-cursor-mask` | Máscara que revela con el cursor | JS |
| `adv-gooey-menu` | Menú gooey | SVG |
| `adv-infinite-zoom` | Zoom infinito | JS |
| `adv-color-blend` | Ciclo de color con blend | CSS |
| `adv-code-terminal` | Terminal que escribe código | JS |
| `adv-mouse-layers` | Capas con parallax de mouse | JS |
| `adv-glass-refraction` | Refracción tipo cristal | CSS |
| `adv-orbit-system` | Sistema de órbitas | JS |
| `adv-sine-waves` | Ondas seno en canvas | Canvas |
| `adv-halftone` | Semitonos que siguen al cursor | JS |
| `adv-crt-scanlines` | Pantalla CRT con barrido | CSS |
| `adv-liquid-blob` | Blob líquido que persigue al cursor | Canvas |
| `adv-conic-mask-text` | Texto con máscara cónica | CSS |
| `adv-magnetic-dots` | Puntos magnéticos | Canvas |
| `adv-depth-scroll` | Capas de profundidad con scroll | JS |
| `adv-conic-loader` | Cargador cónico | CSS |
| `adv-spotlight-cards` | Foco compartido sobre una rejilla | JS |
| `adv-nav-island` | Nav que se contrae en isla | JS |
| `adv-circuit-board` | Placa de circuito con pulsos recorriendo las pistas | SVG |
| `adv-digital-loom` | Telar digital: urdimbre y trama cruzadas | CSS |
| `adv-ascii-wave` | Onda dibujada por densidad de caracteres ASCII | JS |
| `adv-vapour-text` | Texto que se evapora letra a letra y vuelve | CSS |

## Patrones que ya usás  `produccion`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `prod-marquee` | Marquee infinito con fade y pausa en hover | usado: generador · mosaic |
| `prod-review-wall` | Muro de reseñas vertical multi-velocidad | usado: peluquería · panadería |
| `prod-radial-fab` | FAB radial de contacto | usado: index · fluid-menu |
| `prod-video-scrub` | Scroll scrub tipo video (sticky) | usado: restaurante |
| `prod-canvas-embers` | Partículas canvas (brasas) | usado: restaurante |
| `prod-cursor-peek` | Preview de imagen que sigue al cursor | usado: restaurante |
| `prod-testi-rotator` | Carrusel de testimonios auto-rotativo | usado: restaurante |
| `prod-nav-hide` | Nav que se oculta al bajar y encoge | usado: mosaic · pelu |
| `prod-faq-accordion` | Acordeón FAQ (uno abierto a la vez) | usado: precios.html |
| `prod-splash-loader` | Splash preloader con contador | usado: pelu-mosaico |
| `prod-cta-ping` | CTA con anillo de pulso + punto "en vivo" | usado: styles.css · todas |
| `prod-float-bob` | Bob flotante idle | usado: panadería · veterinaria |
| `prod-clip-reveal` | Reveal con clip-path direccional (hacé scroll de la página) | usado: panadería |
| `prod-snap-horizontal` | Scroll-snap horizontal nativo (arrastrá lateralmente) | usado: restaurante |
| `prod-sector-chips` | Chips de sector que cambian el mockup | usado: index.html |
| `prod-mobile-bar` | Barra flotante de contacto móvil | usado: webs-clientes |
| `prod-open-status` | Estado abierto / cerrado en vivo | usado: todas las webs |
| `prod-gallery-filter` | Galería con filtro animado | usado: trabajos.html |
| `prod-live-validation` | Formulario con validación en vivo | usado: contacto.html |
| `prod-map-pin` | Mapa con pin que late | usado: SEO local |
| `prod-sticky-cta` | CTA fijo que aparece al bajar | JS |
| `prod-cookie-banner` | Aviso de cookies | JS |
| `prod-whatsapp-bubble` | Burbuja de WhatsApp | JS |
| `prod-work-compare` | Comparador de trabajos | CSS |
| `prod-price-toggle` | Cambio de precio mensual / anual | JS |
| `prod-service-grid` | Rejilla de servicios | CSS |
| `prod-logo-wall` | Muro de logos de clientes | CSS |
| `prod-process-steps` | Pasos del proceso (scroll) | JS |
| `prod-faq-search` | FAQ con buscador | JS |
| `prod-booking-calendar` | Mini calendario de reservas | JS |
| `prod-fullscreen-menu` | Menú móvil a pantalla completa | JS |
| `prod-newsletter` | Newsletter en línea | JS |
| `prod-trust-badges` | Sellos de confianza | CSS |
| `prod-stat-band` | Banda de estadísticas (scroll) | JS |
| `prod-team-grid` | Rejilla de equipo | CSS |
| `prod-instagram-feed` | Feed tipo Instagram | CSS |
| `prod-blog-cards` | Tarjetas de blog | CSS |
| `prod-back-to-top` | Botón de volver arriba | JS |
| `prod-lang-switch` | Cambio de idioma | JS |
| `prod-top-loader` | Barra de carga superior | JS |
| `prod-promo-bar` | Barra promocional superior | JS |
| `prod-lightbox` | Lightbox de imagen | JS |
| `prod-service-accordion` | Acordeón de servicios con precio | JS |
| `prod-cta-split` | Sección CTA a dos columnas | CSS |
| `prod-offer-countdown` | Oferta con cuenta atrás | JS |
| `prod-rating-summary` | Resumen de valoraciones (scroll) | JS |
| `prod-scroll-indicator` | Indicador de scroll del hero | CSS |
| `prod-footer-reveal` | Pie que se revela al final | CSS |
| `prod-share-buttons` | Botones de compartir (scroll) | JS |
| `prod-exit-intent` | Captación al salir del contenido | JS |

## Heroes premium  `heropro`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `heropro-aurora-glass` | Aurora con panel de cristal | CSS |
| `heropro-editorial-split` | Editorial impreso a dos columnas | CSS |
| `heropro-product-float` | Mockup de producto flotando | CSS |
| `heropro-grain-gradient` | Degradado con grano y tipografía enorme | CSS |
| `heropro-bento` | Hero en rejilla bento | CSS |
| `heropro-spotlight-cursor` | Foco de luz que sigue el cursor | JS |
| `heropro-marquee-band` | Banda diagonal en marquesina | CSS |
| `heropro-cards-3d` | Tarjetas apiladas en perspectiva | CSS |
| `heropro-cinematic` | Marco cinematográfico con play | CSS |
| `heropro-outline-type` | Titular perfilado sobre luz cálida | CSS |
| `heropro-mesh-blur` | Malla desenfocada en movimiento | CSS |
| `heropro-stats-bar` | A sangre con barra de datos | CSS |
| `heropro-duotone` | Foto en duotono a media pantalla | CSS |
| `heropro-glass-nav` | Navegación de cristal integrada | CSS |
| `heropro-tech-grid` | Rejilla técnica con etiquetas | CSS |
| `heropro-logo-orbit` | Logos en órbita | JS |
| `heropro-tilt-mockup` | Mockup que se inclina con el cursor | JS |
| `heropro-gradient-type` | Degradado animado dentro del texto | CSS |
| `heropro-color-split` | Bloque de color y foto al 50% | CSS |
| `heropro-social-proof` | Centrado con prueba social | CSS |
| `heropro-hair-salon` | Peluquería · reserva en dos toques | CSS |
| `heropro-car-shop` | Taller mecánico · presupuesto por foto | CSS |
| `heropro-restaurant` | Restaurante · carta y mesa | CSS |
| `heropro-dental` | Clínica dental · primera visita gratis | CSS |
| `heropro-gym` | Gimnasio · prueba gratis | CSS |
| `heropro-bakery` | Panadería · pedido para recoger | CSS |
| `heropro-florist` | Floristería · envío el mismo día | CSS |
| `heropro-vet` | Veterinaria · urgencias 24 h | CSS |
| `heropro-lawyer` | Abogado · primera consulta | CSS |
| `heropro-physio` | Fisioterapia · antes y después | CSS |
| `heropro-realestate` | Inmobiliaria · buscador rápido | CSS |
| `heropro-academy` | Academia · matrícula abierta | CSS |
| `heropro-rural-hotel` | Hotel rural · disponibilidad | CSS |
| `heropro-pintxos` | Bar de pintxos · lo de hoy | CSS |
| `heropro-optics` | Óptica · graduación gratis | CSS |
| `heropro-hardware` | Ferretería · stock y reserva | CSS |
| `heropro-plumber` | Fontanero · urgencias | CSS |
| `heropro-electrician` | Electricista · boletines | CSS |
| `heropro-catering` | Catering · evento a medida | CSS |
| `heropro-photographer` | Fotógrafo · portfolio a pantalla | CSS |
| `heropro-tattoo` | Estudio de tatuaje · cita previa | CSS |
| `heropro-spa` | Spa · bono regalo | CSS |
| `heropro-driving-school` | Autoescuela · precio claro | CSS |
| `heropro-nursery` | Guardería · plazas y horario | CSS |
| `heropro-carpentry` | Carpintería · antes y después | CSS |
| `heropro-pastry` | Obrador · encargo de tartas | CSS |
| `heropro-therapist` | Psicología · primera sesión | CSS |
| `heropro-fishmonger` | Pescadería · lo fresco de hoy | CSS |
| `heropro-cleaning` | Empresa de limpieza · presupuesto | CSS |
| `heropro-renovation` | Reformas · proyecto cerrado | CSS |

## Heroes minimalistas  `heromin`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `heromin-centered` | Centrado con etiqueta y enlace | CSS |
| `heromin-left` | Alineado a la izquierda | CSS |
| `heromin-rule-top` | Filete superior con sección | CSS |
| `heromin-type-only` | Sólo tipografía | CSS |
| `heromin-underline-link` | Titular con enlace subrayado | CSS |
| `heromin-numbered` | Con número de índice | CSS |
| `heromin-vertical-rule` | Con filete vertical de acento | CSS |
| `heromin-boxed` | Caja de borde fino | CSS |
| `heromin-eyebrow` | Etiqueta pequeña arriba | CSS |
| `heromin-date-right` | Titular y fecha alineada | CSS |
| `heromin-two-col` | Dos columnas: titular y texto | CSS |
| `heromin-baseline` | Texto apoyado abajo | CSS |
| `heromin-corner-labels` | Etiquetas en las esquinas | CSS |
| `heromin-mono` | Todo en monoespaciada | CSS |
| `heromin-serif` | Display serif grande | CSS |
| `heromin-caps` | Versalitas con tracking | CSS |
| `heromin-dot` | Punto de acento | CSS |
| `heromin-inner-frame` | Marco interior fino | CSS |
| `heromin-split-rule` | Línea que parte el hero | CSS |
| `heromin-small-type` | Tipografía pequeña, mucho blanco | CSS |
| `heromin-dark` | Fondo tinta | CSS |
| `heromin-dark-center` | Tinta centrado | CSS |
| `heromin-bone` | Papel hueso | CSS |
| `heromin-accent-word` | Una palabra en color | CSS |
| `heromin-long-arrow` | Flecha larga | CSS |
| `heromin-index` | Índice a la derecha | CSS |
| `heromin-signature` | Con firma | CSS |
| `heromin-stacked` | Palabras escalonadas | CSS |
| `heromin-wide-track` | Tracking muy abierto | CSS |
| `heromin-tight-track` | Tracking cerrado | CSS |
| `heromin-caption` | Con pie de foto | CSS |
| `heromin-grid-2` | Dos columnas iguales | CSS |
| `heromin-hairline-box` | Caja de líneas finas | CSS |
| `heromin-quote` | Cita corta | CSS |
| `heromin-scroll-cue` | Indicador de scroll | CSS |
| `heromin-meta-row` | Fila de metadatos | CSS |
| `heromin-slashes` | Separadores con barra | CSS |
| `heromin-dot-nav` | Navegación de puntos | CSS |
| `heromin-narrow` | Columna estrecha centrada | CSS |
| `heromin-outline-btn` | Botón de contorno | CSS |
| `heromin-text-cta` | CTA como texto con flecha | CSS |
| `heromin-lang` | Selector de idioma discreto | CSS |
| `heromin-square` | Cuadrado de acento | CSS |
| `heromin-diagonal` | Línea diagonal | CSS |
| `heromin-footer-line` | Contacto en la línea inferior | CSS |
| `heromin-big-number` | Cifra grande | CSS |
| `heromin-three-words` | Tres palabras | CSS |
| `heromin-margin-note` | Nota al margen | CSS |
| `heromin-corner-plus` | Cruces en las esquinas | CSS |
| `heromin-mini-nav` | Navegación mínima arriba | CSS |

## Heroes por esquema  `heroesq`

Catalogados por **composición**, no por efecto: dónde cae la foto, dónde el texto y dónde
la acción. Ortogonales al resto: se elige aquí la estructura y encima se le aplica el
movimiento de `hero-`, el acabado de `heropro-` y la tipografía de `font-`.

Pensados para negocio local, con el móvil como pieza original: la acción principal vive en
el tercio inferior, al alcance del pulgar. La columna **Prueba** dice qué contesta la
imagen — *espacio* (cómo es el local), *producto* (lo que se vende), *resultado* (el
antes/después), *persona* (quién te atiende), *proceso* (cómo se hace) o *dato* cuando la
pieza no lleva foto y se sostiene con una cifra.

Cada pieza se muestra en sus dos estados, escritorio y móvil, porque un catálogo de
composición que no enseña cómo apila no sirve para decidir.

**Tres superficies, todas planas.** Tinta (`#0f0f13`) para hostelería de noche, taller,
gimnasio y oficio; papel cálido (`#f7f5f1`) para comercio de boca, flores y niños; nieve
fría (`#fafafb`) para salud, óptica y despacho. Reparto 23 oscuras / 27 claras: cincuenta
cajas oscuras seguidas no dejan juzgar una composición, sólo pesan. Nada de degradados de
fondo — el ruido de fondo es lo primero que impide que un hero se lea limpio.

**El acento sólo manda en oscuro.** Sobre papel o nieve el botón primario va en tinta, y el
acento queda para marcas pequeñas: un acento relleno al lado del verde de WhatsApp da dos
primarios compitiendo. Sobre fondo oscuro el primario lleva siempre tinta oscura encima del
acento — los ocho tonos de la paleta son claros y en blanco ninguno llega a 4.5:1.

**Un cuarto eje: qué hace el titular.** Tomado de cómo clasifica Land-book sus headlines,
adaptado al comercio de barrio — fuera «Visión», que una panadería no tiene, y dentro
«Urgencia», que es plazas, temporada y horario. Los siete ángulos: **Problema** (le pone
nombre a lo que le pasa al cliente), **Resultado** (lo que se lleva), **Mecanismo** (cómo
funciona), **Diferenciación** (por qué aquí y no enfrente), **Posicionamiento** (qué es este
sitio), **Urgencia** (por qué ahora) y **Descripción** (qué se vende, sin más). Y cinco
tonos: Rotundo, Cercano, Emocional, Informativo, Mínimo.

Sirve para elegir esquema y ángulo por separado: la misma composición admite un titular de
Problema o de Resultado, y esa decisión cambia la web más que mover la foto de lado.

| Nombre clave | Dónde cae cada bloque | Titular | Prueba | Tec |
|---|---|---|---|---|
| `heroesq-sinfoto-centro-cta-ancho` | Sin foto, texto centrado, botón a todo el ancho | Urgencia · Informativo | Dato | CSS |
| `heroesq-sinfoto-izq-cta-telefono` | Sin foto, texto izquierda, el número es el botón | Problema · Emocional | Dato | CSS |
| `heroesq-sinfoto-dato-cta-unico` | Sin foto, precio protagonista, un solo botón | Posicionamiento · Mínimo | Dato | CSS |
| `heroesq-sinfoto-dos-col-cta-pie` | Sin foto, dos columnas de texto, CTA al pie tras la línea | Diferenciación · Informativo | Dato | CSS |
| `heroesq-sinfoto-antetitulo-cta-flecha` | Sin foto, antetítulo, botón más enlace con flecha | Mecanismo · Rotundo | Dato | CSS |
| `heroesq-sangre-izq-barra-fija` | Foto a sangre, texto izquierda, barra de acción al pie | Resultado · Emocional | Espacio | CSS |
| `heroesq-sangre-centro-cta-doble` | Foto a sangre, texto centrado, dos botones centrados | Diferenciación · Emocional | Espacio | CSS |
| `heroesq-sangre-der-cta-tarjeta` | Foto a sangre, texto derecha, tarjeta flotante con la acción | Descripción · Informativo | Espacio | CSS |
| `heroesq-sangre-antetitulo-cta-sobre-foto` | Foto a sangre, antetítulo, botón sobre la foto | Mecanismo · Rotundo | Espacio | CSS |
| `heroesq-sangre-dato-cta-terna` | Foto a sangre, dato grande, tres acciones | Diferenciación · Rotundo | Espacio | CSS |
| `heroesq-media-der-izq-cta-doble` | Foto media derecha, texto izquierda, dos botones bajo el párrafo | Resultado · Cercano | Resultado | CSS |
| `heroesq-media-der-antetitulo-cta-flecha` | Foto media derecha, antetítulo, botón más enlace con flecha | Mecanismo · Informativo | Producto | CSS |
| `heroesq-media-der-dato-cta-sobre-foto` | Foto media derecha, dato grande, botón encima de la foto | Mecanismo · Mínimo | Producto | CSS |
| `heroesq-media-der-izq-cta-telefono` | Foto media derecha, texto izquierda, teléfono como botón | Posicionamiento · Rotundo | Persona | CSS |
| `heroesq-media-der-dos-col-cta-pie` | Foto media derecha, dos columnas, CTA al pie tras la línea | Diferenciación · Informativo | Espacio | CSS |
| `heroesq-media-izq-der-cta-doble` | Foto media izquierda, texto derecha alineado, dos botones | Problema · Cercano | Resultado | CSS |
| `heroesq-media-izq-antetitulo-barra-fija` | Foto media izquierda, antetítulo, barra de acción al pie | Mecanismo · Cercano | Persona | CSS |
| `heroesq-media-izq-dato-cta-ancho` | Foto media izquierda, dato grande, botón a todo el ancho | Urgencia · Mínimo | Producto | CSS |
| `heroesq-media-izq-izq-cta-header` | Foto media izquierda, acción en la cabecera y repetida abajo | Diferenciación · Informativo | Persona | CSS |
| `heroesq-media-izq-der-cta-apilado` | Foto media izquierda, texto derecha, botones apilados | Mecanismo · Cercano | Producto | CSS |
| `heroesq-recorte-arco-izq-cta-doble` | Foto en arco (boca de horno), texto izquierda, dos botones | Mecanismo · Mínimo | Proceso | CSS |
| `heroesq-recorte-circulo-der-cta-flecha` | Retrato en círculo, texto derecha, botón más flecha | Diferenciación · Emocional | Persona | CSS |
| `heroesq-recorte-circulo-centro-cta-unico` | Retrato en círculo arriba, texto centrado, un solo botón | Diferenciación · Mínimo | Persona | CSS |
| `heroesq-recorte-arco-dato-barra-fija` | Foto en arco, dato grande, barra de acción al pie | Resultado · Informativo | Resultado | CSS |
| `heroesq-recorte-rombo-antetitulo-cta-tarjeta` | Foto en rombo (señal de taller), antetítulo, tarjeta con la acción | Mecanismo · Cercano | Proceso | CSS |
| `heroesq-mosaico-izq-cta-doble` | Mosaico con dominante, texto izquierda, dos botones | Urgencia · Informativo | Producto | CSS |
| `heroesq-mosaico-der-cta-flecha` | Mosaico a la derecha, texto derecha, botón más flecha | Diferenciación · Rotundo | Producto | CSS |
| `heroesq-mosaico-centro-cta-ancho` | Mosaico de fondo, texto centrado encima, botón a todo el ancho | Posicionamiento · Emocional | Espacio | CSS |
| `heroesq-mosaico-dato-cta-terna` | Mosaico con dominante, dato grande, tres acciones | Descripción · Mínimo | Producto | CSS |
| `heroesq-mosaico-antetitulo-cta-pie` | Mosaico, antetítulo, CTA al pie tras la línea | Urgencia · Informativo | Producto | CSS |
| `heroesq-tira-izq-cta-doble` | Tira de fotos al pie, texto izquierda, dos botones | Posicionamiento · Cercano | Producto | CSS |
| `heroesq-tira-centro-barra-fija` | Tira de fotos al pie, texto centrado, barra de acción | Mecanismo · Emocional | Producto | CSS |
| `heroesq-tira-dato-cta-ancho` | Tira de fotos al pie, dato grande, botón a todo el ancho | Mecanismo · Mínimo | Producto | CSS |
| `heroesq-tira-antetitulo-cta-apilado` | Tira de fotos al pie, antetítulo, botones apilados | Diferenciación · Cercano | Producto | CSS |
| `heroesq-tira-der-cta-unico` | Tira de fotos al pie, texto derecha, un solo botón | Problema · Cercano | Producto | CSS |
| `heroesq-flotante-izq-cta-sobre-foto` | Foto flotante desbordando, texto izquierda, botón sobre la foto | Problema · Rotundo | Espacio | CSS |
| `heroesq-flotante-der-cta-telefono` | Foto flotante a la izquierda, texto derecha, teléfono como botón | Problema · Cercano | Proceso | CSS |
| `heroesq-flotante-dato-cta-tarjeta` | Foto flotante, dato grande, tarjeta flotante con la acción | Resultado · Emocional | Espacio | CSS |
| `heroesq-flotante-antetitulo-cta-header` | Foto flotante, antetítulo, acción en la cabecera y repetida abajo | Diferenciación · Informativo | Espacio | CSS |
| `heroesq-flotante-centro-cta-flecha` | Foto flotante al pie, texto centrado, botón más flecha | Posicionamiento · Emocional | Espacio | CSS |
| `heroesq-mockup-carta-izq-barra-fija` | Mockup de carta, texto izquierda, barra de acción al pie | Descripción · Informativo | Producto | CSS |
| `heroesq-mockup-movil-der-cta-unico` | Mockup de móvil a la izquierda, texto derecha, un solo botón | Mecanismo · Cercano | Proceso | CSS |
| `heroesq-mockup-ticket-dato-cta-ancho` | Mockup de ticket, dato grande, botón a todo el ancho | Mecanismo · Mínimo | Producto | CSS |
| `heroesq-mockup-movil-antetitulo-cta-doble` | Mockup de móvil a la derecha, antetítulo, dos botones | Resultado · Informativo | Proceso | CSS |
| `heroesq-mockup-carta-centro-cta-terna` | Mockup de carta centrado, texto centrado, tres acciones | Posicionamiento · Cercano | Producto | CSS |
| `heroesq-franja-lateral-izq-cta-doble` | Franja lateral de foto, texto izquierda, dos botones | Problema · Cercano | Espacio | CSS |
| `heroesq-franja-diagonal-der-cta-apilado` | Franja diagonal de foto, texto derecha, botones apilados | Resultado · Rotundo | Resultado | CSS |
| `heroesq-franja-banda-dato-cta-unico` | Banda horizontal de color, dato grande, un solo botón | Resultado · Rotundo | Dato | CSS |
| `heroesq-franja-esquina-antetitulo-cta-header` | Foto en la esquina, antetítulo, acción en la cabecera y repetida | Problema · Mínimo | Espacio | CSS |
| `heroesq-franja-lateral-dos-col-cta-pie` | Franja lateral de foto, dos columnas, CTA al pie tras la línea | Descripción · Informativo | Espacio | CSS |

### Cobertura de los tres ejes

Sirve para comprobar de un vistazo que no hay agujeros ni ternas repetidas.

| # | Esquema | Imagen (A) | Texto (B) | Acción (C) |
|---|---|---|---|---|
| 1 | `sinfoto-centro-cta-ancho` | A1 sin foto | centrado | C12 a todo el ancho |
| 2 | `sinfoto-izq-cta-telefono` | A1 sin foto | izquierda | C8 teléfono |
| 3 | `sinfoto-dato-cta-unico` | A1 sin foto | dato grande | C2 un botón |
| 4 | `sinfoto-dos-col-cta-pie` | A1 sin foto | dos columnas | C11 al pie |
| 5 | `sinfoto-antetitulo-cta-flecha` | A1 sin foto | antetítulo | C3 botón + flecha |
| 6 | `sangre-izq-barra-fija` | A2 a sangre | izquierda | C4 barra al pie |
| 7 | `sangre-centro-cta-doble` | A2 a sangre | centrado | C1 dos botones |
| 8 | `sangre-der-cta-tarjeta` | A2 a sangre | derecha | C10 tarjeta |
| 9 | `sangre-antetitulo-cta-sobre-foto` | A2 a sangre | antetítulo | C6 sobre la foto |
| 10 | `sangre-dato-cta-terna` | A2 a sangre | dato grande | C9 terna |
| 11 | `media-der-izq-cta-doble` | A3 media der. | izquierda | C1 dos botones |
| 12 | `media-der-antetitulo-cta-flecha` | A3 media der. | antetítulo | C3 botón + flecha |
| 13 | `media-der-dato-cta-sobre-foto` | A3 media der. | dato grande | C6 sobre la foto |
| 14 | `media-der-izq-cta-telefono` | A3 media der. | izquierda | C8 teléfono |
| 15 | `media-der-dos-col-cta-pie` | A3 media der. | dos columnas | C11 al pie |
| 16 | `media-izq-der-cta-doble` | A4 media izq. | derecha | C1 dos botones |
| 17 | `media-izq-antetitulo-barra-fija` | A4 media izq. | antetítulo | C4 barra al pie |
| 18 | `media-izq-dato-cta-ancho` | A4 media izq. | dato grande | C12 a todo el ancho |
| 19 | `media-izq-izq-cta-header` | A4 media izq. | izquierda | C5 en la cabecera |
| 20 | `media-izq-der-cta-apilado` | A4 media izq. | derecha | C7 apilados |
| 21 | `recorte-arco-izq-cta-doble` | A5 recorte | izquierda | C1 dos botones |
| 22 | `recorte-circulo-der-cta-flecha` | A5 recorte | derecha | C3 botón + flecha |
| 23 | `recorte-circulo-centro-cta-unico` | A5 recorte | centrado | C2 un botón |
| 24 | `recorte-arco-dato-barra-fija` | A5 recorte | dato grande | C4 barra al pie |
| 25 | `recorte-rombo-antetitulo-cta-tarjeta` | A5 recorte | antetítulo | C10 tarjeta |
| 26 | `mosaico-izq-cta-doble` | A6 mosaico | izquierda | C1 dos botones |
| 27 | `mosaico-der-cta-flecha` | A6 mosaico | derecha | C3 botón + flecha |
| 28 | `mosaico-centro-cta-ancho` | A6 mosaico | centrado | C12 a todo el ancho |
| 29 | `mosaico-dato-cta-terna` | A6 mosaico | dato grande | C9 terna |
| 30 | `mosaico-antetitulo-cta-pie` | A6 mosaico | antetítulo | C11 al pie |
| 31 | `tira-izq-cta-doble` | A7 tira | izquierda | C1 dos botones |
| 32 | `tira-centro-barra-fija` | A7 tira | centrado | C4 barra al pie |
| 33 | `tira-dato-cta-ancho` | A7 tira | dato grande | C12 a todo el ancho |
| 34 | `tira-antetitulo-cta-apilado` | A7 tira | antetítulo | C7 apilados |
| 35 | `tira-der-cta-unico` | A7 tira | derecha | C2 un botón |
| 36 | `flotante-izq-cta-sobre-foto` | A8 flotante | izquierda | C6 sobre la foto |
| 37 | `flotante-der-cta-telefono` | A8 flotante | derecha | C8 teléfono |
| 38 | `flotante-dato-cta-tarjeta` | A8 flotante | dato grande | C10 tarjeta |
| 39 | `flotante-antetitulo-cta-header` | A8 flotante | antetítulo | C5 en la cabecera |
| 40 | `flotante-centro-cta-flecha` | A8 flotante | centrado | C3 botón + flecha |
| 41 | `mockup-carta-izq-barra-fija` | A9 mockup | izquierda | C4 barra al pie |
| 42 | `mockup-movil-der-cta-unico` | A9 mockup | derecha | C2 un botón |
| 43 | `mockup-ticket-dato-cta-ancho` | A9 mockup | dato grande | C12 a todo el ancho |
| 44 | `mockup-movil-antetitulo-cta-doble` | A9 mockup | antetítulo | C1 dos botones |
| 45 | `mockup-carta-centro-cta-terna` | A9 mockup | centrado | C9 terna |
| 46 | `franja-lateral-izq-cta-doble` | A10 franja | izquierda | C1 dos botones |
| 47 | `franja-diagonal-der-cta-apilado` | A10 franja | derecha | C7 apilados |
| 48 | `franja-banda-dato-cta-unico` | A10 franja | dato grande | C2 un botón |
| 49 | `franja-esquina-antetitulo-cta-header` | A10 franja | antetítulo | C5 en la cabecera |
| 50 | `franja-lateral-dos-col-cta-pie` | A10 franja | dos columnas | C11 al pie |

**Ángulo del titular:** Mecanismo ×12 · Diferenciación ×10 · Problema ×7 · Resultado ×7 · Posicionamiento ×6 · Urgencia ×4 · Descripción ×4
**Tono:** Informativo ×13 · Cercano ×12 · Mínimo ×9 · Emocional ×8 · Rotundo ×8

**Imagen:** A1 sin foto ×5 · A10 franja ×5 · A2 a sangre ×5 · A3 media der. ×5 · A4 media izq. ×5 · A5 recorte ×5 · A6 mosaico ×5 · A7 tira ×5 · A8 flotante ×5 · A9 mockup ×5
**Acción:** C1 dos botones ×8 · C10 tarjeta ×3 · C11 al pie ×4 · C12 a todo el ancho ×5 · C2 un botón ×5 · C3 botón + flecha ×5 · C4 barra al pie ×5 · C5 en la cabecera ×3 · C6 sobre la foto ×3 · C7 apilados ×3 · C8 teléfono ×3 · C9 terna ×3

## Estilos de fuente  `tipografia`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `font-editorial-serif` | Editorial clásico | CSS |
| `font-modern-grotesk` | Grotesca moderna | CSS |
| `font-swiss` | Suiza pura | CSS |
| `font-brutalist-caps` | Brutalista en mayúsculas | CSS |
| `font-poster-condensed` | Cartel condensado | CSS |
| `font-elegant-light` | Elegante fina | CSS |
| `font-tech-mono` | Técnica monoespaciada | CSS |
| `font-friendly-round` | Amable redondeada | CSS |
| `font-variable-serif` | Serif variable con carácter | CSS |
| `font-geometric-sober` | Geométrica sobria | CSS |
| `font-thin-display` | Titular fino y enorme | CSS |
| `font-newspaper-serif` | Serif de periódico | CSS |
| `font-expressive-display` | Display expresiva | CSS |
| `font-wide-futuristic` | Futurista ancha | CSS |
| `font-italic-serif` | Serif italiana en cursiva | CSS |
| `font-condensed-title` | Condensada de titular | CSS |
| `font-serif-display` | Serif moderna de display | CSS |
| `font-vertical-impact` | Impacto vertical | CSS |
| `font-humanist` | Humanista cálida | CSS |
| `font-reading-serif` | Serif de lectura larga | CSS |
| `font-caps-tracked` | Mayúsculas muy espaciadas | CSS |
| `font-tight-tracking` | Tracking negativo extremo | CSS |
| `font-weight-contrast` | Contraste de pesos | CSS |
| `font-italic-accent` | Serif con cursiva de acento | CSS |
| `font-mono-title` | Mono de titular, sans de texto | CSS |
| `font-sans-serif-pair` | Sans de titular, serif de texto | CSS |
| `font-serif-mono-pair` | Serif y mono | CSS |
| `font-title-two-sizes` | Titular a dos tamaños | CSS |
| `font-small-caps` | Versalitas para etiquetas | CSS |
| `font-airy-leading` | Interlineado muy abierto | CSS |
| `font-tight-leading` | Interlineado cerrado | CSS |
| `font-tabular-nums` | Números tabulares | CSS |
| `font-oldstyle-nums` | Cifras de estilo antiguo | CSS |
| `font-thick-underline` | Titular con subrayado grueso | CSS |
| `font-mono-labels` | Rótulos en mono, titular en sans | CSS |
| `font-thin-serif-wide-sans` | Serif fina con sans ancha | CSS |
| `font-single-variable` | Todo en una familia variable | CSS |
| `font-classic-centered` | Titular centrado clásico | CSS |
| `font-scale-visible` | Escala tipográfica visible | CSS |
| `font-two-tone-title` | Titular en dos colores | CSS |
| `font-luxury-airy` | Serif de lujo con mucho aire | CSS |
| `font-justified-block` | Bloque de texto justificado | CSS |
| `font-drop-initial` | Titular con inicial grande | CSS |
| `font-stacked-caps` | Mayúsculas condensadas apiladas | CSS |
| `font-light-large` | Sans ligera de gran tamaño | CSS |
| `font-mono-label-serif` | Etiqueta mono sobre titular serif | CSS |
| `font-em-dash` | Titular con guion de apertura | CSS |
| `font-editorial-system` | Sistema editorial completo | CSS |
| `font-wide-mono` | Mono ancha de titular | CSS |
| `font-serif-grotesk-pair` | Contraste serif y grotesca | CSS |

## Cabeceras y menús  `header`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `head-classic` | Clásico: logo, menú y CTA | CSS |
| `head-centered` | Centrado en dos filas | CSS |
| `head-split` | Menú dividido a los lados | CSS |
| `head-pill-nav` | Navegación en píldora | CSS |
| `head-cta-minimal` | Minimal: solo logo y CTA | CSS |
| `head-underline` | Subrayado animado al pasar | CSS |
| `head-transparent` | Transparente sobre color | CSS |
| `head-topbar` | Barra superior de contacto | CSS |
| `head-search` | Con buscador | CSS |
| `head-mega` | Megamenú desplegable | CSS |
| `head-hamburger` | Hamburguesa (móvil) | JS |
| `head-burger-center` | Hamburguesa + logo centrado | JS |
| `head-island` | Isla flotante redondeada | CSS |
| `head-accent-border` | Borde inferior de acento | CSS |
| `head-gradient` | Degradado de marca | CSS |
| `head-dark` | Cabecera oscura | CSS |
| `head-logo-badge` | Logo con punto de estado | CSS |
| `head-icon-nav` | Navegación con iconos | CSS |
| `head-cart` | Con carrito y contador | CSS |
| `head-lang` | Selector de idioma | CSS |
| `head-double-deck` | Doble piso: utilidades + menú | CSS |
| `head-breadcrumb` | Con migas de pan | CSS |
| `head-progress` | Con barra de progreso | JS |
| `head-shrink` | Compacta (se encoge al scroll) | CSS |
| `head-cta-outline` | CTA con contorno | CSS |
| `head-dividers` | Enlaces con separadores | CSS |
| `head-social` | Con redes sociales | CSS |
| `head-announcement` | Aviso superior descartable | JS |
| `head-mega-cols` | Megamenú en columnas | CSS |
| `head-avatar` | Con avatar de usuario | CSS |
| `head-tabs` | Navegación tipo pestañas | CSS |
| `head-glass` | Cristal esmerilado sobre imagen | CSS |
| `head-serif` | Editorial: logo serif | CSS |
| `head-stacked-upper` | Centrado en versalitas | CSS |
| `head-accent-logo` | Logo en bloque de acento | CSS |
| `head-two-cta` | Login + registro | CSS |
| `head-mini` | Ultra compacta | CSS |
| `head-rounded-nav` | Enlaces en chips redondeados | CSS |
| `head-nav-left` | Todo el menú a la izquierda | CSS |
| `head-badge-new` | Etiqueta "Nuevo" en un item | CSS |
| `head-caret` | Items con flecha desplegable | CSS |
| `head-sticky` | Fija arriba (sticky) | CSS |
| `head-contact-strip` | Franja de contacto destacada | CSS |
| `head-center-icons` | Logo centrado con iconos | CSS |
| `head-two-tone` | Fondo en dos tonos | CSS |
| `head-outline-logo` | Logo con contorno | CSS |
| `head-vertical` | Barra lateral vertical | CSS |
| `head-cta-arrow` | CTA con flecha | CSS |
| `head-search-expand` | Buscador que se expande | JS |
| `head-mega-image` | Megamenú con imagen | CSS |

## Estructuras de contenido  `contenido`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `body-sidebar-left` | Barra lateral a la izquierda | CSS |
| `body-sidebar-right` | Barra lateral a la derecha | CSS |
| `body-two-col` | Dos columnas | CSS |
| `body-three-col` | Tres columnas | CSS |
| `body-hero-split` | Hero partido: texto + imagen | CSS |
| `body-bento` | Rejilla bento | CSS |
| `body-magazine` | Revista: titular y columnas | CSS |
| `body-cards-grid` | Rejilla de tarjetas | CSS |
| `body-alternating` | Filas alternadas (zig-zag) | CSS |
| `body-feature-list` | Lista de características | CSS |
| `body-centered-prose` | Prosa centrada | CSS |
| `body-hero-centered` | Hero centrado | CSS |
| `body-full-hero` | Hero a pantalla completa | CSS |
| `body-stats-band` | Banda de estadísticas | CSS |
| `body-pricing-3` | Precios en tres planes | CSS |
| `body-faq-list` | Lista de preguntas (FAQ) | CSS |
| `body-masonry` | Galería masonry | CSS |
| `body-timeline` | Línea temporal | CSS |
| `body-cta-block` | Bloque de llamada a la acción | CSS |
| `body-logos-strip` | Tira de logos | CSS |
| `body-testimonial-band` | Banda de testimonio | CSS |
| `body-split-5050` | Split 50/50 de color | CSS |
| `body-media-left` | Media a la izquierda | CSS |
| `body-media-right` | Media a la derecha | CSS |
| `body-tabs` | Contenido con pestañas | JS |
| `body-steps` | Pasos numerados | CSS |
| `body-team-grid` | Rejilla de equipo | CSS |
| `body-blog-list` | Lista de blog | CSS |
| `body-blog-grid` | Rejilla de blog | CSS |
| `body-services-3` | Tres servicios con icono | CSS |
| `body-contact-split` | Contacto: formulario + mapa | CSS |
| `body-hero-cards` | Hero con tarjetas de apoyo | CSS |
| `body-overlap-card` | Tarjeta que solapa la imagen | CSS |
| `body-sticky-sidebar` | Sidebar fija con índice | CSS |
| `body-comparison` | Tabla comparativa | CSS |
| `body-icon-grid` | Rejilla de iconos | CSS |
| `body-quote-full` | Cita a toda página | CSS |
| `body-banner` | Banner de imagen ancha | CSS |
| `body-two-hero` | Dos héroes en mitades | CSS |
| `body-catalog` | Catálogo de productos | CSS |
| `body-product-detail` | Ficha de producto | CSS |
| `body-dashboard` | Panel de aplicación | CSS |
| `body-kanban` | Tablero kanban | CSS |
| `body-feed` | Muro tipo feed | CSS |
| `body-cover-title` | Portada tipo revista | CSS |
| `body-index-list` | Listado tipo directorio | CSS |
| `body-map-listings` | Mapa con listado | CSS |
| `body-accordion-media` | Acordeón con media | JS |
| `body-newsletter-hero` | Hero con newsletter | CSS |
| `body-end-cta` | Cierre con gran CTA | CSS |

## Pies de página  `footer`

| Nombre clave | Qué hace | Tec |
|---|---|---|
| `foot-classic` | Clásico de cuatro columnas | CSS |
| `foot-minimal` | Minimal en una línea | CSS |
| `foot-newsletter` | Con newsletter | CSS |
| `foot-dark` | Oscuro | CSS |
| `foot-cta-band` | Con banda de CTA arriba | CSS |
| `foot-map` | Con mini mapa | CSS |
| `foot-social-big` | Redes en grande | CSS |
| `foot-two-col` | Marca a la izquierda, enlaces a la derecha | CSS |
| `foot-centered` | Todo centrado | CSS |
| `foot-accent` | Fondo de acento | CSS |
| `foot-three-col` | Tres columnas | CSS |
| `foot-logo-huge` | Logotipo gigante | CSS |
| `foot-legal-bar` | Solo barra legal | CSS |
| `foot-back-to-top` | Con botón volver arriba | JS |
| `foot-contact-card` | Tarjeta de contacto | CSS |
| `foot-hours` | Con horarios | CSS |
| `foot-gradient` | Degradado | CSS |
| `foot-badges` | Con sellos de confianza | CSS |
| `foot-app-links` | Con botones de app | CSS |
| `foot-lang` | Idioma y moneda | CSS |
| `foot-sitemap` | Mapa del sitio denso | CSS |
| `foot-signature` | Con firma del estudio | CSS |
| `foot-social-round` | Iconos sociales redondos | CSS |
| `foot-split-cta` | CTA partido a un lado | CSS |
| `foot-newsletter-inline` | Newsletter en línea | CSS |
| `foot-address-cols` | Direcciones en columnas | CSS |
| `foot-wave` | Con ola decorativa | CSS |
| `foot-accent-top` | Borde superior de acento | CSS |
| `foot-mini-center` | Mini centrado | CSS |
| `foot-link-cards` | Enlaces como tarjetas | CSS |
| `foot-map-full` | Mapa a todo el ancho | CSS |
| `foot-dark-accent` | Oscuro con acento | CSS |
| `foot-copyright-center` | Copyright centrado | CSS |
| `foot-three-part` | Logo · enlaces · redes | CSS |
| `foot-cta-arrow` | CTA con flecha | CSS |
| `foot-collapsible` | Columnas plegables (móvil) | JS |
| `foot-payment` | Iconos de pago | CSS |
| `foot-review-badge` | Con valoración de Google | CSS |
| `foot-whatsapp` | Con botón de WhatsApp | CSS |
| `foot-schedule` | Horario + CTA de reserva | CSS |
| `foot-brand-statement` | Declaración de marca | CSS |
| `foot-nav-inline` | Navegación en línea | CSS |
| `foot-social-count` | Redes con contador | CSS |
| `foot-newsletter-dark` | Newsletter oscura | CSS |
| `foot-locations` | Varias sedes | CSS |
| `foot-big-links` | Enlaces grandes | CSS |
| `foot-thin` | Finísimo | CSS |
| `foot-gradient-cta` | Degradado con CTA | CSS |
| `foot-map-contact` | Mapa + datos de contacto | CSS |
| `foot-heart` | Con corazón | CSS |

