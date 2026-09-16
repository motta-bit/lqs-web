'use client'

/**
 * useSound — API para disparar cues desde cualquier componente.
 *
 * Devuelve una función estable `cue(name)` que solo suena si el usuario activó
 * el sonido. Doble barrera con el motor: si el store dice off, ni se llama a
 * play; si el audio no fue primed, play es no-op.
 */

import { useCallback } from 'react'
import { useSoundStore } from './soundStore'
import { play, type SoundCue } from './engine'

export function useSound() {
  const enabled = useSoundStore((s) => s.enabled)

  return useCallback(
    (cue: SoundCue) => {
      if (!enabled) return
      play(cue)
    },
    [enabled],
  )
}
