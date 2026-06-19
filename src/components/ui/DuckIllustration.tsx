// Paleta Mallard compartida
const C = {
  body:     '#EDE0C4',
  wing:     '#7C6340',
  speculum: '#4A7EB5',
  head:     '#1E6B42',
  collar:   '#F0ECE4',
  beak:     '#E87800',
  feet:     '#E87800',
  eye:      '#111111',
  gleam:    '#FFFFFF',
}

// ── Pato base — reutilizable en hero y cursor ────────────────────────────
export type DuckPose = 'walking' | 'eating' | 'flying' | 'photo' | 'sleeping'

export function DuckSVG({
  pose      = 'walking' as DuckPose,
  wingPhase = 0,
  direction = 'right' as 'left' | 'right',
  frame     = 0,
  size      = 48,
  isMoving  = false,
  className,
  style,
}: {
  pose?:      DuckPose
  wingPhase?: number
  direction?: 'left' | 'right'
  frame?:     number
  size?:      number
  isMoving?:  boolean
  className?: string
  style?:     React.CSSProperties
}) {
  const flip     = direction === 'left' ? -1 : 1
  const legAngle = isMoving && pose === 'walking' ? Math.sin(frame * 0.28) * 22 : 0
  const wingFlap = pose === 'flying'
    ? Math.sin(frame * 0.35) * 36
    : isMoving ? Math.sin(wingPhase) * 20 : 0
  const eatBob   = pose === 'eating'   ? Math.abs(Math.sin(frame * 0.30)) * 7 : 0
  const sleepNod = pose === 'sleeping' ? Math.sin(frame * 0.07) * 2.5 : 0
  const bodyTilt = pose === 'flying'   ? -9 : 0
  const headX    = 31
  const headY    = 22 + eatBob + sleepNod

  return (
    <svg
      width={size} height={size} viewBox="0 0 48 48"
      className={className}
      style={{ transform: `scaleX(${flip})`, overflow: 'visible', ...style }}
      aria-hidden="true"
    >
      <g style={{ transform: `rotate(${bodyTilt}deg)`, transformOrigin: '22px 30px' }}>
        <ellipse cx="22" cy="30" rx="12" ry="9" fill={C.body} />
        <g style={{ transformOrigin: '22px 26px', transform: `rotate(${wingFlap}deg)` }}>
          <ellipse cx="22" cy="24" rx="10" ry="4" fill={C.wing} />
          <ellipse cx="20" cy="23.5" rx="5" ry="1.4" fill={C.speculum} opacity="0.88" />
        </g>
        {pose === 'flying' && (
          <ellipse cx="12" cy="24" rx="9" ry="3" fill={C.wing} opacity="0.6"
            style={{ transform: `rotate(${-wingFlap * 0.5}deg)`, transformOrigin: '22px 24px' }} />
        )}
        <ellipse cx={headX - 3} cy={headY + 5.5} rx="4" ry="2" fill={C.collar} opacity="0.92" />
        <circle cx={headX} cy={headY} r="7" fill={C.head} />
        <ellipse cx={headX - 1} cy={headY - 2} rx="4" ry="3" fill="#2A8A56" opacity="0.4" />
        {pose !== 'sleeping' ? (
          <>
            <circle cx={headX + 2} cy={headY - 2} r="1.5" fill={C.eye} />
            <circle cx={headX + 2.5} cy={headY - 2.5} r="0.5" fill={C.gleam} />
          </>
        ) : (
          <path d={`M ${headX - 0.5} ${headY - 2} Q ${headX + 2} ${headY - 3.8} ${headX + 4.5} ${headY - 2}`}
            stroke={C.eye} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        )}
        {pose === 'eating' && eatBob > 3 ? (
          <g>
            <ellipse cx={headX + 7} cy={headY + 1} rx="3" ry="1" fill={C.beak} />
            <ellipse cx={headX + 7} cy={headY + 2.8} rx="2.5" ry="0.8" fill={C.beak} opacity="0.7" />
          </g>
        ) : (
          <ellipse cx={headX + 6.5} cy={headY + 0.5} rx="3" ry="1.5" fill={C.beak} />
        )}
        {(pose === 'walking' || pose === 'photo') && (
          <g>
            <rect x="26" y="13" width="10" height="7" rx="1.5" fill="#1a1a1a" />
            <circle cx="31" cy="16.5" r="2.5" fill="#2a2a2a" />
            <circle cx="31" cy="16.5" r="1.5" fill="#4a9eff" opacity="0.85" />
            <rect x="34.5" y="13.5" width="2" height="1.8" rx="0.4" fill="#444" />
          </g>
        )}
        {pose === 'eating' && (
          <g>
            <rect x={headX + 8} y={headY + 9} width="6" height="4" rx="1.5" fill="#C8A850" />
            <rect x={headX + 10} y={headY + 8} width="3.5" height="3" rx="1" fill="#B5943A" opacity="0.65" />
          </g>
        )}
        {pose === 'sleeping' && (
          <g fontFamily="sans-serif" fontWeight="bold">
            <text x={headX + 5}  y={headY - 5}  fontSize="5"   fill={C.eye} opacity="0.65">z</text>
            <text x={headX + 9}  y={headY - 10} fontSize="3.5" fill={C.eye} opacity="0.38">z</text>
          </g>
        )}
        {pose !== 'flying' && pose !== 'sleeping' && (
          <>
            <rect x="16.5" y="37" width="3" height="4.5" rx="1" fill={C.feet}
              style={{ transform: `rotate(${legAngle}deg)`, transformOrigin: '18px 37px' }} />
            <rect x="22.5" y="37" width="3" height="4.5" rx="1" fill={C.feet}
              style={{ transform: `rotate(${-legAngle}deg)`, transformOrigin: '24px 37px' }} />
            <ellipse cx="18"  cy="42" rx="4" ry="1.3" fill={C.feet} opacity="0.88" />
            <ellipse cx="24"  cy="42" rx="4" ry="1.3" fill={C.feet} opacity="0.88" />
          </>
        )}
      </g>
    </svg>
  )
}

