'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuoterStore } from '@/store/quoterStore'

interface Tier { name: string; price: string; features: string[]; popular?: boolean }
interface Tab  { id: string; label: string; color: string; rgb: string; tiers: Tier[] }

const TABS: Tab[] = [
  { id: 'branding', label: 'Branding',   color: '#FF2D78', rgb: '255,45,120',
    tiers: [
      { name: 'Esencial',  price: '$850k',   features: ['Logo + variaciones','Paleta de colores','Tipografía','Archivos vectoriales'] },
      { name: 'Estándar',  price: '$2.5M',   features: ['+ Manual de marca','Papelería corporativa','Guía digital','Aplicaciones'], popular: true },
      { name: 'Premium',   price: '$5M',     features: ['+ Naming','Brand strategy','Identidad en movimiento','Soporte 3 meses'] },
    ] },
  { id: 'web',      label: 'Web',        color: '#00E5FF', rgb: '0,229,255',
    tiers: [
      { name: 'Landing',   price: '$1.2M',   features: ['Landing responsive','Formulario','Analytics','Hosting + SSL'] },
      { name: 'Sitio',     price: '$3.5M',   features: ['+ Hasta 8 páginas','SEO técnico','CMS','WhatsApp integrado'], popular: true },
      { name: 'Plataforma',price: 'Desde $7M',features: ['+ E-commerce','Auth usuarios','Panel admin','APIs'] },
    ] },
  { id: 'video',    label: 'Video',      color: '#9B59FF', rgb: '155,89,255',
    tiers: [
      { name: 'Cápsula',   price: '$800k',   features: ['1 video (1 min)','Guión incluido','Color grading','Entrega 4K'] },
      { name: 'Pack',      price: '$2.2M',   features: ['3 piezas','Video + 2 reels','Motion graphics','Música licenciada'], popular: true },
      { name: 'Producción',price: '$4.5M',   features: ['Producción completa','Storyboard','Post-producción','Versiones ads'] },
    ] },
  { id: 'foto',     label: 'Fotografía', color: '#FF6EC7', rgb: '255,110,199',
    tiers: [
      { name: 'Básica',    price: '$600k',   features: ['2h sesión','20 fotos editadas','Retoque','Alta resolución'] },
      { name: 'Estándar',  price: '$1.5M',   features: ['4h sesión','60 fotos','Producto incluido','2 locaciones'], popular: true },
      { name: 'Editorial', price: '$3M',     features: ['Día completo','150+ fotos','Dirección de arte','Lookbook'] },
    ] },
  { id: 'redes',    label: 'Redes',      color: '#00FF88', rgb: '0,255,136',
    tiers: [
      { name: 'Esencial',  price: '$900k/mes',  features: ['12 posts','3 plataformas','Diseño plantillas','Reporte'] },
      { name: 'Activo',    price: '$2.2M/mes',  features: ['20 posts + stories','Community','Pauta $300k','Copywriting'], popular: true },
      { name: 'Full 360',  price: '$4M/mes',    features: ['Estrategia omnicanal','Contenido ilimitado','Pauta avanzada','Dashboard live'] },
    ] },
  { id: 'eventos',  label: 'Eventos',    color: '#FFD700', rgb: '255,215,0',
    tiers: [
      { name: 'Cobertura', price: '$1.5M',   features: ['Fotografía 4h','Video resumen','50 fotos editadas','Entrega 3 días'] },
      { name: 'Producción',price: '$3.5M',   features: ['Foto + video','Transmisión live','Señalética','8h cobertura'], popular: true },
      { name: 'Integral',  price: 'Cotizar', features: ['Producción completa','Diseño de espacios','Logística','RRPP digitales'] },
    ] },
  { id: 'marketing',label: 'Marketing',  color: '#38BDF8', rgb: '56,189,248',
    tiers: [
      { name: 'Básico',    price: '$1.2M/mes',  features: ['Auditoría digital','Estrategia','Pauta $400k','Email marketing'] },
      { name: 'Crecimiento',price: '$2.8M/mes', features: ['Meta + Google','Pauta $800k','Retargeting','Funnel conversión'], popular: true },
      { name: 'Enterprise',price: '$6M/mes',    features: ['Estrategia 360°','CRM + automatización','Equipo dedicado','Consultor senior'] },
    ] },
]

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, on }
}

