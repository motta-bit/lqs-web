'use client'

/**
 * Easter egg del pato — el cursor de pato es "la puerta natural a una familia
 * de easter eggs" (informe §B.6).
 *
 * Teclear "pato" en cualquier parte revela un guiño efímero y, si el sonido
 * está activo, un cue. Al ser una secuencia de teclado es accesible por
 * naturaleza; no interfiere con inputs (se ignora si el foco está en un campo
 * de texto). Sorpresa y deleite sin costo de performance ni de accesibilidad.
 */

import { useEffect, useState } from 'react'
import { useSound } from './sound/useSound'

const SEQUENCE = 'pato'

export function DuckEasterEgg() {
  const [revealed, setRevealed] = useState(false)
  const cue = useSound()

  useEffect(() => {
    let buffer = ''

    const onKeyDown = (e: KeyboardEvent) => {
      // No secuestrar la escritura en campos.
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (target?.isContentEditable) return
      if (e.key.length !== 1) return

      buffer = (buffer + e.key.toLowerCase()).slice(-SEQUENCE.length)
      if (buffer === SEQUENCE) {
        setRevealed(true)
        cue('cta')
        window.setTimeout(() => setRevealed(false), 3000)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [cue])

  if (!revealed) return null

  return (
    <div
      role="status"
      className="fixed bottom-20 right-5 z-[996] flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2 backdrop-blur"
      style={{ animation: 'duck-assemble-in 0.5s cubic-bezier(0.16,1,0.3,1) both' }}
    >
      <span aria-hidden="true" className="text-lg">🦆</span>
      <span className="font-data-mono text-xs tracking-[0.15em] text-white">
        ¡Cuac! Me encontraste.
      </span>
    </div>
  )
}

export default DuckEasterEgg
