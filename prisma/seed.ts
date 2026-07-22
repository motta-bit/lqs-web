import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'
import { SERVICES, PACKAGES } from './seed-data'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma  = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed de LQS...')

  // ─── Servicios (22) ──────────────────────────────────────────────────
  const priceBySlug = new Map<string, number>()
  const idBySlug = new Map<string, string>()

  for (const s of SERVICES) {
    const { slug, ...rest } = s
    const service = await prisma.service.upsert({
      where:  { slug },
      update: { ...rest }, // idempotente: refleja cambios de precio/distrito
      create: { slug, ...rest },
    })
    priceBySlug.set(slug, s.basePrice)
    idBySlug.set(slug, service.id)
  }
  console.log(`✅ ${SERVICES.length} servicios creados`)

  // ─── Paquetes (4) ─────────────────────────────────────────────────────
  for (const p of PACKAGES) {
    const subtotal = p.serviceSlugs.reduce((acc, slug) => {
      const price = priceBySlug.get(slug)
      if (price === undefined) throw new Error(`Paquete ${p.slug}: servicio inexistente ${slug}`)
      return acc + price
    }, 0)
    const totalPrice = Math.round(subtotal * (1 - p.discountPct))
    const serviceLinks = p.serviceSlugs.map((slug) => ({ serviceId: idBySlug.get(slug)! }))

    // Reemplazo total de vínculos para que el seed sea idempotente.
    await prisma.packageService.deleteMany({ where: { package: { slug: p.slug } } })
    await prisma.package.upsert({
      where:  { slug: p.slug },
      update: {
        nameEs: p.nameEs, nameEn: p.nameEn,
        descriptionEs: p.descriptionEs, descriptionEn: p.descriptionEn,
        type: p.type, totalPrice, discountPct: p.discountPct,
        clientTypes: p.clientTypes, isHighlighted: p.isHighlighted,
        services: { create: serviceLinks },
      },
      create: {
        slug: p.slug,
        nameEs: p.nameEs, nameEn: p.nameEn,
        descriptionEs: p.descriptionEs, descriptionEn: p.descriptionEn,
        type: p.type, totalPrice, discountPct: p.discountPct,
        clientTypes: p.clientTypes, isHighlighted: p.isHighlighted,
        services: { create: serviceLinks },
      },
    })
  }
  console.log(`✅ ${PACKAGES.length} paquetes creados`)

  // ─── Temas estacionales (3) ───────────────────────────────────────────
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

  // ─── FAQs (5) ─────────────────────────────────────────────────────────
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

  // ─── Usuario admin ─────────────────────────────────────────────────────
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
