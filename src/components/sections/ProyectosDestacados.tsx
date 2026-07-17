'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const PROYECTOS = [
  { id: 1, titulo: 'Identidad Visual Completa', cliente: 'Natura Colombia', servicio: 'Branding', año: '2024', color: '#FF6B00', desc: 'Rediseño completo de marca para empresa de cosméticos naturales.', tags: ['Logo', 'Manual', 'Packaging'] },
  { id: 2, titulo: 'Plataforma E-commerce', cliente: 'TecnoStore SAS', servicio: 'Web', año: '2024', color: '#0080FF', desc: 'Tienda online Next.js con más de 2.000 productos y pagos integrados.', tags: ['Next.js', 'SEO', 'Payments'] },
  { id: 3, titulo: 'Campaña Audiovisual', cliente: 'Evento Summit 2024', servicio: 'Video', año: '2024', color: '#9900FF', desc: 'Producción completa: trailer, resumen y piezas digitales para evento de 3000 personas.', tags: ['Producción', 'Edición', 'Motion'] },
  { id: 4, titulo: 'Sesión Editorial', cliente: 'Moda Bogotá', servicio: 'Fotografía', año: '2023', color: '#FF2D55', desc: 'Lookbook editorial para colección temporada verano. 200+ piezas seleccionadas.', tags: ['Editorial', 'Retoque', 'Lookbook'] },
  { id: 5, titulo: 'Estrategia Redes 360', cliente: 'Fintech Colombia', servicio: 'Redes', año: '2024', color: '#00CC59', desc: 'Gestión completa: community, pauta digital y crecimiento orgánico x3 en 60 días.', tags: ['Community', 'Meta Ads', 'Analytics'] },
  { id: 6, titulo: 'Festival Gastronómico', cliente: 'Sabor Medellín', servicio: 'Eventos', año: '2024', color: '#FFD700', desc: 'Producción integral de evento con 5.000 asistentes, señalética y cobertura completa.', tags: ['Logística', 'Señalética', 'Cobertura'] },
]

function ProjectCard({ p, i }: { p: typeof PROYECTOS[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    setTilt({ x: y * 8, y: -x * 8 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      className="relative border cursor-pointer transition-all duration-300"
      style={{
        borderColor: hovered ? p.color : '#1a1a1a',
        background: hovered ? `rgba(${hexToRgb(p.color)},0.04)` : '#080808',
        transform: hovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : 'perspective(800px) rotateX(0) rotateY(0) translateY(0)',
        boxShadow: hovered ? `0 20px 60px rgba(${hexToRgb(p.color)},0.12)` : 'none',
        opacity: visible ? 1 : 0,
        transitionDelay: visible ? `${i * 80}ms` : '0ms',
        transitionProperty: 'all',
      }}>

      {/* Top color bar */}
      <div className="h-0.5 w-full transition-all duration-500"
        style={{ background: hovered ? p.color : '#1a1a1a' }} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="font-mono-data text-[10px] tracking-widest uppercase px-2 py-1"
            style={{ background: `rgba(${hexToRgb(p.color)},0.12)`, color: p.color }}>
            {p.servicio}
          </span>
          <span className="font-mono-data text-[10px]" style={{ color: '#2a2a2a' }}>{p.año}</span>
        </div>

        <h3 className="font-authority text-xl tracking-wider mb-1" style={{ color: '#fff' }}>
          {p.titulo}
        </h3>
        <p className="font-mono-data text-xs mb-3" style={{ color: '#444' }}>
          {p.cliente}
        </p>

        <p className={`font-readability text-sm leading-relaxed mb-4 transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
          style={{ color: '#888' }}>
          {p.desc}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {p.tags.map(tag => (
            <span key={tag} className="font-mono-data text-[9px] tracking-wider px-2 py-0.5"
              style={{ color: '#444', border: '1px solid #1a1a1a' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `${r},${g},${b}`
}

export function ProyectosDestacados() {
  const titleRef = useRef<HTMLDivElement>(null)
  const [titleVisible, setTitleVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTitleVisible(true) }, { threshold: 0.2 })
    if (titleRef.current) obs.observe(titleRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="section-compact py-24 px-6" style={{ background: '#050505' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={titleRef} className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div style={{ opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'none' : 'translateY(30px)', transition: 'all 0.7s ease' }}>
            <p className="font-mono-data text-xs tracking-widest uppercase mb-4"
              style={{ color: '#FF4600' }}>
              ◆ Trabajo real
            </p>
            <h2 className="font-authority text-[clamp(3rem,8vw,6rem)] leading-none"
              style={{ color: '#fff' }}>
              PROYECTOS<br />
              <span style={{ color: '#FF4600' }}>DESTACADOS.</span>
            </h2>
          </div>
          <div style={{ opacity: titleVisible ? 1 : 0, transition: 'all 0.7s ease 0.2s' }}>
            <p className="font-readability text-sm max-w-xs" style={{ color: '#555' }}>
              Resultados reales para clientes reales. Cada proyecto es único.
            </p>
            <Link href="/portafolio"
              className="inline-block mt-4 font-mono-data text-xs tracking-widest uppercase transition-all hover:text-white"
              style={{ color: '#FF4600' }}>
              Ver portafolio completo →
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROYECTOS.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
