'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const PROYECTOS = [
  { id: 1, titulo: 'Identidad Visual',       cliente: 'Natura Colombia',    servicio: 'Branding',    año: '2024', color: '#FF2D78', rgb: '255,45,120',  tags: ['Logo', 'Manual', 'Packaging'] },
  { id: 2, titulo: 'Plataforma Web',          cliente: 'TecnoStore SAS',     servicio: 'Web',         año: '2024', color: '#00E5FF', rgb: '0,229,255',   tags: ['Next.js', 'SEO', 'E-commerce'] },
  { id: 3, titulo: 'Campaña Audiovisual',     cliente: 'Summit 2024',        servicio: 'Video',       año: '2024', color: '#9B59FF', rgb: '155,89,255',  tags: ['Producción', 'Motion', 'Reel'] },
  { id: 4, titulo: 'Sesión Editorial',        cliente: 'Moda Bogotá',        servicio: 'Fotografía',  año: '2023', color: '#FF6EC7', rgb: '255,110,199', tags: ['Editorial', 'Lookbook'] },
  { id: 5, titulo: 'Estrategia Digital',      cliente: 'Fintech Colombia',   servicio: 'Redes',       año: '2024', color: '#00FF88', rgb: '0,255,136',   tags: ['Community', 'Meta Ads'] },
  { id: 6, titulo: 'Festival Gastronómico',   cliente: 'Sabor Medellín',     servicio: 'Eventos',     año: '2024', color: '#FFD700', rgb: '255,215,0',   tags: ['Logística', 'Cobertura'] },
]

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true) }, { threshold: 0.12 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, on }
}

function Card({ p, i }: { p: typeof PROYECTOS[0]; i: number }) {
  const [hovered, setHovered] = useState(false)
  const { ref, on } = useReveal()

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass cursor-pointer transition-all duration-400 relative overflow-hidden"
      style={{
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${i * 90}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 90}ms, border-color 0.3s, box-shadow 0.3s`,
        borderColor: hovered ? `rgba(${p.rgb},0.45)` : 'rgba(255,255,255,0.07)',
        boxShadow: hovered ? `0 8px 50px rgba(${p.rgb},0.12)` : 'none',
        padding: '1.75rem',
      }}>

      {/* Color line */}
      <div className="absolute top-0 left-0 right-0 h-px transition-all duration-400"
        style={{ background: hovered ? `linear-gradient(90deg, transparent, rgba(${p.rgb},0.8), transparent)` : 'transparent' }} />

      <div className="flex items-start justify-between mb-5">
        <span className="font-mono-data text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{ background: `rgba(${p.rgb},0.1)`, color: `rgba(${p.rgb},1)`, border: `1px solid rgba(${p.rgb},0.2)` }}>
          {p.servicio}
        </span>
        <span className="font-mono-data text-[10px]" style={{ color: 'rgba(255,255,255,0.15)' }}>{p.año}</span>
      </div>

      <h3 className="font-authority text-xl tracking-wider mb-1" style={{ color: '#fff' }}>
        {p.titulo}
      </h3>
      <p className="font-mono-data text-xs mb-5" style={{ color: 'rgba(255,255,255,0.25)' }}>
        {p.cliente}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {p.tags.map(t => (
          <span key={t} className="font-mono-data text-[9px] tracking-widest px-2 py-0.5"
            style={{ color: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ProyectosDestacados() {
  const { ref: hRef, on: hOn } = useReveal()

  return (
    <section className="section-compact py-28 px-6 lg:px-16" style={{ background: 'var(--sky-0)' }}>
      <div className="max-w-6xl mx-auto">

        <div ref={hRef} className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div style={{ opacity: hOn ? 1 : 0, transform: hOn ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
            <p className="font-mono-data text-xs tracking-[0.3em] uppercase mb-5"
              style={{ color: 'var(--neon-cyan)' }}>
              Proyectos
            </p>
            <h2 className="font-authority leading-none"
              style={{ fontSize: 'clamp(3rem,8vw,6rem)', color: '#fff' }}>
              TRABAJO<br />
              <span className="glow-cyan" style={{ color: 'var(--neon-cyan)' }}>REAL.</span>
            </h2>
          </div>
          <div style={{ opacity: hOn ? 1 : 0, transition: 'all 0.7s ease 0.15s' }}>
            <Link href="/portafolio"
              className="glass px-6 py-3 font-mono-data text-xs tracking-widest uppercase transition-all inline-block hover:border-white/20"
              style={{ color: 'rgba(255,255,255,0.45)' }}>
              Ver portafolio completo →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROYECTOS.map((p, i) => <Card key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </section>
  )
}
