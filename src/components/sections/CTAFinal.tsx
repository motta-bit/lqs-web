'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useQuoterStore } from '@/store/quoterStore'

export function CTAFinal() {
  const ref = useRef<HTMLElement>(null)
  const [on, setOn] = useState(false)
  const openPanel = useQuoterStore(s => s.openPanel)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const WA = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573247680413'}?text=Hola%2C%20quiero%20empezar%20un%20proyecto`

  return (
    <section ref={ref} className="section-compact relative py-32 px-6 lg:px-16 overflow-hidden"
      style={{ background: 'var(--sky-1)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Neon cloud accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full animate-cloud-drift"
          style={{ width: 600, height: 250, left: '-5%', top: '20%', background: '#9B59FF', opacity: 0.05, filter: 'blur(100px)', '--drift': '30s' } as React.CSSProperties} />
        <div className="absolute rounded-full animate-cloud-drift"
          style={{ width: 500, height: 200, right: '-5%', bottom: '10%', background: '#00E5FF', opacity: 0.05, filter: 'blur(100px)', '--drift': '24s', animationDelay: '-12s' } as React.CSSProperties} />
      </div>

      {/* Top iridescent line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), rgba(155,89,255,0.5), rgba(255,45,120,0.5), transparent)' }} />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="font-mono-data text-xs tracking-[0.35em] uppercase mb-8"
          style={{
            color: 'rgba(0,229,255,0.7)',
            opacity: on ? 1 : 0,
            transition: 'all 0.6s ease',
            transform: on ? 'none' : 'translateY(12px)',
          }}>
          ¿Empezamos?
        </p>

        <h2 className="font-authority leading-none mb-10 glow-white"
          style={{
            fontSize: 'clamp(3rem,10vw,7.5rem)',
            color: '#fff',
            opacity: on ? 1 : 0,
            transform: on ? 'none' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
          }}>
          CREAMOS<br />
          <span className="glow-cyan" style={{ color: 'var(--neon-cyan)' }}>LO QUE</span><br />
          <span className="glow-pink" style={{ color: 'var(--neon-pink)' }}>SEA.</span>
        </h2>

        <div className="flex flex-wrap gap-4 justify-center"
          style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(20px)', transition: 'all 0.7s ease 0.28s' }}>
          <button onClick={openPanel}
            className="glass glass-cyan px-10 py-4 font-mono-data text-sm tracking-widest uppercase transition-all hover:-translate-y-0.5"
            style={{ color: 'var(--neon-cyan)' }}>
            Cotizar ahora →
          </button>
          <a href={WA} target="_blank" rel="noopener"
            className="glass glass-green px-10 py-4 font-mono-data text-sm tracking-widest uppercase transition-all hover:-translate-y-0.5"
            style={{ color: 'var(--neon-green)' }}>
            WhatsApp
          </a>
          <Link href="/planes"
            className="glass px-10 py-4 font-mono-data text-sm tracking-widest uppercase transition-all hover:border-white/20"
            style={{ color: 'rgba(255,255,255,0.3)' }}>
            Ver planes
          </Link>
        </div>
      </div>
    </section>
  )
}
