'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { ArchivoItem } from '@/lib/edge-store'

interface FileViewerProps {
  items:     ArchivoItem[]
  autoplay?: boolean
  interval?: number
}

export function FileViewer({ items, autoplay = false, interval = 5000 }: FileViewerProps) {
  const [idx,        setIdx]        = useState(0)
  const [lightbox,   setLightbox]   = useState(false)
  const [pdfLoaded,  setPdfLoaded]  = useState(false)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchX    = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const go = useCallback((n: number) => {
    setIdx((n + items.length) % items.length)
    setPdfLoaded(false)
  }, [items.length])

  const prev = () => go(idx - 1)
  const next = () => go(idx + 1)

  // Autoplay
  useEffect(() => {
    if (!autoplay || lightbox) return
    timerRef.current = setTimeout(() => next(), interval)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [idx, autoplay, lightbox, interval])

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     setLightbox(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [idx])

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    const dx = touchX.current - e.changedTouches[0].clientX
    if (Math.abs(dx) > 50) dx > 0 ? next() : prev()
  }

  if (!items.length) return null

  const current = items[idx]
  if (!current) return null

  return (
    <>
      {/* Lightbox overlay */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={() => setLightbox(false)}>
          <button
            className="absolute top-4 right-4 font-mono-data text-2xl z-10"
            style={{ color: '#fff' }}
            onClick={() => setLightbox(false)}>✕</button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 font-mono-data text-3xl z-10 px-3"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onClick={e => { e.stopPropagation(); prev() }}>‹</button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 font-mono-data text-3xl z-10 px-3"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onClick={e => { e.stopPropagation(); next() }}>›</button>
          <div className="max-w-5xl max-h-[90vh] w-full px-16" onClick={e => e.stopPropagation()}>
            {current.tipo === 'image' ? (
              <img src={current.url} alt={current.titulo}
                className="max-w-full max-h-[85vh] object-contain mx-auto" />
            ) : current.tipo === 'pdf' ? (
              <iframe src={current.url} className="w-full rounded-sm"
                style={{ height: '85vh', border: 'none' }} title={current.titulo} />
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📄</div>
                <a href={current.url} target="_blank" rel="noopener"
                  className="font-mono-data text-sm underline" style={{ color: 'var(--imi-accentOrange)' }}>
                  Descargar {current.nombre}
                </a>
              </div>
            )}
          </div>
          <div className="absolute bottom-6 font-mono-data text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {idx + 1} / {items.length}
          </div>
        </div>
      )}

      {/* Main viewer */}
      <div ref={containerRef} className="w-full select-none"
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

        {/* Display area */}
        <div className="relative overflow-hidden rounded-sm"
          style={{ background: '#0a0a0a', minHeight: 320 }}>

          {/* Nav arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full font-mono-data text-xl transition-all"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full font-mono-data text-xl transition-all"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                ›
              </button>
            </>
          )}

          {/* Content */}
          {current.tipo === 'image' ? (
            <img
              key={current.id}
              src={current.url}
              alt={current.titulo}
              onClick={() => setLightbox(true)}
              className="w-full object-contain cursor-zoom-in transition-opacity duration-300"
              style={{ maxHeight: 480 }}
            />
          ) : current.tipo === 'pdf' ? (
            <div key={current.id} className="relative" style={{ height: 480 }}>
              {!pdfLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="text-6xl">📄</div>
                  <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>Cargando PDF...</p>
                </div>
              )}
              <iframe
                src={`${current.url}#toolbar=1&navpanes=0`}
                className="w-full h-full rounded-sm"
                style={{ border: 'none', opacity: pdfLoaded ? 1 : 0 }}
                title={current.titulo}
                onLoad={() => setPdfLoaded(true)}
              />
              <button
                onClick={() => setLightbox(true)}
                className="absolute top-3 right-3 font-mono-data text-[10px] px-3 py-1.5 rounded-sm z-10"
                style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
                ⛶ Pantalla completa
              </button>
            </div>
          ) : (
            <div key={current.id} className="flex flex-col items-center justify-center" style={{ height: 320 }}>
              <div className="text-6xl mb-4">📎</div>
              <a href={current.url} target="_blank" rel="noopener"
                className="font-mono-data text-sm underline" style={{ color: 'var(--imi-accentOrange)' }}>
                {current.nombre}
              </a>
            </div>
          )}

          {/* Info overlay */}
          {(current.titulo || current.descripcion) && (
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}>
              {current.titulo && (
                <p className="font-authority text-lg tracking-wider" style={{ color: '#fff' }}>
                  {current.titulo}
                </p>
              )}
              {current.descripcion && (
                <p className="font-readability text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {current.descripcion}
                </p>
              )}
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className="font-mono-data text-[9px] px-2 py-1 rounded-sm uppercase tracking-wider"
              style={{ background: 'rgba(0,0,0,0.7)', color: current.tipo === 'pdf' ? '#FF4600' : 'rgba(255,255,255,0.6)' }}>
              {current.tipo}
            </span>
          </div>
        </div>

        {/* Thumbnails strip */}
        {items.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {items.map((item, i) => (
              <button
                key={item.id}
                onClick={() => go(i)}
                className="flex-shrink-0 rounded-sm overflow-hidden transition-all"
                style={{
                  width: 60, height: 44,
                  border: `2px solid ${i === idx ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)'}`,
                  opacity: i === idx ? 1 : 0.5,
                }}>
                {item.tipo === 'image' ? (
                  <img src={item.url} alt={item.titulo} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg"
                    style={{ background: 'var(--imi-bgAbsolute)' }}>📄</div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Dot indicators */}
        {items.length > 1 && items.length <= 10 && (
          <div className="flex justify-center gap-2 mt-3">
            {items.map((_, i) => (
              <button key={i} onClick={() => go(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === idx ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)' }} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
