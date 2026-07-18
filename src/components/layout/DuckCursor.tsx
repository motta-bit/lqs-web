'use client'

import { useEffect, useRef, useState } from 'react'
import { useCursorDuck } from '@/hooks/useCursorDuck'
import { useIsMobile }   from '@/hooks/useMediaQuery'

// ─── Paleta: boceto blanco ────────────────────────────────────────────────
const W = '#FFFFFF'
const S = '#1a1a2e'      // stroke oscuro
const BOOT = '#00E5FF'   // botas neon-cyan (único color)
const BEAK = '#FFD166'   // pico amarillo suave

type Pose = 'idle' | 'walking' | 'waving' | 'photo' | 'sleeping'

// ─── SVG boceto del pato ─────────────────────────────────────────────────
export function DuckSVG({
  pose      = 'idle',
  wingPhase = 0,
  direction = 'right',
  frame     = 0,
  size      = 48,
  isMoving  = false,
}: {
  pose?:      Pose
  wingPhase?: number
  direction?: 'left' | 'right'
  frame?:     number
  size?:      number
  isMoving?:  boolean
}) {
  const flip = direction === 'left' ? -1 : 1

  // Animaciones calculadas
  const bob       = pose === 'idle'     ? Math.sin(frame * 0.04) * 1.5 : 0
  const waddle    = pose === 'walking'  ? Math.sin(frame * 0.28) * 3 : 0
  const sleepNod  = pose === 'sleeping' ? Math.sin(frame * 0.07) * 2 : 0
  const wingWave  = pose === 'waving'   ? Math.sin(frame * 0.2) * 25 : isMoving ? Math.sin(wingPhase) * 12 : 0
  const bootL     = pose === 'walking'  ? Math.sin(frame * 0.28) * 12 : 0
  const bootR     = pose === 'walking'  ? Math.sin(frame * 0.28 + Math.PI) * 12 : 0
  const eyeClose  = pose === 'sleeping'

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 52 58"
      style={{ transform: `scaleX(${flip})`, overflow: 'visible' }}
      aria-hidden="true"
    >
      <g transform={`translate(0, ${bob + waddle * 0.3})`}>

        {/* ── Cuerpo principal ── */}
        <ellipse cx="25" cy="35" rx="14" ry="11"
          fill={W} stroke={S} strokeWidth="1.6"
          strokeLinejoin="round" />

        {/* Pliegue del ala */}
        <path d="M 14 32 Q 22 28 34 32 Q 30 36 14 35 Z"
          fill="rgba(0,0,0,0.04)" stroke={S} strokeWidth="1" strokeLinecap="round" />

        {/* ── Ala levantada (waving / moving) ── */}
        <g style={{ transformOrigin: '14px 30px', transform: `rotate(${-wingWave}deg)` }}>
          <path d="M 10 30 Q 6 22 12 18 Q 16 22 14 30 Z"
            fill={W} stroke={S} strokeWidth="1.4" strokeLinejoin="round" />
        </g>

        {/* ── Cuello ── */}
        <path d="M 22 26 Q 25 22 28 24"
          fill="none" stroke={S} strokeWidth="1.8" strokeLinecap="round" />

        {/* ── Cabeza ── */}
        <circle cx="29" cy="19" r="9"
          fill={W} stroke={S} strokeWidth="1.6"
          transform={`translate(0, ${sleepNod})`} />

        {/* Mejilla suave */}
        <ellipse cx="32" cy="21" rx="4" ry="3"
          fill="rgba(255,200,200,0.15)"
          transform={`translate(0, ${sleepNod})`} />

        {/* ── Ojo ── */}
        {!eyeClose ? (
          <g transform={`translate(0, ${sleepNod})`}>
            <circle cx="32" cy="17" r="2" fill={S} />
            <circle cx="32.8" cy="16.3" r="0.6" fill={W} />
          </g>
        ) : (
          <path d="M 30 17 Q 32 15.5 34 17"
            stroke={S} strokeWidth="1.4" fill="none" strokeLinecap="round"
            transform={`translate(0, ${sleepNod})`} />
        )}

        {/* ── Pico ── */}
        <path d="M 36.5 19 L 41 20.5 L 39 22.5 Z"
          fill={BEAK} stroke={S} strokeWidth="1.1" strokeLinejoin="round"
          transform={`translate(0, ${sleepNod})`} />

        {/* ── Botas de caucho (neon-cyan) ── */}
        {pose !== 'sleeping' && (
          <>
            {/* Bota izquierda */}
            <g style={{ transformOrigin: '19px 45px', transform: `rotate(${bootL}deg)` }}>
              <rect x="16" y="44" width="6" height="8" rx="2"
                fill={BOOT} stroke={S} strokeWidth="1.3" />
              <rect x="14.5" y="49.5" width="9" height="3" rx="1.5"
                fill={BOOT} stroke={S} strokeWidth="1.1" />
              {/* brillo bota */}
              <rect x="17.5" y="45.5" width="1.5" height="3" rx="0.75"
                fill="rgba(255,255,255,0.35)" />
            </g>

            {/* Bota derecha */}
            <g style={{ transformOrigin: '29px 45px', transform: `rotate(${bootR}deg)` }}>
              <rect x="26" y="44" width="6" height="8" rx="2"
                fill={BOOT} stroke={S} strokeWidth="1.3" />
              <rect x="24.5" y="49.5" width="9" height="3" rx="1.5"
                fill={BOOT} stroke={S} strokeWidth="1.1" />
              <rect x="27.5" y="45.5" width="1.5" height="3" rx="0.75"
                fill="rgba(255,255,255,0.35)" />
            </g>
          </>
        )}

        {/* ── Cámara ── */}
        {(pose === 'idle' || pose === 'walking' || pose === 'photo') && (
          <g transform={`translate(0, ${bob})`}>
            {/* correa */}
            <path d="M 25 26 Q 30 22 36 23"
              fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1" strokeLinecap="round" />
            {/* cuerpo cámara */}
            <rect x="34" y="10" width="11" height="8" rx="2"
              fill="#1a1a2e" stroke={S} strokeWidth="1.2" />
            {/* lente */}
            <circle cx="39.5" cy="14" r="2.5"
              fill="#0a0a1a" stroke={S} strokeWidth="1" />
            <circle cx="39.5" cy="14" r="1.5"
              fill="#4a9eff" opacity="0.8" />
            <circle cx="40.2" cy="13.3" r="0.5"
              fill={W} opacity="0.7" />
            {/* flash */}
            {pose === 'photo' && (
              <circle cx="43.5" cy="10.5" r="1.5" fill="#FFE566">
                <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="r"       values="1.5;2.5;1.5" dur="0.8s" repeatCount="indefinite" />
              </circle>
            )}
            {pose !== 'photo' && (
              <rect x="42.5" y="9.5" width="3" height="2" rx="0.6"
                fill="#2a2a4a" stroke={S} strokeWidth="0.8" />
            )}
          </g>
        )}

        {/* ── Zzz durmiendo ── */}
        {pose === 'sleeping' && (
          <g opacity="0.55">
            <text x="38" y="14" fontSize="6"   fill={S} fontFamily="sans-serif" fontWeight="bold">z</text>
            <text x="42" y="8"  fontSize="4.5" fill={S} fontFamily="sans-serif" fontWeight="bold">z</text>
            <text x="45" y="3"  fontSize="3"   fill={S} fontFamily="sans-serif" fontWeight="bold">z</text>
          </g>
        )}

        {/* ── Detalles de boceto (líneas de textura) ── */}
        <path d="M 16 33 Q 20 32 24 33"
          fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeLinecap="round" />
        <path d="M 30 34 Q 34 33 36 35"
          fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeLinecap="round" />

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
    const id = setInterval(() => { f++; setFrame(f) }, 30)
    return () => clearInterval(id)
  }, [])

  if (!mounted || isMobile) return null

  const pose: Pose = duck.isMoving ? 'walking' : 'idle'

  return (
    <>
      <div className="fixed pointer-events-none z-[999]"
        style={{ left: duck.x - 26, top: duck.y - 44, willChange: 'transform' }}>
        <DuckSVG
          pose={pose}
          wingPhase={duck.wingPhase}
          direction={duck.direction}
          frame={frame}
          isMoving={duck.isMoving}
          size={52}
        />
      </div>
      {/* Punto del cursor */}
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

// ─── Mascota flotante (acompaña el scroll) ───────────────────────────────
export function DuckFloat() {
  const [frame, setFrame] = useState(0)
  const [visible, setVisible] = useState(false)
  const [pose, setPose] = useState<Pose>('idle')
  const [msg, setMsg] = useState<string | null>(null)
  const [side, setSide] = useState<'left' | 'right'>('right')

  useEffect(() => {
    // Aparece después de 3s
    const t = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let f = 0
    const id = setInterval(() => { f++; setFrame(f) }, 40)
    return () => clearInterval(id)
  }, [])

  // Reacciona al scroll
  useEffect(() => {
    const sections: { id: string; msg: string; pose: Pose; side: 'left' | 'right' }[] = [
      { id: 'inicio',     msg: null!,                     pose: 'idle',   side: 'right' },
      { id: 'portafolio', msg: '¡Mira lo que hicimos!',  pose: 'photo',  side: 'right' },
      { id: 'planes',     msg: '¿Cuál es el tuyo?',      pose: 'waving', side: 'left'  },
      { id: 'contacto',   msg: '¡Hablemos!',             pose: 'waving', side: 'right' },
    ]

    const observers = sections.map(sec => {
      const el = document.getElementById(sec.id)
      if (!el) return null
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          setPose(sec.pose)
          setSide(sec.side)
          if (sec.msg) {
            setMsg(sec.msg)
            setTimeout(() => setMsg(null), 3000)
          }
        }
      }, { threshold: 0.3 })
      obs.observe(el)
      return obs
    })

    return () => observers.forEach(o => o?.disconnect())
  }, [])

  return (
    <div
      className="fixed bottom-28 z-50 flex flex-col items-center gap-2 pointer-events-none select-none transition-all duration-700"
      style={{
        right:     side === 'right' ? 20 : 'auto',
        left:      side === 'left'  ? 20 : 'auto',
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
      }}
      aria-hidden="true"
    >
      {/* Burbuja de mensaje */}
      {msg && (
        <div className="px-3 py-1.5 rounded-xl text-xs font-mono-data text-center max-w-[140px] animate-intro-in"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            color: 'rgba(255,255,255,0.8)',
            boxShadow: '0 0 20px rgba(0,229,255,0.15)',
          }}>
          {msg}
        </div>
      )}

      {/* Pato */}
      <div style={{
        filter: 'drop-shadow(0 4px 20px rgba(0,229,255,0.2)) drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
      }}>
        <DuckSVG
          pose={pose}
          direction={side === 'right' ? 'left' : 'right'}
          frame={frame}
          isMoving={false}
          size={56}
        />
      </div>
    </div>
  )
}

