'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useDiagnosisStore } from '@/store/diagnosisStore'
import { useScrollReveal }   from '@/hooks/useScrollAnimation'
import { GlowCard }          from '@/components/ui/GlowCard'
import { DuckBrandSVG, DuckCreatorSVG, DuckEventSVG } from '@/components/ui/DuckIllustration'
import type { ClientType }   from '@/types'

gsap.registerPlugin(ScrollToPlugin)

const DUCK_ICON: Record<ClientType, React.ReactNode> = {
  brand:   <DuckBrandSVG   size={72} />,
  creator: <DuckCreatorSVG size={72} />,
  event:   <DuckEventSVG   size={72} />,
}

const OPTIONS = [
  {
    type:        'brand' as ClientType,
    title:       'Soy una Marca / Empresa',
    description: 'Necesito branding, web, marketing o producción para mi empresa o negocio.',
    tags:        ['Branding', 'Web', 'Marketing', 'Video'],
  },
  {
    type:        'creator' as ClientType,
    title:       'Soy un Creador / Persona',
    description: 'Quiero impulsar mi marca personal, canal o proyectos creativos.',
    tags:        ['Marca personal', 'Redes', 'Fotografía', 'Reels'],
  },
  {
    type:        'event' as ClientType,
    title:       'Tengo un Proyecto / Evento',
    description: 'Necesito producción, cobertura o logística para un lanzamiento o evento.',
    tags:        ['Eventos', 'Cobertura', 'Lanzamiento', 'Logística'],
  },
]

export function AutoDiagnosis() {
  const { clientType, setClientType } = useDiagnosisStore()
  const sectionRef = useScrollReveal()
  const cardsRef   = useRef<HTMLDivElement>(null)

  const handleSelect = (type: ClientType) => {
    setClientType(type)
    gsap.to(window, {
      scrollTo: '#servicios',
      duration: 1.2,
      ease: 'power3.inOut',
    })
  }

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="diagnose"
      className="py-36 px-6 relative"
      style={{ background: 'var(--imi-bgAbsolute)' }}
    >
      {/* Línea separadora */}
      <div
        className="absolute top-0 left-6 right-6 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--imi-accentOrange), transparent)' }}
      />

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16" data-reveal>
          <p className="font-mono-data text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--imi-accentOrange)' }}>
            ◆ Primer paso
          </p>
          <h2 className="font-authority text-5xl md:text-7xl leading-none mb-6" style={{ color: 'var(--imi-textPrimary)' }}>
            ¿QUÉ ERES TÚ?
          </h2>
          <p className="font-readability text-base max-w-md mx-auto" style={{ color: 'var(--imi-textMuted)' }}>
            Selecciona tu perfil y te mostramos exactamente lo que necesitas. Sin ruido.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OPTIONS.map((option) => {
            const isSelected = clientType === option.type
            return (
              <button
                key={option.type}
                onClick={() => handleSelect(option.type)}
                className="text-left transition-all duration-300 group relative"
              >
                <GlowCard
                  variant={isSelected ? 'orange' : 'default'}
                  glowColor={isSelected ? 'orange' : 'teal'}
                  className="p-8 h-full"
                >
                  <div className="mb-6">{DUCK_ICON[option.type]}</div>

                  <h3
                    className="font-authority text-2xl tracking-wider mb-3 transition-colors"
                    style={{ color: isSelected ? 'var(--imi-accentOrange)' : 'var(--imi-textPrimary)' }}
                  >
                    {option.title}
                  </h3>

                  <p className="font-readability text-sm leading-relaxed mb-6" style={{ color: 'var(--imi-textMuted)' }}>
                    {option.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {option.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono-data text-[10px] tracking-wider uppercase px-2 py-1 rounded border"
                        style={{
                          borderColor: isSelected ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)',
                          color:       isSelected ? 'var(--imi-accentOrange)' : 'var(--imi-textMuted)',
                          background:  isSelected ? 'rgba(255,70,0,0.08)'     : 'transparent',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {isSelected && (
                    <div
                      className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--imi-accentOrange)' }}
                    >
                      <span className="text-black text-xs font-bold">✓</span>
                    </div>
                  )}
                </GlowCard>
              </button>
            )
          })}
        </div>

        {clientType && (
          <div className="text-center mt-8 font-mono-data text-sm animate-fade-in" style={{ color: 'var(--imi-securityTeal)' }}>
            ◆ Perfecto — mostrando servicios para{' '}
            {OPTIONS.find(o => o.type === clientType)?.title}
          </div>
        )}
      </div>
    </section>
  )
}
