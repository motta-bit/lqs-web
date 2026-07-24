import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DISTRICTS, getDistrict, ACCENT_HEX, ACCENT_TEXT_HEX, CITY_COPY } from '@/city/districts'
import { getCases } from '@/city/cases'
import { DistrictLink } from '@/city/dom/DistrictLink'
import { SoundToggle } from '@/city/sound/SoundToggle'

/**
 * Nivel 2 — Distrito.
 *
 * Regla 1: una sola frase de propósito. Los casos son "edificios": muestran
 * su título siempre (disparador persistente, regla 7) y revelan la línea al
 * hover/focus con CSS — sin JS, sigue siendo Server Component y accesible por
 * teclado. El texto largo no está aquí: vive en el nivel 3.
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
  const accentText = ACCENT_TEXT_HEX[district.accent]
  const cases = getCases(district.slug)

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
        {/* La única frase. Todo el presupuesto de copy del nivel 2. */}
        <p className="mt-6 font-display text-[clamp(1.5rem,4vw,2.75rem)] font-black uppercase leading-tight">
          {district.phrase}
        </p>
      </header>

      {/* Casos como objetos. */}
      {cases.length > 0 ? (
        <section aria-label={`Casos de ${district.name}`} className="mt-20">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((c) => (
              <li key={c.slug}>
                <DistrictLink
                  href={`/ciudad/${district.slug}/${c.slug}`}
                  accent={district.accent}
                  className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-sm border border-white/10 p-5 transition-colors hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ outlineColor: accent }}
                >
                  {/* Barra de acento del "edificio". */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-1 w-full origin-left scale-x-100"
                    style={{ background: accent }}
                  />
                  {/* Título: visible siempre (disparador persistente). */}
                  <h2 className="font-display text-xl font-black uppercase leading-none tracking-tight">
                    {c.title}
                  </h2>
                  {/* Métrica: visible siempre, discreta. Texto pequeño → color accesible. */}
                  <p className="mt-2 text-xs uppercase tracking-[0.15em]" style={{ color: accentText }}>
                    {c.metric}
                  </p>
                  {/* Línea: se revela al hover/focus (progresiva). */}
                  <p className="mt-2 max-h-0 overflow-hidden text-sm text-[color:var(--imi-textMuted)] opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100 group-focus-within:max-h-24 group-focus-within:opacity-100">
                    {c.tagline}
                  </p>
                </DistrictLink>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="mt-20 text-xs uppercase tracking-[0.2em] text-[color:var(--imi-textMuted)]">
          Casos — próximamente
        </p>
      )}

      <nav aria-label="Otros distritos" className="mt-24 border-t border-white/10 pt-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {DISTRICTS.filter((d) => d.slug !== district.slug).map((d) => (
            <li key={d.slug}>
              <DistrictLink
                href={`/ciudad/${d.slug}`}
                accent={d.accent}
                className="font-display text-sm font-black uppercase tracking-wide opacity-50 transition-opacity hover:opacity-100"
              >
                {d.name}
              </DistrictLink>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-16">
        <Link href="/ayuntamiento" className="underline underline-offset-4" style={{ color: accentText }}>
          {CITY_COPY.duckCTA}
        </Link>
      </p>

      <SoundToggle />
    </main>
  )
}
