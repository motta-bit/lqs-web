'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import CTAButton from '@/components/ui/CTAButton'
import { useQuoterStore } from '@/store/quoterStore'

const NAV_LINKS = [
  { label: 'Nosotros',   href: '/nosotros'   },
  { label: 'Servicios',  href: '/servicios'  },
  { label: 'Portafolio', href: '/portafolio' },
  { label: 'Contacto',   href: '/contacto'   },
]

export default function Header() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const { openPanel } = useQuoterStore()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cierra menú al cambiar de ruta
  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-[#262626]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="font-authority text-2xl tracking-[0.2em] text-white hover:text-[var(--imi-accentOrange)] transition-colors z-10"
        >
          LQS
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'font-data-mono text-xs tracking-[0.2em] uppercase transition-colors',
                  active
                    ? 'text-white'
                    : 'text-white/50 hover:text-white'
                )}
                style={active ? { color: 'var(--imi-accentOrange)' } : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <CTAButton size="sm" variant="primary" onClick={openPanel}>
            Cotizar
          </CTAButton>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 z-10"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span className={clsx('block w-6 h-px bg-white transition-all duration-300', menuOpen && 'rotate-45 translate-y-[6px]')} />
          <span className={clsx('block w-6 h-px bg-white transition-all duration-300', menuOpen && 'opacity-0')} />
          <span className={clsx('block w-6 h-px bg-white transition-all duration-300', menuOpen && '-rotate-45 -translate-y-[6px]')} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          'md:hidden fixed inset-0 top-16 bg-black/97 backdrop-blur-md',
          'flex flex-col items-center justify-center gap-10',
          'transition-all duration-300',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'font-authority text-5xl tracking-[0.15em] transition-colors',
                active ? 'text-white' : 'text-white/60 hover:text-white'
              )}
              style={active ? { color: 'var(--imi-accentOrange)' } : undefined}
            >
              {link.label}
            </Link>
          )
        })}
        <CTAButton
          size="lg"
          variant="primary"
          onClick={() => { setMenuOpen(false); openPanel() }}
          className="mt-2"
        >
          Cotizar Proyecto
        </CTAButton>
      </div>
    </header>
  )
}
