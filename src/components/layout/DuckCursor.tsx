'use client'

import { useEffect, useRef, useState } from 'react'
import { useCursorDuck } from '@/hooks/useCursorDuck'
import { useIsMobile }   from '@/hooks/useMediaQuery'

// ─── Paleta: boceto exacto ────────────────────────────────────────────────
const W = '#FFFFFF'   // relleno blanco
const S = '#111111'   // trazo oscuro sketch

type Pose = 'idle' | 'walking' | 'waving' | 'photo' | 'sleeping'

// ─── SVG fiel al boceto: cabeza pequeña, cuerpo oval, patas, botas ───────
export function DuckSVG({
  pose      = 'idle',
  wingPhase = 0,
  direction = 'right',
  frame     = 0,
  size      = 52,
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

  // Animaciones
  const bob       = Math.sin(frame * 0.05) * 1.5
  const bootL     = pose === 'walking' ? Math.sin(frame  * 0.28) * 10 : 0
  const bootR     = pose === 'walking' ? Math.sin(frame  * 0.28 + Math.PI) * 10 : 0
  const sleepNod  = pose === 'sleeping' ? Math.sin(frame * 0.07) * 3 : 0
  const waveAngle = pose === 'waving'   ? Math.sin(frame * 0.22) * 30 : 0

  // Coordenadas base (viewBox 0 0 60 72)
  const bodyX = 28, bodyY = 38 + bob
  const headX = 38, headY = 14 + bob + sleepNod
  const neckX = 34, neckY = 22 + bob

  return (
    <svg
      width={size}
      height={Math.round(size * 72 / 60)}
      viewBox="0 0 60 72"
      style={{ transform: `scaleX(${flip})`, overflow: 'visible' }}
      aria-hidden="true"
    >
      {/* ── Cuerpo oval (gran elipse, como en el boceto) ── */}
      <ellipse
        cx={bodyX} cy={bodyY} rx="17" ry="13"
        fill={W} stroke={S} strokeWidth="1.8"
      />

      {/* ── Ala sugerida (línea curva sobre el cuerpo) ── */}
      <path
        d={`M ${bodyX - 12} ${bodyY - 4} Q ${bodyX - 2} ${bodyY - 8} ${bodyX + 10} ${bodyY - 2}`}
        fill="none" stroke={S} strokeWidth="1.1" strokeLinecap="round" opacity="0.4"
      />

      {/* ── Ala agitada (waving pose) ── */}
      {(pose === 'waving' || (isMoving && pose === 'walking')) && (
        <g style={{ transformOrigin: `${bodyX - 14}px ${bodyY - 6}px`, transform: `rotate(${-waveAngle - (isMoving ? Math.sin(wingPhase) * 15 : 0)}deg)` }}>
          <path
            d={`M ${bodyX - 14} ${bodyY - 6} Q ${bodyX - 22} ${bodyY - 14} ${bodyX - 18} ${bodyY - 18}`}
            fill="none" stroke={S} strokeWidth="1.6" strokeLinecap="round"
          />
        </g>
      )}

      {/* ── Cuello ── */}
      <path
        d={`M ${neckX - 3} ${neckY + 5} Q ${neckX} ${neckY} ${headX - 4} ${headY + 5}`}
        fill={W} stroke={S} strokeWidth="1.6" strokeLinecap="round"
      />

      {/* ── Cabeza (círculo, más pequeño que el cuerpo) ── */}
      <circle
        cx={headX} cy={headY} r="9"
        fill={W} stroke={S} strokeWidth="1.8"
      />

      {/* ── Ojo ── */}
      {pose !== 'sleeping' ? (
        <circle cx={headX + 2} cy={headY - 2} r="1.4" fill={S} />
      ) : (
        <path
          d={`M ${headX} ${headY - 2} Q ${headX + 3} ${headY - 4.5} ${headX + 5} ${headY - 2}`}
          stroke={S} strokeWidth="1.3" fill="none" strokeLinecap="round"
        />
      )}

      {/* ── Pico (triángulo pequeño, apunta a la derecha) ── */}
      <path
        d={`M ${headX + 7} ${headY} L ${headX + 12} ${headY + 1} L ${headX + 7} ${headY + 3} Z`}
        fill={W} stroke={S} strokeWidth="1.3" strokeLinejoin="round"
      />

      {/* ── Patas (dos líneas delgadas rectas) ── */}
      {pose !== 'sleeping' && (
        <>
          {/* Pata izquierda */}
          <line
            x1={bodyX - 4} y1={bodyY + 12}
            x2={bodyX - 4} y2={bodyY + 22}
            stroke={S} strokeWidth="1.8" strokeLinecap="round"
            style={{ transform: `rotate(${bootL}deg)`, transformOrigin: `${bodyX - 4}px ${bodyY + 12}px` }}
          />
          {/* Pata derecha */}
          <line
            x1={bodyX + 4} y1={bodyY + 12}
            x2={bodyX + 4} y2={bodyY + 22}
            stroke={S} strokeWidth="1.8" strokeLinecap="round"
            style={{ transform: `rotate(${bootR}deg)`, transformOrigin: `${bodyX + 4}px ${bodyY + 12}px` }}
          />

          {/* ── Bota izquierda ── */}
          <g style={{ transform: `rotate(${bootL}deg)`, transformOrigin: `${bodyX - 4}px ${bodyY + 12}px` }}>
            {/* caña de la bota */}
            <rect
              x={bodyX - 7} y={bodyY + 20}
              width="6" height="8" rx="1"
              fill={W} stroke={S} strokeWidth="1.5"
            />
            {/* suela / punta */}
            <rect
              x={bodyX - 7} y={bodyY + 26}
              width="10" height="4" rx="1.5"
              fill={W} stroke={S} strokeWidth="1.5"
            />
          </g>

          {/* ── Bota derecha ── */}
          <g style={{ transform: `rotate(${bootR}deg)`, transformOrigin: `${bodyX + 4}px ${bodyY + 12}px` }}>
            {/* caña de la bota */}
            <rect
              x={bodyX + 1} y={bodyY + 20}
              width="6" height="8" rx="1"
              fill={W} stroke={S} strokeWidth="1.5"
            />
            {/* suela / punta */}
            <rect
              x={bodyX + 1} y={bodyY + 26}
              width="10" height="4" rx="1.5"
              fill={W} stroke={S} strokeWidth="1.5"
            />
          </g>
        </>
      )}

      {/* ── Cámara (accesorio de marca) ── */}
      {(pose === 'idle' || pose === 'walking' || pose === 'photo') && (
        <g transform={`translate(0, ${bob})`}>
          {/* correa */}
          <path d={`M ${headX - 2} ${headY + 8} Q ${headX + 4} ${bodyY - 14} ${headX + 10} ${bodyY - 16}`}
            fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.9" strokeLinecap="round" />
          {/* cámara */}
          <rect x={headX + 9} y={bodyY - 22} width="10" height="7" rx="1.5"
            fill="#111" stroke={S} strokeWidth="1.1" />
          {/* lente */}
          <circle cx={headX + 14} cy={bodyY - 18.5} r="2.2"
            fill="#1a1aff" opacity="0.7" stroke={S} strokeWidth="0.8" />
          <circle cx={headX + 14.6} cy={bodyY - 19.3} r="0.7"
            fill={W} opacity="0.6" />
          {/* flash / botón */}
          {pose === 'photo' ? (
            <circle cx={headX + 18} cy={bodyY - 23} r="1.3" fill="#FFE566">
              <animate attributeName="opacity" values="1;0;1" dur="0.7s" repeatCount="indefinite" />
              <animate attributeName="r"       values="1.3;2.5;1.3" dur="0.7s" repeatCount="indefinite" />
            </circle>
          ) : (
            <rect x={headX + 17} y={bodyY - 24} width="2.5" height="1.8" rx="0.5"
              fill="#333" stroke={S} strokeWidth="0.7" />
          )}
        </g>
      )}

      {/* ── Zzz ── */}
      {pose === 'sleeping' && (
        <g opacity="0.5" fontFamily="sans-serif" fontWeight="bold">
          <text x={headX + 8}  y={headY - 5}  fontSize="5.5" fill={S}>z</text>
          <text x={headX + 13} y={headY - 11} fontSize="4"   fill={S}>z</text>
          <text x={headX + 17} y={headY - 16} fontSize="3"   fill={S}>z</text>
        </g>
      )}
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
        style={{ left: duck.x - 28, top: duck.y - 48, willChange: 'transform' }}>
        <DuckSVG
          pose={pose}
          wingPhase={duck.wingPhase}
          direction={duck.direction}
          frame={frame}
          isMoving={duck.isMoving}
          size={56}
        />
      </div>
      {/* Punto cursor neon-cyan */}
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
  const [pose, setPose]     = useState<Pose>('idle')
  const [msg,  setMsg]      = useState<string | null>(null)
  const [side, setSide]     = useState<'left' | 'right'>('right')

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let f = 0
    const id = setInterval(() => { f++; setFrame(f) }, 40)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const sections: { id: string; msg: string | null; pose: Pose; side: 'left' | 'right' }[] = [
      { id: 'inicio',     msg: null,                      pose: 'idle',   side: 'right' },
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
        right:     side === 'right' ? 16 : 'auto',
        left:      side === 'left'  ? 16 : 'auto',
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
      }}
      aria-hidden="true"
    >
      {msg && (
        <div className="px-3 py-1.5 rounded-xl text-xs font-mono-data text-center max-w-[140px] animate-intro-in"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            color: 'rgba(255,255,255,0.8)',
            boxShadow: '0 0 20px rgba(0,229,255,0.15)',
          }}>
          {msg}
        </div>
      )}
      <div style={{
        filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(0,229,255,0.1))',
      }}>
        <DuckSVG
          pose={pose}
          direction={side === 'right' ? 'left' : 'right'}
          frame={frame}
          isMoving={false}
          size={52}
        />
      </div>
    </div>
  )
}

// ─── Pato en header mobile ───────────────────────────────────────────────
export function HeaderDuck() {
  const isMobile = useIsMobile()
  const [frame, setFrame] = useState(0)
  const [x, setX]         = useState(80)
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
      if      (newX >= maxX) { xRef.current = maxX; dirRef.current = 'left' }
      else if (newX <= 70)   { xRef.current = 70;   dirRef.current = 'right' }
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
      <DuckSVG pose="walking" direction={dirRef.current} frame={frame} isMoving size={28} />
    </div>
  )
}

// ─── DuckMascot (legacy) ─────────────────────────────────────────────────
export function DuckMascot({ visible, message }: { visible: boolean; message?: string }) {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    let f = 0
    const id = setInterval(() => { f++; setFrame(f) }, 40)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 transition-all duration-500 pointer-events-none"
      style={{
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
        opacity:   visible ? 1 : 0,
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
