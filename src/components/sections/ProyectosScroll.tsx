'use client'

import { useEffect, useRef, useState } from 'react'

const PROYECTOS = [
  {
    id: 1, num: '01',
    titulo: 'Identidad Visual',
    cliente: 'Marca propia',
    desc: 'Sistema de marca completo: logo, paleta, tipografía, manual.',
    tags: ['Branding', 'Diseño'],
    color: '#FF2D78', rgb: '255,45,120',
  },
  {
    id: 2, num: '02',
    titulo: 'Plataforma Web',
    cliente: 'Tech startup',
    desc: 'App web de alta conversión con diseño UX centrado en el usuario.',
    tags: ['Web', 'UX/UI'],
    color: '#00E5FF', rgb: '0,229,255',
  },
  {
    id: 3, num: '03',
    titulo: 'Campaña Audiovisual',
    cliente: 'Festival local',
    desc: 'Video de lanzamiento con dirección de arte y post-producción.',
    tags: ['Video', 'Arte'],
    color: '#9B59FF', rgb: '155,89,255',
  },
  {
    id: 4, num: '04',
    titulo: 'Sesión Editorial',
    cliente: 'Moda independiente',
    desc: 'Lookbook fotográfico para colección cápsula primavera.',
    tags: ['Fotografía', 'Editorial'],
    color: '#FF6EC7', rgb: '255,110,199',
  },
  {
    id: 5, num: '05',
    titulo: 'Estrategia Digital',
    cliente: 'Restaurante gourmet',
    desc: 'Posicionamiento en redes + contenido mensual en 4 plataformas.',
    tags: ['Redes', 'Contenido'],
    color: '#00FF88', rgb: '0,255,136',
  },
]

export function ProyectosScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const pct = Math.max(0, Math.min(1, scrolled / total))

      setProgress(pct)
      const idx = Math.min(PROYECTOS.length - 1, Math.floor(pct * PROYECTOS.length))
      setActive(idx)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const p = PROYECTOS[active]

  return (
    <div ref={containerRef} style={{ height: `${PROYECTOS.length * 120}vh` }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100dvh' }}>

        {/* Gradient background that shifts with active project */}
        <div className="absolute inset-0 transition-all duration-700"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 0%, rgba(${p.rgb},0.08) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 80% 100%, rgba(${p.rgb},0.04) 0%, transparent 60%),
              var(--sky-0)
            `,
          }} />

        {/* Neon accent orb */}
        <div className="absolute rounded-full pointer-events-none transition-all duration-700"
          style={{
            width: 500, height: 500,
            right: '5%', top: '10%',
            background: `radial-gradient(circle, rgba(${p.rgb},0.06) 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }} />

        {/* Section label */}
        <div className="absolute top-10 left-8 md:left-16">
          <span className="font-mono-data text-xs tracking-[0.4em] uppercase"
            style={{ color: 'rgba(255,255,255,0.2)' }}>
            Portafolio
          </span>
        </div>

        {/* Progress dots */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          {PROYECTOS.map((proj, i) => (
            <div key={proj.id} className="transition-all duration-300"
              style={{
                width: i === active ? 8 : 4,
                height: i === active ? 8 : 4,
                borderRadius: '50%',
                background: i === active ? proj.color : 'rgba(255,255,255,0.15)',
                boxShadow: i === active ? `0 0 10px ${proj.color}` : 'none',
              }} />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-5xl mx-auto">

          {/* Project number */}
          <div key={`num-${active}`} className="animate-intro-in font-authority mb-4"
            style={{ fontSize: 'clamp(5rem,18vw,14rem)', lineHeight: 1,
              color: `rgba(${p.rgb},0.08)`,
              position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-55%)',
              pointerEvents: 'none', userSelect: 'none',
              animationDelay: '0ms' }}>
            {p.num}
          </div>

          {/* Tags */}
          <div key={`tags-${active}`} className="flex gap-2 mb-6 animate-intro-in"
            style={{ animationDelay: '50ms', opacity: 0 }}>
            {p.tags.map(t => (
              <span key={t} className="font-mono-data text-[10px] tracking-[0.3em] uppercase px-3 py-1 rounded-full border"
                style={{ color: p.color, borderColor: `rgba(${p.rgb},0.3)`, background: `rgba(${p.rgb},0.05)` }}>
                {t}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 key={`title-${active}`} className="font-authority leading-none mb-4 animate-intro-in"
            style={{
              fontSize: 'clamp(2.5rem,7vw,5.5rem)',
              color: '#fff',
              animationDelay: '100ms', opacity: 0,
              textShadow: `0 0 60px rgba(${p.rgb},0.3)`,
            }}>
            {p.titulo}
          </h2>

          {/* Client */}
          <p key={`cli-${active}`} className="font-mono-data text-sm mb-6 animate-intro-in"
            style={{ color: `rgba(${p.rgb},0.7)`, animationDelay: '160ms', opacity: 0 }}>
            — {p.cliente}
          </p>

          {/* Description */}
          <p key={`desc-${active}`} className="text-base leading-relaxed max-w-md mb-10 animate-intro-in"
            style={{ color: 'rgba(255,255,255,0.4)', animationDelay: '220ms', opacity: 0 }}>
            {p.desc}
          </p>

          {/* CTA */}
          <div key={`cta-${active}`} className="animate-intro-in"
            style={{ animationDelay: '300ms', opacity: 0 }}>
            <button className="font-mono-data text-xs tracking-widest uppercase px-8 py-3 border transition-all hover:-translate-y-0.5"
              style={{
                borderColor: `rgba(${p.rgb},0.4)`,
                color: p.color,
                background: `rgba(${p.rgb},0.05)`,
              }}>
              Ver proyecto →
            </button>
          </div>
        </div>

        {/* Bottom gradient blending into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, var(--sky-0))` }} />

        {/* Scan line decoration */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.015 }}
          aria-hidden>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', top: `${i * 2.5}%`, left: 0, right: 0, height: 1,
              background: 'rgba(255,255,255,0.5)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
