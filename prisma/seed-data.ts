import type { Category, ClientType, PackageType } from '@prisma/client'

/**
 * Datos de seed, separados de la ejecución (seed.ts) para que puedan
 * verificarse sin abrir una conexión ni correr `main()`.
 * Ver scripts/check-city-services.ts.
 */

// ─── Servicios (22) ──────────────────────────────────────────────────────
// Data-driven a propósito: cuando lleguen las mascotas definitivas, cambiar
// una asignación es editar el campo `district` de una fila. `district` es la
// clave del vínculo con src/city/districts.ts.
export interface ServiceSeed {
  slug:          string
  nameEs:        string
  nameEn:        string
  descriptionEs: string
  descriptionEn: string
  category:      Category
  district:      string
  basePrice:     number
  deliveryDays:  number
  tags:          string[]
}

export const SERVICES: ServiceSeed[] = [
  // ── REEL · video y contenido audiovisual (3) ──────────────────────────
  {
    slug: 'video-produccion', district: 'reel', category: 'MEDIA',
    nameEs: 'Video Producción', nameEn: 'Video Production',
    descriptionEs: 'Videos institucionales, comerciales y de producto con producción completa.',
    descriptionEn: 'Institutional, commercial, and product videos with full production.',
    basePrice: 2000000, deliveryDays: 10,
    tags: ['video', 'produccion', 'comercial', 'institucional'],
  },
  {
    slug: 'contenido-redes', district: 'reel', category: 'MEDIA',
    nameEs: 'Contenido para Redes', nameEn: 'Social Media Content',
    descriptionEs: 'Reels, TikToks y contenido visual optimizado para cada plataforma.',
    descriptionEn: 'Reels, TikToks, and visual content optimized for each platform.',
    basePrice: 1200000, deliveryDays: 7,
    tags: ['reels', 'tiktok', 'instagram', 'contenido'],
  },
  {
    slug: 'reel-motion-graphics', district: 'reel', category: 'MEDIA',
    nameEs: 'Motion Graphics', nameEn: 'Motion Graphics',
    descriptionEs: 'Animación y gráficos en movimiento para explicar, presentar y vender.',
    descriptionEn: 'Animation and motion graphics to explain, present, and sell.',
    basePrice: 1800000, deliveryDays: 12,
    tags: ['motion', 'animacion', 'aftereffects', 'explainer'],
  },

  // ── LUMI · fotografía y luz (3) ───────────────────────────────────────
  {
    slug: 'fotografia-corporativa', district: 'lumi', category: 'MEDIA',
    nameEs: 'Fotografía Corporativa', nameEn: 'Corporate Photography',
    descriptionEs: 'Sesiones fotográficas profesionales para tu equipo, oficinas y productos.',
    descriptionEn: 'Professional photo sessions for your team, offices, and products.',
    basePrice: 800000, deliveryDays: 5,
    tags: ['foto', 'corporativo', 'equipo', 'branding'],
  },
  {
    slug: 'fotografia-producto', district: 'lumi', category: 'MEDIA',
    nameEs: 'Fotografía de Producto', nameEn: 'Product Photography',
    descriptionEs: 'Fotografía especializada para e-commerce y catálogos de producto.',
    descriptionEn: 'Specialized photography for e-commerce and product catalogs.',
    basePrice: 600000, deliveryDays: 4,
    tags: ['foto', 'producto', 'ecommerce', 'catalogo'],
  },
  {
    slug: 'lumi-retrato-lifestyle', district: 'lumi', category: 'MEDIA',
    nameEs: 'Retrato & Lifestyle', nameEn: 'Portrait & Lifestyle',
    descriptionEs: 'Retrato de marca personal y sesiones lifestyle para creadores y equipos.',
    descriptionEn: 'Personal-brand portraits and lifestyle sessions for creators and teams.',
    basePrice: 900000, deliveryDays: 6,
    tags: ['retrato', 'lifestyle', 'marca-personal', 'creador'],
  },

  // ── BASS · audio y música (3) ─────────────────────────────────────────
  {
    slug: 'bass-produccion-musical', district: 'bass', category: 'MEDIA',
    nameEs: 'Producción Musical', nameEn: 'Music Production',
    descriptionEs: 'Composición, grabación y mezcla de música original para tu proyecto.',
    descriptionEn: 'Composition, recording, and mixing of original music for your project.',
    basePrice: 2500000, deliveryDays: 20,
    tags: ['musica', 'produccion', 'mezcla', 'composicion'],
  },
  {
    slug: 'bass-branding-sonoro', district: 'bass', category: 'IDEATION',
    nameEs: 'Branding Sonoro', nameEn: 'Sonic Branding',
    descriptionEs: 'Identidad sonora: jingle, logo de audio y firma acústica de tu marca.',
    descriptionEn: 'Sonic identity: jingle, audio logo, and your brand’s acoustic signature.',
    basePrice: 1600000, deliveryDays: 15,
    tags: ['jingle', 'audio-logo', 'sonic-branding', 'marca'],
  },
  {
    slug: 'bass-podcast', district: 'bass', category: 'MEDIA',
    nameEs: 'Producción de Podcast', nameEn: 'Podcast Production',
    descriptionEs: 'Grabación, edición y post de podcast, listo para publicar en cada plataforma.',
    descriptionEn: 'Podcast recording, editing, and post, ready to publish on every platform.',
    basePrice: 1400000, deliveryDays: 12,
    tags: ['podcast', 'audio', 'edicion', 'post'],
  },

  // ── BRAND · identidad de marca (3) ────────────────────────────────────
  {
    slug: 'branding-identidad', district: 'brand', category: 'IDEATION',
    nameEs: 'Branding & Identidad Visual', nameEn: 'Branding & Visual Identity',
    descriptionEs: 'Construcción de marca: logo, paleta, tipografía, manual de uso y más.',
    descriptionEn: 'Brand building: logo, palette, typography, usage manual, and more.',
    basePrice: 3000000, deliveryDays: 21,
    tags: ['branding', 'logo', 'identidad', 'manual', 'marca'],
  },
  {
    slug: 'naming-copywriting', district: 'brand', category: 'IDEATION',
    nameEs: 'Naming & Copywriting', nameEn: 'Naming & Copywriting',
    descriptionEs: 'Creación de nombre de marca, eslogan y textos estratégicos que conectan.',
    descriptionEn: 'Brand name creation, slogan, and strategic texts that connect.',
    basePrice: 1500000, deliveryDays: 14,
    tags: ['naming', 'copy', 'eslogan', 'textos', 'estrategia'],
  },
  {
    slug: 'brand-manual-identidad', district: 'brand', category: 'IDEATION',
    nameEs: 'Manual de Marca', nameEn: 'Brand Guidelines',
    descriptionEs: 'Sistema de identidad documentado: reglas, aplicaciones y activos listos para usar.',
    descriptionEn: 'Documented identity system: rules, applications, and ready-to-use assets.',
    basePrice: 2200000, deliveryDays: 18,
    tags: ['manual', 'guidelines', 'sistema', 'identidad'],
  },

  // ── FESTA · eventos y experiencias (2) ────────────────────────────────
  {
    slug: 'festa-cobertura', district: 'festa', category: 'MEDIA',
    nameEs: 'Cobertura de Evento', nameEn: 'Event Coverage',
    descriptionEs: 'Foto y video en vivo de tu evento, con entregas ágiles para redes.',
    descriptionEn: 'Live photo and video of your event, with fast turnaround for social.',
    basePrice: 1800000, deliveryDays: 7,
    tags: ['evento', 'cobertura', 'foto', 'video', 'vivo'],
  },
  {
    slug: 'festa-produccion-evento', district: 'festa', category: 'MEDIA',
    nameEs: 'Producción de Evento', nameEn: 'Event Production',
    descriptionEs: 'Producción integral: concepto, logística, escenografía y ejecución en sitio.',
    descriptionEn: 'End-to-end production: concept, logistics, staging, and on-site execution.',
    basePrice: 4500000, deliveryDays: 25,
    tags: ['evento', 'produccion', 'logistica', 'lanzamiento'],
  },

  // ── PIXEL · web y producto digital (3) ────────────────────────────────
  {
    slug: 'diseno-web', district: 'pixel', category: 'IDEATION',
    nameEs: 'Diseño Web', nameEn: 'Web Design',
    descriptionEs: 'Diseño UX/UI de sitios web modernos, rápidos y orientados a conversión.',
    descriptionEn: 'UX/UI design of modern, fast, and conversion-focused websites.',
    basePrice: 4000000, deliveryDays: 30,
    tags: ['web', 'ux', 'ui', 'diseño', 'landing'],
  },
  {
    slug: 'seo-analitica', district: 'pixel', category: 'GROWTH',
    nameEs: 'SEO & Analítica Web', nameEn: 'SEO & Web Analytics',
    descriptionEs: 'Posicionamiento orgánico en buscadores y reportes de analítica mensual.',
    descriptionEn: 'Organic search engine positioning and monthly analytics reports.',
    basePrice: 1200000, deliveryDays: 30,
    tags: ['seo', 'google', 'analitica', 'posicionamiento'],
  },
  {
    slug: 'pixel-ecommerce', district: 'pixel', category: 'IDEATION',
    nameEs: 'Tienda Online', nameEn: 'E-commerce Build',
    descriptionEs: 'Montaje de e-commerce con pasarela de pago, catálogo y despacho configurados.',
    descriptionEn: 'E-commerce build with payment gateway, catalog, and fulfilment configured.',
    basePrice: 5500000, deliveryDays: 35,
    tags: ['ecommerce', 'tienda', 'pagos', 'catalogo'],
  },

  // ── ARTY · arte e ilustración (2) ─────────────────────────────────────
  {
    slug: 'arty-ilustracion', district: 'arty', category: 'IDEATION',
    nameEs: 'Ilustración', nameEn: 'Illustration',
    descriptionEs: 'Ilustración original para campañas, empaques y piezas que se recuerdan.',
    descriptionEn: 'Original illustration for campaigns, packaging, and pieces that stick.',
    basePrice: 1300000, deliveryDays: 10,
    tags: ['ilustracion', 'arte', 'campana', 'empaque'],
  },
  {
    slug: 'arty-direccion-arte', district: 'arty', category: 'IDEATION',
    nameEs: 'Dirección de Arte', nameEn: 'Art Direction',
    descriptionEs: 'Concepto visual y dirección de arte que le da un mundo propio a tu marca.',
    descriptionEn: 'Visual concept and art direction that gives your brand a world of its own.',
    basePrice: 2000000, deliveryDays: 14,
    tags: ['direccion-arte', 'concepto', 'visual', 'campana'],
  },

  // ── MUSE · estrategia e ideas (3) ─────────────────────────────────────
  {
    slug: 'gestion-redes', district: 'muse', category: 'GROWTH',
    nameEs: 'Gestión de Redes Sociales', nameEn: 'Social Media Management',
    descriptionEs: 'Administración mensual de Instagram, Facebook y TikTok con estrategia.',
    descriptionEn: 'Monthly management of Instagram, Facebook, and TikTok with strategy.',
    basePrice: 1500000, deliveryDays: 30,
    tags: ['redes', 'community', 'instagram', 'facebook', 'tiktok'],
  },
  {
    slug: 'pauta-digital', district: 'muse', category: 'GROWTH',
    nameEs: 'Pauta Digital', nameEn: 'Digital Advertising',
    descriptionEs: 'Gestión y optimización de campañas en Meta Ads y Google Ads.',
    descriptionEn: 'Management and optimization of Meta Ads and Google Ads campaigns.',
    basePrice: 1000000, deliveryDays: 30,
    tags: ['ads', 'meta', 'google', 'pauta', 'publicidad'],
  },
  {
    slug: 'email-marketing', district: 'muse', category: 'GROWTH',
    nameEs: 'Email Marketing', nameEn: 'Email Marketing',
    descriptionEs: 'Campañas de correo electrónico con diseño, automatización y analítica.',
    descriptionEn: 'Email campaigns with design, automation, and analytics.',
    basePrice: 800000, deliveryDays: 14,
    tags: ['email', 'newsletter', 'automatizacion', 'campanas'],
  },
]