// ─── Pato en header mobile ───────────────────────────────────────────────
export function HeaderDuck() {
  const isMobile = useIsMobile()
  const [frame, setFrame] = useState(0)
  const [x, setX] = useState(80)
  const dirRef  = useRef<'left' | 'right'>('right')
  const xRef    = useRef(80)
  const rafRef  = useRef<number>(0)

  useEffect(() => {
    let f = 0
    const id = setInterval(() => { f++; setFrame(f) }, 35)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const SPEED = 0.9
    const tick = () => {
      const maxX = typeof window !== 'undefined' ? window.innerWidth - 70 : 320
      const newX = xRef.current + (dirRef.current === 'right' ? SPEED : -SPEED)
      if (newX >= maxX) { xRef.current = maxX; dirRef.current = 'left' }
      else if (newX <= 70) { xRef.current = 70; dirRef.current = 'right' }
      else xRef.current = newX
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
      <DuckSVG
        pose="walking"
        direction={dirRef.current}
        frame={frame}
        isMoving={true}
        size={30}
      />
    </div>
  )
}

// ─── DuckMascot (legacy compat) ──────────────────────────────────────────
export function DuckMascot({ visible, message }: { visible: boolean; message?: string }) {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    let f = 0
    const id = setInterval(() => { f++; setFrame(f) }, 40)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 transition-all duration-500"
      style={{
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
        opacity:   visible ? 1 : 0,
        pointerEvents: 'none',
      }}>
      {message && (
        <div className="max-w-[180px] px-3 py-2 rounded-lg text-xs font-mono-data text-right"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
          {message}
        </div>
      )}
      <DuckSVG pose="idle" direction="left" frame={frame} isMoving={false} size={56} />
    </div>
  )
}

export default DuckCursor
