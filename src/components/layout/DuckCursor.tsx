'use client'

import { useEffect, useRef, useState } from 'react'
import { useCursorDuck } from '@/hooks/useCursorDuck'
import { useIsMobile }   from '@/hooks/useMediaQuery'

// ─── Colores: solo blanco + trazo negro, fiel al boceto ──────────────────
const W = '#FFFFFF'
const S = '#0d0d0d'

type Pose = 'idle' | 'walking' | 'sleeping'

// ─── SVG exacto al boceto: cuerpo oval grande, cabeza pequeña, botas ─────
export function DuckSVG({
  pose      = 'idle',
  direction = 'right',
  frame     = 0,
  size      = 52,
  isMoving  = false,
}: {
  pose?:      Pose
  direction?: 'left' | 'right'
  frame?:     number
  size?:      number
  isMoving?:  boolean
}) {
  const flip   = direction === 'left' ? -1 : 1
  const bob    = Math.sin(frame * 0.05) * 1.2
  const waddle = pose === 'walking' ? Math.sin(frame * 0.22) * 2.5 : 0
  const legL   = pose === 'walking' ? Math.sin(frame  * 0.28) * 16 : 0
  const legR   = pose === 'walking' ? Math.sin(frame  * 0.28 + Math.PI) * 16 : 0

  // viewBox 0 0 68 90 → head upper-right, body dominant center, boots bottom
  return (
    <svg
      width={size}
      height={Math.round(size * 90 / 68)}
      viewBox="0 0 68 90"
      style={{ transform: `scaleX(${flip})`, overflow: 'visible' }}
      aria-hidden="true"
    >
      <g transform={`translate(${waddle}, ${bob})`}>

        {/* ── Cuerpo — elipse grande, domina la figura ── */}
        <ellipse
          cx="31" cy="50" rx="21" ry="16"
          fill={W} stroke={S} strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* ── Cuello — arco corto conectando cuerpo con cabeza ── */}
        <path
          d="M 40 36 Q 42 40 43 44"
          fill="none" stroke={S} strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* ── Cabeza — círculo claramente más pequeño que cuerpo ── */}
        <circle
          cx="44" cy="26" r="12"
          fill={W} stroke={S} strokeWidth="2.2"
        />

        {/* ── Ojo ── */}
        {pose !== 'sleeping' ? (
          <circle cx="48" cy="22" r="1.8" fill={S} />
        ) : (
          <path
            d="M 45 22 Q 48 19.5 51 22"
            stroke={S} strokeWidth="1.6" fill="none" strokeLinecap="round"
          />
        )}

        {/* ── Pico — triángulo pequeño apuntando derecha ── */}
        <path
          d="M 54 23 L 62 26 L 54 29 Z"
          fill={W} stroke={S} strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* ── Patas — dos líneas delgadas rectas ── */}
        {pose !== 'sleeping' && (
          <>
            {/* Pata izquierda */}
            <line
              x1="24" y1="64" x2="24" y2="74"
              stroke={S} strokeWidth="2.2" strokeLinecap="round"
              style={{ transform: `rotate(${legL}deg)`, transformOrigin: '24px 64px' }}
            />
            {/* Pata derecha */}
            <line
              x1="36" y1="64" x2="36" y2="74"
              stroke={S} strokeWidth="2.2" strokeLinecap="round"
              style={{ transform: `rotate(${legR}deg)`, transformOrigin: '36px 64px' }}
            />

            {/* ── Bota izquierda ── */}
            <g style={{ transform: `rotate(${legL}deg)`, transformOrigin: '24px 64px' }}>
              {/* caña */}
              <rect x="17" y="70" width="13" height="9" rx="1.5"
                fill={W} stroke={S} strokeWidth="2" />
              {/* suela / punta */}
              <rect x="15" y="76" width="19" height="5" rx="2"
                fill={W} stroke={S} strokeWidth="2" />
              {/* líneas de textura */}
              <line x1="19" y1="73" x2="28" y2="73" stroke={S} strokeWidth="0.9" opacity="0.4" />
              <line x1="19" y1="76" x2="28" y2="76" stroke={S} strokeWidth="0.9" opacity="0.4" />
            </g>

            {/* ── Bota derecha ── */}
            <g style={{ transform: `rotate(${legR}deg)`, transformOrigin: '36px 64px' }}>
              {/* caña */}
              <rect x="29" y="70" width="13" height="9" rx="1.5"
                fill={W} stroke={S} strokeWidth="2" />
              {/* suela / punta */}
              <rect x="27" y="76" width="19" height="5" rx="2"
                fill={W} stroke={S} strokeWidth="2" />
              {/* líneas de textura */}
              <line x1="31" y1="73" x2="40" y2="73" stroke={S} strokeWidth="0.9" opacity="0.4" />
              <line x1="31" y1="76" x2="40" y2="76" stroke={S} strokeWidth="0.9" opacity="0.4" />
            </g>
          </>
        )}

        {/* ── Zzz durmiendo ── */}
        {pose === 'sleeping' && (
          <g opacity="0.45" fontFamily="sans-serif" fontWeight="bold" fill={S}>
            <text x="57" y="18" fontSize="6">z</text>
            <text x="62" y="11" fontSize="4.5">z</text>
            <text x="66" y="5"  fontSize="3">z</text>
          </g>
        )}

      </g>
    </svg>
  )
}

