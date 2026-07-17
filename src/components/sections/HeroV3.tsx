'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DuckSVG } from '@/components/ui/DuckIllustration'
import { useQuoterStore } from '@/store/quoterStore'

const SERVICES = ['BRANDING', 'WEB', 'VIDEO', 'FOTOS', 'REDES', 'EVENTOS']

export function HeroV3() {
  const [serviceIdx, setServiceIdx] = useState(0)
  const [displayed,  setDisplayed]  = useState('BRANDING')
  const [isDeleting, setIsDeleting] = useState(false)
  const [duckFrame,  setDuckFrame]  = useState(0)
  const openPanel = useQuoterStore(s => s.openPanel)

  // Typewriter
  useEffect(() => {
    const service = SERVICES[serviceIdx]
    let t: ReturnType<typeof setTimeout>
    if (!isDeleting && displayed === service) {
      t = setTimeout(() => setIsDeleting(true), 2600)
    } else if (isDeleting && displayed === '') {
      setIsDeleting(false)
      setServiceIdx(i => (i + 1) % SERVICES.length)
    } else {
      t = setTimeout(() => {
        setDisplayed(isDeleting
          ? service.slice(0, displayed.length - 1)
          : service.slice(0, displayed.length + 1)
        )
      }, isDeleting ? 55 : 105)
    }
    return () => clearTimeout(t)
  }, [displayed, isDeleting, serviceIdx])

  // Duck animation frame
  useEffect(() => {
    const id = setInterval(() => setDuckFrame(f => f + 1), 80)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#000' }}>
      {/* Animated grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] pointer-events-none" />

      {/* Color orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-orb" style={{
          width: 750, height: 750, background: '#FF4600', opacity: 0.11,
          top: '-18%', left: '-12%', '--drift-duration': '28s',
        } as React.CSSProperties} />
        <div className="hero-orb" style={{
          width: 500, height: 500, background: '#0055FF', opacity: 0.08,
          top: '25%', right: '-6%', '--drift-duration': '21s', animationDelay: '-10s',
        } as React.CSSProperties} />
        <div className="hero-orb" style={{
          width: 380, height: 380, background: '#00CC59', opacity: 0.07,
          bottom: '-8%', left: '38%', '--drift-duration': '24s', animationDelay: '-15s',
        } as React.CSSProperties} />
      </div>

      {/* Radial gradient vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 90% at 40% 50%, transparent 15%, #000 78%)' }} />

      {/* Top-right auth */}
      <div className="absolute top-20 right-6 z-20 flex items-center gap-3">
        <Link href="/login"
          className="font-mono-data text-xs tracking-widest uppercase px-4 py-2 transition-colors"
          style={{ color: '#555', borderBottom: '1px solid #222' }}>
          Iniciar sesión
        </Link>
        <Link href="/registro"
          className="font-mono-data text-xs tracking-widest uppercase px-4 py-2 transition-all hover:bg-[rgba(255,70,0,0.2)]"
          style={{ background: 'rgba(255,70,0,0.08)', color: '#FF4600', border: '1px solid rgba(255,70,0,0.25)' }}>
          Registrarse
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16"
        style={{ paddingTop: 'clamp(5rem,13vh,9rem)', paddingBottom: 'clamp(3rem,8vh,6rem)' }}>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left: text */}
          <div className="flex-1 max-w-2xl">
            <p className="font-mono-data text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: '#FF4600' }}>
              // AGENCIA CREATIVA — COLOMBIA
            </p>

            <h1 className="font-authority leading-none mb-8 animate-glitch"
              style={{ letterSpacing: '0.01em' }}>
              <span className="block text-[clamp(5rem,14vw,10.5rem)]"
                style={{ color: '#fff', textShadow: '0 0 80px rgba(255,70,0,0.22)' }}>
                LQS.
              </span>
            </h1>

            {/* Typewriter */}
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-7">
              <span className="font-authority text-[clamp(1.6rem,4.5vw,3.2rem)]"
                style={{ color: '#444' }}>
                HACEMOS
              </span>
              <span className="font-authority text-[clamp(1.6rem,4.5vw,3.2rem)]"
                style={{ color: '#FF4600', minWidth: '6ch' }}>
                {displayed}
                <span className="animate-terminal-blink" style={{ color: '#FF4600' }}>_</span>
              </span>
            </div>

            <p className="font-readability text-base md:text-lg leading-[1.85] mb-10 max-w-md"
              style={{ color: '#777' }}>
              Producción creativa sin límites. Medios, crecimiento e ideación para marcas que se atreven a existir de verdad.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-14">
              <button
                onClick={openPanel}
                className="px-8 py-4 font-mono-data text-sm tracking-widest uppercase transition-all hover:scale-[1.03]"
                style={{ background: '#FF4600', color: '#000', boxShadow: '0 0 40px rgba(255,70,0,0)' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(255,70,0,0.45)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(255,70,0,0)')}>
                Cotizar proyecto →
              </button>
              <Link href="/planes"
                className="px-8 py-4 border font-mono-data text-sm tracking-widest uppercase transition-all hover:border-white hover:text-white"
                style={{ borderColor: '#282828', color: '#666' }}>
                Ver planes
              </Link>
              <Link href="/portafolio"
                className="px-8 py-4 font-mono-data text-sm tracking-widest uppercase transition-all hover:text-white"
                style={{ color: '#444' }}>
                Portafolio ↗
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-8 border-t" style={{ borderColor: '#141414' }}>
              {[{ n: '50+', l: 'Proyectos' }, { n: '7', l: 'Industrias' }, { n: '100%', l: 'Custom' }].map(s => (
                <div key={s.l}>
                  <p className="font-authority text-[2.4rem] leading-none"
                    style={{ color: '#fff', textShadow: '0 0 25px rgba(255,70,0,0.18)' }}>
                    {s.n}
                  </p>
                  <p className="font-mono-data text-[10px] tracking-widest uppercase mt-1"
                    style={{ color: '#3a3a3a' }}>
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Duck */}
          <div className="hidden lg:flex flex-shrink-0 items-center justify-center animate-float"
            style={{ filter: 'drop-shadow(0 0 100px rgba(255,70,0,0.12))' }}>
            <DuckSVG pose="photo" direction="left" size={300} frame={duckFrame} isMoving={false} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono-data text-[10px] tracking-[0.3em] uppercase" style={{ color: '#2a2a2a' }}>
          SCROLL
        </span>
        <div className="w-px h-10 animate-pulse"
          style={{ background: 'linear-gradient(to bottom, #FF4600 0%, transparent 100%)' }} />
      </div>
    </section>
  )
}
