import type { Metadata } from 'next'
import { CityStage } from '@/city/CityStage'
import { CityPreloader } from '@/city/CityPreloader'
import { HubCopy } from '@/city/dom/HubCopy'
import { CITY_COPY } from '@/city/districts'
import { DuckCursor } from '@/components/duck/DuckCursor'

/**
 * Level 1 — the Hub.
 *
 * Lives at /ciudad during Phase 0 (decision D-08) so the grey-box can be
 * reviewed without taking the live homepage down. It moves to / in Phase 2,
 * once there is something behind all eight districts.
 *
 * This page is a Server Component and stays one. The canvas is mounted by
 * `CityStage`, a client island; the copy is server-rendered HTML. Googlebot
 * gets the h1 and eight district links with JS disabled.
 */

export const metadata: Metadata = {
  title: 'La Ciudad del Pato',
  description: CITY_COPY.hubInvite,
}

export default function CiudadPage() {
  return (
    <main className="relative min-h-dvh bg-black">
      <CityStage />
      <HubCopy />
      <DuckCursor />
      <CityPreloader />

      <noscript>
        {/*
          Brief §F: a <noscript> with headline, summary and CTA inside the
          canvas wrapper. Without JS the backdrop never mounts, so this is the
          whole experience — it has to stand on its own.
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
