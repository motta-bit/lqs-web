/**
 * The 8 districts of La Ciudad del Pato.
 *
 * Single source of truth for the hub, the district pages, the DOM copy layer
 * and the grey-box scene. Nothing about a district is defined anywhere else.
 *
 * Copy is Spanish and comes verbatim from the report's proposed microcopy — it
 * is not to be rewritten. Code and identifiers stay in English.
 *
 * Text rule (brief rule 1): `phrase` is the ONLY prose a district shows at
 * level 2. One sentence. Long text lives at level 3 and nowhere else.
 */

export type DistrictAccent = 'orange' | 'teal' | 'blue'

export interface District {
  /** URL segment. Stable — it is a public route. */
  slug: string
  /** Mascot name, display uppercase. */
  name: string
  /** The one sentence allowed at level 2. From the report. */
  phrase: string
  /** What the mascot sells, in plain Spanish. Used for aria-labels and meta. */
  domain: string
  accent: DistrictAccent
  /**
   * Position on the city plane. The 8 districts sit on an octagon around the
   * Ayuntamiento at the origin — legible from the overhead hub camera and
   * cheap to lay out procedurally.
   */
  position: readonly [x: number, z: number]
  /** Grey-box massing: relative footprint and height of the district block. */
  massing: { footprint: number; height: number }
  /**
   * Service slugs from the Prisma seed. Empty means the district has nothing
   * to sell yet — see the risk noted in PLAN.md §3.
   */
  services: readonly string[]
}

/** Accent hex, resolved from the brand palette. No colours outside these three.
 *  Para RELLENOS y titulares GRANDES (umbral WCAG 3:1). */
export const ACCENT_HEX: Record<DistrictAccent, string> = {
  orange: '#FF4600',
  teal: '#008080',
  blue: '#0055FF',
}

/**
 * Variantes accesibles para TEXTO PEQUEÑO sobre negro (umbral WCAG 4.5:1).
 * El teal y el azul de marca fallan como texto chico (4.4:1 y 3.4:1); estas
 * versiones aclaradas pasan (~7:1 y ~5.4:1) manteniendo el tono. El naranja
 * ya pasa, se conserva idéntico. Los colores de marca reales siguen en
 * ACCENT_HEX para rellenos y display grande.
 */
export const ACCENT_TEXT_HEX: Record<DistrictAccent, string> = {
  orange: '#FF4600',
  teal: '#00A8A8',
  blue: '#4477FF',
}

const RADIUS = 12

/** Octagon vertex for index i of 8, starting north and going clockwise. */
function octagon(i: number): readonly [number, number] {
  const angle = (i / 8) * Math.PI * 2 - Math.PI / 2
  return [
    Math.round(Math.cos(angle) * RADIUS * 100) / 100,
    Math.round(Math.sin(angle) * RADIUS * 100) / 100,
  ] as const
}

export const DISTRICTS: readonly District[] = [
  {
    slug: 'reel',
    name: 'REEL',
    phrase: 'Lo tuyo en movimiento.',
    domain: 'Video y contenido audiovisual',
    accent: 'orange',
    position: octagon(0),
    massing: { footprint: 4.2, height: 3.4 },
    services: ['video-produccion', 'contenido-redes', 'reel-motion-graphics'],
  },
  {
    slug: 'lumi',
    name: 'LUMI',
    phrase: 'Que se vea bien.',
    domain: 'Fotografía y luz',
    accent: 'teal',
    position: octagon(1),
    massing: { footprint: 3.6, height: 2.6 },
    services: ['fotografia-corporativa', 'fotografia-producto', 'lumi-retrato-lifestyle'],
  },
  {
    slug: 'bass',
    name: 'BASS',
    phrase: 'Que suene.',
    domain: 'Audio y música',
    accent: 'blue',
    position: octagon(2),
    massing: { footprint: 3.2, height: 4.8 },
    services: ['bass-produccion-musical', 'bass-branding-sonoro', 'bass-podcast'],
  },
  {
    slug: 'brand',
    name: 'BRAND',
    phrase: 'Que se reconozca.',
    domain: 'Identidad de marca',
    accent: 'orange',
    position: octagon(3),
    massing: { footprint: 4.6, height: 2.2 },
    services: ['branding-identidad', 'naming-copywriting', 'brand-manual-identidad'],
  },
  {
    slug: 'festa',
    name: 'FESTA',
    phrase: 'Que se sienta.',
    domain: 'Eventos y experiencias',
    accent: 'orange',
    position: octagon(4),
    massing: { footprint: 5.0, height: 1.8 },
    services: ['festa-cobertura', 'festa-produccion-evento'],
  },
  {
    slug: 'pixel',
    name: 'PIXEL',
    phrase: 'Que funcione.',
    domain: 'Web y producto digital',
    accent: 'blue',
    position: octagon(5),
    massing: { footprint: 3.8, height: 4.2 },
    services: ['diseno-web', 'seo-analitica', 'pixel-ecommerce'],
  },
  {
    slug: 'arty',
    name: 'ARTY',
    phrase: 'Que sorprenda.',
    domain: 'Arte e ilustración',
    accent: 'teal',
    position: octagon(6),
    massing: { footprint: 3.4, height: 3.0 },
    services: ['arty-ilustracion', 'arty-direccion-arte'],
  },
  {
    slug: 'muse',
    name: 'MUSE',
    phrase: 'De dónde sale todo.',
    domain: 'Estrategia e ideas',
    accent: 'blue',
    position: octagon(7),
    massing: { footprint: 4.0, height: 5.2 },
    services: ['gestion-redes', 'pauta-digital', 'email-marketing'],
  },
] as const

export function getDistrict(slug: string): District | undefined {
  return DISTRICTS.find((d) => d.slug === slug)
}

/** Districts with nothing to sell yet. Surfaced so Phase 3 cannot forget them. */
export const DISTRICTS_WITHOUT_SERVICES = DISTRICTS.filter((d) => d.services.length === 0)

/** Site copy that is not district-specific. Spanish, from the report. */
export const CITY_COPY = {
  preloader: 'Cargando lo que sea...',
  hubInvite: 'Métete. Explora la ciudad.',
  duckCTA: '¿Te late? El pato te arma algo.',
  quoterIntro: 'Cuéntame qué necesitas. Sin vueltas.',
  leadClose: 'Dejá por dónde te escribimos.',
} as const
