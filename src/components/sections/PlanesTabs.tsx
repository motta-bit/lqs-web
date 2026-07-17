'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuoterStore } from '@/store/quoterStore'

interface Tier {
  name: string
  price: string
  features: string[]
  popular?: boolean
}

interface ServiceTab {
  id: string
  label: string
  icon: string
  color: string
  rgb: string
  tagline: string
  desc: string
  tiers: Tier[]
}

const TABS: ServiceTab[] = [
  {
    id: 'branding', label: 'Branding', icon: '◈', color: '#FF6B00', rgb: '255,107,0',
    tagline: 'Identidad visual que habla por tu marca',
    desc: 'Construimos marcas memorables. Desde el logo hasta el manual completo de identidad visual.',
    tiers: [
      { name: 'Esencial', price: '$850.000', features: ['Logo principal + variaciones', 'Paleta de colores', 'Tipografía corporativa', 'Archivos vectoriales (AI, PDF, PNG)', 'Guía de uso básica'] },
      { name: 'Estándar', price: '$2.500.000', features: ['Todo lo de Esencial', 'Manual de marca completo', 'Papelería corporativa', 'Tarjetas y membrete', 'Aplicaciones digitales'], popular: true },
      { name: 'Premium', price: '$5.000.000', features: ['Todo lo de Estándar', 'Naming + posicionamiento', 'Brand strategy 360°', 'Identidad en movimiento', 'Soporte post-entrega 3 meses'] },
    ],
  },
  {
    id: 'web', label: 'Web', icon: '◉', color: '#0080FF', rgb: '0,128,255',
    tagline: 'Presencia digital de alto rendimiento',
    desc: 'Sitios web rápidos, modernos y optimizados. Construidos con Next.js para máxima performance.',
    tiers: [
      { name: 'Landing', price: '$1.200.000', features: ['Landing page responsive', 'Formulario de contacto', 'Analytics básico (GA4)', 'Hosting + SSL 1 año', 'Integración WhatsApp'] },
      { name: 'Sitio Completo', price: '$3.500.000', features: ['Todo de Landing', 'Hasta 8 páginas', 'SEO técnico completo', 'CMS para editar contenido', 'Blog o noticias'], popular: true },
      { name: 'Plataforma', price: 'Desde $7.000.000', features: ['Todo de Sitio', 'E-commerce o app web', 'Autenticación de usuarios', 'Panel de administración', 'Integraciones API'] },
    ],
  },
  {
    id: 'video', label: 'Video', icon: '▶', color: '#9900FF', rgb: '153,0,255',
    tagline: 'Contenido audiovisual que conecta y convierte',
    desc: 'Producción audiovisual profesional: corporativos, publicidad, redes sociales y eventos.',
    tiers: [
      { name: 'Cápsula', price: '$800.000', features: ['1 video corporativo (hasta 1 min)', 'Guión básico incluido', 'Color grading profesional', 'Entrega en MP4 4K', 'Subtítulos incluidos'] },
      { name: 'Pack Media', price: '$2.200.000', features: ['3 piezas audiovisuales', 'Video corporativo + 2 reels', 'Motion graphics básico', 'Música licenciada', 'Formatos para todas las plataformas'], popular: true },
      { name: 'Producción', price: '$4.500.000', features: ['Producción completa', 'Guión + storyboard', 'Día de grabación', 'Post-producción avanzada', 'Versiones para anuncios'] },
    ],
  },
  {
    id: 'foto', label: 'Fotografía', icon: '⬡', color: '#FF2D55', rgb: '255,45,85',
    tagline: 'Imágenes que cuentan historias reales',
    desc: 'Fotografía editorial, de producto y corporativa. Imágenes que venden y posicionan.',
    tiers: [
      { name: 'Básica', price: '$600.000', features: ['2 horas de sesión', '20 fotos editadas', 'Retoque básico incluido', 'Entrega digital en alta resolución', 'Derechos de uso comercial'] },
      { name: 'Estándar', price: '$1.500.000', features: ['4 horas de sesión', '60 fotos editadas', 'Fotografía de producto incluida', 'Retoque avanzado', '2 locaciones'], popular: true },
      { name: 'Editorial', price: '$3.000.000', features: ['Día completo de sesión', '150+ fotos seleccionadas', 'Dirección de arte', 'Vestuario y utilería', 'Portafolio editorial completo'] },
    ],
  },
  {
    id: 'redes', label: 'Redes', icon: '◎', color: '#00CC59', rgb: '0,204,89',
    tagline: 'Comunidades activas que se convierten en clientes',
    desc: 'Community management, pauta digital y estrategia de contenidos para crecer en redes.',
    tiers: [
      { name: 'Esencial', price: '$900.000/mes', features: ['12 posts mensuales', '3 plataformas sociales', 'Diseño de plantillas', 'Programación incluida', 'Reporte mensual'] },
      { name: 'Activo', price: '$2.200.000/mes', features: ['20 posts + 10 stories', 'Community management', 'Pauta básica Meta ($300k)', 'Copywriting estratégico', 'Análisis de competencia'], popular: true },
      { name: 'Full 360', price: '$4.000.000/mes', features: ['Estrategia omnicanal', 'Contenido ilimitado', 'Pauta avanzada Meta + Google', 'Influencer outreach', 'Dashboard de métricas en vivo'] },
    ],
  },
  {
    id: 'eventos', label: 'Eventos', icon: '✦', color: '#FFD700', rgb: '255,215,0',
    tagline: 'Experiencias que marcan momentos únicos',
    desc: 'Producción integral de eventos: cobertura audiovisual, señalética y logística completa.',
    tiers: [
      { name: 'Cobertura', price: '$1.500.000', features: ['Fotografía del evento (4h)', 'Video resumen (3 min)', '50 fotos editadas entregadas', 'Entrega en 3 días hábiles', 'Derechos de uso incluidos'] },
      { name: 'Producción', price: '$3.500.000', features: ['Foto + video completo', 'Transmisión en vivo', 'Señalética y montaje', 'Reel del evento', 'Cobertura de hasta 8 horas'], popular: true },
      { name: 'Integral', price: 'Cotización', features: ['Producción completa del evento', 'Diseño de espacios', 'Logística y coordinación', 'Cobertura ilimitada', 'Relaciones públicas digitales'] },
    ],
  },
  {
    id: 'marketing', label: 'Marketing', icon: '◇', color: '#00CFFF', rgb: '0,207,255',
    tagline: 'Estrategias que generan resultados medibles',
    desc: 'Marketing digital completo: estrategia, ejecución y análisis para crecer de verdad.',
    tiers: [
      { name: 'Básico', price: '$1.200.000/mes', features: ['Auditoría de presencia digital', 'Estrategia de contenidos', 'Pauta básica ($400k incluido)', 'Email marketing básico', 'Reporte mensual'] },
      { name: 'Crecimiento', price: '$2.800.000/mes', features: ['Campañas Meta + Google', 'Pauta ($800k incluido)', 'Retargeting avanzado', 'Funnel de conversión', 'A/B testing'], popular: true },
      { name: 'Enterprise', price: '$6.000.000/mes', features: ['Estrategia 360° completa', 'Pauta ilimitada (budget aparte)', 'CRM y automatización', 'Equipo dedicado', 'Consultor senior asignado'] },
    ],
  },
]

