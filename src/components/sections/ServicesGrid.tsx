'use client'

import { useState }          from 'react'
import { useScrollReveal }   from '@/hooks/useScrollAnimation'
import { GlowCard }          from '@/components/ui/GlowCard'
import { useDiagnosisStore } from '@/store/diagnosisStore'
import { useQuoterStore }    from '@/store/quoterStore'
import type { Category }     from '@/types'

const SERVICES_DATA = [
  // MEDIA
  {
    id: 'edicion-video-reels', slug: 'edicion-video-reels',
    name: 'Edición de Video — Reels / TikToks',
    category: 'MEDIA' as Category, basePrice: 350000, unitType: 'por video',
    description: 'Edición profesional de contenido vertical para redes sociales. Cortes, transiciones, música y subtítulos.',
    icon: '🎬', tags: ['creator', 'brand'], isActive: true,
  },
  {
    id: 'fotografia-producto', slug: 'fotografia-producto',
    name: 'Fotografía de Producto',
    category: 'MEDIA' as Category, basePrice: 800000, unitType: 'por sesión',
    description: 'Sesión fotográfica profesional con retoque avanzado. Hasta 20 fotos entregadas.',
    icon: '📸', tags: ['brand', 'creator'], isActive: true,
  },
  {
    id: 'produccion-cortos', slug: 'produccion-cortos',
    name: 'Producción de Cortos / Entrevistas',
    category: 'MEDIA' as Category, basePrice: 2500000, unitType: 'por pieza',
    description: 'Producción completa de piezas audiovisuales. Grabación, edición y corrección de color.',
    icon: '🎥', tags: ['brand', 'event'], isActive: true,
  },
  // GROWTH
  {
    id: 'auditoria-marca', slug: 'auditoria-marca',
    name: 'Auditoría de Marca',
    category: 'GROWTH' as Category, basePrice: 600000, unitType: 'por marca',
    description: 'Análisis completo de presencia digital y visual. Informe con recomendaciones estratégicas.',
    icon: '🔍', tags: ['brand'], isActive: true,
  },
  {
    id: 'copywriting', slug: 'copywriting-estrategico',
    name: 'Copywriting Estratégico',
    category: 'GROWTH' as Category, basePrice: 450000, unitType: 'por pieza',
    description: 'Textos persuasivos orientados a conversión para web, redes y campañas.',
    icon: '✍️', tags: ['brand', 'creator'], isActive: true,
  },
  {
    id: 'pauta-digital', slug: 'pauta-digital',
    name: 'Pauta Digital',
    category: 'GROWTH' as Category, basePrice: 1200000, unitType: 'por mes',
    description: 'Gestión de pauta en Meta Ads y Google Ads. Configuración, optimización y reporte mensual.',
    icon: '📊', tags: ['brand'], isActive: true,
  },
  // IDEATION
  {
    id: 'branding-identidad', slug: 'branding-identidad',
    name: 'Branding e Identidad Visual',
    category: 'IDEATION' as Category, basePrice: 3500000, unitType: 'por proyecto',
    description: 'Construcción completa de identidad: logo, paleta, tipografías y manual de marca.',
    icon: '🎨', tags: ['brand', 'creator'], isActive: true,
  },
  {
    id: 'wireframing-ui', slug: 'wireframing-ui',
    name: 'Wireframing UI / UX',
    category: 'IDEATION' as Category, basePrice: 1800000, unitType: 'por proyecto',
    description: 'Diseño de flujos y wireframes de alta fidelidad en Figma. Incluye prototipo interactivo.',
    icon: '🖼️', tags: ['brand'], isActive: true,
  },
  {
    id: 'cotizacion-evento', slug: 'cotizacion-evento',
    name: 'Producción de Evento',
    category: 'IDEATION' as Category, basePrice: 0, unitType: 'personalizado',
    description: 'Producción integral: logística, escenografía, sonido, iluminación y cobertura audiovisual.',
    icon: '🎪', tags: ['event'], isActive: true,
  },
]

