'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Estado del sonido — regla innegociable 6: opt-in, toggle visible, nunca
 * autoplay.
 *
 * `enabled` arranca en false y solo cambia por acción explícita del usuario.
 * Se persiste para respetar la elección entre visitas — pero incluso
 * persistido, el contexto de audio no arranca hasta un gesto del usuario
 * (política de autoplay del navegador), así que jamás suena sin permiso.
 */
interface SoundState {
  enabled: boolean
  toggle: () => void
  set: (value: boolean) => void
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      enabled: false,
      toggle: () => set((s) => ({ enabled: !s.enabled })),
      set: (enabled) => set({ enabled }),
    }),
    { name: 'lqs-sound' },
  ),
)
