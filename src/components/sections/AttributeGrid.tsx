'use client'

import { useScrollReveal } from '@/hooks/useScrollAnimation'
import { GlowCard }        from '@/components/ui/GlowCard'

const ATTRIBUTES = [
  {
    number: '01',
    title:  'Caos Curado',
    desc:   'El desorden también tiene método. Aprovechamos lo inesperado para crear resultados que ningún proceso rígido puede generar.',
    accent: 'var(--imi-accentOrange)',
    large:  true,
  },
  {
    number: '02',
    title:  'Toderos de Verdad',
    desc:   'Branding, web, video, eventos. Contamos con equipos propios y vinculaciones estratégicas para ser óptimos en cualquier situación. Si hay algo que excede nuestro alcance, ya tenemos a quién llamar.',
    accent: 'var(--imi-securityTeal)',
    large:  false,
  },
  {
    number: '03',
    title:  'Precios Claros',
    desc:   'Sin letras pequeñas. El cotizador muestra el precio real antes de que hables con nosotros.',
    accent: 'var(--imi-innovationBlue)',
    large:  false,
  },
  {
    number: '04',
    title:  'Velocidad Real',
    desc:   'Los plazos que pactamos son los plazos que cumplimos. Si hay urgencia, hay un multiplicador — nada escondido.',
    accent: 'var(--imi-accentOrange)',
    large:  false,
  },
  {
    number: '05',
    title:  'Tech + Creatividad',
    desc:   'IA, Three.js, automatizaciones y GSAP al servicio de la misma idea: que tu marca se vea y funcione mejor.',
    accent: 'var(--imi-securityTeal)',
    large:  true,
  },
  {
    number: '06',
    title:  'Impacto Social',
    desc:   'Parte de lo que hacemos va a proyectos como Vita Nova Colombia y Casa RAÍZ.',
    accent: 'var(--imi-innovationBlue)',
    large:  false,
  },
]

export function AttributeGrid() {
  const sectionRef = useScrollReveal({ stagger: 0.08 })

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="nosotros"
      className="py-36 px-6 relative"
      style={{ background: 'var(--imi-bgAbsolute)' }}
    >
      <div className="max-w-7xl mx-auto">

        <div className="mb-16" data-reveal>
          <p className="font-mono-data text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--imi-accentOrange)' }}>
            ◆ Por qué LQS
          </p>
          <h2 className="font-authority text-5xl md:text-7xl leading-none" style={{ color: 'var(--imi-textPrimary)' }}>
            LO QUE NOS<br />
            <span style={{ color: 'var(--imi-securityTeal)' }}>DIFERENCIA.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ATTRIBUTES.map((attr) => (
            <div key={attr.number} data-reveal className={attr.large ? 'lg:col-span-2' : ''}>
              <GlowCard className="p-8 h-full group cursor-default">
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="font-mono-data text-4xl font-bold opacity-20 group-hover:opacity-60 transition-opacity"
                    style={{ color: attr.accent }}
                  >
                    {attr.number}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-glow-pulse"
                    style={{ background: attr.accent }}
                  />
                </div>
                <h3
                  className="font-authority text-2xl tracking-wider mb-3 transition-colors"
                  style={{ color: attr.accent }}
                >
                  {attr.title}
                </h3>
                <p className="font-readability text-sm leading-relaxed" style={{ color: 'var(--imi-textMuted)' }}>
                  {attr.desc}
                </p>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
