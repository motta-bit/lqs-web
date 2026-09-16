'use client'

/**
 * CityPreloader — nivel 0 (informe §D).
 *
 * Reemplaza el preloader falso (progreso por setInterval + localStorage). Aquí
 * el contador es real: lo mueve la carga efectiva de la escena vía
 * cityReadyStore (contexto GL → primer frame pintado).
 *
 * Regla de oro del informe: la transición enmascara carga real, nunca añade
 * espera artificial. Por eso solo aparece en modo `full` — en lite/static no
 * hay mundo 3D que cargar, así que no hay nada que enmascarar y mostrar un
 * preloader sería precisamente la espera falsa que el informe prohíbe.
 */

import { useEffect, useRef, useState } from 'react'
import { useCapability } from '@/motion/useCapability'
import { useCityReadyStore } from './scene/cityReadyStore'
import { DuckSVG } from '@/components/duck/DuckSVG'
import { CITY_COPY } from './districts'

/**
 * Tope duro de espera. Si la escena no reporta "listo" en este tiempo (GPU
 * lenta, contexto WebGL perdido, tab en segundo plano), el preloader se retira
 * igual. Un preloader que puede colgarse para siempre es exactamente el
 * asesino de conversión que advierte el informe (regla de los 3s de Google).
 */
const MAX_WAIT_MS = 6000

export function CityPreloader() {
  const { mode, resolved } = useCapability()
  const progress = useCityReadyStore((s) => s.progress)
  const ready = useCityReadyStore((s) => s.ready)

  const [dismissed, setDismissed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Al llegar a listo, se retira tras un beat corto (deja ver el 100%).
  useEffect(() => {
    if (ready && !dismissed) {
      timerRef.current = setTimeout(() => setDismissed(true), 350)
    }
    return () => clearTimeout(timerRef.current)
  }, [ready, dismissed])

  // Tope duro: el usuario nunca queda atrapado, reporte o no la escena.
  useEffect(() => {
    const cap = setTimeout(() => setDismissed(true), MAX_WAIT_MS)
    return () => clearTimeout(cap)
  }, [])

  // Solo en full: es el único modo con carga 3D real que enmascarar.
  // Antes de resolver el modo no se muestra, para no tapar el hub en lite.
  if (!resolved || mode !== 'full' || dismissed) return null

  const pct = Math.round(progress * 100)

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-500"
      style={{ opacity: ready ? 0 : 1 }}
      role="status"
      aria-live="polite"
      aria-label={`${CITY_COPY.preloader} ${pct}%`}
    >
      {/* Pato ensamblándose: entra con un latido y flota mientras carga. */}
      <div className="duck-assemble">
        <DuckSVG size={72} />
      </div>

      <div className="mt-8 font-display text-3xl font-black uppercase tracking-[0.3em] text-white">
        LQS
      </div>

      <p className="mt-3 font-data-mono text-xs tracking-[0.2em] text-[color:var(--imi-textMuted)]">
        {CITY_COPY.preloader}
      </p>

      {/* Barra: el ancho anima suave aunque el progreso real salte 0→60→100. */}
      <div className="mt-6 h-px w-48 overflow-hidden bg-white/10">
        <div
          className="h-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%`, background: 'var(--lqs-orange)' }}
        />
      </div>

      <div className="mt-3 font-data-mono text-[11px] tracking-[0.2em] text-[color:var(--imi-textMuted)]">
        {pct}%
      </div>
    </div>
  )
}

export default CityPreloader