// ── Pato Marca / Empresa — corbata + maletín ─────────────────────────────
export function DuckBrandSVG({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" overflow="visible" aria-hidden="true">
      {/* Cuerpo */}
      <ellipse cx="22" cy="30" rx="12" ry="9" fill={C.body} />
      {/* Ala */}
      <ellipse cx="22" cy="24" rx="10" ry="4" fill={C.wing} />
      <ellipse cx="20" cy="23.5" rx="5" ry="1.4" fill={C.speculum} opacity="0.88" />
      {/* Corbata sobre el pecho */}
      <polygon points="29,27 31,27 30.2,31 29.8,31" fill="#CC1515" />
      <polygon points="29.2,31 30.8,31 31.5,40 28.5,40 29.2,31" fill="#CC1515" />
      <polygon points="28.5,40 31.5,40 30,43" fill="#B01010" />
      {/* Anillo collar */}
      <ellipse cx="28" cy="27.5" rx="4" ry="2" fill={C.collar} opacity="0.92" />
      {/* Cabeza */}
      <circle cx="31" cy="22" r="7" fill={C.head} />
      <ellipse cx="30" cy="20" rx="4" ry="3" fill="#2A8A56" opacity="0.4" />
      {/* Ojo */}
      <circle cx="33" cy="20" r="1.5" fill={C.eye} />
      <circle cx="33.5" cy="19.5" r="0.5" fill={C.gleam} />
      {/* Pico */}
      <ellipse cx="37.5" cy="22.5" rx="3" ry="1.5" fill={C.beak} />
      {/* Maletín */}
      <rect x="6" y="30" width="11" height="8" rx="1.5" fill="#2a2a2a" />
      <rect x="9" y="27.5" width="5" height="3" rx="1.5" fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
      <rect x="10" y="33" width="3" height="2" rx="0.5" fill="#555" />
      {/* Patas */}
      <rect x="16.5" y="37" width="3" height="4.5" rx="1" fill={C.feet} />
      <rect x="22.5" y="37" width="3" height="4.5" rx="1" fill={C.feet} />
      <ellipse cx="18" cy="42" rx="4" ry="1.3" fill={C.feet} opacity="0.88" />
      <ellipse cx="24" cy="42" rx="4" ry="1.3" fill={C.feet} opacity="0.88" />
    </svg>
  )
}

