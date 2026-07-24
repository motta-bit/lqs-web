import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DISTRICTS, getDistrict, ACCENT_TEXT_HEX, CITY_COPY } from '@/city/districts'
import { getCases, getCase } from '@/city/cases'
import { SoundToggle } from '@/city/sound/SoundToggle'

/**
 * Nivel 3 — Local / deep-dive.
 *
 * El ÚNICO nivel donde vive el texto largo (regla 1). Aquí sí hay párrafos:
 * el caso completo, el detalle, el resultado. Server-rendered para SEO — es
 * el contenido indexable de verdad de la ciudad.
 */

export function generateStaticParams() {
  return DISTRICTS.flatMap((d) =>
    getCases(d.slug).map((c) => ({ distrito: d.slug, caso: c.slug })),
  )
}

export async function generateMetadata(
  props: PageProps<'/ciudad/[distrito]/[caso]'>,
): Promise<Metadata> {
  const { distrito, caso } = await props.params
  const district = getDistrict(distrito)
  const caseData = getCase(distrito, caso)
  if (!district || !caseData) return {}

  return {
    title: `${caseData.title} — ${district.name}`,
    description: caseData.tagline,
  }
}

export default async function CasoPage(props: PageProps<'/ciudad/[distrito]/[caso]'>) {
  const { distrito, caso } = await props.params
  const district = getDistrict(distrito)
  const caseData = getCase(distrito, caso)
  if (!district || !caseData) notFound()

  const accentText = ACCENT_TEXT_HEX[district.accent]

  return (
    <main className="relative min-h-dvh bg-black px-6 py-10 md:px-10">
      <Link
        href={`/ciudad/${district.slug}`}
        className="text-xs uppercase tracking-[0.2em] text-[color:var(--imi-textMuted)] underline-offset-4 hover:underline"
      >
        ← {district.name}
      </Link>

      <article className="mx-auto mt-16 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: accentText }}>
          {district.name} · {caseData.metric}
        </p>

        <h1 className="mt-4 font-display text-[clamp(2.25rem,7vw,4.5rem)] font-black uppercase leading-[0.9] tracking-tight">
          {caseData.title}
        </h1>

        <p className="mt-6 text-lg text-[color:var(--imi-textMuted)]">{caseData.tagline}</p>

        {/* Texto largo — nivel 3, y solo aquí. */}
        <div className="mt-10 space-y-5 text-base leading-relaxed text-white/85">
          {caseData.deepDive.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Otros casos del mismo distrito. */}
        <nav aria-label={`Más casos de ${district.name}`} className="mt-16 border-t border-white/10 pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {getCases(district.slug)
              .filter((c) => c.slug !== caseData.slug)
              .map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/ciudad/${district.slug}/${c.slug}`}
                    className="text-sm underline-offset-4 hover:underline"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <p className="mt-12">
          <Link href="/ayuntamiento" className="underline underline-offset-4" style={{ color: accentText }}>
            {CITY_COPY.duckCTA}
          </Link>
        </p>
      </article>

      <SoundToggle />
    </main>
  )
}
