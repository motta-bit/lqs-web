'use client'

import { useEffect, useState } from 'react'

type Phase = 'blank' | 'hello' | 'sub' | 'hold' | 'out' | 'ready' | 'enter' | 'done'

// Orbs estáticos (posiciones fijas, no Math.random para evitar hidratación)
const ORBS = [
  { w: 520, h: 520, t: '50%', l: '50%', tx: '-50%', ty: '-50%', color: '0,229,255',   op: 0.07, blur: 60, dur: '14s', delay: '0s'  },
  { w: 380, h: 380, t: '18%', l: '8%',  tx: '0',    ty: '0',    color: '155,89,255',  op: 0.05, blur: 80, dur: '20s', delay: '-6s' },
  { w: 300, h: 300, t: '65%', l: '72%', tx: '0',    ty: '0',    color: '255,45,120',  op: 0.04, blur: 70, dur: '17s', delay: '-9s' },
  { w: 260, h: 260, t: '80%', l: '15%', tx: '0',    ty: '0',    color: '0,255,136',   op: 0.04, blur: 60, dur: '22s', delay: '-3s' },
]

const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  cx: `${((i * 47 + 13) % 97) + 1}%`,
  cy: `${((i * 31 + 7)  % 94) + 1}%`,
  r:  (i % 3) * 0.5 + 0.3,
  dur: ((i % 4) + 2.5).toFixed(1),
  delay: ((i % 6) * 0.8).toFixed(1),
}))

export function IntroSequence({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('blank')

  useEffect(() => {
    // Secuencia cinemática
    const steps: [Phase, number][] = [
      ['hello',  320],
      ['sub',    1100],
      ['hold',   2000],
      ['out',    3600],
      ['ready',  4500],
      ['enter',  5200],
    ]
    let acc = 0
    const ts = steps.map(([p, d]) => { acc += d; return setTimeout(() => setPhase(p), acc) })
    return () => ts.forEach(clearTimeout)
  }, [])

  if (phase === 'done') return null

  const greetOn = ['hello','sub','hold'].includes(phase)
  const subOn   = ['sub','hold'].includes(phase)
  const fadingOut = phase === 'out'
  const readyOn   = ['ready','enter'].includes(phase)
  const enterOn   = phase === 'enter'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--sky-0)' }}>

      {/* ── Background: orbs flotantes ── */}
      <div className="absolute inset-0 pointer-events-none">
        {ORBS.map((o, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: o.w, height: o.h,
              top: o.t, left: o.l,
              transform: `translate(${o.tx}, ${o.ty})`,
              background: `radial-gradient(circle, rgba(${o.color},${o.op}) 0%, transparent 70%)`,
              filter: `blur(${o.blur}px)`,
              animation: `orb-drift ${o.dur} ease-in-out ${o.delay} infinite`,
            }} />
        ))}
        <svg className="absolute inset-0 w-full h-full" aria-hidden>
          {STARS.map(s => (
            <circle key={s.id} cx={s.cx} cy={s.cy} r={s.r} fill="white"
              style={{ opacity: 0.1, animation: `star-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
          ))}
        </svg>
      </div>

      {/* ── Fase saludo ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{
          opacity:    fadingOut ? 0 : (greetOn ? 1 : 0),
          transform:  fadingOut ? 'scale(1.06) translateY(-10px)' : 'scale(1) translateY(0)',
          filter:     fadingOut ? 'blur(10px)' : 'blur(0px)',
          transition: fadingOut
            ? 'opacity 0.85s cubic-bezier(0.4,0,1,1), transform 0.85s cubic-bezier(0.4,0,1,1), filter 0.85s ease'
            : 'opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1), filter 1s ease',
        }}>
        <h1 className="font-authority select-none text-center"
          style={{
            fontSize: 'clamp(5rem,16vw,11rem)',
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-0.01em',
            opacity:    greetOn ? 1 : 0,
            transform:  greetOn ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.95)',
            filter:     greetOn ? 'blur(0)' : 'blur(10px)',
            transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1), filter 1s ease',
          }}>
          Hola.
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 'clamp(1rem,2.5vw,1.4rem)',
          color: 'rgba(255,255,255,0.28)',
          marginTop: '1.2rem',
          letterSpacing: '0.06em',
          opacity:    subOn ? 1 : 0,
          transform:  subOn ? 'translateY(0)' : 'translateY(14px)',
          filter:     subOn ? 'blur(0)' : 'blur(6px)',
          transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s, filter 0.9s ease 0.1s',
        }}>
          ¿cómo estás?
        </p>
      </div>

      {/* ── Fase ready ── */}
      {readyOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* orb de acento detrás del texto */}
          <div className="absolute rounded-full pointer-events-none"
            style={{
              width: 700, height: 500,
              background: 'radial-gradient(ellipse, rgba(0,229,255,0.06) 0%, transparent 70%)',
              filter: 'blur(60px)',
              animation: 'ready-glow 3s ease-in-out infinite',
            }} />

          <h2 className="font-authority select-none text-center relative z-10"
            style={{
              fontSize: 'clamp(3.5rem,11vw,8rem)',
              color: 'var(--neon-cyan)',
              lineHeight: 1.05,
              textShadow: '0 0 60px rgba(0,229,255,0.35), 0 0 140px rgba(0,229,255,0.12)',
              animation: 'intro-word-in 1.1s cubic-bezier(0.16,1,0.3,1) forwards',
            }}>
            ¿Listo para<br />crear?
          </h2>

          <p className="font-mono-data text-xs tracking-[0.45em] uppercase mt-10 relative z-10"
            style={{
              color: 'rgba(255,255,255,0.18)',
              opacity:    enterOn ? 1 : 0,
              transform:  enterOn ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s',
            }}>
            LQS Studio · Agencia Creativa
          </p>

          <button
            onClick={() => { setPhase('done'); onDone() }}
            className="relative z-10 mt-9 font-mono-data text-sm tracking-widest uppercase px-16 py-5 transition-all duration-300"
            style={{
              color: 'var(--neon-cyan)',
              border: '1px solid rgba(0,229,255,0.35)',
              background: 'rgba(0,229,255,0.04)',
              backdropFilter: 'blur(16px)',
              opacity:    enterOn ? 1 : 0,
              transform:  enterOn ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.9s ease 0.28s, transform 0.9s ease 0.28s, box-shadow 0.3s, border-color 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow    = '0 0 40px rgba(0,229,255,0.18), 0 0 80px rgba(0,229,255,0.06)'
              e.currentTarget.style.borderColor  = 'rgba(0,229,255,0.7)'
              e.currentTarget.style.transform    = 'translateY(-3px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow    = 'none'
              e.currentTarget.style.borderColor  = 'rgba(0,229,255,0.35)'
              e.currentTarget.style.transform    = 'translateY(0)'
            }}
          >
            Entrar →
          </button>
        </div>
      )}

      {/* ── Línea decorativa inferior ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.2), transparent)' }} />
    </div>
  )
}
