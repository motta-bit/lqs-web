'use client'

import { useEffect, useRef, useState } from 'react'

interface DuckState {
  x:         number
  y:         number
  targetX:   number
  targetY:   number
  isMoving:  boolean
  direction: 'left' | 'right'
  wingPhase: number
}

export function useCursorDuck() {
  const [duck, setDuck] = useState<DuckState>({
    x: -100, y: -100,
    targetX: -100, targetY: -100,
    isMoving:  false,
    direction: 'right',
    wingPhase: 0,
  })

  const stateRef = useRef(duck)
  const rafRef   = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const prevXRef = useRef(-100)

  useEffect(() => {
    stateRef.current = duck
  }, [duck])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newDirection = e.clientX > prevXRef.current ? 'right' : 'left'
      prevXRef.current = e.clientX

      setDuck(prev => ({
        ...prev,
        targetX:   e.clientX,
        targetY:   e.clientY,
        isMoving:  true,
        direction: newDirection,
      }))

      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setDuck(prev => ({ ...prev, isMoving: false }))
      }, 150)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timerRef.current)
    }
  }, [])

  // Loop de animación con inercia
  useEffect(() => {
    let wingPhase = 0

    const animate = () => {
      setDuck(prev => {
        const lerp   = (a: number, b: number, t: number) => a + (b - a) * t
        const newX   = lerp(prev.x, prev.targetX, 0.12)
        const newY   = lerp(prev.y, prev.targetY, 0.12)
        const moving = Math.abs(newX - prev.targetX) > 0.5 || Math.abs(newY - prev.targetY) > 0.5

        if (moving) wingPhase += 0.3

        return { ...prev, x: newX, y: newY, wingPhase }
      })
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return duck
}