export function PlanesTabs() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [animKey,   setAnimKey]   = useState(0)
  const openPanel = useQuoterStore(s => s.openPanel)
  const { ref: headRef, on: headOn } = useReveal()
  const tab = TABS[activeIdx]

  const handleTab = (i: number) => { setActiveIdx(i); setAnimKey(k => k + 1) }

  return (
    <section
      className="section-compact py-28 px-6 lg:px-16 transition-all duration-700"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(${tab.rgb},0.04) 0%, var(--sky-0) 60%)`,
        borderTop: `1px solid rgba(${tab.rgb},0.1)`,
      }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div ref={headRef} className="mb-14" style={{ opacity: headOn ? 1 : 0, transform: headOn ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <p className="font-mono-data text-xs tracking-[0.3em] uppercase mb-5 transition-colors duration-500"
            style={{ color: tab.color }}>
            Servicios
          </p>
          <h2 className="font-authority leading-none transition-all duration-500"
            style={{ fontSize: 'clamp(3rem,8vw,5.5rem)', color: '#fff' }}>
            PLANES <span style={{ color: tab.color }}>LQS.</span>
          </h2>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto gap-2 mb-12 pb-1" style={{ scrollbarWidth: 'none' }}>
          {TABS.map((t, i) => (
            <button key={t.id} onClick={() => handleTab(i)}
              className="glass flex-shrink-0 px-5 py-2.5 font-mono-data text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                color: activeIdx === i ? t.color : 'rgba(255,255,255,0.25)',
                borderColor: activeIdx === i ? `rgba(${t.rgb},0.45)` : 'rgba(255,255,255,0.06)',
                background: activeIdx === i ? `rgba(${t.rgb},0.08)` : 'rgba(255,255,255,0.03)',
                boxShadow: activeIdx === i ? `0 0 20px rgba(${t.rgb},0.1)` : 'none',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div key={animKey} className="animate-tab-slide grid grid-cols-1 md:grid-cols-3 gap-4">
          {tab.tiers.map((tier, ti) => (
            <div
              key={tier.name}
              className="glass relative transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: tier.popular ? `rgba(${tab.rgb},0.4)` : 'rgba(255,255,255,0.07)',
                background: tier.popular ? `rgba(${tab.rgb},0.05)` : 'rgba(255,255,255,0.03)',
                boxShadow: tier.popular ? `0 0 50px rgba(${tab.rgb},0.08)` : 'none',
                animationDelay: `${ti * 80}ms`,
                padding: '2rem',
              }}>

              {tier.popular && (
                <div className="absolute -top-3 left-5">
                  <span className="font-mono-data text-[10px] tracking-widest uppercase px-3 py-1"
                    style={{ background: tab.color, color: '#000' }}>
                    ★ Popular
                  </span>
                </div>
              )}

              <p className="font-mono-data text-xs tracking-widest uppercase mb-1 transition-colors duration-500"
                style={{ color: tab.color }}>
                {tier.name}
              </p>
              <p className="font-authority text-3xl mb-6" style={{ color: '#fff' }}>{tier.price}</p>

              <ul className="space-y-2.5 mb-8">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 font-readability text-sm"
                    style={{ color: 'rgba(255,255,255,0.45)' }}>
                    <span className="flex-shrink-0 mt-0.5 text-[10px] transition-colors duration-500"
                      style={{ color: tab.color }}>◆</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button onClick={openPanel}
                className="w-full py-3 font-mono-data text-xs tracking-widest uppercase transition-all duration-300"
                style={{
                  background: tier.popular ? tab.color : 'transparent',
                  color: tier.popular ? '#000' : tab.color,
                  border: `1px solid ${tier.popular ? tab.color : `rgba(${tab.rgb},0.3)`}`,
                }}
                onMouseEnter={e => { if (!tier.popular) e.currentTarget.style.background = `rgba(${tab.rgb},0.1)` }}
                onMouseLeave={e => { if (!tier.popular) e.currentTarget.style.background = 'transparent' }}>
                {tier.price === 'Cotizar' ? 'Solicitar cotización' : 'Elegir plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
