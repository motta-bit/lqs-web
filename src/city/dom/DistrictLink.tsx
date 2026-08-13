'use client'

/**
 * DistrictLink — enlace de distrito con cortina.
 *
 * Sigue siendo un <Link> real y rastreable (reglas 3 y 7 del brief): el href
 * funciona con JS desactivado y es navegable por teclado. Con JS, intercepta
 * el click para pasar por la transición-cortina en vez del salto duro.
 *
 * No intercepta clicks con modificador (nueva pestaña, etc.): ahí el usuario
 * quiere el comportamiento nativo del navegador.
 */

import Link from 'next/link'
import { useCityNavigation } from '../transitions/useCityNavigation'
import type { DistrictAccent } from '../districts'

export function DistrictLink({
  href,
  accent,
  className,
  style,
  children,
  ...rest
}: {
  href: string
  accent: DistrictAccent
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
} & Omit<React.ComponentProps<typeof Link>, 'href'>) {
  const navigateTo = useCityNavigation()

  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        navigateTo(href, accent)
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}

export default DistrictLink
