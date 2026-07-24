'use client'

/**
 * CityMenu — la vía de escape tradicional que exige el informe (Caveats):
 * "siempre una vía de escape/menú tradicional accesible, o algunos usuarios se
 * perderán".
 *
 * Un botón fijo abre un panel con la lista completa de distritos + el
 * Ayuntamiento + páginas clave. Navegación por teclado real: Escape cierra,
 * el foco entra al panel al abrir y vuelve al botón al cerrar. Es el plano B
 * para quien no quiera (o no pueda) navegar el mundo espacial.
 */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { DISTRICTS, ACCENT_HEX } from '../districts'

const EXTRA_LINKS = [
  { href: '/ayuntamiento', label: 'Ayuntamiento — Cotiza' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

export function CityMenu() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const close = () => {
    setOpen(false)
    // Foco de vuelta al disparador: cerrar un diálogo no debe dejar el foco
    // huérfano (WCAG 2.4.3).
    buttonRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    // Foco al primer enlace del panel al abrir.
    panelRef.current?.querySelector<HTMLElement>('a')?.focus()
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Abrir menú"
        className="fixed right-5 top-5 z-[997] flex h-10 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 text-white backdrop-blur transition-colors hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: 'var(--lqs-orange)' }}
      >
        <span aria-hidden="true" className="flex flex-col gap-[3px]">
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
        </span>
        <span className="font-data-mono text-[11px] uppercase tracking-[0.15em]">Menú</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú de la ciudad"
          className="fixed inset-0 z-[1000] flex"
        >
          {/* Fondo: cierra al hacer clic fuera. */}
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
          />

          <div
            ref={panelRef}
            className="relative ml-0 flex h-full w-full max-w-sm flex-col overflow-y-auto border-r border-white/10 bg-black p-8"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl font-black uppercase tracking-tight">La Ciudad</p>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar menú"
                className="text-white/60 hover:text-white focus-visible:outline focus-visible:outline-2"
                style={{ outlineColor: 'var(--lqs-orange)' }}
              >
                ✕
              </button>
            </div>

            <nav aria-label="Distritos" className="mt-8">
              <p className="font-data-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
                Distritos
              </p>
              <ul className="mt-3 grid gap-1">
                {DISTRICTS.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/ciudad/${d.slug}`}
                      onClick={close}
                      className="flex min-h-11 items-center gap-3 font-display text-lg font-black uppercase tracking-wide text-white/90 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ outlineColor: ACCENT_HEX[d.accent] }}
                    >
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: ACCENT_HEX[d.accent] }}
                      />
                      {d.name}
                      <span className="font-readability text-xs font-normal normal-case tracking-normal text-white/60">
                        {d.domain}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Más" className="mt-8 border-t border-white/10 pt-6">
              <ul className="grid gap-1">
                {EXTRA_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={close}
                      className="flex min-h-11 items-center text-sm text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ outlineColor: 'var(--lqs-orange)' }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default CityMenu
