'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { ArchivoItem, SeccionContenido, SectionesMap } from '@/lib/edge-store'

const SECCION_LABELS: Record<string, string> = {
  muestras_empresas: '🏢 Muestras para empresas',
  portafolio_media:  '🖼️ Portafolio media',
  hero_media:        '🎬 Hero (fondo)',
}

function fmtSize(b: number) {
  return b > 1_000_000 ? `${(b/1_000_000).toFixed(1)} MB` : `${(b/1_000).toFixed(0)} KB`
}

function FileThumbnail({ item, small }: { item: ArchivoItem; small?: boolean }) {
  const sz = small ? 'w-10 h-10' : 'w-full h-28'
  if (item.tipo === 'image')
    return <img src={item.url} alt={item.titulo} className={`${sz} object-cover rounded-sm`} />
  return (
    <div className={`${sz} flex items-center justify-center rounded-sm`}
      style={{ background: 'var(--imi-bgAbsolute)' }}>
      <span style={{ fontSize: small ? 20 : 32 }}>📄</span>
    </div>
  )
}

export default function ArchivosPage() {
  const [archivos,  setArchivos]  = useState<ArchivoItem[]>([])
  const [secciones, setSecciones] = useState<SectionesMap>({})
  const [selected,  setSelected]  = useState<string | null>(null)
  const [dragging,  setDragging]  = useState<string | null>(null)
  const [dragOver,  setDragOver]  = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const [editId,    setEditId]    = useState<string | null>(null)
  const [editForm,  setEditForm]  = useState({ titulo: '', descripcion: '' })
  const [saving,    setSaving]    = useState(false)
  const [status,    setStatus]    = useState('')
  const [blobOk,    setBlobOk]    = useState<boolean | null>(null)
  const [tab,       setTab]       = useState<'archivos' | 'secciones'>('archivos')
  const fileInput = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const [a, s] = await Promise.all([
      fetch('/api/admin/archivos').then(r => r.json()),
      fetch('/api/admin/secciones').then(r => r.json()),
    ])
    setArchivos(Array.isArray(a) ? a : [])
    setSecciones(s || {})
    setBlobOk(!a?.error)
  }, [])

  useEffect(() => { load() }, [load])

  const msg = (m: string) => { setStatus(m); setTimeout(() => setStatus(''), 3000) }

  // ── Upload ──────────────────────────────────────────────────────────────────
  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true)
    let done = 0
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.id) setArchivos(prev => [data, ...prev])
        else msg(`Error: ${data.error}`)
      } catch { msg('Error al subir archivo') }
      done++
      setUploadPct(Math.round(done / files.length * 100))
    }
    setUploading(false)
    setUploadPct(0)
    msg(`✓ ${done} archivo(s) subido(s)`)
  }

  const onDropZone = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  const deleteArchivo = async (id: string) => {
    if (!confirm('¿Eliminar este archivo?')) return
    await fetch('/api/admin/archivos', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setArchivos(prev => prev.filter(a => a.id !== id))
    setSecciones(prev => {
      const next = { ...prev }
      for (const k of Object.keys(next))
        next[k] = { ...next[k], archivos: next[k].archivos.filter(fid => fid !== id) }
      return next
    })
    msg('✓ Eliminado')
  }

  // ── Edit inline ─────────────────────────────────────────────────────────────
  const startEdit = (item: ArchivoItem) => {
    setEditId(item.id)
    setEditForm({ titulo: item.titulo, descripcion: item.descripcion })
  }
  const saveEdit = async () => {
    const item = archivos.find(a => a.id === editId)
    if (!item) return
    const updated = { ...item, ...editForm }
    await fetch('/api/admin/archivos', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    setArchivos(prev => prev.map(a => a.id === editId ? updated : a))
    setEditId(null)
    msg('✓ Guardado')
  }

  // ── Drag from library to section ─────────────────────────────────────────────
  const onDragStartFile = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('fileId', id)
    setDragging(id)
  }
  const onDropSection = async (e: React.DragEvent, secKey: string) => {
    e.preventDefault()
    const fileId = e.dataTransfer.getData('fileId')
    setDragOver(null)
    setDragging(null)
    if (!fileId) return
    const next = { ...secciones }
    if (!next[secKey]) return
    if (!next[secKey].archivos.includes(fileId))
      next[secKey] = { ...next[secKey], archivos: [...next[secKey].archivos, fileId] }
    setSecciones(next)
    await saveSecciones(next)
  }

  const removeFromSection = async (secKey: string, fileId: string) => {
    const next = { ...secciones }
    next[secKey] = { ...next[secKey], archivos: next[secKey].archivos.filter(id => id !== fileId) }
    setSecciones(next)
    await saveSecciones(next)
  }

  const toggleVisible = async (secKey: string) => {
    const next = { ...secciones }
    next[secKey] = { ...next[secKey], visible: !next[secKey].visible }
    setSecciones(next)
    await saveSecciones(next)
  }

  const saveSecciones = async (data: SectionesMap) => {
    setSaving(true)
    await fetch('/api/admin/secciones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSaving(false)
    msg('✓ Sección guardada')
  }

  // ── Assign from file card ──────────────────────────────────────────────────
  const addToSection = async (fileId: string, secKey: string) => {
    const next = { ...secciones }
    if (!next[secKey]) return
    if (!next[secKey].archivos.includes(fileId))
      next[secKey] = { ...next[secKey], archivos: [...next[secKey].archivos, fileId] }
    setSecciones(next)
    await saveSecciones(next)
  }

  // ── Reorder within section ──────────────────────────────────────────────────
  const moveSectionFile = async (secKey: string, fromIdx: number, toIdx: number) => {
    const next = { ...secciones }
    const arr  = [...next[secKey].archivos]
    const [item] = arr.splice(fromIdx, 1)
    arr.splice(toIdx, 0, item)
    next[secKey] = { ...next[secKey], archivos: arr }
    setSecciones(next)
    await saveSecciones(next)
  }

  const inSections = (fileId: string) =>
    Object.values(secciones).some(s => s.archivos?.includes(fileId))

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-authority text-4xl tracking-wider" style={{ color: 'var(--imi-textPrimary)' }}>
          ARCHIVOS & SECCIONES
        </h1>
        <div className="flex items-center gap-3">
          {saving && <span className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>Guardando...</span>}
          {status && <span className="font-mono-data text-xs" style={{ color: 'var(--imi-securityTeal)' }}>{status}</span>}
        </div>
      </div>
      <p className="font-mono-data text-xs mb-6" style={{ color: 'var(--imi-textMuted)' }}>
        {archivos.length} archivos · Sube imágenes y PDFs, luego asígnalos a secciones del sitio
      </p>

      {/* Blob setup warning */}
      {blobOk === false && (
        <div className="mb-6 p-4 border rounded-sm font-mono-data text-xs" style={{ borderColor: '#FF4600', color: '#FF4600', background: 'rgba(255,70,0,0.05)' }}>
          ⚠️ <strong>Vercel Blob no configurado.</strong> Ve a Vercel Dashboard → Storage → Create Blob Store → Connect to project → luego corre <code>vercel env pull</code> y reinicia el servidor.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b" style={{ borderColor: 'var(--imi-gridBorder)' }}>
        {(['archivos', 'secciones'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="font-mono-data text-xs tracking-widest uppercase px-5 py-3 border-b-2 transition-colors"
            style={{
              borderColor: tab === t ? 'var(--imi-accentOrange)' : 'transparent',
              color: tab === t ? 'var(--imi-accentOrange)' : 'var(--imi-textMuted)',
            }}>
            {t === 'archivos' ? '📁 Archivos' : '📐 Secciones del sitio'}
          </button>
        ))}
      </div>

      {/* ══ TAB ARCHIVOS ══ */}
      {tab === 'archivos' && (
        <div>
          {/* Upload zone */}
          <div
            className="border-2 border-dashed rounded-sm mb-8 transition-all cursor-pointer"
            style={{ borderColor: 'var(--imi-accentOrange)', background: 'rgba(255,70,0,0.03)' }}
            onDragOver={e => e.preventDefault()}
            onDrop={onDropZone}
            onClick={() => fileInput.current?.click()}
          >
            <input ref={fileInput} type="file" multiple accept="image/*,.pdf" className="hidden"
              onChange={e => e.target.files && uploadFiles(e.target.files)} />
            <div className="py-12 text-center">
              {uploading ? (
                <>
                  <div className="text-4xl mb-3">⏫</div>
                  <p className="font-mono-data text-sm" style={{ color: 'var(--imi-accentOrange)' }}>
                    Subiendo... {uploadPct}%
                  </p>
                  <div className="mt-3 mx-auto w-48 h-1 rounded-full" style={{ background: 'var(--imi-gridBorder)' }}>
                    <div className="h-1 rounded-full transition-all" style={{ width: `${uploadPct}%`, background: 'var(--imi-accentOrange)' }} />
                  </div>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-3">🦆</div>
                  <p className="font-authority text-xl tracking-widest mb-1" style={{ color: 'var(--imi-textPrimary)' }}>
                    ARRASTRA ARCHIVOS AQUÍ
                  </p>
                  <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>
                    PNG · JPG · PDF · o haz clic para seleccionar
                  </p>
                </>
              )}
            </div>
          </div>

          {/* File grid */}
          {archivos.length === 0 ? (
            <p className="font-mono-data text-xs text-center py-16" style={{ color: 'var(--imi-textMuted)' }}>
              Sin archivos aún — sube el primero arriba.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {archivos.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={e => onDragStartFile(e, item.id)}
                  onDragEnd={() => setDragging(null)}
                  onClick={() => setSelected(selected === item.id ? null : item.id)}
                  className="border rounded-sm overflow-hidden cursor-grab active:cursor-grabbing transition-all"
                  style={{
                    borderColor: selected === item.id ? 'var(--imi-accentOrange)'
                      : dragging === item.id ? 'var(--imi-securityTeal)'
                      : inSections(item.id) ? 'var(--imi-securityTeal)'
                      : 'var(--imi-gridBorder)',
                    background: 'var(--imi-cardBg)',
                    opacity: dragging === item.id ? 0.5 : 1,
                  }}>
                  <FileThumbnail item={item} />
                  <div className="p-2">
                    {editId === item.id ? (
                      <div onClick={e => e.stopPropagation()}>
                        <input
                          value={editForm.titulo}
                          onChange={e => setEditForm(f => ({ ...f, titulo: e.target.value }))}
                          className="w-full bg-transparent border-b outline-none font-mono-data text-xs mb-1"
                          style={{ borderColor: 'var(--imi-accentOrange)', color: 'var(--imi-textPrimary)' }}
                          placeholder="Título"
                        />
                        <input
                          value={editForm.descripcion}
                          onChange={e => setEditForm(f => ({ ...f, descripcion: e.target.value }))}
                          className="w-full bg-transparent border-b outline-none font-readability text-xs mb-2"
                          style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}
                          placeholder="Descripción"
                        />
                        <div className="flex gap-1">
                          <button onClick={saveEdit}
                            className="flex-1 py-1 font-mono-data text-[9px] rounded-sm"
                            style={{ background: 'var(--imi-accentOrange)', color: '#000' }}>✓</button>
                          <button onClick={() => setEditId(null)}
                            className="flex-1 py-1 font-mono-data text-[9px]"
                            style={{ color: 'var(--imi-textMuted)' }}>✕</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-mono-data text-[10px] truncate mb-0.5" style={{ color: 'var(--imi-textPrimary)' }}>
                          {item.titulo}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-mono-data text-[9px]" style={{ color: 'var(--imi-textMuted)' }}>
                            {item.tipo.toUpperCase()} · {fmtSize(item.tamaño)}
                          </span>
                          {inSections(item.id) && (
                            <span className="font-mono-data text-[9px]" style={{ color: 'var(--imi-securityTeal)' }}>●</span>
                          )}
                        </div>
                        {selected === item.id && (
                          <div className="mt-2 pt-2 border-t flex flex-col gap-1" style={{ borderColor: 'var(--imi-gridBorder)' }}
                            onClick={e => e.stopPropagation()}>
                            <p className="font-mono-data text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--imi-textMuted)' }}>
                              Asignar a sección:
                            </p>
                            {Object.keys(secciones).map(k => (
                              <button key={k} onClick={() => addToSection(item.id, k)}
                                className="text-left font-mono-data text-[9px] px-1.5 py-1 border rounded-sm transition-all"
                                style={{
                                  borderColor: secciones[k]?.archivos?.includes(item.id) ? 'var(--imi-securityTeal)' : 'var(--imi-gridBorder)',
                                  color: secciones[k]?.archivos?.includes(item.id) ? 'var(--imi-securityTeal)' : 'var(--imi-textMuted)',
                                }}>
                                {secciones[k]?.archivos?.includes(item.id) ? '✓ ' : '+ '}{SECCION_LABELS[k] || k}
                              </button>
                            ))}
                            <div className="flex gap-1 mt-1">
                              <button onClick={() => startEdit(item)}
                                className="flex-1 py-1 border rounded-sm font-mono-data text-[9px]"
                                style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}>
                                ✎ Editar
                              </button>
                              <button onClick={() => deleteArchivo(item.id)}
                                className="px-2 py-1 rounded-sm font-mono-data text-[9px]"
                                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                ✕
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ TAB SECCIONES ══ */}
      {tab === 'secciones' && (
        <div className="space-y-6">
          <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>
            Arrastra archivos desde la pestaña "Archivos" directamente a cada sección, o gestiona el contenido aquí.
          </p>

          {Object.entries(secciones).map(([key, sec]) => {
            const filesInSection = sec.archivos
              .map(id => archivos.find(a => a.id === id))
              .filter(Boolean) as ArchivoItem[]

            return (
              <div key={key} className="border rounded-sm overflow-hidden"
                style={{ borderColor: sec.visible ? 'var(--imi-gridBorder)' : '#333' }}>
                {/* Section header */}
                <div className="flex items-center justify-between px-6 py-4 border-b"
                  style={{ borderColor: 'var(--imi-gridBorder)', background: 'var(--imi-cardBg)' }}>
                  <div>
                    <h3 className="font-authority text-lg tracking-wider" style={{ color: 'var(--imi-textPrimary)' }}>
                      {SECCION_LABELS[key] || key}
                    </h3>
                    <p className="font-mono-data text-[10px]" style={{ color: 'var(--imi-textMuted)' }}>
                      {filesInSection.length} archivo(s) · {sec.subtitulo}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono-data text-[9px] uppercase tracking-wider" style={{ color: sec.visible ? 'var(--imi-securityTeal)' : 'var(--imi-textMuted)' }}>
                      {sec.visible ? '● Visible' : '○ Oculto'}
                    </span>
                    <button onClick={() => toggleVisible(key)}
                      className="font-mono-data text-[10px] px-3 py-1.5 border rounded-sm"
                      style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}>
                      {sec.visible ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </div>

                {/* Drop zone + files */}
                <div
                  className="p-4 min-h-[120px] transition-all"
                  style={{ background: dragOver === key ? 'rgba(255,70,0,0.05)' : 'transparent' }}
                  onDragOver={e => { e.preventDefault(); setDragOver(key) }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => onDropSection(e, key)}>
                  {filesInSection.length === 0 ? (
                    <div className="flex items-center justify-center h-24 border border-dashed rounded-sm"
                      style={{ borderColor: dragOver === key ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)' }}>
                      <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>
                        {dragOver === key ? '⬇ Suelta aquí' : 'Arrastra archivos aquí'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-3 flex-wrap">
                      {filesInSection.map((item, idx) => (
                        <div key={item.id} className="relative group">
                          <div className="w-20 h-20 rounded-sm overflow-hidden border"
                            style={{ borderColor: 'var(--imi-gridBorder)' }}>
                            <FileThumbnail item={item} small />
                          </div>
                          <p className="font-mono-data text-[9px] mt-1 w-20 truncate text-center"
                            style={{ color: 'var(--imi-textMuted)' }}>
                            {item.titulo}
                          </p>
                          <div className="absolute -top-1 -right-1 hidden group-hover:flex gap-1">
                            {idx > 0 && (
                              <button onClick={() => moveSectionFile(key, idx, idx - 1)}
                                className="w-5 h-5 text-[10px] rounded-full flex items-center justify-center"
                                style={{ background: 'var(--imi-accentOrange)', color: '#000' }}>←</button>
                            )}
                            {idx < filesInSection.length - 1 && (
                              <button onClick={() => moveSectionFile(key, idx, idx + 1)}
                                className="w-5 h-5 text-[10px] rounded-full flex items-center justify-center"
                                style={{ background: 'var(--imi-accentOrange)', color: '#000' }}>→</button>
                            )}
                            <button onClick={() => removeFromSection(key, item.id)}
                              className="w-5 h-5 text-[10px] rounded-full flex items-center justify-center"
                              style={{ background: '#ef4444', color: '#fff' }}>✕</button>
                          </div>
                        </div>
                      ))}
                      {/* Extra drop target */}
                      <div className="w-20 h-20 flex items-center justify-center border border-dashed rounded-sm"
                        style={{ borderColor: dragOver === key ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)' }}>
                        <span style={{ color: 'var(--imi-textMuted)', fontSize: 20 }}>+</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
