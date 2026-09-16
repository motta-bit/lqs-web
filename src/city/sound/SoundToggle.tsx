'use client'

/**
 * SoundToggle — el toggle visible que exige la regla 6.
 *
 * Siempre presente, siempre accesible por teclado, con estado claro (aria-
 * pressed). Activarlo es el gesto de usuario que arranca el audio; desactivarlo
 * lo descarta. Nunca suena nada sin pasar por aquí.
 */

import { useSoundStore } from './soundStore'
import { primeAudio, teardownAudio, play } from './engine'

export function SoundToggle() {
  const enabled = useSoundStore((s) => s.enabled)
  const toggle = useSoundStore((s) => s.toggle)

  const handleClick = () => {
    const next = !enabled
    if (next) {
      // Este click es el gesto que autoriza el audio (política del navegador).
      primeAudio()
      play('toggle')
    } else {
      teardownAudio()
    }
    toggle()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={enabled}
      aria-label={enabled ? 'Silenciar sonido' : 'Activar sonido'}
      title={enabled ? 'Sonido activado' : 'Sonido desactivado'}
      className="fixed bottom-5 right-5 z-[997] flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition-colors hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outlineColor: 'var(--lqs-orange)' }}
    >
      {/* Icono en SVG inline: barras + ondas cuando está activo. */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 9v6h4l5 4V5L8 9H4z"
          fill="currentColor"
        />
        {enabled ? (
          <>
            <path d="M16 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </>
        ) : (
          <path d="M17 9l5 6M22 9l-5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        )}
      </svg>
    </button>
  )
}

export default SoundToggle
