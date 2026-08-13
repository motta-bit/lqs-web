import { create } from 'zustand'

/**
 * Señal de carga real de la ciudad (informe §D: "contador real de assets").
 *
 * Reemplaza el progreso falso del preloader viejo. Lo alimentan eventos
 * reales del canvas — contexto GL creado, primer frame pintado — no un
 * setInterval. En Fase 2, cuando haya modelos y texturas, aquí se engancha
 * THREE.LoadingManager y el progreso pasa a ser byte a byte.
 */
interface CityReadyState {
  progress: number // 0..1, real
  ready:    boolean
  setProgress: (value: number) => void
  markReady:   () => void
  reset:       () => void
}

export const useCityReadyStore = create<CityReadyState>((set) => ({
  progress: 0,
  ready:    false,
  // Monótono: el progreso nunca retrocede, para que la barra no parpadee.
  setProgress: (value) => set((s) => ({ progress: Math.max(s.progress, Math.min(1, value)) })),
  markReady:   () => set({ progress: 1, ready: true }),
  reset:       () => set({ progress: 0, ready: false }),
}))
