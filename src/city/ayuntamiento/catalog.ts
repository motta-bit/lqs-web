/**
 * Catálogo cliente del Ayuntamiento — la matriz diagnóstica.
 *
 * Importa directamente de prisma/seed-data (objetos planos, tipos type-only):
 * una sola fuente de verdad para servicios y paquetes, verificada por
 * check:city. Cuando la BD esté conectada en producción, este módulo puede
 * pasar a hidratarse desde /api/v1/services sin cambiar la superficie.
 *
 * Regla 2 del brief se hereda: este catálogo alimenta la conversación, pero
 * el precio solo se muestra en el paso de resultado.
 */

import { SERVICES, PACKAGES, type ServiceSeed, type PackageSeed } from '../../../prisma/seed-data'
import type { QuoterService } from '@/store/quoterStore'

export { SERVICES, PACKAGES }
export type { ServiceSeed, PackageSeed }

/** Servicios de un distrito, en la forma que ya consume el quoterStore. */
export function servicesForDistrict(district: string): QuoterService[] {
  return SERVICES.filter((s) => s.district === district).map(toQuoterService)
}

export function toQuoterService(s: ServiceSeed): QuoterService {
  return {
    id: s.slug,
    slug: s.slug,
    name: s.nameEs,
    nameEn: s.nameEn,
    category: s.category,
    basePrice: s.basePrice,
    unitType: 'unidad',
    description: s.descriptionEs,
    descriptionEn: s.descriptionEn,
    isActive: true,
    order: 0,
    createdAt: new Date(0), // estable: evita mismatch de hidratación
  }
}

export interface PlanSuggestion {
  pkg: PackageSeed
  /** Precio con descuento aplicado (mensual si billing=MONTHLY). */
  price: number
  monthly: boolean
  /** Cuántos de los servicios elegidos cubre el paquete. */
  covered: number
}

/** Precio de un paquete: suma de sus servicios × (1 − descuento). */
export function packagePrice(pkg: PackageSeed): number {
  const priceBySlug = new Map(SERVICES.map((s) => [s.slug, s.basePrice]))
  const subtotal = pkg.serviceSlugs.reduce((acc, slug) => acc + (priceBySlug.get(slug) ?? 0), 0)
  return Math.round(subtotal * (1 - pkg.discountPct))
}

/**
 * Matriz diagnóstica → recomendación: el paquete/plan que más servicios
 * elegidos cubre, filtrado por tipo de cliente. Empates los gana el de menor
 * precio (la escalera empieza abajo: primero el paso alcanzable, no el techo).
 * Se exige cubrir al menos 2 servicios para no recomendar por ruido.
 */
export function suggestPlan(
  selectedSlugs: string[],
  clientType: string,
): PlanSuggestion | null {
  const selected = new Set(selectedSlugs)

  let best: PlanSuggestion | null = null
  for (const pkg of PACKAGES) {
    if (!pkg.clientTypes.includes(clientType as PackageSeed['clientTypes'][number])) continue
    const covered = pkg.serviceSlugs.filter((slug) => selected.has(slug)).length
    if (covered < 2) continue

    const candidate: PlanSuggestion = {
      pkg,
      price: packagePrice(pkg),
      monthly: pkg.billing === 'MONTHLY',
      covered,
    }
    if (
      !best ||
      candidate.covered > best.covered ||
      (candidate.covered === best.covered && candidate.price < best.price)
    ) {
      best = candidate
    }
  }
  return best
}
