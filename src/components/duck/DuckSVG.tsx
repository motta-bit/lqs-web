/**
 * The duck. Brand signature — geometry is preserved exactly (decision D-03).
 *
 * The only change from the original `DuckCursor.tsx` is that the bob, waddle
 * and leg swing moved from a React `frame` prop to CSS keyframes. Same motion,
 * same periods, zero re-renders. See `.duck-*` in globals.css.
 *
 * Pose and direction are driven by data attributes so the animation loop can
 * change them without React ever re-rendering this tree.
 */

const W = '#FFFFFF'
const S = '#0d0d0d'

export type DuckPose = 'idle' | 'walking' | 'sleeping'

export function DuckSVG({ size = 52 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round((size * 90) / 68)}
      viewBox="0 0 68 90"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <g className="duck-bob">
        <g className="duck-waddle">
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
          <circle cx="44" cy="26" r="12" fill={W} stroke={S} strokeWidth="2.2" />

          {/* ── Ojo ── */}
          <circle className="duck-eye-open" cx="48" cy="22" r="1.8" fill={S} />
          <path
            className="duck-eye-shut"
            d="M 45 22 Q 48 19.5 51 22"
            stroke={S} strokeWidth="1.6" fill="none" strokeLinecap="round"
          />

          {/* ── Pico — triángulo pequeño apuntando derecha ── */}
          <path
            d="M 54 23 L 62 26 L 54 29 Z"
            fill={W} stroke={S} strokeWidth="1.8"
            strokeLinejoin="round"
          />

          <g className="duck-legs">
            {/* Pata izquierda */}
            <g className="duck-leg-l">
              <line x1="24" y1="64" x2="24" y2="74" stroke={S} strokeWidth="2.2" strokeLinecap="round" />
              {/* caña */}
              <rect x="17" y="70" width="13" height="9" rx="1.5" fill={W} stroke={S} strokeWidth="2" />
              {/* suela / punta */}
              <rect x="15" y="76" width="19" height="5" rx="2" fill={W} stroke={S} strokeWidth="2" />
              {/* líneas de textura */}
              <line x1="19" y1="73" x2="28" y2="73" stroke={S} strokeWidth="0.9" opacity="0.4" />
              <line x1="19" y1="76" x2="28" y2="76" stroke={S} strokeWidth="0.9" opacity="0.4" />
            </g>

            {/* Pata derecha */}
            <g className="duck-leg-r">
              <line x1="36" y1="64" x2="36" y2="74" stroke={S} strokeWidth="2.2" strokeLinecap="round" />
              <rect x="29" y="70" width="13" height="9" rx="1.5" fill={W} stroke={S} strokeWidth="2" />
              <rect x="27" y="76" width="19" height="5" rx="2" fill={W} stroke={S} strokeWidth="2" />
              <line x1="31" y1="73" x2="40" y2="73" stroke={S} strokeWidth="0.9" opacity="0.4" />
              <line x1="31" y1="76" x2="40" y2="76" stroke={S} strokeWidth="0.9" opacity="0.4" />
            </g>
          </g>

          {/* ── Zzz durmiendo ── */}
          <g className="duck-zzz" opacity="0.45" fontFamily="sans-serif" fontWeight="bold" fill={S}>
            <text x="57" y="18" fontSize="6">z</text>
            <text x="62" y="11" fontSize="4.5">z</text>
            <text x="66" y="5" fontSize="3">z</text>
          </g>
        </g>
      </g>
    </svg>
  )
}

export default DuckSVG
