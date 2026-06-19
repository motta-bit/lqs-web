'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

interface AnimatedCounterProps {
  target:     number
  suffix?:    string
  prefix?:    string
  duration?:  number
  className?: string
}

export default function AnimatedCounter({
  target,
  suffix    = '',
  prefix    = '',
  duration  = 2000,
  className,
}: AnimatedCounterProps) {
  const [count, setCount]   = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return

    const startTime  = performance.now()
    const startValue = 0

    const tick = (now: number) => {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.round(startValue + (target - startValue) * ease))

      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [started, target, duration])

  return (
    <span ref={ref} className={clsx('tabular-nums', className)}>
      {prefix}{count.toLocaleString('es-CO')}{suffix}
    </span>
  )
}
