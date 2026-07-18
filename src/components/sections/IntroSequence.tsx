'use client'

import { useEffect, useState } from 'react'

type Phase = 'hola' | 'como' | 'together' | 'fadeout' | 'ready' | 'done'

interface Props { onDone: () => void }

function Stars() {
  const [pts] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      r: Math.random() * 1.2 + 0.3, d: Math.random() * 4 + 2, dl: Math.random() * 5,
    }))
  )
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      {pts.map(p => (
        <circle key={p.id} cx={`${p.x}%`} cy={`${p.y}%`} r={p.r} fill="white"
          style={{ animation: `star-twinkle ${p.d}s ease-in-out ${p.dl}s infinite`, opacity: 0.12 }} />
      ))}
    </svg>
  )
}

export function IntroSequence({ onDone }: Props) {
  const [phase, setPhase] = useState<Phase>('hola')

  useEffect(() => {
    const seq: [Phase, number][] = [
      ['como',     900],
      ['together', 700],
      ['fadeout',  1800],
      ['ready',    600],
    ]
    let total = 0
    const timers: ReturnType<typeof setTimeout>[] = []
    for (const [p, delay] of seq) {
      total += delay
      const t = setTimeout(() => setPhase(p), total)
      timers.push(t)
    }
    return () => timers.forEach(clearTimeout)
  }, [])

  if (phase === 'done') return null

  const greetingVisible = phase === 'hola' || phase === 'como' || phase === 'together'
  const fadingOut       = phase === 'fadeout'
  const readyVisible    = phase === 'ready'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'var(--sky-0)' }}>

      <Stars />

      {/* Subtle neon orb */}
      <div className="absolute pointer-events-none rounded-full"
        style={{ width: 400, height: 400, top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)' }} />

      {/* Greeting */}
      {(greetingVisible || fadingOut) && (
        <div className="text-center select-none" style={{
          opacity: fadingOut ? 0 : 1,
          transition: fadingOut ? 'opacity 0.7s ease' : 'none',
        }}>
          <h1 className="font-authority leading-none" style={{ fontSize: 'clamp(3rem,10vw,7rem)', color: '#fff' }}>
            {(phase === 'hola' || phase === 'como' || phase === 'together') && (
              <span className="block animate-intro-in" style={{ animationDelay: '0ms' }}>
                Hola.
              </span>
            )}
            {(phase === 'como' || phase === 'together') && (
              <span className="block animate-intro-in" style={{ color: 'rgba(255,255,255,0.35)', animationDelay: '0ms' }}>
                ¿cómo estás?
              </span>
            )}
          </h1>
        </div>
      )}

      {/* Ready */}
      {readyVisible && (
        <div className="text-center select-none">
          <h2 className="font-authority leading-none mb-10 animate-intro-in animate-ready-glow"
            style={{ fontSize: 'clamp(2.5rem,8vw,5.5rem)', color: 'var(--neon-cyan)',
              animationDelay: '0ms',
            }}>
            ¿Listo para crear?
          </h2>
          <p className="font-mono-data text-xs tracking-[0.4em] uppercase mb-10 animate-intro-in"
            style={{ color: 'rgba(255,255,255,0.25)', animationDelay: '200ms', opacity: 0 }}>
            LQS Studio · Agencia Creativa
          </p>
          <button
            onClick={() => { setPhase('done'); onDone() }}
            className="glass animate-btn-pulse animate-intro-in font-mono-data text-sm tracking-widest uppercase px-12 py-4 transition-all hover:-translate-y-0.5"
            style={{ color: 'var(--neon-cyan)', borderColor: 'rgba(0,229,255,0.35)',
              animationDelay: '400ms', opacity: 0 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,229,255,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}>
            Entrar →
          </button>
        </div>
      )}
    </div>
  )
}
