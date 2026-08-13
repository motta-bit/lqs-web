import { create } from 'zustand'
import type { DistrictAccent } from '../districts'

/**
 * Estado de la transición-cortina entre niveles (informe §D).
 *
 * Vive fuera de React y del árbol de rutas para sobrevivir a la navegación:
 * el hub y el distrito son rutas distintas, así que la cortina tiene que
 * persistir su fase mientras Next reemplaza la página debajo.
 *
 *   idle     → sin cortina, overlay oculto
 *   covering → la cortina está entrando (tapa la pantalla)
 *   covered  → pantalla tapada; se dispara router.push y se espera el destino
 *   revealing→ la cortina se retira en la ruta nueva
 */
export type CurtainPhase = 'idle' | 'covering' | 'covered' | 'revealing'

interface CurtainState {
  phase:      CurtainPhase
  accent:     DistrictAccent
  targetHref: string | null
  cover:  (href: string, accent: DistrictAccent) => void
  covered: () => void
  reveal: () => void
  done:   () => void
}

export const useCurtainStore = create<CurtainState>((set) => ({
  phase:      'idle',
  accent:     'orange',
  targetHref: null,

  cover:  (targetHref, accent) => set({ phase: 'covering', accent, targetHref }),
  covered: () => set({ phase: 'covered' }),
  reveal: () => set({ phase: 'revealing' }),
  done:   () => set({ phase: 'idle', targetHref: null }),
}))
