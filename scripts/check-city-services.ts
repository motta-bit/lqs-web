/**
 * Guardia de consistencia mascota↔servicio.
 *
 * districts.ts (capa de presentación) y prisma/seed.ts (datos) referencian los
 * mismos slugs de servicio desde lugares distintos. Sin esta verificación es
 * cuestión de tiempo que uno cambie un slug y el otro quede colgado: un distrito
 * apuntando a un servicio que no existe, o un servicio huérfano sin distrito.
 *
 * Corre con `npm run check:city`. No toca la BD.
 */

import { DISTRICTS } from '../src/city/districts'

// Import perezoso del seed sin ejecutar su `main()`: solo queremos los datos.
// El seed exporta las constantes para poder verificarlas acá.
import { SERVICES, PACKAGES } from '../prisma/seed-data'

const errors: string[] = []

const seedSlugs = new Set(SERVICES.map((s) => s.slug))
const districtSlugs = new Set(DISTRICTS.map((d) => d.slug))

// 1. Todo servicio referenciado por un distrito existe en el seed.
for (const district of DISTRICTS) {
  for (const slug of district.services) {
    if (!seedSlugs.has(slug)) {
      errors.push(`Distrito ${district.slug} → servicio inexistente en seed: ${slug}`)
    }
  }
}

// 2. Todo servicio del seed pertenece a un distrito declarado, y ese distrito
//    lo lista. (Detecta servicios huérfanos y asignaciones asimétricas.)
for (const service of SERVICES) {
  if (!districtSlugs.has(service.district)) {
    errors.push(`Servicio ${service.slug} → distrito desconocido: ${service.district}`)
    continue
  }
  const district = DISTRICTS.find((d) => d.slug === service.district)!
  if (!district.services.includes(service.slug)) {
    errors.push(`Servicio ${service.slug} dice distrito ${service.district}, pero ese distrito no lo lista`)
  }
}

// 3. Todo servicio de un paquete existe.
for (const pkg of PACKAGES) {
  for (const slug of pkg.serviceSlugs) {
    if (!seedSlugs.has(slug)) {
      errors.push(`Paquete ${pkg.slug} → servicio inexistente: ${slug}`)
    }
  }
}

// 4. Cada distrito tiene al menos un servicio (ningún distrito vacío llega al
//    cotizador). Era el riesgo de PLAN.md §3.
for (const district of DISTRICTS) {
  if (district.services.length === 0) {
    errors.push(`Distrito ${district.slug} no tiene servicios — llegaría vacío al cotizador`)
  }
}

if (errors.length > 0) {
  console.error('FALLO: inconsistencias mascota↔servicio\n')
  errors.forEach((e) => console.error('  • ' + e))
  process.exit(1)
}

console.log(
  `OK: ${SERVICES.length} servicios en ${DISTRICTS.length} distritos, ` +
    `${PACKAGES.length} paquetes. Sin distritos vacíos.`,
)
