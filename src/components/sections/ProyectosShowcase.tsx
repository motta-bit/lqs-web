'use client'

import { useEffect, useRef, useState } from 'react'

const PROYECTOS = [
  { id: 1, num: '01', titulo: 'Identidad Visual',     cliente: 'Startup de moda',      tags: ['Branding', 'Diseño'],      desc: 'Sistema de marca completo: logo, paleta, tipografía, manual de uso.',       color: '#FF2D78', rgb: '255,45,120'  },
  { id: 2, num: '02', titulo: 'Plataforma Web',        cliente: 'Tech startup',          tags: ['Web', 'UX/UI'],            desc: 'App web de alta conversión con diseño centrado en el usuario.',            color: '#00E5FF', rgb: '0,229,255'   },
  { id: 3, num: '03', titulo: 'Campaña Audiovisual',   cliente: 'Festival gastronómico', tags: ['Video', 'Dirección'],      desc: 'Video de lanzamiento, dirección de arte y post-producción completa.',     color: '#9B59FF', rgb: '155,89,255'  },
  { id: 4, num: '04', titulo: 'Sesión Editorial',      cliente: 'Moda independiente',    tags: ['Fotografía', 'Editorial'], desc: 'Lookbook fotográfico para colección cápsula de temporada.',               color: '#FF6EC7', rgb: '255,110,199' },
  { id: 5, num: '05', titulo: 'Estrategia Digital',    cliente: 'Restaurante gourmet',   tags: ['Redes', 'Contenido'],      desc: 'Posicionamiento en redes y contenido mensual en 4 plataformas.',         color: '#00FF88', rgb: '0,255,136'   },
]

function ProjectCard({ p, visible }: { p: typeof PROYECTOS[0]; visible: boolean }) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden transition-all duration-700"
      style={{
        background: `linear-gradient(135deg, rgba(${p.rgb},0.14) 0%, rgba(0,0,0,0.35) 100%)`,
        border: `1px solid rgba(${p.rgb},0.2)`,
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
      }}>
      {/* Número grande decorativo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-authority"
          style={{ fontSize: 'clamp(7rem,18vw,14rem)', color: `rgba(${p.rgb},0.09)`, lineHeight: 1 }}>
          {p.num}
        </span>
      </div>
      {/* Gradiente inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
        style={{ background: `linear-gradient(to top, rgba(${p.rgb},0.08), transparent)` }} />
      {/* Borde neon superior */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgba(${p.rgb},0.5), transparent)` }} />
    </div>
  )
}

export function ProyectosShowcase() {
  const [active, setActive]   = useState(0)
  const [visible, setVisible] = useState(false)
  const [tick, setTick]       = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const autoRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  // Reveal on enter viewport
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  // Auto-advance
  useEffect(() => {
    autoRef.current = setInterval(() => {
      setActive(a => (a + 1) % PROYECTOS.length)
      setTick(t => t + 1)
    }, 4500)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [])

  const goTo = (i: number) => {
    if (autoRef.current) clearInterval(autoRef.current)
    setActive(i); setTick(t => t + 1)
    autoRef.current = setInterval(() => {
      setActive(a => (a + 1) % PROYECTOS.length)
      setTick(t => t + 1)
    }, 4500)
  }

  const p = PROYECTOS[active]

  return (
    <section ref={sectionRef} className="full-section relative"
      style={{ background: 'var(--sky-0)', paddingTop: '5rem' }}>

      {/* Background shift per project */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse 70% 60% at 80% 50%, rgba(${p.rgb},0.055) 0%, transparent 65%)` }} />

      {/* Section label */}
      <div className="absolute top-8 left-8 md:left-16 z-10">
        <span className="font-mono-data text-[11px] tracking-[0.45em] uppercase"
          style={{ color: 'rgba(255,255,255,0.22)' }}>
          Portafolio · Lo que hacemos
        </span>
      </div>

      {/* Counter */}
      <div className="absolute top-8 right-8 md:right-16 z-10 font-mono-data text-xs"
        style={{ color: 'rgba(255,255,255,0.18)' }}>
        <span style={{ color: p.color, fontSize: '1rem', fontFamily: 'var(--font-bebas)' }}>{p.num}</span>
        {' / '}0{PROYECTOS.length}
      </div>

      {/* Main layout: text left, card right */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 px-8 md:px-20 w-full">

        {/* ── Columna izquierda: texto ── */}
        <div className="flex-1 max-w-xl">
          {/* Tags */}
          <div key={`tags-${tick}`} className="flex flex-wrap gap-2 mb-6 animate-intro-in">
            {p.tags.map(t => (
              <span key={t} className="font-mono-data text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 rounded-full border"
                style={{ color: p.color, borderColor: `rgba(${p.rgb},0.35)`, background: `rgba(${p.rgb},0.07)` }}>
                {t}
              </span>
            ))}
          </div>

          {/* Título */}
          <h2 key={`h-${tick}`} className="font-authority leading-none mb-5 animate-intro-in"
            style={{
              fontSize: 'clamp(3rem,7vw,5.5rem)',
              color: '#fff',
              animationDelay: '60ms', opacity: 0,
              textShadow: `0 0 80px rgba(${p.rgb},0.2)`,
            }}>
            {p.titulo}
          </h2>

          {/* Cliente */}
          <p key={`c-${tick}`} className="font-mono-data text-sm mb-5 animate-intro-in"
            style={{ color: `rgba(${p.rgb},0.75)`, animationDelay: '120ms', opacity: 0 }}>
            — {p.cliente}
          </p>

          {/* Descripción */}
          <p key={`d-${tick}`} className="leading-relaxed max-w-md mb-10 animate-intro-in"
            style={{
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.38)',
              animationDelay: '180ms', opacity: 0,
            }}>
            {p.desc}
          </p>

          {/* CTA */}
          <div key={`cta-${tick}`} className="animate-intro-in" style={{ animationDelay: '250ms', opacity: 0 }}>
            <button
              className="font-mono-data text-xs tracking-widest uppercase px-8 py-3.5 border transition-all duration-300 hover:-translate-y-0.5"
              style={{
                color: p.color,
                borderColor: `rgba(${p.rgb},0.4)`,
                background: `rgba(${p.rgb},0.05)`,
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 24px rgba(${p.rgb},0.2)` }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}>
              Ver proyecto →
            </button>
          </div>
        </div>

        {/* ── Columna derecha: tarjeta visual ── */}
        <div key={`card-${tick}`} className="flex-1 max-w-md w-full"
          style={{ aspectRatio: '4/3', minHeight: 220, maxHeight: 380 }}>
          <ProjectCard p={p} visible={visible} />
        </div>
      </div>

      {/* ── Navegación por puntos ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {PROYECTOS.map((proj, i) => (
          <button key={proj.id} onClick={() => goTo(i)}
            aria-label={`Proyecto ${proj.num}`}
            className="transition-all duration-400 rounded-full"
            style={{
              width:      i === active ? 28 : 7,
              height:     7,
              background: i === active ? proj.color : 'rgba(255,255,255,0.18)',
              boxShadow:  i === active ? `0 0 12px ${proj.color}` : 'none',
            }} />
        ))}
      </div>

      {/* Degradado inferior de transición */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(2,8,16,0.6))' }} />
    </section>
  )
}
