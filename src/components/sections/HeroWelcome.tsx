'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useQuoterStore } from '@/store/quoterStore'

/* ── Starfield ────────────────────────────────────────────────────────── */
function Stars() {
  const [stars] = useState(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.4 + 0.4,
      delay: Math.random() * 6,
      dur: Math.random() * 4 + 3,
    }))
  )
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      {stars.map(s => (
        <circle
          key={s.id}
          cx={`${s.x}%`} cy={`${s.y}%`} r={s.r}
          fill="white"
          style={{
            animation: `star-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            opacity: 0.15,
          }}
        />
      ))}
    </svg>
  )
}

/* ── Cloud shapes ─────────────────────────────────────────────────────── */
function Clouds() {
  const shapes = [
    { w: 700, h: 300, x: -8, y: 5,  color: 'rgba(0,229,255,1)',   blur: 120, dur: '38s', delay: '0s'  },
    { w: 500, h: 220, x: 60, y: 15, color: 'rgba(155,89,255,1)',  blur: 100, dur: '28s', delay: '-12s' },
    { w: 600, h: 280, x: 20, y: 55, color: 'rgba(0,255,136,1)',   blur: 130, dur: '33s', delay: '-20s' },
    { w: 400, h: 200, x: 75, y: 65, color: 'rgba(255,45,120,1)',  blur: 110, dur: '25s', delay: '-8s'  },
    { w: 450, h: 180, x: 40, y: 80, color: 'rgba(56,189,248,1)',  blur: 120, dur: '30s', delay: '-16s' },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-cloud-drift"
          style={{
            width:  s.w, height: s.h,
            left:   `${s.x}%`, top: `${s.y}%`,
            background: s.color,
            filter: `blur(${s.blur}px)`,
            opacity: 0.06,
            '--drift': s.dur,
            animationDelay: s.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

/* ── Neon ring decoration ─────────────────────────────────────────────── */
function NeonRing({ color, size, style }: { color: string; size: number; style?: React.CSSProperties }) {
  return (
    <div className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        border: `1px solid ${color}`,
        opacity: 0.15,
        ...style,
      }}>
      <div className="absolute inset-0 rounded-full animate-pulse-ring"
        style={{ border: `1px solid ${color}`, opacity: 0.4 }} />
    </div>
  )
}

/* ── Action card ──────────────────────────────────────────────────────── */
interface Action {
  label: string
  sub: string
  color: string
  rgb: string
  icon: string
  href?: string
  quoter?: true
}

function ActionCard({ a, delay, onQuoter }: { a: Action; delay: number; onQuoter: () => void }) {
  const [hovered, setHovered] = useState(false)
  const inner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass cursor-pointer transition-all duration-300 relative overflow-hidden group"
      style={{
        animationDelay: `${delay}ms`,
        borderColor: hovered ? `rgba(${a.rgb},0.5)` : `rgba(${a.rgb},0.2)`,
        boxShadow: hovered
          ? `0 0 50px rgba(${a.rgb},0.18), inset 0 0 40px rgba(${a.rgb},0.04)`
          : `0 0 20px rgba(${a.rgb},0.06)`,
        transform: hovered ? 'translateY(-4px) scale(1.01)' : 'none',
        padding: '2rem 1.75rem',
      }}>

      {/* Shimmer sweep on hover */}
      {hovered && (
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 30%, rgba(${a.rgb},0.08) 50%, transparent 70%)`,
            backgroundSize: '200% auto',
            animation: 'shimmer-aero 1.2s linear infinite',
          }} />
      )}

      <div className="relative z-10">
        <div className="text-3xl mb-5" style={{ color: a.color }}>{a.icon}</div>
        <h3 className="font-authority text-2xl tracking-wider mb-2" style={{ color: '#fff' }}>
          {a.label}
        </h3>
        <p className="font-mono-data text-xs tracking-widest uppercase" style={{ color: `rgba(${a.rgb},0.7)` }}>
          {a.sub}
        </p>
        <div className="mt-5 flex items-center gap-2 font-mono-data text-xs"
          style={{ color: a.color, opacity: hovered ? 1 : 0, transition: 'opacity 0.25s' }}>
          Continuar <span>→</span>
        </div>
      </div>
    </div>
  )
  if (a.quoter) return <div onClick={onQuoter}>{inner}</div>
  return <Link href={a.href!}>{inner}</Link>
}

/* ── Main component ───────────────────────────────────────────────────── */
const ACTIONS: Action[] = [
  { label: 'Cotizar proyecto',    sub: 'Tu idea completa',          color: '#00E5FF', rgb: '0,229,255',   icon: '◆', quoter: true },
  { label: 'Ver servicios',       sub: 'Planes y precios',          color: '#00FF88', rgb: '0,255,136',   icon: '◈', href: '/planes' },
  { label: 'Ver portafolio',      sub: 'Trabajo real',              color: '#FF2D78', rgb: '255,45,120',  icon: '◉', href: '/portafolio' },
]

export function HeroWelcome() {
  const [visible, setVisible] = useState(false)
  const openPanel = useQuoterStore(s => s.openPanel)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="sky-bg relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Depth layers */}
      <Stars />
      <Clouds />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

      {/* Radial vignette bottom */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 60% at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 70%)' }} />

      {/* Decorative rings */}
      <NeonRing color="#00E5FF" size={500}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <NeonRing color="rgba(155,89,255,0.5)" size={700}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

      {/* Content */}
      <div className="relative z-10 text-center w-full max-w-4xl mx-auto">

        {/* Eyebrow tag */}
        <div
          className="inline-flex items-center gap-2 glass px-5 py-2 mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(12px)',
            transition: 'all 0.6s ease',
          }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00E5FF' }} />
          <span className="font-mono-data text-xs tracking-[0.35em] uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Agencia Creativa · Colombia
          </span>
        </div>

        {/* Main title */}
        <h1
          className="font-authority leading-none mb-4 glow-white"
          style={{
            fontSize: 'clamp(5rem,18vw,13rem)',
            color: '#fff',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
          }}>
          LQS.
        </h1>

        {/* Prompt */}
        <p
          className="font-authority tracking-widest mb-14"
          style={{
            fontSize: 'clamp(1rem,2.5vw,1.5rem)',
            color: 'rgba(255,255,255,0.28)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(16px)',
            transition: 'all 0.7s ease 0.22s',
          }}>
          ¿QUÉ QUIERES HACER?
        </p>

        {/* Action cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(24px)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s',
          }}>
          {ACTIONS.map((a, i) => (
            <ActionCard key={a.label} a={a} delay={i * 80} onQuoter={openPanel} />
          ))}
        </div>

        {/* Secondary links */}
        <div
          className="flex flex-wrap justify-center gap-6 mt-10"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'all 0.6s ease 0.55s',
          }}>
          <Link href="/login" className="font-mono-data text-xs tracking-widest uppercase transition-colors"
            style={{ color: 'rgba(255,255,255,0.2)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}>
            Iniciar sesión
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.08)' }}>·</span>
          <Link href="/registro" className="font-mono-data text-xs tracking-widest uppercase transition-colors"
            style={{ color: 'rgba(255,255,255,0.2)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(0,229,255,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}>
            Crear cuenta
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ opacity: visible ? 0.5 : 0, transition: 'opacity 0.8s ease 0.8s' }}>
        <div className="w-px h-14 animate-pulse"
          style={{ background: 'linear-gradient(to bottom, rgba(0,229,255,0.8), transparent)' }} />
      </div>
    </section>
  )
}
