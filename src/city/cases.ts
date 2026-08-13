/**
 * Casos por distrito — los "edificios" del nivel 2 y el contenido del nivel 3.
 *
 * Regla 1 del brief: en el nivel 2 un caso muestra solo su título (y, al
 * revelar, una línea). El texto largo — `deepDive` — vive SOLO en el nivel 3.
 *
 * Fase 1 puebla los dos distritos piloto (REEL, LUMI). El resto se completa en
 * Fase 2; `getCases` devuelve [] para ellos y la página lo maneja con gracia.
 *
 * Contenido placeholder hasta que lleguen los casos reales del portafolio.
 * Cuando existan en la BD (PortfolioProject), esta capa se reemplaza por una
 * consulta; la forma (title / tagline / deepDive) se mantiene.
 */

export interface CityCase {
  slug: string
  /** Título — lo único visible por defecto en el nivel 2. */
  title: string
  /** Una línea, se revela al hover/focus. Nivel 2. */
  tagline: string
  /** Métrica o resultado corto, para el objeto. */
  metric: string
  /** Texto largo — nivel 3, y solo aquí. Párrafos. */
  deepDive: string[]
}

const CASES: Record<string, CityCase[]> = {
  reel: [
    {
      slug: 'lanzamiento-cafe',
      title: 'Café de origen',
      tagline: 'Un reel que agotó el primer lote en 48 horas.',
      metric: 'Sold out en 48h',
      deepDive: [
        'Una tostadora local quería lanzar su primer café de origen sin presupuesto de gran marca. El reto no era hacer un video bonito, sino hacer que la gente sintiera el aroma a través de la pantalla.',
        'Grabamos el proceso completo —del grano verde a la taza— en una sola mañana, con luz natural y sonido real: el crujido del tueste, el goteo del filtro. Nada de música genérica; el audio del proceso era el gancho.',
        'El reel se publicó un jueves. Para el sábado, el primer lote estaba agotado y la tostadora tenía lista de espera para el segundo. La pieza siguió trayendo pedidos durante tres semanas más.',
      ],
    },
    {
      slug: 'serie-testimonios',
      title: 'Serie de testimonios',
      tagline: 'Clientes reales contando, sin guion, por qué vuelven.',
      metric: '6 piezas, +40% cierre',
      deepDive: [
        'Un estudio de fisioterapia tenía excelentes reseñas escritas que nadie leía. Las convertimos en una serie de seis testimonios en video, cortos y sin guion, grabados en el mismo consultorio.',
        'La clave fue no dirigir demasiado: dejamos que cada paciente contara su historia a su ritmo. La autenticidad hizo el trabajo que ningún eslogan podría.',
        'El equipo comercial empezó a mandar el video correspondiente a cada prospecto según su dolencia. La tasa de cierre de citas subió un 40% en dos meses.',
      ],
    },
    {
      slug: 'reel-producto',
      title: 'Reel de producto',
      tagline: 'Un solo plano, mil reproducciones al día.',
      metric: '1M+ views orgánicas',
      deepDive: [
        'Una marca de accesorios artesanales necesitaba mostrar el detalle de su trabajo sin caer en el video-catálogo aburrido. Apostamos por un solo plano continuo, muy cercano, con las manos trabajando.',
        'El movimiento hipnótico y el sonido del material hicieron que el algoritmo lo empujara solo. Superó el millón de reproducciones orgánicas sin un peso de pauta.',
        'Más allá de las vistas, el reel se volvió la carta de presentación de la marca: lo mandan por WhatsApp cada vez que alguien pregunta "¿y ustedes qué hacen?".',
      ],
    },
  ],
  lumi: [
    {
      slug: 'catalogo-producto',
      title: 'Catálogo de producto',
      tagline: 'Fotos que hicieron subir el ticket promedio.',
      metric: '+25% ticket promedio',
      deepDive: [
        'Una tienda de decoración vendía bien en local pero sus fotos online no le hacían justicia a los productos. Rehicimos el catálogo completo: 40 piezas, fondo neutro y luz que respeta la textura real.',
        'El objetivo no era "foto bonita" sino foto que vende: cada imagen pensada para que el cliente entienda tamaño, material y acabado sin tener que preguntar.',
        'Con el catálogo nuevo, el ticket promedio de la tienda online subió un 25%: la gente compraba piezas de mayor valor porque por fin podía apreciarlas.',
      ],
    },
    {
      slug: 'retrato-marca-personal',
      title: 'Retrato de marca personal',
      tagline: 'Una consultora que por fin se ve como la experta que es.',
      metric: '1 sesión, 1 año de contenido',
      deepDive: [
        'Una consultora independiente usaba selfies para su LinkedIn y sentía que no transmitía autoridad. Hicimos una sesión de retrato de marca personal: un solo día, varios cambios, distintos ambientes.',
        'Planeamos la sesión para que rindiera todo el año: fotos horizontales para portada, verticales para historias, planos con espacio para texto de campañas.',
        'De una sola sesión salió un banco de imágenes que le duró doce meses de contenido. Dejó de improvisar con selfies y su marca personal empezó a verse tan sólida como su trabajo.',
      ],
    },
  ],
  bass: [
    {
      slug: 'jingle-panaderia',
      title: 'Jingle de barrio',
      tagline: 'Cinco segundos que todo el barrio ya se sabe.',
      metric: 'Recordación instantánea',
      deepDive: [
        'Una panadería de barrio quería algo que sonara suyo en sus historias y en la radio local. No un temón: una firma corta, pegajosa, imposible de olvidar.',
        'Compusimos un jingle de cinco segundos a partir del nombre del local. Grabamos tres versiones —cantada, silbada e instrumental— para que sirviera en cualquier formato.',
        'A las pocas semanas los clientes entraban tarareándolo. Esa firma sonora hizo por la recordación de marca más que cualquier volante.',
      ],
    },
    {
      slug: 'podcast-emprendedor',
      title: 'Podcast de una PYME',
      tagline: 'De idea suelta a programa con episodios y audiencia.',
      metric: '12 episodios, audiencia fiel',
      deepDive: [
        'Un emprendedor tenía mucho que contar de su sector pero cero estructura para hacerlo. Montamos su podcast de punta a punta: formato, cortinillas, guía de grabación y post.',
        'Le armamos un flujo simple: él graba desde su oficina, nosotros editamos, limpiamos el audio y entregamos listo para publicar en todas las plataformas.',
        'Doce episodios después, el podcast se volvió su mejor herramienta de autoridad: prospectos que llegaban ya habiéndolo escuchado y confiando en él.',
      ],
    },
  ],
  brand: [
    {
      slug: 'rebranding-restaurante',
      title: 'Rebranding de restaurante',
      tagline: 'La misma cocina de siempre, por fin con la cara que merece.',
      metric: '+30% en reservas',
      deepDive: [
        'Un restaurante con años de trayectoria tenía una comida excelente y una imagen que parecía de otra época. El reto: modernizar sin perder el alma del lugar.',
        'Rehicimos logo, carta, señalética y redes con una identidad coherente que respetaba su historia pero hablaba el idioma de hoy. Todo salido de un mismo sistema.',
        'Con la marca renovada, las reservas subieron un 30% en el primer trimestre. La gente nueva por fin se atrevía a entrar, y los de siempre sintieron que su lugar seguía siendo suyo.',
      ],
    },
    {
      slug: 'identidad-emprendimiento',
      title: 'Identidad desde cero',
      tagline: 'Un emprendimiento que nació ya pareciendo marca grande.',
      metric: 'Marca lista en 2 semanas',
      deepDive: [
        'Una persona natural lanzaba su emprendimiento y no tenía nada: ni nombre definido, ni logo, ni norte visual. Empezamos por lo esencial sin inflar el presupuesto.',
        'Definimos nombre, logo, colores y tipografía en un paquete de arranque pensado para emprendedores. Lo justo para salir con dignidad y crecer después.',
        'En dos semanas tenía una marca que se veía seria desde el día uno. Nadie que la viera adivinaría que apenas estaba empezando.',
      ],
    },
  ],
  festa: [
    {
      slug: 'lanzamiento-producto',
      title: 'Lanzamiento de producto',
      tagline: 'Un evento que se sintió, y que siguió vivo en redes.',
      metric: '3x alcance esperado',
      deepDive: [
        'Una marca local lanzaba un producto y quería que el evento no muriera al cerrar las puertas. Producimos la experiencia completa: concepto, montaje, cobertura y contenido.',
        'Pensamos el evento como set de grabación: cada rincón diseñado para verse bien en cámara. Lo vivido en sala se convirtió en material para semanas de redes.',
        'El alcance en redes triplicó lo esperado. El evento duró una noche; el contenido que generó siguió trabajando durante más de un mes.',
      ],
    },
    {
      slug: 'cobertura-feria',
      title: 'Cobertura de feria',
      tagline: 'Un stand que se llenó gracias a lo que se publicaba en vivo.',
      metric: 'Contenido en vivo, 72h',
      deepDive: [
        'Un expositor en una feria comercial quería aprovechar los tres días al máximo. Montamos cobertura en vivo: foto y video con entregas el mismo día para publicar mientras la feria pasaba.',
        'Cada pieza salía a redes en cuestión de horas, invitando a la gente a pasar por el stand antes de que cerrara. El contenido trabajaba en tiempo real.',
        'El stand se llenó en los momentos clave gracias a ese empuje digital. Al terminar, el cliente tenía además un banco de material para todo el año.',
      ],
    },
  ],
  pixel: [
    {
      slug: 'tienda-online',
      title: 'Tienda que vende sola',
      tagline: 'De vender por DM a cobrar en automático mientras duerme.',
      metric: 'Primeras ventas en 1 semana',
      deepDive: [
        'Una emprendedora vendía todo por mensajes de Instagram y vivía pegada al celular. Le montamos una tienda online real: catálogo, pasarela de pago y despacho configurados.',
        'Priorizamos lo vital para una PYME: que cargue rápido, que se vea bien en el celular y que cobrar sea un clic, sin fricción para el comprador.',
        'La primera semana ya tenía ventas que se cerraban solas, sin que ella escribiera un mensaje. Recuperó tiempo y dejó de perder ventas por no contestar a tiempo.',
      ],
    },
    {
      slug: 'landing-servicios',
      title: 'Landing que convierte',
      tagline: 'Una página, un objetivo: que te escriban.',
      metric: '+3x contactos por WhatsApp',
      deepDive: [
        'Un profesional independiente tenía un perfil de redes pero ningún lugar serio a dónde mandar a sus prospectos. Le diseñamos una landing enfocada en una sola cosa: generar el contacto.',
        'Rápida, clara y con el botón de WhatsApp siempre a la mano. Sin menús que distraen ni texto de más: cada sección empuja hacia el mensaje.',
        'Los contactos por WhatsApp se triplicaron. Ahora tiene un lugar propio que trabaja por él, en vez de depender del algoritmo de una red social.',
      ],
    },
  ],
  arty: [
    {
      slug: 'ilustracion-empaque',
      title: 'Ilustración de empaque',
      tagline: 'Un empaque que la gente no bota: lo colecciona.',
      metric: 'Producto más fotografiado',
      deepDive: [
        'Una marca de producto artesanal quería que su empaque fuera parte de la experiencia, no solo una caja. Creamos una ilustración original que contaba la historia del producto.',
        'El arte se pensó para que funcionara en repisa, en la mano y en foto: detalles que invitan a mirar de cerca y a querer compartirlo.',
        'El empaque se volvió el producto más fotografiado de la marca. Los clientes lo publicaban solos: publicidad gratis hecha por la propia gente.',
      ],
    },
    {
      slug: 'direccion-campana',
      title: 'Dirección de campaña',
      tagline: 'Una campaña con un mundo visual propio, imposible de confundir.',
      metric: 'Identidad de campaña coherente',
      deepDive: [
        'Una PYME lanzaba una campaña de temporada y no quería que se viera genérica. Le dimos dirección de arte: un concepto visual propio que amarraba todas las piezas.',
        'De ese concepto salieron los colores, el estilo y el tono para redes, pauta y punto de venta. Todo distinto, todo reconociblemente de la misma campaña.',
        'La campaña se sintió como algo pensado, no improvisado. Ese mundo visual propio hizo que la marca se destacara en un feed lleno de competidores parecidos.',
      ],
    },
  ],
  muse: [
    {
      slug: 'estrategia-redes',
      title: 'Estrategia que ordenó el caos',
      tagline: 'De publicar por publicar a saber por qué cada post existe.',
      metric: '+50% interacción en 3 meses',
      deepDive: [
        'Una PYME publicaba sin rumbo: a veces mucho, a veces nada, sin saber qué funcionaba. Entramos a poner orden con una estrategia clara y un calendario realista.',
        'Definimos pilares de contenido, tono y frecuencia sostenible. Cada publicación pasó a tener un propósito: informar, conectar o vender, nunca rellenar.',
        'En tres meses la interacción subió un 50% publicando menos, pero mejor. El equipo dejó de vivir la ansiedad del "hay que subir algo" y empezó a ver resultados.',
      ],
    },
    {
      slug: 'plan-crecimiento',
      title: 'Plan de crecimiento por pasos',
      tagline: 'Una marca que creció al ritmo de su bolsillo, sin frenar.',
      metric: 'De Semilla a Escala en 6 meses',
      deepDive: [
        'Un emprendimiento quería crecer pero no podía comprometerse de golpe con un presupuesto grande. Le armamos un plan mensual por pasos, pensado para ir mejorando.',
        'Arrancó con lo vital —presencia constante en redes— y fue sumando pauta, SEO y video a medida que las ventas lo permitían. Cada paso financiaba el siguiente.',
        'En seis meses pasó del plan de arranque al de crecimiento, sin sobresaltos de caja. La marca creció al ritmo del negocio, no al revés.',
      ],
    },
  ],
}

export function getCases(districtSlug: string): CityCase[] {
  return CASES[districtSlug] ?? []
}

export function getCase(districtSlug: string, caseSlug: string): CityCase | undefined {
  return getCases(districtSlug).find((c) => c.slug === caseSlug)
}
