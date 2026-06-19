'use client'

import { useEffect, useRef, useState } from 'react'
import { useCursorDuck } from '@/hooks/useCursorDuck'
import { useIsMobile }   from '@/hooks/useMediaQuery'

// ── Paleta Mallard: toque realista, forma simple ──────────────────────────
const C = {
  body:     '#EDE0C4', // crema cálido (pecho del pato real)
  wing:     '#7C6340', // marrón natural
  speculum: '#4A7EB5', // banda azul de ala (característica del mallard)
  head:     '#1E6B42', // verde bosque iridiscente
  collar:   '#F0ECE4', // anillo blanco cuello
  beak:     '#E87800', // naranja natural
  feet:     '#E87800',
  eye:      '#111111',
  gleam:    '#FFFFFF',
  cam:      '#1a1a1a',
  camLens:  '#4a9eff',
}

type Pose = 'walking' | 'eating' | 'flying' | 'photo' | 'sleeping'

// ── SVG del pato — una forma por escena ──────────────────────────────────
function DuckSVG({
  pose      = 'walking',
  wingPhase = 0,
  direction = 'right',
  frame     = 0,
  size      = 48,
  isMoving  = true,
}: {
  pose?:      Pose
  wingPhase?: number
  direction?: 'left' | 'right'
  frame?:     number
  size?:      number
  isMoving?:  boolean
}) {
  const flip = direction === 'left' ? -1 : 1

  // Animaciones calculadas por frame
  const legAngle = isMoving && pose === 'walking' ? Math.sin(frame * 0.28) * 22 : 0
  const wingFlap = pose === 'flying'
    ? Math.sin(frame * 0.35) * 36
    : isMoving ? Math.sin(wingPhase) * 20 : 0
  const eatBob   = pose === 'eating'   ? Math.abs(Math.sin(frame * 0.30)) * 7 : 0
  const sleepNod = pose === 'sleeping' ? Math.sin(frame * 0.07) * 2.5 : 0
  const bodyTilt = pose === 'flying'   ? -9 : 0

  const headX = 31
  const headY = 22 + eatBob + sleepNod

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `scaleX(${flip})`, overflow: 'visible' }}
      aria-hidden="true"
    >
      <g style={{ transform: `rotate(${bodyTilt}deg)`, transformOrigin: '22px 30px' }}>

        {/* Cuerpo */}
        <ellipse cx="22" cy="30" rx="12" ry="9" fill={C.body} />

        {/* Ala principal con banda speculum */}
        <g style={{ transformOrigin: '22px 26px', transform: `rotate(${wingFlap}deg)` }}>
          <ellipse cx="22" cy="24" rx="10" ry="4" fill={C.wing} />
          <ellipse cx="20" cy="23.5" rx="5" ry="1.4" fill={C.speculum} opacity="0.88" />
        </g>

        {/* Ala opuesta (solo en vuelo) */}
        {pose === 'flying' && (
          <ellipse
            cx="12" cy="24" rx="9" ry="3"
            fill={C.wing} opacity="0.6"
            style={{ transform: `rotate(${-wingFlap * 0.5}deg)`, transformOrigin: '22px 24px' }}
          />
        )}

        {/* Anillo blanco cuello */}
        <ellipse cx={headX - 3} cy={headY + 5.5} rx="4" ry="2" fill={C.collar} opacity="0.92" />

        {/* Cabeza verde */}
        <circle cx={headX} cy={headY} r="7" fill={C.head} />

        {/* Reflejo iridiscente cabeza */}
        <ellipse cx={headX - 1} cy={headY - 2} rx="4" ry="3" fill="#2A8A56" opacity="0.4" />

        {/* Ojo */}
        {pose !== 'sleeping' ? (
          <>
            <circle cx={headX + 2} cy={headY - 2} r="1.5" fill={C.eye} />
            <circle cx={headX + 2.5} cy={headY - 2.5} r="0.5" fill={C.gleam} />
          </>
        ) : (
          <path
            d={`M ${headX - 0.5} ${headY - 2} Q ${headX + 2} ${headY - 3.8} ${headX + 4.5} ${headY - 2}`}
            stroke={C.eye} strokeWidth="1.3" fill="none" strokeLinecap="round"
          />
        )}

        {/* Pico */}
        {pose === 'eating' && eatBob > 3 ? (
          <g>
            <ellipse cx={headX + 7} cy={headY + 1} rx="3" ry="1" fill={C.beak} />
            <ellipse cx={headX + 7} cy={headY + 2.8} rx="2.5" ry="0.8" fill={C.beak} opacity="0.7" />
          </g>
        ) : (
          <ellipse cx={headX + 6.5} cy={headY + 0.5} rx="3" ry="1.5" fill={C.beak} />
        )}

        {/* ── Extras por escena ─────────────────────────── */}

        {/* Cámara (caminando y pose foto) */}
        {(pose === 'walking' || pose === 'photo') && (
          <g>
            <rect x="26" y="13" width="10" height="7" rx="1.5" fill={C.cam} />
            <circle cx="31" cy="16.5" r="2.5" fill="#2a2a2a" />
            <circle cx="31" cy="16.5" r="1.5" fill={C.camLens} opacity="0.85" />
            <rect x="34.5" y="13.5" width="2" height="1.8" rx="0.4" fill="#444" />
            {!isMoving && pose === 'walking' && (
              <circle cx="35.5" cy="12.5" r="1" fill="#FFD700" opacity="0.55">
                <animate attributeName="opacity" values="0.55;1;0.55" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            {pose === 'photo' && (
              <circle cx="35.5" cy="12.5" r="1.5" fill="#FFE566">
                <animate attributeName="opacity" values="1;0.1;1" dur="0.75s" repeatCount="indefinite" />
                <animate attributeName="r" values="1.5;2.8;1.5" dur="0.75s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        )}

        {/* Comida (pan / miga) */}
        {pose === 'eating' && (
          <g>
            <rect x={headX + 8} y={headY + 9} width="6" height="4" rx="1.5" fill="#C8A850" />
            <rect x={headX + 10} y={headY + 8} width="3.5" height="3" rx="1" fill="#B5943A" opacity="0.65" />
          </g>
        )}

        {/* Zzz durmiendo */}
        {pose === 'sleeping' && (
          <g fontFamily="sans-serif" fontWeight="bold">
            <text x={headX + 5}  y={headY - 5}  fontSize="5"   fill={C.eye} opacity="0.65">z</text>
            <text x={headX + 9}  y={headY - 10} fontSize="3.5" fill={C.eye} opacity="0.38">z</text>
            <text x={headX + 12} y={headY - 14} fontSize="2.5" fill={C.eye} opacity="0.2">z</text>
          </g>
        )}

        {/* Patas y pies palmeados */}
        {pose !== 'flying' && pose !== 'sleeping' && (
          <>
            <rect x="16.5" y="37" width="3" height="4.5" rx="1" fill={C.feet}
              style={{ transform: `rotate(${legAngle}deg)`, transformOrigin: '18px 37px' }} />
            <rect x="22.5" y="37" width="3" height="4.5" rx="1" fill={C.feet}
              style={{ transform: `rotate(${-legAngle}deg)`, transformOrigin: '24px 37px' }} />
            <ellipse cx="18"  cy="42" rx="4"   ry="1.3" fill={C.feet} opacity="0.88" />
            <ellipse cx="24"  cy="42" rx="4"   ry="1.3" fill={C.feet} opacity="0.88" />
          </>
        )}

      </g>
    </svg>
  )
}

// ── Pato en la barra superior (mobile / tablet) ──────────────────────────
const EDGE_SCENES: Pose[]  = ['eating', 'photo', 'sleeping', 'eating', 'photo']
const MOVE_FLYING_EVERY    = 3   // cada N viajes se activa vuelo

export function HeaderDuck() {
  const [view, setView] = useState({
    x:         80,
    direction: 'right' as 'left' | 'right',
    pose:      'walking' as Pose,
    frame:     0,
  })

  const xRef          = useRef(80)
  const dirRef        = useRef<'left' | 'right'>('right')
  const frameRef      = useRef(0)
  const edgePauseRef  = useRef(0)
  const edgeCountRef  = useRef(0)   // cuántas veces tocó el borde
  const currentPose   = useRef<Pose>('walking')
  const rafRef        = useRef<number>(0)

  useEffect(() => {
    const SPEED       = 1.1
    const FLY_SPEED   = 2.3
    const EDGE_FRAMES = 68
    const MARGIN_L    = 72
    const getMaxX     = () => (typeof window !== 'undefined' ? window.innerWidth - 68 : 320)

    const tick = () => {
      frameRef.current++
      const f = frameRef.current

      if (edgePauseRef.current > 0) {
        edgePauseRef.current--
        if (edgePauseRef.current === 0) {
          // Termina escena de borde → vuelve a caminar (o volar)
          const tripCount = edgeCountRef.current
          currentPose.current = tripCount % MOVE_FLYING_EVERY === 0 ? 'flying' : 'walking'
        }
      } else {
        const isFlying = currentPose.current === 'flying'
        const speed    = isFlying ? FLY_SPEED : SPEED
        const newX     = xRef.current + (dirRef.current === 'right' ? speed : -speed)
        const maxX     = getMaxX()

        if (newX >= maxX) {
          xRef.current         = maxX
          dirRef.current       = 'left'
          edgeCountRef.current++
          const sceneIdx       = edgeCountRef.current % EDGE_SCENES.length
          currentPose.current  = EDGE_SCENES[sceneIdx]
          edgePauseRef.current = EDGE_FRAMES
        } else if (newX <= MARGIN_L) {
          xRef.current         = MARGIN_L
          dirRef.current       = 'right'
          edgeCountRef.current++
          const sceneIdx       = edgeCountRef.current % EDGE_SCENES.length
          currentPose.current  = EDGE_SCENES[sceneIdx]
          edgePauseRef.current = EDGE_FRAMES
        } else {
          xRef.current = newX
        }
      }

      setView({
        x:         Math.round(xRef.current),
        direction: dirRef.current,
        pose:      currentPose.current,
        frame:     f,
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const isMobile = useIsMobile()
  if (!isMobile) return null

  return (
    <div
      className="fixed top-0 pointer-events-none select-none flex items-center"
      style={{ left: view.x, height: 64, zIndex: 39 }}
      aria-hidden="true"
    >
      <DuckSVG
        pose={view.pose}
        direction={view.direction}
        frame={view.frame}
        isMoving={view.pose === 'walking' || view.pose === 'flying'}
        size={30}
      />
    </div>
  )
}

// ── DuckMascot (mensajes en mobile) ──────────────────────────────────────
export function DuckMascot({ visible, message }: { visible: boolean; message?: string }) {
  return (
    <div
      className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 transition-all duration-500"
      style={{
        transform:     visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
        opacity:       visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {message && (
        <div
          className="max-w-[180px] px-3 py-2 rounded-lg text-xs font-mono-data text-right"
          style={{ background: 'var(--imi-cardBg)', border: '1px solid var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}
        >
          {message}
        </div>
      )}
      <DuckSVG wingPhase={0} direction="left" isMoving={false} size={56} />
    </div>
  )
}

// ── Cursor pato (desktop) ─────────────────────────────────────────────────
export function DuckCursor() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  const duck = useCursorDuck()

  useEffect(() => {
    setMounted(true)
    document.body.style.cursor = 'none'
    return () => { document.body.style.cursor = 'auto' }
  }, [])

  if (!mounted || isMobile) return null

  return (
    <>
      <div
        className="fixed pointer-events-none z-[999]"
        style={{ left: duck.x - 24, top: duck.y - 40, willChange: 'transform' }}
      >
        <DuckSVG
          pose="walking"
          wingPhase={duck.wingPhase}
          direction={duck.direction}
          frame={Math.round(duck.wingPhase / 0.3)}
          isMoving={duck.isMoving}
        />
      </div>
      <div
        className="fixed pointer-events-none z-[998] w-1.5 h-1.5 rounded-full"
        style={{
          left:       duck.x - 3,
          top:        duck.y - 3,
          background: 'var(--imi-accentOrange)',
          opacity:    0.6,
          boxShadow:  '0 0 6px var(--imi-accentOrange)',
          willChange: 'transform',
        }}
      />
    </>
  )
}

export default DuckCursor