const CATEGORY_CONFIG = {
  MEDIA:    { label: 'Media',    color: 'var(--imi-accentOrange)'   },
  GROWTH:   { label: 'Growth',   color: 'var(--imi-securityTeal)'   },
  IDEATION: { label: 'Ideation', color: 'var(--imi-innovationBlue)' },
}

function formatPrice(price: number, unit: string) {
  if (price === 0) return 'Cotización personalizada'
  return `Desde ${new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(price)} ${unit}`
}

export function ServicesGrid() {
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL')
  const { clientType }               = useDiagnosisStore()
  const { openPanel }    = useQuoterStore()
  const sectionRef = useScrollReveal({ stagger: 0.06 })

  const filtered = SERVICES_DATA.filter(s => {
    const matchesCategory = activeCategory === 'ALL' || s.category === activeCategory
    const matchesClient   = !clientType || s.tags.includes(clientType)
    return matchesCategory && matchesClient && s.isActive
  })

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="servicios"
      className="py-36 px-6"
      style={{ background: 'var(--imi-bgAbsolute)' }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12" data-reveal>
          <p className="font-mono-data text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--imi-accentOrange)' }}>
            ◆ Lo que hacemos
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-authority text-5xl md:text-7xl leading-none" style={{ color: 'var(--imi-textPrimary)' }}>
              SERVICIOS
              {clientType && (
                <span className="block text-3xl mt-2" style={{ color: 'var(--imi-textMuted)' }}>
                  para {clientType === 'brand' ? 'marcas' : clientType === 'creator' ? 'creadores' : 'eventos'}
                </span>
              )}
            </h2>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
              {(['ALL', 'MEDIA', 'GROWTH', 'IDEATION'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="font-mono-data text-xs tracking-widest uppercase px-4 py-2 border rounded-sm transition-all"
                  style={{
                    borderColor: activeCategory === cat ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)',
                    color:       activeCategory === cat ? 'var(--imi-accentOrange)' : 'var(--imi-textMuted)',
                    background:  activeCategory === cat ? 'rgba(255,70,0,0.08)'     : 'transparent',
                  }}
                >
                  {cat === 'ALL' ? 'Todos' : CATEGORY_CONFIG[cat].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(service => {
            const catConfig = CATEGORY_CONFIG[service.category]
            return (
              <div key={service.id} data-reveal>
                <GlowCard className="p-6 h-full flex flex-col group">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="font-mono-data text-[10px] tracking-widest uppercase px-2 py-1 rounded border"
                      style={{ color: catConfig.color, borderColor: `${catConfig.color}40`, background: `${catConfig.color}10` }}
                    >
                      {catConfig.label}
                    </span>
                    <span className="text-2xl">{service.icon}</span>
                  </div>

                  <h3
                    className="font-authority text-xl tracking-wider mb-3 group-hover:text-[var(--imi-accentOrange)] transition-colors"
                    style={{ color: 'var(--imi-textPrimary)' }}
                  >
                    {service.name}
                  </h3>

                  <p className="font-readability text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--imi-textMuted)' }}>
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-mono-data text-xs" style={{ color: catConfig.color }}>
                      {formatPrice(service.basePrice, service.unitType)}
                    </span>
                    <button
                      onClick={() => openPanel()}
                      className="font-mono-data text-xs tracking-widest uppercase px-3 py-1.5 border rounded-sm transition-all hover:scale-105"
                      style={{ borderColor: 'var(--imi-accentOrange)', color: 'var(--imi-accentOrange)' }}
                    >
                      + Agregar
                    </button>
                  </div>
                </GlowCard>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="font-authority text-4xl mb-4" style={{ color: 'var(--imi-textMuted)' }}>SIN RESULTADOS</p>
            <p className="font-readability text-sm" style={{ color: 'var(--imi-textMuted)' }}>
              Prueba con otra categoría o perfil de cliente.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
