'use client'

/**
 * Duck cursor — rewritten engine, identical bird (decision D-03).
 *
 * The original called `setDuck()` (React state) inside a `requestAnimationFrame`
 * plus a 28ms `setInterval` for the wing counter: one React render per frame,
 * forever, on top of a WebGL canvas. That is an INP failure by construction,
 * and INP <200ms is one of the three budgets that break the build.
 *
 * This version renders ONCE. The rAF loop writes `transform` and two data
 * attributes straight to the DOM; React is never involved after mount.
 */

import { useEffect, useRef } from 'react'
import { useCapability } from '@/motion/useCapability'
import { DuckSVG } from './DuckSVG'

/** Inertia factor, preserved from the original hook. The duck's "feel". */
const LERP = 0.12
/** How long without pointer movement before the duck stops walking. */
const IDLE_MS = 150

export function DuckCursor() {
  const { profile, resolved } = useCapability()
  const enabled = resolved && profile.cursorPhysics

  const duckRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    const duckEl = duckRef.current
    const dotEl = dotRef.current
    if (!duckEl || !dotEl) return

    // All mutable animation state lives in closures, never in React state.
    let x = -100
    let y = -100
    let targetX = -100
    let targetY = -100
    let prevX = -100
    let pose: 'idle' | 'walking' = 'idle'
    let direction: 'left' | 'right' = 'right'
    let idleTimer: ReturnType<typeof setTimeout> | undefined
    let raf = 0

    const setPose = (next: 'idle' | 'walking') => {
      if (pose === next) return
      pose = next
      duckEl.dataset.pose = next
    }

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY

      const nextDirection = event.clientX > prevX ? 'right' : 'left'
      if (nextDirection !== direction) {
        direction = nextDirection
        duckEl.dataset.direction = nextDirection
      }
      prevX = event.clientX

      setPose('walking')
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => setPose('idle'), IDLE_MS)
    }

    const tick = () => {
      x += (targetX - x) * LERP
      y += (targetY - y) * LERP

      // translate3d keeps this on the compositor; no layout, no paint.
      duckEl.style.transform = `translate3d(${x - 24}px, ${y - 50}px, 0)`
      dotEl.style.transform = `translate3d(${targetX - 3}px, ${targetY - 3}px, 0)`

      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    raf = requestAnimationFrame(tick)

    // Hide the native cursor only while the duck is actually driving, and only
    // on the body — inputs and the admin keep a real caret and pointer.
    document.body.classList.add('duck-cursor-active')

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(raf)
      clearTimeout(idleTimer)
      document.body.classList.remove('duck-cursor-active')
    }
  }, [enabled])

  // In `lite` (touch) and `static` (reduced motion) there is no duck cursor at
  // all: a pointer-follower is meaningless without a pointer, and inertia is
  // exactly the kind of motion the preference asks us to drop.
  if (!enabled) return null

  return (
    <>
      <div
        ref={duckRef}
        data-pose="idle"
        data-direction="right"
        className="duck-cursor pointer-events-none fixed left-0 top-0 z-[999]"
      >
        <DuckSVG size={52} />
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[998] h-1.5 w-1.5 rounded-full"
        style={{
          background: 'var(--lqs-teal)',
          boxShadow: '0 0 8px var(--lqs-teal)',
        }}
        aria-hidden="true"
      />
    </>
  )
}

export default DuckCursor
