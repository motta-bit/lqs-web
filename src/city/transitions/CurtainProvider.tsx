'use client'

/**
 * CurtainProvider — clip-path wipe entre niveles (informe §D, estilo Zentry).
 *
 * Vive en el layout raíz para persistir a través del cambio de ruta. El flujo:
 * el hub pide `cover()`, la cortina tapa, se dispara la navegación, y al llegar
 * al destino la cortina se retira con `reveal()`.
 *
 * Los tres modos de D-04 se respetan por construcción: si el perfil no permite
 * `levelTransitions` (modo static), `useCityNavigation` navega directo y esta
 * cortina nunca se activa.
 */

import { useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ACCENT_HEX } from '../districts'
import { useCurtainStore } from './curtainStore'
import { DUR, gsapEase } from '@/motion/tokens'

const CURTAIN_EASE = gsapEase('curtain')

export function CurtainProvider({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const phase = useCurtainStore((s) => s.phase)
  const accent = useCurtainStore((s) => s.accent)
  const targetHref = useCurtainStore((s) => s.targetHref)
  const covered = useCurtainStore((s) => s.covered)
  const reveal = useCurtainStore((s) => s.reveal)
  const done = useCurtainStore((s) => s.done)

  // Fase COVERING: la cortina baja desde arriba. Al terminar, navega.
  useGSAP(
    () => {
      if (phase !== 'covering' || !overlayRef.current || !targetHref) return
      const el = overlayRef.current
      el.style.background = ACCENT_HEX[accent]

      // La navegación se dispara una sola vez, venga del onComplete de GSAP o
      // de la red de seguridad. Sin este guard, un tab que se va a segundo
      // plano (rAF pausado) dejaría la cortina tapando la pantalla para
      // siempre: GSAP no avanzaría y router.push nunca correría.
      let navigated = false
      const go = () => {
        if (navigated) return
        navigated = true
        covered()
        router.push(targetHref)
      }

      const tween = gsap.fromTo(
        el,
        { clipPath: 'inset(0 0 100% 0)' }, // oculta: colapsada arriba
        {
          clipPath: 'inset(0 0 0% 0)', // tapa toda la pantalla
          duration: DUR.curtain,
          ease: CURTAIN_EASE,
          onComplete: go,
        },
      )

      // Tope duro: pase lo que pase con el rAF, se navega.
      const safety = window.setTimeout(go, DUR.curtain * 1000 + 500)
      return () => {
        tween.kill()
        window.clearTimeout(safety)
      }
    },
    { dependencies: [phase, targetHref, accent] },
  )

  // La ruta cambió estando 'covered' → llegamos al destino: retirar cortina.
  useGSAP(
    () => {
      if (phase !== 'covered') return
      reveal()
    },
    { dependencies: [pathname] },
  )

  // Fase REVEALING: la cortina sale por abajo, descubriendo la ruta nueva.
  useGSAP(
    () => {
      if (phase !== 'revealing' || !overlayRef.current) return

      let finished = false
      const finish = () => {
        if (finished) return
        finished = true
        done()
      }

      const tween = gsap.fromTo(
        overlayRef.current,
        { clipPath: 'inset(0 0 0% 0)' },
        {
          clipPath: 'inset(100% 0 0 0)', // colapsa hacia abajo y desaparece
          duration: DUR.curtain,
          ease: CURTAIN_EASE,
          onComplete: finish,
        },
      )

      // Sin esto, un reveal que no completa deja el overlay tapando la ruta
      // nueva con pointer-events activos: la página quedaría inusable.
      const safety = window.setTimeout(finish, DUR.curtain * 1000 + 500)
      return () => {
        tween.kill()
        window.clearTimeout(safety)
      }
    },
    { dependencies: [phase] },
  )

  const active = phase !== 'idle'

  return (
    <>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-[9998]"
        style={{
          clipPath: 'inset(0 0 100% 0)',
          pointerEvents: active ? 'auto' : 'none',
          willChange: active ? 'clip-path' : 'auto',
        }}
      />
    </>
  )
}

export default CurtainProvider
