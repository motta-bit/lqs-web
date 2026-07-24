import { CityStage } from '@/city/CityStage'
import { CityPreloader } from '@/city/CityPreloader'
import { HubCopy } from '@/city/dom/HubCopy'
import { CITY_COPY } from '@/city/districts'
import { DuckCursor } from '@/components/duck/DuckCursor'
import { SoundToggle } from '@/city/sound/SoundToggle'
import { DuckEasterEgg } from '@/city/DuckEasterEgg'
import { Whispers } from '@/city/dom/Whispers'
import { CityMenu } from '@/city/dom/CityMenu'

/**
 * El Hub (nivel 1), como componente reutilizable.
 *
 * Server Component: el canvas lo monta `CityStage` (isla cliente), el copy es
 * HTML server-rendered. Googlebot recibe el h1 y los 8 enlaces sin JS.
 *
 * Vive a la vez en `/` (la home desde Fase 4) — este componente es la fuente
 * única, para no duplicar el árbol entre rutas.
 */
export function CityHub() {
  return (
    <main className="relative min-h-dvh bg-black">
      <CityStage />
      <HubCopy />
      <DuckCursor />
      <CityPreloader />
      <SoundToggle />
      <DuckEasterEgg />
      <Whispers />
      <CityMenu />

      <noscript>
        {/*
          Informe §F: un <noscript> con headline, resumen y CTA dentro del
          wrapper del canvas. Sin JS el fondo nunca monta, así que esto es toda
          la experiencia — debe sostenerse solo.
        */}
        <div className="relative z-20 p-10">
          <p className="mb-6 text-lg">{CITY_COPY.hubInvite}</p>
          <a href="/ayuntamiento" className="underline">
            {CITY_COPY.quoterIntro}
          </a>
        </div>
      </noscript>
    </main>
  )
}

export default CityHub
