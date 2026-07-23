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
}

export function getCases(districtSlug: string): CityCase[] {
  return CASES[districtSlug] ?? []
}

export function getCase(districtSlug: string, caseSlug: string): CityCase | undefined {
  return getCases(districtSlug).find((c) => c.slug === caseSlug)
}
