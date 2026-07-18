'use client'

import { useEffect, useRef, useState } from 'react'
import { IntroSequence }      from './IntroSequence'
import { HeroWelcome }        from './HeroWelcome'
import { ProyectosShowcase }  from './ProyectosShowcase'
import { MuestrasEmpresas }   from './MuestrasEmpresas'
import { PlanesTabs }         from './PlanesTabs'
import { CTAFinal }           from './CTAFinal'

const SKIP_KEY = 'lqs_intro_seen'

// ── Separador visual entre secciones ─────────────────────────────────────
function SectionBreak({ label, color, rgb }: { label: string; color: string; rgb: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative py-20 flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--sky-0)' }}>

      {/* Línea horizontal neon */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 5%, rgba(${rgb},0.3) 40%, rgba(${rgb},0.3) 60%, transparent 95%)`,
          opacity: vis ? 1 : 0,
          transition: 'opacity 1.2s ease 0.1s',
        }} />

      {/* Chip central */}
      <div className="relative px-7 py-2.5 font-mono-data text-[11px] tracking-[0.5em] uppercase"
        style={{
          color,
          background: 'var(--sky-0)',
          border: `1px solid rgba(${rgb},0.25)`,
          boxShadow: `0 0 30px rgba(${rgb},0.08)`,
          opacity:   vis ? 1 : 0,
          transform: vis ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
          transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s',
        }}>
        {label}
      </div>

      {/* Punto neon izquierdo */}
      <div className="absolute left-[calc(50%-80px)] top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 5, height: 5,
          background: color,
          boxShadow: `0 0 10px ${color}`,
          opacity: vis ? 1 : 0,
          transition: 'opacity 0.6s ease 0.5s',
        }} />
      {/* Punto neon derecho */}
      <div className="absolute left-[calc(50%+75px)] top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 5, height: 5,
          background: color,
          boxShadow: `0 0 10px ${color}`,
          opacity: vis ? 1 : 0,
          transition: 'opacity 0.6s ease 0.5s',
        }} />
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────
export function HomeClient() {
  const [showIntro, setShowIntro] = useState(false)
  const [ready,     setReady]     = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SKIP_KEY)) setReady(true)
    else setShowIntro(true)
  }, [])

  const handleIntroDone = () => {
    sessionStorage.setItem(SKIP_KEY, '1')
    setShowIntro(false)
    setReady(true)
  }

  return (
    <>
      {showIntro && <IntroSequence onDone={handleIntroDone} />}

      {ready && (
        <div>
          {/* ── 1. Hero / Inicio ── */}
          <section id="inicio" className="full-section">
            <HeroWelcome />
          </section>

          {/* Separador */}
          <SectionBreak label="Portafolio" color="var(--neon-pink)" rgb="255,45,120" />

          {/* ── 2. Portafolio ── */}
          <section id="portafolio">
            <ProyectosShowcase />
          </section>

          {/* Separador */}
          <SectionBreak label="Clientes" color="rgba(255,255,255,0.4)" rgb="255,255,255" />

          {/* ── 3. Clientes ── */}
          <section id="clientes" className="full-section" style={{ minHeight: 'auto', padding: '4rem 0' }}>
            <MuestrasEmpresas />
          </section>

          {/* Separador */}
          <SectionBreak label="Planes" color="var(--neon-cyan)" rgb="0,229,255" />

          {/* ── 4. Planes ── */}
          <section id="planes" className="full-section">
            <PlanesTabs />
          </section>

          {/* Separador */}
          <SectionBreak label="Contacto" color="var(--neon-green)" rgb="0,255,136" />

          {/* ── 5. CTA / Contacto ── */}
          <section id="contacto">
            <CTAFinal />
          </section>
        </div>
      )}
    </>
  )
}
