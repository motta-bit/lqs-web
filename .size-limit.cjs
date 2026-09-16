/**
 * Presupuesto de tamaño de bundle (decisión D-05).
 *
 * Turbopack emite nombres de chunk totalmente opacos (`0paxexg6-m0de.js`), así
 * que no hay glob estable que apuntar. La configuración se resuelve leyendo el
 * build manifest, que es la única fuente fiable de qué carga realmente el
 * arranque de la app.
 *
 * Requiere `next build` previo. `npm run perf` encadena ambos.
 */

const fs = require('node:fs')
const path = require('node:path')

const MANIFEST = path.join(__dirname, '.next', 'build-manifest.json')

if (!fs.existsSync(MANIFEST)) {
  throw new Error('Falta .next/build-manifest.json — corré `npm run build` antes de size-limit.')
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
// Siempre con `/`: size-limit interpreta las rutas como globs y en Windows el
// backslash es carácter de escape, no separador.
const toNextPath = (f) => `.next/${f.split(path.sep).join('/')}`

module.exports = [
  {
    // Lo que el navegador necesita antes de pintar cualquier ruta.
    // El bundle 3D NO debe aparecer acá: va detrás de dynamic(ssr:false).
    name: 'App shell (arranque, sin 3D)',
    path: [...manifest.rootMainFiles, ...manifest.polyfillFiles].map(toNextPath),
    // Medido en 149 kB al cerrar Fase 0. El margen es para features, no para
    // que three se cuele: si esto pasa de 180 kB algo entró al arranque.
    limit: '180 kB',
  },
  {
    // Techo global. Si three/R3F se cuelan en el arranque, esto también sube.
    name: 'Total de chunks estáticos',
    path: '.next/static/chunks/**/*.js',
    limit: '600 kB',
  },
]
