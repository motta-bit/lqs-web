'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useQuoterStore } from '@/store/quoterStore'

export function CTAFinal() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const openPanel = useQuoterStore(s => s.openPanel)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.25 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const WA_URL = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573247680413'}?text=Hola%2C%20quiero%20empezar%20un%20proyecto%20con%20LQS`

  return (
    <section
      ref={ref}
      className="section-compact relative overflow-hidden py-32 px-6"
      style={{ background: '#040404' }}>

      {/* Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-orb" style={{
          width: 600, height: 600, background: '#FF4600', opacity: 0.06,
          top: '-20%', left: '20%', '--drift-duration': '30s',
        } as React.CSSProperties} />
        <div className="hero-orb" style={{
          width: 400, height: 400, background: '#0055FF', opacity: 0.04,
          bottom: '-10%', right: '10%', '--drift-duration': '22s', animationDelay: '-12s',
        } as React.CSSProperties} />
      </div>

      <div className="absolute inset-0 bg-grid-pattern opacity-[0.07] pointer-events-none" />

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #FF4600, transparent)' }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="font-mono-data text-xs tracking-[0.3em] uppercase mb-6"
          style={{ color: '#FF4600', opacity: visible ? 1 : 0, transition: 'all 0.7s ease', transform: visible ? 'none' : 'translateY(20px)' }}>
          ◆ ¿Empezamos?
        </p>

        <h2
          className="font-authority leading-none mb-8"
          style={{
            color: '#fff',
            fontSize: 'clamp(2.8rem,9vw,7rem)',
            textShadow: '0 0 100px rgba(255,70,0,0.2)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
          }}>
          CREAMOS LO<br />
          <span style={{ color: '#FF4600' }}>QUE SEA.</span>
        </h2>

        <p className="font-readability text-lg leading-relaxed mb-12 max-w-xl mx-auto"
          style={{
            color: '#666',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(20px)',
            transition: 'all 0.7s ease 0.25s',
          }}>
          Cuéntanos tu idea y construimos juntos la solución creativa perfecta para tu negocio.
        </p>

        <div className="flex flex-wrap gap-4 justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(20px)',
            transition: 'all 0.7s ease 0.35s',
          }}>
          <button
            onClick={openPanel}
            className="px-10 py-4 font-mono-data text-sm tracking-widest uppercase transition-all hover:scale-105"
            style={{ background: '#FF4600', color: '#000', boxShadow: '0 0 50px rgba(255,70,0,0)' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(255,70,0,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(255,70,0,0)')}>
            Cotizar ahora →
          </button>
          <a href={WA_URL} target="_blank" rel="noopener"
            className="px-10 py-4 border font-mono-data text-sm tracking-widest uppercase transition-all hover:border-green-500 hover:text-green-400"
            style={{ borderColor: '#1a1a1a', color: '#555' }}>
            💬 WhatsApp
          </a>
          <Link href="/planes"
            className="px-10 py-4 font-mono-data text-sm tracking-widest uppercase transition-all hover:text-white"
            style={{ color: '#333' }}>
            Ver planes
          </Link>
        </div>

        <p className="font-mono-data text-xs mt-10 tracking-widest" style={{ color: '#222' }}>
          Respuesta en menos de 24 horas · Cotización sin costo
        </p>
      </div>
    </section>
  )
}
