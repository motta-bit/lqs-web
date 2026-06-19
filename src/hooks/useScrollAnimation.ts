'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal(options?: {
  y?:        number
  opacity?:  number
  duration?: number
  stagger?:  number
}) {
  const ref = useRef<HTMLElement>(null)
  const { y = 40, opacity = 0, duration = 0.8, stagger = 0.1 } = options || {}

  useEffect(() => {
    if (!ref.current) return

    const elements = ref.current.querySelectorAll('[data-reveal]')
    const targets  = elements.length > 0 ? Array.from(elements) : [ref.current]

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity },
        {
          y: 0, opacity: 1,
          duration,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start:   'top 85%',
            end:     'bottom 15%',
            scrub:   false,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [y, opacity, duration, stagger])

  return ref as React.RefObject<HTMLElement>
}
