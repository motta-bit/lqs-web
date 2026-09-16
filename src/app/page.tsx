import { CityHub } from '@/city/CityHub'

/**
 * Home — La Ciudad del Pato (Fase 4, D-13).
 *
 * La ciudad es ahora la puerta del sitio, como pide el informe una vez que los
 * 8 distritos tienen contenido. Está fuera del route group (main), así que usa
 * solo el layout raíz: sin Header/Footer legacy. El menú de escape (CityMenu)
 * cubre la navegación tradicional.
 *
 * La metadata la hereda del layout raíz (título por defecto "LQS — Lo Que
 * Sea"), que es lo correcto para la home.
 */
export default function HomePage() {
  return <CityHub />
}