// ── Pato Creador — paleta de pintura + pincel ────────────────────────────
export function DuckCreatorSVG({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" overflow="visible" aria-hidden="true">
      {/* Cuerpo */}
      <ellipse cx="22" cy="30" rx="12" ry="9" fill={C.body} />
      {/* Ala */}
      <ellipse cx="22" cy="24" rx="10" ry="4" fill={C.wing} />
      <ellipse cx="20" cy="23.5" rx="5" ry="1.4" fill={C.speculum} opacity="0.88" />
      {/* Collar */}
      <ellipse cx="28" cy="27.5" rx="4" ry="2" fill={C.collar} opacity="0.92" />
      {/* Cabeza */}
      <circle cx="31" cy="22" r="7" fill={C.head} />
      <ellipse cx="30" cy="20" rx="4" ry="3" fill="#2A8A56" opacity="0.4" />
      {/* Ojo */}
      <circle cx="33" cy="20" r="1.5" fill={C.eye} />
      <circle cx="33.5" cy="19.5" r="0.5" fill={C.gleam} />
      {/* Pico */}
      <ellipse cx="37.5" cy="22.5" rx="3" ry="1.5" fill={C.beak} />
      {/* Pincel (reemplaza cámara) */}
      <rect x="28" y="7" width="2.5" height="11" rx="1" fill="#8B6914" />
      <rect x="27.5" y="17" width="3.5" height="2" rx="0.5" fill="#999" />
      {/* Cerdas del pincel */}
      <ellipse cx="29.25" cy="21" rx="2.5" ry="3.5" fill="#E87800" opacity="0.9" />
      <ellipse cx="29.25" cy="21" rx="1.5" ry="3.5" fill="#FF6B00" opacity="0.7" />
      {/* Paleta de pintura */}
      <ellipse cx="9" cy="26" rx="7" ry="5.5" fill="#D4C098" />
      <circle cx="7"  cy="24" r="1.8" fill="#CC1515" />
      <circle cx="11" cy="23" r="1.8" fill="#E87800" />
      <circle cx="13" cy="26" r="1.8" fill="#1E6B42" />
      <circle cx="10" cy="29" r="1.8" fill="#4A7EB5" />
      <circle cx="7"  cy="28.5" r="1.3" fill="#fff" opacity="0.7" />
      {/* Patas */}
      <rect x="16.5" y="37" width="3" height="4.5" rx="1" fill={C.feet} />
      <rect x="22.5" y="37" width="3" height="4.5" rx="1" fill={C.feet} />
      <ellipse cx="18" cy="42" rx="4" ry="1.3" fill={C.feet} opacity="0.88" />
      <ellipse cx="24" cy="42" rx="4" ry="1.3" fill={C.feet} opacity="0.88" />
    </svg>
  )
}

// ── Pato Evento — megáfono + confetti ───────────────────────────────────
export function DuckEventSVG({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" overflow="visible" aria-hidden="true">
      {/* Cuerpo */}
      <ellipse cx="22" cy="30" rx="12" ry="9" fill={C.body} />
      {/* Ala */}
      <ellipse cx="22" cy="24" rx="10" ry="4" fill={C.wing} />
      <ellipse cx="20" cy="23.5" rx="5" ry="1.4" fill={C.speculum} opacity="0.88" />
      {/* Collar */}
      <ellipse cx="28" cy="27.5" rx="4" ry="2" fill={C.collar} opacity="0.92" />
      {/* Cabeza */}
      <circle cx="31" cy="22" r="7" fill={C.head} />
      <ellipse cx="30" cy="20" rx="4" ry="3" fill="#2A8A56" opacity="0.4" />
      {/* Ojo */}
      <circle cx="33" cy="20" r="1.5" fill={C.eye} />
      <circle cx="33.5" cy="19.5" r="0.5" fill={C.gleam} />
      {/* Pico */}
      <ellipse cx="37.5" cy="22.5" rx="3" ry="1.5" fill={C.beak} />
      {/* Megáfono */}
      <polygon points="37,19 37,26 44,29 44,16" fill="#CC1515" />
      <rect x="35" y="20" width="3" height="5" rx="0.5" fill="#991010" />
      {/* Ondas de sonido */}
      <path d="M45,18 Q48,22.5 45,27" stroke="#E87800" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M46.5,16 Q51,22.5 46.5,29" stroke="#E87800" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Confetti */}
      <circle cx="12" cy="10" r="1.5" fill="#CC1515" />
      <circle cx="7"  cy="16" r="1.2" fill="#4A7EB5" />
      <circle cx="18" cy="6"  r="1"   fill="#E87800" />
      <rect x="5"  y="10" width="2.5" height="2.5" rx="0.5" fill="#1E6B42" transform="rotate(25,6.25,11.25)" />
      <rect x="15" y="13"  width="2" height="2" rx="0.5" fill="#CC1515" opacity="0.8" />
      <rect x="22" y="4"  width="2"   height="2"   rx="0.5" fill="#4A7EB5" transform="rotate(-15,23,5)" />
      {/* Patas */}
      <rect x="16.5" y="37" width="3" height="4.5" rx="1" fill={C.feet} />
      <rect x="22.5" y="37" width="3" height="4.5" rx="1" fill={C.feet} />
      <ellipse cx="18" cy="42" rx="4" ry="1.3" fill={C.feet} opacity="0.88" />
      <ellipse cx="24" cy="42" rx="4" ry="1.3" fill={C.feet} opacity="0.88" />
    </svg>
  )
}