export function PlanesTabs() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [animKey,   setAnimKey]   = useState(0)
  const openPanel = useQuoterStore(s => s.openPanel)
  const tab = TABS[activeIdx]
  const tabsRef = useRef<HTMLDivElement>(null)

  const handleTab = (i: number) => {
    setActiveIdx(i)
    setAnimKey(k => k + 1)
  }

  return (
    <section
      className="section-compact lqs-tab-section py-16 px-6"
      style={{
        background: `linear-gradient(180deg, #000 0%, rgba(${tab.rgb},0.03) 50%, #000 100%)`,
        borderTop: `1px solid rgba(${tab.rgb},0.15)`,
      }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="font-mono-data text-xs tracking-widest uppercase mb-4"
            style={{ color: tab.color, transition: 'color 0.4s ease' }}>
            ◆ Servicios y precios
          </p>
          <h2 className="font-authority text-[clamp(3rem,8vw,6rem)] leading-none"
            style={{ color: '#fff' }}>
            PLANES <span style={{ color: tab.color, transition: 'color 0.4s ease' }}>LQS.</span>
          </h2>
          <p className="font-readability text-sm mt-4 max-w-md mx-auto" style={{ color: '#555' }}>
            Elige el servicio que necesitas. Cada plan es totalmente personalizable.
          </p>
        </div>

        {/* Tab bar */}
        <div ref={tabsRef} className="flex overflow-x-auto gap-2 mb-12 pb-2 justify-start lg:justify-center"
          style={{ scrollbarWidth: 'none' }}>
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => handleTab(i)}
              className="flex items-center gap-2 px-5 py-3 flex-shrink-0 font-mono-data text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                background: activeIdx === i ? `rgba(${t.rgb},0.12)` : 'transparent',
                color: activeIdx === i ? t.color : '#333',
                border: `1px solid ${activeIdx === i ? `rgba(${t.rgb},0.4)` : '#1a1a1a'}`,
                boxShadow: activeIdx === i ? `0 0 20px rgba(${t.rgb},0.12)` : 'none',
              }}>
              <span style={{ fontSize: '0.9rem' }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Active service header */}
        <div key={`header-${animKey}`} className="animate-tab-slide mb-10 text-center">
          <h3 className="font-authority text-[clamp(2rem,5vw,4rem)] leading-tight mb-2"
            style={{ color: tab.color }}>
            {tab.tagline}
          </h3>
          <p className="font-readability text-base max-w-xl mx-auto" style={{ color: '#666' }}>
            {tab.desc}
          </p>
        </div>

        {/* Pricing cards */}
        <div key={`cards-${animKey}`} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tab.tiers.map((tier, ti) => (
            <div
              key={tier.name}
              className="relative border transition-all duration-300 hover:-translate-y-1"
              style={{
                background: tier.popular ? `rgba(${tab.rgb},0.05)` : '#080808',
                borderColor: tier.popular ? `rgba(${tab.rgb},0.4)` : '#1a1a1a',
                boxShadow: tier.popular ? `0 0 40px rgba(${tab.rgb},0.1)` : 'none',
                animationDelay: `${ti * 80}ms`,
                animation: 'tab-slide-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
                opacity: 0,
              }}>

              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="font-mono-data text-[10px] tracking-widest uppercase px-3 py-1"
                    style={{ background: tab.color, color: '#000' }}>
                    ★ MÁS POPULAR
                  </span>
                </div>
              )}

              <div className="p-7 pt-9">
                <p className="font-mono-data text-xs tracking-widest uppercase mb-1"
                  style={{ color: tab.color }}>
                  {tier.name}
                </p>
                <p className="font-authority text-3xl mb-6" style={{ color: '#fff' }}>
                  {tier.price}
                </p>

                <ul className="space-y-2.5 mb-8">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 font-readability text-sm"
                      style={{ color: '#888' }}>
                      <span className="flex-shrink-0 mt-0.5 text-xs" style={{ color: tab.color }}>◆</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={openPanel}
                  className="w-full py-3.5 font-mono-data text-xs tracking-widest uppercase transition-all"
                  style={{
                    background: tier.popular ? tab.color : 'transparent',
                    color: tier.popular ? '#000' : tab.color,
                    border: `1px solid ${tier.popular ? tab.color : `rgba(${tab.rgb},0.3)`}`,
                  }}
                  onMouseEnter={e => {
                    if (!tier.popular) {
                      e.currentTarget.style.background = `rgba(${tab.rgb},0.1)`
                    }
                  }}
                  onMouseLeave={e => {
                    if (!tier.popular) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}>
                  {tier.price === 'Cotización' ? 'Solicitar cotización' : 'Quiero este plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center font-mono-data text-xs mt-8" style={{ color: '#2a2a2a' }}>
          * Todos los precios en COP. IVA no incluido. Consulta paquetes con descuento.
        </p>
      </div>
    </section>
  )
}