// ─── Paquetes (4) ─────────────────────────────────────────────────────────
// totalPrice = suma de basePrice de sus servicios × (1 − discountPct).
// El descuento se refleja en el precio; no hay catálogo: el precio solo
// aparece al final del cotizador (regla 2 del brief).
export interface PackageSeed {
  slug:          string
  nameEs:        string
  nameEn:        string
  descriptionEs: string
  descriptionEn: string
  type:          PackageType
  discountPct:   number
  clientTypes:   ClientType[]
  isHighlighted: boolean
  serviceSlugs:  string[]
}

export const PACKAGES: PackageSeed[] = [
  {
    slug: 'chispa', type: 'starter', discountPct: 0.10,
    nameEs: 'Chispa', nameEn: 'Spark',
    descriptionEs: 'El arranque: presencia en redes, contenido y producto listos para mostrar.',
    descriptionEn: 'The kickoff: social presence, content, and product ready to show.',
    clientTypes: ['brand', 'creator'], isHighlighted: false,
    serviceSlugs: ['contenido-redes', 'gestion-redes', 'fotografia-producto'],
  },
  {
    slug: 'marca-completa', type: 'pro', discountPct: 0.15,
    nameEs: 'Marca Completa', nameEn: 'Full Brand',
    descriptionEs: 'De cero a marca: identidad, manual, web y gestión, todo hablando el mismo idioma.',
    descriptionEn: 'From zero to brand: identity, guidelines, web, and management, all in one voice.',
    clientTypes: ['brand'], isHighlighted: true,
    serviceSlugs: ['branding-identidad', 'brand-manual-identidad', 'diseno-web', 'gestion-redes'],
  },
  {
    slug: 'evento-360', type: 'pro', discountPct: 0.15,
    nameEs: 'Evento 360', nameEn: 'Event 360',
    descriptionEs: 'Tu evento de punta a punta: producción, cobertura y contenido para después.',
    descriptionEn: 'Your event end to end: production, coverage, and content for afterward.',
    clientTypes: ['event'], isHighlighted: false,
    serviceSlugs: ['festa-produccion-evento', 'festa-cobertura', 'video-produccion', 'contenido-redes'],
  },
  {
    slug: 'todo-terreno', type: 'enterprise', discountPct: 0.20,
    nameEs: 'Todo Terreno', nameEn: 'All Terrain',
    descriptionEs: 'La operación completa: marca, web, video, sonido y crecimiento, un solo equipo.',
    descriptionEn: 'The full operation: brand, web, video, sound, and growth, one single team.',
    clientTypes: ['brand'], isHighlighted: true,
    serviceSlugs: [
      'branding-identidad', 'diseno-web', 'video-produccion',
      'gestion-redes', 'pauta-digital', 'bass-branding-sonoro',
    ],
  },
]
