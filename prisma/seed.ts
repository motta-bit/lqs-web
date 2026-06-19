import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma  = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed de LQS...')

  // ─── Servicios (11) ───────────────────────────────────────────────
  const services = await Promise.all([
    // MEDIA (4)
    prisma.service.upsert({
      where:  { slug: 'fotografia-corporativa' },
      update: {},
      create: {
        slug:          'fotografia-corporativa',
        nameEs:        'Fotografía Corporativa',
        nameEn:        'Corporate Photography',
        descriptionEs: 'Sesiones fotográficas profesionales para tu equipo, oficinas y productos.',
        descriptionEn: 'Professional photo sessions for your team, offices, and products.',
        category:      'MEDIA',
        basePrice:     800000,
        deliveryDays:  5,
        tags:          ['foto', 'corporativo', 'equipo', 'branding'],
      },
    }),
    prisma.service.upsert({
      where:  { slug: 'video-produccion' },
      update: {},
      create: {
        slug:          'video-produccion',
        nameEs:        'Video Producción',
        nameEn:        'Video Production',
        descriptionEs: 'Videos institucionales, comerciales y de producto con producción completa.',
        descriptionEn: 'Institutional, commercial, and product videos with full production.',
        category:      'MEDIA',
        basePrice:     2000000,
        deliveryDays:  10,
        tags:          ['video', 'produccion', 'comercial', 'institucional'],
      },
    }),
    prisma.service.upsert({
      where:  { slug: 'contenido-redes' },
      update: {},
      create: {
        slug:          'contenido-redes',
        nameEs:        'Contenido para Redes',
        nameEn:        'Social Media Content',
        descriptionEs: 'Reels, TikToks y contenido visual optimizado para cada plataforma.',
        descriptionEn: 'Reels, TikToks, and visual content optimized for each platform.',
        category:      'MEDIA',
        basePrice:     1200000,
        deliveryDays:  7,
        tags:          ['reels', 'tiktok', 'instagram', 'contenido'],
      },
    }),
    prisma.service.upsert({
      where:  { slug: 'fotografia-producto' },
      update: {},
      create: {
        slug:          'fotografia-producto',
        nameEs:        'Fotografía de Producto',
        nameEn:        'Product Photography',
        descriptionEs: 'Fotografía especializada para e-commerce y catálogos de producto.',
        descriptionEn: 'Specialized photography for e-commerce and product catalogs.',
        category:      'MEDIA',
        basePrice:     600000,
        deliveryDays:  4,
        tags:          ['foto', 'producto', 'ecommerce', 'catalogo'],
      },
    }),
    // GROWTH (4)
    prisma.service.upsert({
      where:  { slug: 'gestion-redes' },
      update: {},
      create: {
        slug:          'gestion-redes',
        nameEs:        'Gestión de Redes Sociales',
        nameEn:        'Social Media Management',
        descriptionEs: 'Administración mensual de Instagram, Facebook y TikTok con estrategia.',
        descriptionEn: 'Monthly management of Instagram, Facebook, and TikTok with strategy.',
        category:      'GROWTH',
        basePrice:     1500000,
        deliveryDays:  30,
        tags:          ['redes', 'community', 'instagram', 'facebook', 'tiktok'],
      },
    }),
    prisma.service.upsert({
      where:  { slug: 'pauta-digital' },
      update: {},
      create: {
        slug:          'pauta-digital',
        nameEs:        'Pauta Digital',
        nameEn:        'Digital Advertising',
        descriptionEs: 'Gestión y optimización de campañas en Meta Ads y Google Ads.',
        descriptionEn: 'Management and optimization of Meta Ads and Google Ads campaigns.',
        category:      'GROWTH',
        basePrice:     1000000,
        deliveryDays:  30,
        tags:          ['ads', 'meta', 'google', 'pauta', 'publicidad'],
      },
    }),
    prisma.service.upsert({
      where:  { slug: 'email-marketing' },
      update: {},
      create: {
        slug:          'email-marketing',
        nameEs:        'Email Marketing',
        nameEn:        'Email Marketing',
        descriptionEs: 'Campañas de correo electrónico con diseño, automatización y analítica.',
        descriptionEn: 'Email campaigns with design, automation, and analytics.',
        category:      'GROWTH',
        basePrice:     800000,
        deliveryDays:  14,
        tags:          ['email', 'newsletter', 'automatizacion', 'campanas'],
      },
    }),
    prisma.service.upsert({
      where:  { slug: 'seo-analitica' },
      update: {},
      create: {
        slug:          'seo-analitica',
        nameEs:        'SEO & Analítica Web',
        nameEn:        'SEO & Web Analytics',
        descriptionEs: 'Posicionamiento orgánico en buscadores y reportes de analítica mensual.',
        descriptionEn: 'Organic search engine positioning and monthly analytics reports.',
        category:      'GROWTH',
        basePrice:     1200000,
        deliveryDays:  30,
        tags:          ['seo', 'google', 'analitica', 'posicionamiento'],
      },
    }),
    // IDEATION (3)
    prisma.service.upsert({
      where:  { slug: 'branding-identidad' },
      update: {},
      create: {
        slug:          'branding-identidad',
        nameEs:        'Branding & Identidad Visual',
        nameEn:        'Branding & Visual Identity',
        descriptionEs: 'Construcción de marca: logo, paleta, tipografía, manual de uso y más.',
        descriptionEn: 'Brand building: logo, palette, typography, usage manual, and more.',
        category:      'IDEATION',
        basePrice:     3000000,
        deliveryDays:  21,
        tags:          ['branding', 'logo', 'identidad', 'manual', 'marca'],
      },
    }),
    prisma.service.upsert({
      where:  { slug: 'diseno-web' },
      update: {},
      create: {
        slug:          'diseno-web',
        nameEs:        'Diseño Web',
        nameEn:        'Web Design',
        descriptionEs: 'Diseño UX/UI de sitios web modernos, rápidos y orientados a conversión.',
        descriptionEn: 'UX/UI design of modern, fast, and conversion-focused websites.',
        category:      'IDEATION',
        basePrice:     4000000,
        deliveryDays:  30,
        tags:          ['web', 'ux', 'ui', 'diseño', 'landing'],
      },
    }),
    prisma.service.upsert({
      where:  { slug: 'naming-copywriting' },
      update: {},
      create: {
        slug:          'naming-copywriting',
        nameEs:        'Naming & Copywriting',
        nameEn:        'Naming & Copywriting',
        descriptionEs: 'Creación de nombre de marca, eslogan y textos estratégicos que conectan.',
        descriptionEn: 'Brand name creation, slogan, and strategic texts that connect.',
        category:      'IDEATION',
        basePrice:     1500000,
        deliveryDays:  14,
        tags:          ['naming', 'copy', 'eslogan', 'textos', 'estrategia'],
      },
    }),
  ])

  console.log(`✅ ${services.length} servicios creados`)

  // ─── Temas estacionales (3) ───────────────────────────────────────
  await Promise.all([
    prisma.seasonalTheme.upsert({
      where:  { name: 'default' },
      update: {},
      create: { name: 'default',   labelEs: 'Por defecto', labelEn: 'Default',  bg: '#000000', accent: '#FF4600', secondary: '#008080', startMonth: 2,  endMonth: 9  },
    }),
    prisma.seasonalTheme.upsert({
      where:  { name: 'halloween' },
      update: {},
      create: { name: 'halloween', labelEs: 'Halloween',   labelEn: 'Halloween', bg: '#0B0500', accent: '#FF5A00', secondary: '#8A2BE2', startMonth: 10, endMonth: 11 },
    }),
    prisma.seasonalTheme.upsert({
      where:  { name: 'winter' },
      update: {},
      create: { name: 'winter',   labelEs: 'Invierno',    labelEn: 'Winter',    bg: '#050B14', accent: '#00E5FF', secondary: '#00FF88', startMonth: 12, endMonth: 1  },
    }),
  ])

  console.log('✅ 3 temas estacionales creados')

  // ─── FAQs (5) ─────────────────────────────────────────────────────
  const faqs = [
    { id: 'faq-1', questionEs: '¿Cómo funciona el proceso de cotización?',      questionEn: 'How does the quoting process work?',          answerEs: 'Usa nuestro cotizador inteligente para seleccionar los servicios que necesitas. Recibirás una cotización detallada en minutos.',           answerEn: "Use our smart quoter to select the services you need. You'll receive a detailed quote in minutes.",                                                      order: 1 },
    { id: 'faq-2', questionEs: '¿Trabajan con marcas internacionales?',          questionEn: 'Do you work with international brands?',       answerEs: 'Sí, trabajamos con marcas de toda Latinoamérica y a nivel global. Manejamos cotizaciones en COP y USD.',                                    answerEn: 'Yes, we work with brands across Latin America and globally. We handle quotes in COP and USD.',                                                            order: 2 },
    { id: 'faq-3', questionEs: '¿Cuáles son los tiempos de entrega?',           questionEn: 'What are the delivery times?',                 answerEs: 'Depende del servicio: fotografía de producto en 4 días, branding en 21 días. Para urgentes aplicamos un recargo con tiempos desde 7 días.',  answerEn: 'It depends on the service: product photography in 4 days, branding in 21 days. For urgent projects we apply a surcharge from 7 days.',                    order: 3 },
    { id: 'faq-4', questionEs: '¿Qué métodos de pago aceptan?',                 questionEn: 'What payment methods do you accept?',          answerEs: 'Aceptamos transferencia bancaria, Nequi, Daviplata, PSE y tarjetas. Para proyectos internacionales también PayPal y Wise.',                  answerEn: 'We accept bank transfer, Nequi, Daviplata, PSE, and cards. For international projects also PayPal and Wise.',                                             order: 4 },
    { id: 'faq-5', questionEs: '¿Puedo solicitar ajustes después de recibir el trabajo?', questionEn: 'Can I request adjustments after receiving the work?', answerEs: 'Sí, incluimos rondas de revisión en todos nuestros proyectos. El número varía según el servicio.',                        answerEn: "Yes, we include revision rounds in all our projects. The number varies by service and is specified in the work proposal.",                                  order: 5 },
  ]

  for (const faq of faqs) {
    await prisma.fAQ.upsert({ where: { id: faq.id }, update: {}, create: faq })
  }

  console.log('✅ 5 FAQs creadas')

  // ─── Usuario admin ─────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('LQS@dmin2024!', 12)

  await prisma.user.upsert({
    where:  { email: 'loqueseaproductionsp1@gmail.com' },
    update: {},
    create: { email: 'loqueseaproductionsp1@gmail.com', name: 'LQS Admin', password: hashedPassword, role: 'admin' },
  })

  console.log('✅ Usuario admin creado')
  console.log('🎉 Seed completado exitosamente')
}

main()
  .catch((e) => { console.error('❌ Error en seed:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
