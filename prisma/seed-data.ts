import type { Category, ClientType, PackageType, BillingType, Audience } from '@prisma/client'

/**
 * Datos de seed, separados de la ejecución (seed.ts) para poder verificarlos
 * sin abrir conexión ni correr main(). Ver scripts/check-city-services.ts.
 *
 * Filosofía de precios (COP, mercado colombiano):
 * - Los `basePrice` de servicios son precios de ENTRADA ("desde") pensados
 *   para emprendedores, personas naturales y encargos pequeños. Accesibles y
 *   competitivos, no tarifas de gran agencia.
 * - Los paquetes construyen una escalera: micro-encargo emprendedor →
 *   planes mensuales mejorables (desarrollo de marca por pasos) → corporativo
 *   específico y contratos a largo plazo, reservado a grandes empresas.
 */

// ─── Servicios (22) — precios de entrada para emprendedores ───────────────
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
    descriptionEs: 'Video para tu negocio con producción cuidada, desde una pieza. Guion, rodaje y edición.',
    descriptionEn: 'A polished video for your business, from a single piece. Script, shoot, and edit.',
    basePrice: 750000, deliveryDays: 10,
    tags: ['video', 'produccion', 'comercial', 'emprendedor'],
  },
  {
    slug: 'contenido-redes', district: 'reel', category: 'MEDIA',
    nameEs: 'Contenido para Redes', nameEn: 'Social Media Content',
    descriptionEs: 'Reels y contenido visual listo para publicar, optimizado para cada plataforma.',
    descriptionEn: 'Reels and visual content ready to post, optimized for each platform.',
    basePrice: 320000, deliveryDays: 7,
    tags: ['reels', 'tiktok', 'instagram', 'contenido'],
  },
  {
    slug: 'reel-motion-graphics', district: 'reel', category: 'MEDIA',
    nameEs: 'Motion Graphics', nameEn: 'Motion Graphics',
    descriptionEs: 'Animación y gráficos en movimiento para explicar, presentar y vender.',
    descriptionEn: 'Animation and motion graphics to explain, present, and sell.',
    basePrice: 480000, deliveryDays: 12,
    tags: ['motion', 'animacion', 'aftereffects', 'explainer'],
  },

  // ── LUMI · fotografía y luz (3) ───────────────────────────────────────
  {
    slug: 'fotografia-corporativa', district: 'lumi', category: 'MEDIA',
    nameEs: 'Fotografía Corporativa', nameEn: 'Corporate Photography',
    descriptionEs: 'Sesión profesional para tu equipo, local o servicios. Ideal para arrancar tu presencia.',
    descriptionEn: 'Professional session for your team, venue, or services. Great to kick off your presence.',
    basePrice: 350000, deliveryDays: 5,
    tags: ['foto', 'corporativo', 'equipo', 'branding'],
  },
  {
    slug: 'fotografia-producto', district: 'lumi', category: 'MEDIA',
    nameEs: 'Fotografía de Producto', nameEn: 'Product Photography',
    descriptionEs: 'Fotos de producto para tu catálogo, tienda o redes. Por sesión, sin mínimos gigantes.',
    descriptionEn: 'Product shots for your catalog, shop, or socials. Per session, no huge minimums.',
    basePrice: 280000, deliveryDays: 4,
    tags: ['foto', 'producto', 'ecommerce', 'catalogo'],
  },
  {
    slug: 'lumi-retrato-lifestyle', district: 'lumi', category: 'MEDIA',
    nameEs: 'Retrato & Lifestyle', nameEn: 'Portrait & Lifestyle',
    descriptionEs: 'Retrato de marca personal y sesiones lifestyle para creadores y personas naturales.',
    descriptionEn: 'Personal-brand portraits and lifestyle sessions for creators and individuals.',
    basePrice: 320000, deliveryDays: 6,
    tags: ['retrato', 'lifestyle', 'marca-personal', 'creador'],
  },

  // ── BASS · audio y música (3) ─────────────────────────────────────────
  {
    slug: 'bass-produccion-musical', district: 'bass', category: 'MEDIA',
    nameEs: 'Producción Musical', nameEn: 'Music Production',
    descriptionEs: 'Composición, grabación y mezcla de música original para tu proyecto.',
    descriptionEn: 'Composition, recording, and mixing of original music for your project.',
    basePrice: 850000, deliveryDays: 20,
    tags: ['musica', 'produccion', 'mezcla', 'composicion'],
  },
  {
    slug: 'bass-branding-sonoro', district: 'bass', category: 'IDEATION',
    nameEs: 'Branding Sonoro', nameEn: 'Sonic Branding',
    descriptionEs: 'Identidad sonora: jingle corto, logo de audio y firma acústica de tu marca.',
    descriptionEn: 'Sonic identity: short jingle, audio logo, and your brand’s acoustic signature.',
    basePrice: 550000, deliveryDays: 15,
    tags: ['jingle', 'audio-logo', 'sonic-branding', 'marca'],
  },
  {
    slug: 'bass-podcast', district: 'bass', category: 'MEDIA',
    nameEs: 'Producción de Podcast', nameEn: 'Podcast Production',
    descriptionEs: 'Grabación, edición y post de podcast, listo para publicar en cada plataforma.',
    descriptionEn: 'Podcast recording, editing, and post, ready to publish on every platform.',
    basePrice: 450000, deliveryDays: 12,
    tags: ['podcast', 'audio', 'edicion', 'post'],
  },

  // ── BRAND · identidad de marca (3) ────────────────────────────────────
  {
    slug: 'branding-identidad', district: 'brand', category: 'IDEATION',
    nameEs: 'Branding & Identidad Visual', nameEn: 'Branding & Visual Identity',
    descriptionEs: 'Tu marca de arranque: logo, variaciones, colores y tipografía. Base sólida sin gastar de más.',
    descriptionEn: 'Your starter brand: logo, variations, colors, and type. A solid base without overspending.',
    basePrice: 650000, deliveryDays: 14,
    tags: ['branding', 'logo', 'identidad', 'emprendedor'],
  },
  {
    slug: 'naming-copywriting', district: 'brand', category: 'IDEATION',
    nameEs: 'Naming & Copywriting', nameEn: 'Naming & Copywriting',
    descriptionEs: 'Nombre de marca, eslogan y textos que conectan y venden.',
    descriptionEn: 'Brand name, slogan, and copy that connects and sells.',
    basePrice: 380000, deliveryDays: 10,
    tags: ['naming', 'copy', 'eslogan', 'textos'],
  },
  {
    slug: 'brand-manual-identidad', district: 'brand', category: 'IDEATION',
    nameEs: 'Manual de Marca', nameEn: 'Brand Guidelines',
    descriptionEs: 'Sistema de identidad documentado: reglas, aplicaciones y activos listos para usar.',
    descriptionEn: 'Documented identity system: rules, applications, and ready-to-use assets.',
    basePrice: 700000, deliveryDays: 18,
    tags: ['manual', 'guidelines', 'sistema', 'identidad'],
  },

  // ── FESTA · eventos y experiencias (2) ────────────────────────────────
  {
    slug: 'festa-cobertura', district: 'festa', category: 'MEDIA',
    nameEs: 'Cobertura de Evento', nameEn: 'Event Coverage',
    descriptionEs: 'Foto y video de tu evento, con entregas ágiles para redes. Por bloque de horas.',
    descriptionEn: 'Photo and video of your event, with fast social turnaround. Priced by hour block.',
    basePrice: 550000, deliveryDays: 7,
    tags: ['evento', 'cobertura', 'foto', 'video'],
  },
  {
    slug: 'festa-produccion-evento', district: 'festa', category: 'MEDIA',
    nameEs: 'Producción de Evento', nameEn: 'Event Production',
    descriptionEs: 'Producción integral: concepto, logística, escenografía y ejecución en sitio.',
    descriptionEn: 'End-to-end production: concept, logistics, staging, and on-site execution.',
    basePrice: 1800000, deliveryDays: 25,
    tags: ['evento', 'produccion', 'logistica', 'lanzamiento'],
  },

  // ── PIXEL · web y producto digital (3) ────────────────────────────────
  {
    slug: 'diseno-web', district: 'pixel', category: 'IDEATION',
    nameEs: 'Diseño Web', nameEn: 'Web Design',
    descriptionEs: 'Landing o sitio moderno, rápido y listo para vender. Desde una página bien hecha.',
    descriptionEn: 'A modern, fast, sales-ready landing or site. From one well-built page.',
    basePrice: 900000, deliveryDays: 20,
    tags: ['web', 'ux', 'ui', 'landing'],
  },
  {
    slug: 'seo-analitica', district: 'pixel', category: 'GROWTH',
    nameEs: 'SEO & Analítica Web', nameEn: 'SEO & Web Analytics',
    descriptionEs: 'Que te encuentren en Google: posicionamiento orgánico y reportes claros.',
    descriptionEn: 'Get found on Google: organic positioning and clear reports.',
    basePrice: 400000, deliveryDays: 30,
    tags: ['seo', 'google', 'analitica', 'posicionamiento'],
  },
  {
    slug: 'pixel-ecommerce', district: 'pixel', category: 'IDEATION',
    nameEs: 'Tienda Online', nameEn: 'E-commerce Build',
    descriptionEs: 'Tu tienda con pasarela de pago, catálogo y despacho configurados para vender ya.',
    descriptionEn: 'Your shop with payment gateway, catalog, and fulfilment configured to sell now.',
    basePrice: 1900000, deliveryDays: 35,
    tags: ['ecommerce', 'tienda', 'pagos', 'catalogo'],
  },

  // ── ARTY · arte e ilustración (2) ─────────────────────────────────────
  {
    slug: 'arty-ilustracion', district: 'arty', category: 'IDEATION',
    nameEs: 'Ilustración', nameEn: 'Illustration',
    descriptionEs: 'Ilustración original para campañas, empaques y piezas que se recuerdan.',
    descriptionEn: 'Original illustration for campaigns, packaging, and pieces that stick.',
    basePrice: 320000, deliveryDays: 10,
    tags: ['ilustracion', 'arte', 'campana', 'empaque'],
  },
  {
    slug: 'arty-direccion-arte', district: 'arty', category: 'IDEATION',
    nameEs: 'Dirección de Arte', nameEn: 'Art Direction',
    descriptionEs: 'Concepto visual y dirección de arte que le da un mundo propio a tu marca.',
    descriptionEn: 'Visual concept and art direction that gives your brand a world of its own.',
    basePrice: 600000, deliveryDays: 14,
    tags: ['direccion-arte', 'concepto', 'visual', 'campana'],
  },

  // ── MUSE · estrategia e ideas (3) — recurrentes, base de planes ────────
  {
    slug: 'gestion-redes', district: 'muse', category: 'GROWTH',
    nameEs: 'Gestión de Redes Sociales', nameEn: 'Social Media Management',
    descriptionEs: 'Manejamos tus redes con estrategia: contenido, comunidad y constancia. Precio mensual.',
    descriptionEn: 'We run your socials with strategy: content, community, and consistency. Monthly price.',
    basePrice: 450000, deliveryDays: 30,
    tags: ['redes', 'community', 'instagram', 'mensual'],
  },
  {
    slug: 'pauta-digital', district: 'muse', category: 'GROWTH',
    nameEs: 'Pauta Digital', nameEn: 'Digital Advertising',
    descriptionEs: 'Gestión de campañas en Meta y Google para que cada peso invertido rinda. Precio mensual.',
    descriptionEn: 'Meta and Google campaign management so every peso works. Monthly price.',
    basePrice: 350000, deliveryDays: 30,
    tags: ['ads', 'meta', 'google', 'pauta'],
  },
  {
    slug: 'email-marketing', district: 'muse', category: 'GROWTH',
    nameEs: 'Email Marketing', nameEn: 'Email Marketing',
    descriptionEs: 'Campañas de correo con diseño, automatización y analítica. Precio mensual.',
    descriptionEn: 'Email campaigns with design, automation, and analytics. Monthly price.',
    basePrice: 300000, deliveryDays: 14,
    tags: ['email', 'newsletter', 'automatizacion', 'mensual'],
  },
]

