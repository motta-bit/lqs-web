import type { Metadata } from 'next'
import Link from 'next/link'
import { CITY_COPY } from '@/city/districts'

/**
 * Level 4 — Ayuntamiento.
 *
 * Placeholder. The real thing (the existing 6-step quoter re-framed as a guided
 * conversation, plus the diagnostic matrix) is Phase 3.
 *
 * It exists now because every district already links here via the duck's
 * contextual CTA, and shipping a 404 behind the site's main conversion path is
 * not an acceptable Phase 0 state.
 *
 * The price rule (brief rule 2) is inherited for free: nothing here shows a
 * price, and the quoter that will live here only reveals one at the end.
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

      <h1 className="mt-16 max-w-3xl font-display text-[clamp(2rem,7vw,5rem)] font-black uppercase leading-[0.9]">
        {CITY_COPY.quoterIntro}
      </h1>

      <p className="mt-10 text-xs uppercase tracking-[0.2em] text-[color:var(--imi-textMuted)]">
        Cotizador — Fase 3
      </p>

      <p className="mt-6">
        <Link href="/contacto" className="underline underline-offset-4" style={{ color: 'var(--lqs-orange)' }}>
          {CITY_COPY.leadClose}
        </Link>
      </p>
    </main>
  )
}
