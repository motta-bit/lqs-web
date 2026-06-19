'use client'

import { useScrollReveal } from '@/hooks/useScrollAnimation'

const MANIFESTO_LINES = [
  { text: 'No somos la agencia más grande.',   highlight: false },
  { text: 'Somos los que más hacemos.',         highlight: true  },
  { text: 'No tenemos poses.',                  highlight: false },
  { text: 'Tenemos resultados.',                highlight: true  },
  { text: 'El caos es nuestro método.',         highlight: false },
  { text: 'El orden es nuestra entrega.',       highlight: true  },
]

export function ManifestoSection() {
  const sectionRef = useScrollReveal({ y: 20, stagger: 0.12 })

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-32 px-6 relative overflow-hidden"
      style={{ background: 'var(--imi-bgAbsolute)' }}
    >
      <div
        className="absolute top-0 left-6 right-6 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--imi-securityTeal), transparent)' }}
      />

      <div className="max-w-5xl mx-auto">
        <p
          className="font-mono-data text-xs tracking-widest uppercase mb-16 text-center"
          data-reveal
          style={{ color: 'var(--imi-accentOrange)' }}
        >
          ◆ Nuestro manifiesto
        </p>

        <div className="space-y-3">
          {MANIFESTO_LINES.map((line, i) => (
            <div key={i} data-reveal className="overflow-hidden">
              <p
                className="font-authority leading-tight"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                  color:    line.highlight ? 'var(--imi-accentOrange)' : 'var(--imi-textMuted)',
                }}
              >
                {line.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-4" data-reveal>
          <div className="w-12 h-px" style={{ background: 'var(--imi-accentOrange)' }} />
          <p className="font-mono-data text-sm tracking-widest uppercase" style={{ color: 'var(--imi-textMuted)' }}>
            LQS — Lo Que Sea · Medellín, Colombia
          </p>
        </div>
      </div>
    </section>
  )
}