// ─── Paquetes y planes ─────────────────────────────────────────────────────
// Escalera comercial:
//   EMPRENDEDOR  micro-encargo único + plan mensual de arranque
//   PYME         planes mensuales que se van mejorando por pasos + eventos
//   CORPORATIVO  paquete grande específico + retainer con permanencia
//
// Precio:
//   ONE_TIME  totalPrice = suma de basePrice × (1 − descuento)
//   MONTHLY   monthlyPrice = suma mensual × (1 − descuento); totalPrice = igual
export interface PackageSeed {
  slug:             string
  nameEs:           string
  nameEn:           string
  descriptionEs:    string
  descriptionEn:    string
  type:             PackageType
  billing:          BillingType
  audience:         Audience
  tierStep:         number
  commitmentMonths: number | null
  discountPct:      number
  clientTypes:      ClientType[]
  isHighlighted:    boolean
  serviceSlugs:     string[]
  perksEs:          string[]
  perksEn:          string[]
}

export const PACKAGES: PackageSeed[] = [
  // ── EMPRENDEDOR · encargos únicos accesibles ──────────────────────────
  {
    slug: 'arranque-marca', type: 'starter', billing: 'ONE_TIME',
    audience: 'EMPRENDEDOR', tierStep: 1, commitmentMonths: null, discountPct: 0.10,
    nameEs: 'Arranque de Marca', nameEn: 'Brand Kickstart',
    descriptionEs: 'Tu marca lista para salir: identidad + contenido para tus primeras publicaciones.',
    descriptionEn: 'Your brand ready to launch: identity + content for your first posts.',
    clientTypes: ['brand', 'creator'], isHighlighted: false,
    serviceSlugs: ['branding-identidad', 'contenido-redes'],
    perksEs: ['Logo + variaciones', 'Pack de 10 plantillas para redes', '2 rondas de ajustes', 'Atención por WhatsApp'],
    perksEn: ['Logo + variations', '10 social templates pack', '2 revision rounds', 'WhatsApp support'],
  },
  {
    slug: 'presencia-express', type: 'starter', billing: 'ONE_TIME',
    audience: 'EMPRENDEDOR', tierStep: 2, commitmentMonths: null, discountPct: 0.12,
    nameEs: 'Presencia Express', nameEn: 'Express Presence',
    descriptionEs: 'Sal a internet ya: landing, fotos de tu producto y contenido para arrancar.',
    descriptionEn: 'Get online now: landing page, product photos, and content to start.',
    clientTypes: ['brand', 'creator'], isHighlighted: true,
    serviceSlugs: ['diseno-web', 'fotografia-producto', 'contenido-redes'],
    perksEs: ['Landing responsive', 'WhatsApp integrado', 'Orientación de hosting y dominio', '2 rondas de ajustes'],
    perksEn: ['Responsive landing', 'WhatsApp integrated', 'Hosting & domain guidance', '2 revision rounds'],
  },

  // ── EMPRENDEDOR → PYME · escalera mensual de desarrollo de marca ───────
  {
    slug: 'plan-semilla', type: 'starter', billing: 'MONTHLY',
    audience: 'EMPRENDEDOR', tierStep: 1, commitmentMonths: 3, discountPct: 0.15,
    nameEs: 'Plan Semilla', nameEn: 'Seed Plan',
    descriptionEs: 'El primer paso mensual: presencia constante en redes sin complicarte. Mejorable cuando crezcas.',
    descriptionEn: 'The first monthly step: steady social presence, no hassle. Upgradeable as you grow.',
    clientTypes: ['brand', 'creator'], isHighlighted: false,
    serviceSlugs: ['gestion-redes', 'contenido-redes'],
    perksEs: ['8 publicaciones al mes', '1 reporte mensual', '1 ronda de ajustes', 'Permanencia mínima 3 meses'],
    perksEn: ['8 posts per month', '1 monthly report', '1 revision round', '3-month minimum term'],
  },
  {
    slug: 'plan-despegue', type: 'pro', billing: 'MONTHLY',
    audience: 'PYME', tierStep: 2, commitmentMonths: 3, discountPct: 0.18,
    nameEs: 'Plan Despegue', nameEn: 'Liftoff Plan',
    descriptionEs: 'El siguiente paso: sumamos pauta para que llegues a más gente y vendas más.',
    descriptionEn: 'The next step: we add paid ads so you reach more people and sell more.',
    clientTypes: ['brand'], isHighlighted: true,
    serviceSlugs: ['gestion-redes', 'contenido-redes', 'pauta-digital'],
    perksEs: ['12 publicaciones al mes', 'Gestión de pauta incluida', 'Reporte quincenal', 'Reunión mensual'],
    perksEn: ['12 posts per month', 'Ad management included', 'Biweekly report', 'Monthly meeting'],
  },
  {
    slug: 'plan-escala', type: 'pro', billing: 'MONTHLY',
    audience: 'PYME', tierStep: 3, commitmentMonths: 6, discountPct: 0.20,
    nameEs: 'Plan Escala', nameEn: 'Scale Plan',
    descriptionEs: 'La marca en modo crecimiento: redes, pauta, SEO, email y un video corto cada mes.',
    descriptionEn: 'Your brand in growth mode: social, ads, SEO, email, and a short video each month.',
    clientTypes: ['brand'], isHighlighted: false,
    serviceSlugs: ['gestion-redes', 'contenido-redes', 'pauta-digital', 'seo-analitica', 'email-marketing'],
    perksEs: ['16 publicaciones al mes', 'SEO + email incluidos', '1 video corto mensual', 'Reunión estratégica mensual', 'Permanencia mínima 6 meses'],
    perksEn: ['16 posts per month', 'SEO + email included', '1 short video monthly', 'Monthly strategy meeting', '6-month minimum term'],
  },

  // ── PYME · encargo único de eventos ───────────────────────────────────
  {
    slug: 'evento-360', type: 'pro', billing: 'ONE_TIME',
    audience: 'PYME', tierStep: 2, commitmentMonths: null, discountPct: 0.15,
    nameEs: 'Evento 360', nameEn: 'Event 360',
    descriptionEs: 'Tu evento de punta a punta: producción, cobertura y contenido para después.',
    descriptionEn: 'Your event end to end: production, coverage, and content for afterward.',
    clientTypes: ['event'], isHighlighted: false,
    serviceSlugs: ['festa-produccion-evento', 'festa-cobertura', 'contenido-redes'],
    perksEs: ['Cobertura foto + video', 'Resumen para redes en 72h', 'Producción y logística en sitio'],
    perksEn: ['Photo + video coverage', 'Social recap in 72h', 'On-site production and logistics'],
  },

  // ── CORPORATIVO · específico, solo para grandes empresas ──────────────
  {
    slug: 'marca-corporativa-360', type: 'enterprise', billing: 'ONE_TIME',
    audience: 'CORPORATIVO', tierStep: 3, commitmentMonths: null, discountPct: 0.15,
    nameEs: 'Marca Corporativa 360', nameEn: 'Corporate Brand 360',
    descriptionEs: 'Para grandes compañías: identidad completa, manual, sitio, tienda, video y firma sonora, con gerente de cuenta.',
    descriptionEn: 'For large companies: full identity, guidelines, site, store, video, and sonic signature, with an account manager.',
    clientTypes: ['brand'], isHighlighted: true,
    serviceSlugs: ['branding-identidad', 'brand-manual-identidad', 'diseno-web', 'pixel-ecommerce', 'video-produccion', 'bass-branding-sonoro'],
    perksEs: ['Gerente de cuenta dedicado', 'Manual de marca completo', 'Soporte post-entrega 60 días', 'Cronograma por hitos'],
    perksEn: ['Dedicated account manager', 'Full brand guidelines', '60-day post-delivery support', 'Milestone schedule'],
  },
  {
    slug: 'retainer-corporativo', type: 'enterprise', billing: 'MONTHLY',
    audience: 'CORPORATIVO', tierStep: 3, commitmentMonths: 12, discountPct: 0.22,
    nameEs: 'Retainer Corporativo', nameEn: 'Corporate Retainer',
    descriptionEs: 'Contrato a largo plazo para grandes empresas: equipo dedicado que opera toda tu presencia mes a mes.',
    descriptionEn: 'Long-term contract for large companies: a dedicated team running your whole presence month to month.',
    clientTypes: ['brand'], isHighlighted: false,
    serviceSlugs: ['gestion-redes', 'contenido-redes', 'pauta-digital', 'seo-analitica', 'email-marketing', 'video-produccion'],
    perksEs: ['Equipo dedicado', 'Reporte semanal', 'Consultor senior', 'Pauta gestionada', 'SLA de respuesta', 'Permanencia 12 meses'],
    perksEn: ['Dedicated team', 'Weekly report', 'Senior consultant', 'Managed ad spend', 'Response SLA', '12-month term'],
  },
]
