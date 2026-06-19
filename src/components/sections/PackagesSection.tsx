'use client'

import { useScrollReveal } from '@/hooks/useScrollAnimation'
import { CTAButton }       from '@/components/ui/CTAButton'
import { useQuoterStore }  from '@/store/quoterStore'

const PACKAGES = [
  {
    id: 'ultra-completo', name: 'Ultra Completo',
    badge: '⭐ PREMIUM', badgeColor: 'var(--imi-accentOrange)',
    price: 'Desde $12.000.000 COP', discount: '20%', highlight: true,
    description: 'Todo lo que tu empresa necesita en un solo paquete. La solución más completa del mercado.',
    includes: [
      'Branding e identidad visual completa',
      'Desarrollo web Next.js + SEO',
      'Producción audiovisual (3 piezas)',
      'Campaña de redes sociales (1 mes)',
      'Sesión fotográfica de producto',
      'Manual de marca completo',
      'Soporte post-entrega 30 días',
    ],
  },
  {
    id: 'ecosistema-brand-web', name: 'Ecosistema Brand & Web',
    badge: '🏢 CORPORATIVO', badgeColor: 'var(--imi-securityTeal)',
    price: 'Desde $7.500.000 COP', discount: '15%', highlight: false,
    description: 'Branding corporativo profesional más presencia web de alto impacto.',
    includes: [
      'Branding e identidad visual',
      'Desarrollo web a medida en Next.js',
      'SEO técnico y on-page',
      'Manual de marca',
      'Integración WhatsApp + Analytics',
    ],
  },
  {
    id: 'campana-omnicanal', name: 'Campaña Omnicanal 360',
    badge: '📡 MARKETING', badgeColor: 'var(--imi-innovationBlue)',
    price: 'Desde $5.000.000 COP', discount: '15%', highlight: false,
    description: 'Estrategia de marketing digital completa para empresas que quieren crecer.',
    includes: [
      'Contenido audiovisual masivo',
      'Community management (1 mes)',
      'Pauta digital Meta + Google',
      'Copywriting para todos los canales',
      'Informe de resultados mensual',
    ],
  },
  {
    id: 'paquete-esencial', name: 'Paquete Esencial',
    badge: '🚀 RECOMENDADO', badgeColor: 'var(--imi-securityTeal)',
    price: 'Desde $2.500.000 COP', discount: '10%', highlight: false,
    description: 'Lo necesario para arrancar con fuerza. Ideal para emprendedores y pymes.',
    includes: [
      'Logo + paleta de colores',
      'Landing page profesional',
      'Pack de 10 plantillas para redes',
      'Sesión fotográfica básica',
    ],
  },
  {
    id: 'launchpad', name: 'Launchpad — Lanzamiento',
    badge: '🚀 ESPECIAL', badgeColor: 'var(--imi-accentOrange)',
    price: 'Desde $3.800.000 COP', discount: '12%', highlight: false,
    description: 'Todo lo que necesitas para lanzar un producto o servicio al mercado.',
    includes: [
      'Landing page de preventa',
      'Video conceptual de marca',
      'Cobertura de prensa digital',
      'Embudos automatizados',
      'Sesión fotográfica del producto',
    ],
  },
  {
    id: 'event-hub', name: 'Event Hub — Experiencia en Vivo',
    badge: '🎪 EVENTOS', badgeColor: 'var(--imi-innovationBlue)',
    price: 'Cotización personalizada', discount: '10%', highlight: false,
    description: 'Producción integral de eventos con cobertura audiovisual completa.',
    includes: [
      'Registro in-situ',
      'Edición rápida en vivo',
      'Diseño de marca física del espacio',
      'Fotografía y video del evento',
      'Logística y coordinación',
    ],
  },
]

export function PackagesSection() {
  const sectionRef    = useScrollReveal({ stagger: 0.08 })
  const { openPanel } = useQuoterStore()

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="paquetes"
      className="py-36 px-6"
      style={{ background: 'var(--imi-cardBg)' }}
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16" data-reveal>
          <p className="font-mono-data text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--imi-accentOrange)' }}>
            ◆ Soluciones completas
          </p>
          <h2 className="font-authority text-5xl md:text-7xl leading-none mb-6" style={{ color: 'var(--imi-textPrimary)' }}>
            PAQUETES<br />
            <span style={{ color: 'var(--imi-securityTeal)' }}>LQS.</span>
          </h2>
          <p className="font-readability text-base max-w-xl mx-auto" style={{ color: 'var(--imi-textMuted)' }}>
            Servicios agrupados con descuento. Más por menos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGES.map(pkg => (
            <div
              key={pkg.id}
              data-reveal
              className={`relative rounded-sm border transition-all duration-300 hover:-translate-y-1 ${
                pkg.highlight ? 'ring-1 ring-[var(--imi-accentOrange)]' : ''
              }`}
              style={{
                borderColor: pkg.highlight ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)',
                background:  pkg.highlight ? 'rgba(255,70,0,0.05)'     : 'var(--imi-bgAbsolute)',
                boxShadow:   pkg.highlight ? '0 0 30px rgba(255,70,0,0.1)' : 'none',
              }}
            >
              {/* Badge */}
              <div className="absolute -top-3 left-6">
                <span
                  className="font-mono-data text-[10px] tracking-widest uppercase px-3 py-1 rounded-sm"
                  style={{ background: pkg.badgeColor, color: '#000' }}
                >
                  {pkg.badge}
                </span>
              </div>

              <div className="p-8 pt-10">
                <h3 className="font-authority text-2xl tracking-wider mb-2" style={{ color: 'var(--imi-textPrimary)' }}>
                  {pkg.name}
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono-data text-sm" style={{ color: pkg.badgeColor }}>
                    {pkg.price}
                  </span>
                  <span
                    className="font-mono-data text-xs px-2 py-0.5 rounded"
                    style={{ color: 'var(--imi-securityTeal)', background: 'rgba(0,128,128,0.1)' }}
                  >
                    -{pkg.discount}
                  </span>
                </div>

                <p className="font-readability text-sm leading-relaxed mb-6" style={{ color: 'var(--imi-textMuted)' }}>
                  {pkg.description}
                </p>

                <ul className="space-y-2 mb-8">
                  {pkg.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 font-readability text-sm" style={{ color: 'var(--imi-textMuted)' }}>
                      <span style={{ color: pkg.badgeColor }} className="flex-shrink-0 mt-0.5">◆</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <CTAButton
                  variant={pkg.highlight ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={openPanel}
                >
                  {pkg.price === 'Cotización personalizada' ? 'Solicitar cotización' : 'Quiero este paquete'}
                </CTAButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
