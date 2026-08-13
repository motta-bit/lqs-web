'use client'

/**
 * useCityNavigation — punto único de navegación entre niveles de la ciudad.
 *
 * Decide, según el modo de capacidad (D-04), si la navegación pasa por la
 * cortina o va directa:
 *   - static (reduced-motion): navegación instantánea, sin cortina.
 *   - lite / full: cortina clip-path.
 *
 * Devolver siempre una función con la misma firma deja a los call sites
 * (DistrictLink) sin ramas: el modo se resuelve acá, no en cada enlace.
 */

import { useRouter } from 'next/navigation'
import { useCapability } from '@/motion/useCapability'
import { allows } from '@/motion/rules'
import { useCurtainStore } from './curtainStore'
import { useSound } from '../sound/useSound'
import type { DistrictAccent } from '../districts'

export function useCityNavigation() {
  const router = useRouter()
  const { mode } = useCapability()
  const cover = useCurtainStore((s) => s.cover)
  const cue = useSound()

  return function navigateTo(href: string, accent: DistrictAccent = 'orange') {
    // Cue solo suena si el usuario activó el sonido (doble barrera en useSound).
    cue('curtain')
    if (allows(mode, 'levelTransitions')) {
      cover(href, accent)
    } else {
      router.push(href)
    }
  }
}
