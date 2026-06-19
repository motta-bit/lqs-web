'use client'

import { useState, useEffect } from 'react'
import { FileViewer }          from '@/components/ui/FileViewer'
import type { ArchivoItem, SeccionContenido } from '@/lib/edge-store'

export function MuestrasEmpresas() {
  const [items,   setItems]   = useState<ArchivoItem[]>([])
  const [seccion, setSeccion] = useState<SeccionContenido | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/archivos').then(r => r.json()),
      fetch('/api/admin/secciones').then(r => r.json()),
    ]).then(([archivos, secciones]) => {
      const sec: SeccionContenido = secciones?.muestras_empresas
      setSeccion(sec)
      if (sec?.visible && sec.archivos?.length && Array.isArray(archivos)) {
        const ordered = sec.archivos
          .map((id: string) => archivos.find((a: ArchivoItem) => a.id === id))
          .filter(Boolean) as ArchivoItem[]
        setItems(ordered)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading || !seccion?.visible || items.length === 0) return null

  return (
    <section id="muestras" className="py-24 px-6" style={{ background: 'var(--imi-bgAbsolute)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="font-mono-data text-xs tracking-widest uppercase mb-4"
            style={{ color: 'var(--imi-accentOrange)' }}>
            ◆ Trabajo real
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="font-authority text-5xl md:text-6xl leading-none"
              style={{ color: 'var(--imi-textPrimary)' }}>
              {seccion.titulo || 'NUESTRO'}<br />
              <span style={{ color: 'var(--imi-accentOrange)' }}>TRABAJO.</span>
            </h2>
            <p className="font-readability text-sm max-w-xs"
              style={{ color: 'var(--imi-textMuted)' }}>
              {seccion.subtitulo || 'Casos reales, resultados medibles. Desliza para explorar.'}
            </p>
          </div>
        </div>

        {/* Viewer */}
        <FileViewer items={items} autoplay={items.length > 1} interval={6000} />

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573247680413'}?text=Hola%2C%20vi%20sus%20muestras%20y%20quiero%20cotizar`}
            target="_blank" rel="noopener"
            className="px-8 py-3 font-mono-data text-xs tracking-widest uppercase transition-all"
            style={{ background: 'var(--imi-accentOrange)', color: '#000' }}>
            💬 Quiero algo así
          </a>
          <a href="/portafolio"
            className="px-8 py-3 border font-mono-data text-xs tracking-widest uppercase transition-all"
            style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}>
            Ver portafolio completo →
          </a>
        </div>

      </div>
    </section>
  )
}
