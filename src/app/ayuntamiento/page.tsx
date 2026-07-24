import type { Metadata } from 'next'
import Link from 'next/link'
import { CITY_COPY } from '@/city/districts'
import { AyuntamientoFlow } from '@/city/ayuntamiento/AyuntamientoFlow'
import { SoundToggle } from '@/city/sound/SoundToggle'

/**
 * Nivel 4 — Ayuntamiento (Fase 3).
 *
 * El cotizador de 6 pasos reformulado como conversación guiada, montado
 * sobre la máquina de estados y el motor de precios existentes. El shell es
 * Server Component: h1 y copy indexables; la conversación es la isla cliente.
 *
 * Regla 2: ninguna lista de precios. El precio aparece una única vez, en el
 * paso de resultado del flujo.
 */

export const metadata: Metadata = {
  title: 'Ayuntamiento',
  description: CITY_COPY.quoterIntro,
}

export default function AyuntamientoPage() {
  return (
    <main className="relative min-h-dvh bg-black px-6 py-10 md:px-10">
      <Link
        href="/ciudad"
        className="text-xs uppercase tracking-[0.2em] text-[color:var(--imi-textMuted)] underline-offset-4 hover:underline"
      >
        ← Volver a la ciudad
      </Link>

      <header className="mx-auto mt-14 max-w-2xl">
        <h1 className="font-display text-[clamp(1.75rem,6vw,4rem)] font-black uppercase leading-[0.9]">
          {CITY_COPY.quoterIntro}
        </h1>
      </header>

      <div className="mt-10">
        <AyuntamientoFlow />
      </div>

      <noscript>
        <p className="mx-auto mt-10 max-w-2xl">
          El cotizador necesita JavaScript.{' '}
          <a href="/contacto" className="underline">
            Escríbenos directo y te cotizamos a mano.
          </a>
        </p>
      </noscript>

      <SoundToggle />
    </main>
  )
}
