import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DISTRICTS, getDistrict, ACCENT_HEX, CITY_COPY } from '@/city/districts'

/**
 * Level 2 — District.
 *
 * Phase 0 scope: routing, copy contract and the accessible spine only. The
 * curtain transition, the sub-world and the 2-3 cases as objects land in
 * Phase 1.
 *
 * Brief rule 1 is enforced structurally here: a district renders exactly one
 * sentence (`phrase`). There is no slot for a paragraph, so none can be added
 * without changing the type.
 */

export function generateStaticParams() {
  return DISTRICTS.map((d) => ({ distrito: d.slug }))
}

export async function generateMetadata(
  props: PageProps<'/ciudad/[distrito]'>,
): Promise<Metadata> {
  const { distrito } = await props.params
  const district = getDistrict(distrito)
  if (!district) return {}

  return {
    title: `${district.name} — ${district.phrase}`,
    description: `${district.name}: ${district.domain}. ${district.phrase}`,
  }
}

export default async function DistritoPage(props: PageProps<'/ciudad/[distrito]'>) {
  const { distrito } = await props.params
  const district = getDistrict(distrito)
  if (!district) notFound()

  const accent = ACCENT_HEX[district.accent]

  return (
    <main className="relative min-h-dvh bg-black px-6 py-10 md:px-10">
      <Link
        href="/ciudad"
        className="text-xs uppercase tracking-[0.2em] text-[color:var(--imi-textMuted)] underline-offset-4 hover:underline"
      >
        ← Volver a la ciudad
      </Link>

      <header className="mt-16 max-w-4xl">
        <h1
          className="font-display text-[clamp(3rem,14vw,10rem)] font-black uppercase leading-[0.8] tracking-tight"
          style={{ color: accent }}
        >
          {district.name}
        </h1>
        {/* The one sentence. Level 2's entire copy budget. */}
        <p className="mt-6 font-display text-[clamp(1.5rem,4vw,2.75rem)] font-black uppercase leading-tight">
          {district.phrase}
        </p>
      </header>

      <p className="mt-20 text-xs uppercase tracking-[0.2em] text-[color:var(--imi-textMuted)]">
        Casos — Fase 1
      </p>

      <nav aria-label="Otros distritos" className="mt-24 border-t border-white/10 pt-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {DISTRICTS.filter((d) => d.slug !== district.slug).map((d) => (
            <li key={d.slug}>
              <Link
                href={`/ciudad/${d.slug}`}
                className="font-display text-sm font-black uppercase tracking-wide opacity-50 transition-opacity hover:opacity-100"
              >
                {d.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-16">
        <Link href="/ayuntamiento" className="underline underline-offset-4" style={{ color: accent }}>
          {CITY_COPY.duckCTA}
        </Link>
      </p>
    </main>
  )
}
