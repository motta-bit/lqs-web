'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from '@/motion/useCapability'

interface LenisProviderProps {
  children: React.ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Smooth scroll is momentum the user did not ask for. Under
    // prefers-reduced-motion Lenis must not run at all — the native scroll is
    // the accessible behaviour, not a degraded one.
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // The loop re-queues itself, so the id to cancel is the latest one, not the
    // first. Tracking it in a closure keeps cleanup honest; the previous
    // version leaked a rAF loop that kept calling a destroyed Lenis.
    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [prefersReducedMotion])

  return <>{children}</>
}

export default LenisProvider
