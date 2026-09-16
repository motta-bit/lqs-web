/**
 * Guardia de arquitectura: three/R3F nunca deben entrar al app shell.
 *
 * El informe (§F) lo pide explícitamente — "diferir el bundle 3D tras el primer
 * paint" — y es la invariante de la que depende el presupuesto de LCP. Un
 * `import` estático mal puesto en cualquier componente cliente la rompe en
 * silencio: el sitio sigue funcionando, solo se vuelve lento.
 *
 * Por eso se verifica en CI y no a ojo.
 */

import fs from 'node:fs'
import path from 'node:path'

const MANIFEST = path.join(process.cwd(), '.next', 'build-manifest.json')

if (!fs.existsSync(MANIFEST)) {
  console.error('Falta .next/build-manifest.json — corré `npm run build` primero.')
  process.exit(1)
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
const shell = [...manifest.rootMainFiles, ...manifest.polyfillFiles]

// Símbolos que solo aparecen si three llegó al bundle. Se buscan varios para
// que una minificación agresiva no dé un falso OK.
const THREE_MARKERS = /WebGLRenderer|BufferGeometry|PerspectiveCamera|three\.module/

const offenders = shell.filter((file) => {
  const source = fs.readFileSync(path.join('.next', file), 'utf8')
  return THREE_MARKERS.test(source)
})

if (offenders.length > 0) {
  console.error('FALLO: el bundle 3D entró al app shell.')
  offenders.forEach((f) => console.error('  ' + f))
  console.error('\nRevisá que la escena se importe con dynamic(..., { ssr: false }).')
  process.exit(1)
}

console.log(`OK: three ausente del app shell (${shell.length} archivos verificados).`)