// ─── Cursor pato (desktop) ────────────────────────────────────────────────
export function DuckCursor() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  const duck = useCursorDuck()
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    setMounted(true)
    document.body.style.cursor = 'none'
    return () => { document.body.style.cursor = 'auto' }
  }, [])

  useEffect(() => {
    let f = 0
    const id = setInterval(() => { f++; setFrame(f) }, 28)
    return () => clearInterval(id)
  }, [])

  if (!mounted || isMobile) return null

  return (
    <>
      <div className="fixed pointer-events-none z-[999]"
        style={{ left: duck.x - 24, top: duck.y - 50, willChange: 'transform' }}>
        <DuckSVG
          pose={duck.isMoving ? 'walking' : 'idle'}
          direction={duck.direction}
          frame={frame}
          isMoving={duck.isMoving}
          size={52}
        />
      </div>
      {/* Punto neon-cyan */}
      <div className="fixed pointer-events-none z-[998] rounded-full"
        style={{
          left: duck.x - 3, top: duck.y - 3,
          width: 6, height: 6,
          background: 'var(--neon-cyan)',
          boxShadow: '0 0 8px var(--neon-cyan)',
          willChange: 'transform',
        }} />
    </>
  )
}

// ─── Mascota flotante ─────────────────────────────────────────────────────
export function DuckFloat() {
  const [frame, setFrame] = useState(0)
  const [visible, setVisible] = useState(false)
  const [pose, setPose]     = useState<Pose>('idle')
  const [msg,  setMsg]      = useState<string | null>(null)
  const [side, setSide]     = useState<'left' | 'right'>('right')

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let f = 0
    const id = setInterval(() => { f++; setFrame(f) }, 36)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const secs = [
      { id: 'portafolio', msg: '¡Mira lo que hicimos!', pose: 'idle' as Pose, side: 'right' as const },
      { id: 'planes',     msg: '¿Cuál es el tuyo?',     pose: 'idle' as Pose, side: 'left'  as const },
      { id: 'contacto',   msg: '¡Hablemos!',            pose: 'idle' as Pose, side: 'right' as const },
    ]
    const obs = secs.map(s => {
      const el = document.getElementById(s.id)
      if (!el) return null
      const o = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          setPose(s.pose); setSide(s.side)
          if (s.msg) { setMsg(s.msg); setTimeout(() => setMsg(null), 3200) }
        }
      }, { threshold: 0.3 })
      o.observe(el)
      return o
    })
    return () => obs.forEach(o => o?.disconnect())
  }, [])

  return (
    <div
      className="fixed bottom-24 z-50 flex flex-col items-center gap-2 pointer-events-none select-none"
      style={{
        right:     side === 'right' ? 16 : 'auto',
        left:      side === 'left'  ? 16 : 'auto',
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease, left 0.6s ease, right 0.6s ease',
      }}
      aria-hidden="true"
    >
      {msg && (
        <div className="px-3 py-1.5 rounded-xl text-[11px] font-mono-data text-center max-w-[130px]"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.14)',
            backdropFilter: 'blur(14px)',
            color: 'rgba(255,255,255,0.75)',
            animation: 'intro-word-in 0.5s ease forwards',
          }}>
          {msg}
        </div>
      )}
      <div style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.6)) drop-shadow(0 0 30px rgba(0,229,255,0.08))' }}>
        <DuckSVG pose={pose} direction={side === 'right' ? 'left' : 'right'} frame={frame} size={50} />
      </div>
    </div>
  )
}

// ─── Header duck (mobile) ─────────────────────────────────────────────────
export function HeaderDuck() {
  const isMobile = useIsMobile()
  const [frame, setFrame] = useState(0)
  const [x, setX]         = useState(88)
  const dirRef = useRef<'left' | 'right'>('right')
  const xRef   = useRef(88)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    let f = 0; const id = setInterval(() => { f++; setFrame(f) }, 32)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const tick = () => {
      const max = (typeof window !== 'undefined' ? window.innerWidth : 375) - 72
      xRef.current += dirRef.current === 'right' ? 0.8 : -0.8
      if (xRef.current >= max) { xRef.current = max; dirRef.current = 'left' }
      else if (xRef.current <= 72) { xRef.current = 72; dirRef.current = 'right' }
      setX(Math.round(xRef.current))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  if (!isMobile) return null

  return (
    <div className="fixed top-0 pointer-events-none select-none"
      style={{ left: x, height: 64, zIndex: 39, display: 'flex', alignItems: 'center' }}
      aria-hidden="true">
      <DuckSVG pose="walking" direction={dirRef.current} frame={frame} isMoving size={26} />
    </div>
  )
}

export function DuckMascot({ visible, message }: { visible: boolean; message?: string }) {
  const [frame, setFrame] = useState(0)
  useEffect(() => { let f = 0; const id = setInterval(() => { f++; setFrame(f) }, 36); return () => clearInterval(id) }, [])
  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none transition-all duration-500"
      style={{ transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)', opacity: visible ? 1 : 0 }}>
      {message && (
        <div className="max-w-[180px] px-3 py-2 rounded-lg text-xs font-mono-data text-right"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
          {message}
        </div>
      )}
      <DuckSVG pose="idle" direction="left" frame={frame} size={54} />
    </div>
  )
}

export default DuckCursor
