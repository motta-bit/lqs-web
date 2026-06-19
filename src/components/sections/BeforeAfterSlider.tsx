'use client'

import { useRef, useState, useCallback } from 'react'
import { useScrollReveal } from '@/hooks/useScrollAnimation'

export function BeforeAfterSlider() {
  const [position,   setPosition]  = useState(50)
  const [isDragging, setDragging]  = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef   = useScrollReveal()

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct  = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100))
    setPosition(pct)
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) updatePosition(e.clientX)
  }, [isDragging, updatePosition])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-36 px-6"
      style={{ background: 'var(--imi-bgAbsolute)' }}
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16" data-reveal>
          <p className="font-mono-data text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--imi-accentOrange)' }}>
            ◆ Transformación real
          </p>
          <h2 className="font-authority text-5xl md:text-7xl leading-none" style={{ color: 'var(--imi-textPrimary)' }}>
            ANTES Y<br />
            <span style={{ color: 'var(--imi-accentOrange)' }}>DESPUÉS.</span>
          </h2>
        </div>

        <div data-reveal>
          <div
            ref={containerRef}
            className="relative w-full aspect-video max-h-[500px] overflow-hidden rounded-sm border select-none"
            style={{ borderColor: 'var(--imi-gridBorder)', cursor: 'col-resize' }}
            onMouseMove={onMouseMove}
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onTouchMove={onTouchMove}
            onTouchStart={() => setDragging(true)}
            onTouchEnd={() => setDragging(false)}
          >
            {/* ANTES */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#111' }}>
              <div className="text-center">
                <p className="font-authority text-4xl mb-2" style={{ color: '#333' }}>ANTES</p>
                <p className="font-mono-data text-xs" style={{ color: '#444' }}>Agrega tu imagen aquí</p>
              </div>
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                  backgroundSize:  '20px 20px',
                }}
              />
            </div>

            {/* DESPUÉS — recortado al lado izquierdo */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                clipPath:   `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`,
                background: 'var(--imi-cardBg)',
              }}
            >
              <div className="text-center">
                <p className="font-authority text-4xl mb-2" style={{ color: 'var(--imi-accentOrange)' }}>DESPUÉS</p>
                <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>Con LQS</p>
              </div>
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(var(--imi-gridBorder) 1px, transparent 1px), linear-gradient(90deg, var(--imi-gridBorder) 1px, transparent 1px)',
                  backgroundSize:  '20px 20px',
                }}
              />
            </div>

            {/* Divisor */}
            <div
              className="absolute top-0 bottom-0 w-0.5 flex items-center justify-center"
              style={{ left: `${position}%`, background: 'var(--imi-accentOrange)', boxShadow: '0 0 12px var(--imi-accentOrange)' }}
            >
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                style={{ background: 'var(--imi-bgAbsolute)', borderColor: 'var(--imi-accentOrange)', boxShadow: '0 0 15px var(--imi-accentOrange)' }}
              >
                <span className="font-mono-data text-xs" style={{ color: 'var(--imi-accentOrange)' }}>⟺</span>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4">
              <span className="font-mono-data text-xs tracking-widest uppercase px-2 py-1" style={{ background: 'rgba(0,0,0,0.8)', color: '#666' }}>
                Antes
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="font-mono-data text-xs tracking-widest uppercase px-2 py-1" style={{ background: 'rgba(0,0,0,0.8)', color: 'var(--imi-accentOrange)' }}>
                Después
              </span>
            </div>
          </div>

          <p className="text-center font-mono-data text-xs mt-4" style={{ color: 'var(--imi-textMuted)' }}>
            Arrastra el divisor para comparar
          </p>
        </div>
      </div>
    </section>
  )
}
