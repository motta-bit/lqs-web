/**
 * The DOM layer of the hub — brief rule 3.
 *
 * This is a SERVER component. It renders real HTML on top of the canvas, never
 * inside it. Three things depend on that: Googlebot sees 8 crawlable links to
 * the districts, screen readers get a real navigation landmark, and the LCP
 * element is text the browser can paint before any 3D work begins.
 *
 * Brief rule 1: zero paragraphs at the hub. The district names and the invite
 * are the entire copy budget of this level.
 *
 * Brief rule 7: every district is a real <Link>. Hovering the 3D block is an
 * enhancement; the persistent, keyboard-reachable trigger is this list.
 */

import Link from 'next/link'
import { DISTRICTS, CITY_COPY, ACCENT_HEX } from '../districts'

export function HubCopy() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-6 md:p-10">
      <header>
        <h1 className="font-display text-[clamp(2.5rem,9vw,7rem)] font-black uppercase leading-[0.85] tracking-tight">
          La Ciudad
          <br />
          del Pato
        </h1>
        <p className="mt-4 max-w-xs text-sm uppercase tracking-[0.2em] text-[color:var(--imi-textMuted)]">
          {CITY_COPY.hubInvite}
        </p>
      </header>

      {/*
        The accessible spine of the hub. On `full` this reads as a legend beside
        the 3D city; on `lite` and `static` it IS the navigation. Same markup in
        all three modes — that is decision D-04 in practice.
      */}
      <nav aria-label="Distritos de la ciudad" className="pointer-events-auto">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4 lg:flex lg:flex-wrap lg:gap-x-8">
          {DISTRICTS.map((district) => (
            <li key={district.slug}>
              <Link
                href={`/ciudad/${district.slug}`}
                data-district={district.slug}
                className="group inline-flex items-baseline gap-2 py-2 font-display text-lg font-black uppercase tracking-wide transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 lg:opacity-60"
                style={{ outlineColor: ACCENT_HEX[district.accent] }}
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: ACCENT_HEX[district.accent] }}
                />
                {district.name}
                {/* Named for screen readers without spending visible copy. */}
                <span className="sr-only"> — {district.domain}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default HubCopy
