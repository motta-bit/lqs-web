'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PortfolioItem } from '@/lib/edge-store'

const CATEGORIES = ['branding', 'web', 'video', 'eventos'] as const
const EMPTY: Omit<PortfolioItem, 'id'> = {
  title: '', client: '', category: 'branding', description: '',
  imageUrl: '', tags: [], year: new Date().getFullYear(), featured: false,
}

export default function AdminPortfolioPage() {
  const [items,   setItems]   = useState<PortfolioItem[]>([])
  const [form,    setForm]    = useState<Omit<PortfolioItem,'id'>>(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [status,  setStatus]  = useState('')
  const [tagsStr, setTagsStr] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/portfolio')
    setItems(await res.json())
  }, [])

  useEffect(() => { load() }, [load])

  const msg = (m: string) => { setStatus(m); setTimeout(() => setStatus(''), 3000) }

  const startEdit = (item: PortfolioItem) => {
    setEditing(item.id)
    setForm({ title: item.title, client: item.client, category: item.category,
      description: item.description, imageUrl: item.imageUrl,
      tags: item.tags, year: item.year, featured: item.featured })
    setTagsStr(item.tags.join(', '))
  }

  const reset = () => { setEditing(null); setForm(EMPTY); setTagsStr('') }

  const save = async () => {
    setLoading(true)
    const payload = { ...form, tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean) }
    const [method, body] = editing
      ? ['PUT', JSON.stringify({ ...payload, id: editing })]
      : ['POST', JSON.stringify(payload)]
    const res = await fetch('/api/admin/portfolio', { method, headers: { 'Content-Type': 'application/json' }, body })
    if (res.ok) { msg(editing ? '✓ Proyecto actualizado' : '✓ Proyecto creado'); reset(); load() }
    else msg('✕ Error al guardar')
    setLoading(false)
  }

  const del = async (id: string) => {
    if (!confirm('¿Eliminar este proyecto?')) return
    await fetch('/api/admin/portfolio', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    msg('✓ Eliminado'); load()
  }

  const field = (label: string, key: keyof typeof EMPTY, type = 'text') => (
    <div key={key}>
      <label className="font-mono-data text-[10px] tracking-widest uppercase block mb-1" style={{ color: 'var(--imi-textMuted)' }}>{label}</label>
      <input
        type={type}
        value={form[key] as string | number}
        onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? +e.target.value : e.target.value }))}
        className="w-full px-3 py-2 rounded-sm border bg-transparent font-readability text-sm outline-none"
        style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }}
      />
    </div>
  )

  return (
    <div className="p-8">
      <h1 className="font-authority text-4xl tracking-wider mb-1" style={{ color: 'var(--imi-textPrimary)' }}>PORTAFOLIO</h1>
      <p className="font-mono-data text-xs mb-8" style={{ color: 'var(--imi-textMuted)' }}>{items.length} proyectos publicados</p>

      {/* Formulario */}
      <div className="border rounded-sm p-6 mb-8" style={{ borderColor: 'var(--imi-accentOrange)', background: 'var(--imi-cardBg)' }}>
        <h2 className="font-authority text-xl tracking-wider mb-5" style={{ color: 'var(--imi-textPrimary)' }}>
          {editing ? '✎ Editar proyecto' : '+ Nuevo proyecto'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {field('Título', 'title')}
          {field('Cliente', 'client')}
          {field('URL de imagen', 'imageUrl')}
          {field('Año', 'year', 'number')}
          <div>
            <label className="font-mono-data text-[10px] tracking-widest uppercase block mb-1" style={{ color: 'var(--imi-textMuted)' }}>Categoría</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value as typeof form.category }))}
              className="w-full px-3 py-2 rounded-sm border bg-transparent font-readability text-sm outline-none"
              style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono-data text-[10px] tracking-widest uppercase block mb-1" style={{ color: 'var(--imi-textMuted)' }}>Tags (separados por coma)</label>
            <input
              value={tagsStr}
              onChange={e => setTagsStr(e.target.value)}
              placeholder="branding, identidad, logo"
              className="w-full px-3 py-2 rounded-sm border bg-transparent font-readability text-sm outline-none"
              style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="font-mono-data text-[10px] tracking-widest uppercase block mb-1" style={{ color: 'var(--imi-textMuted)' }}>Descripción</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-3 py-2 rounded-sm border bg-transparent font-readability text-sm outline-none"
            style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }}
          />
        </div>
        <div className="flex items-center gap-3 mb-5">
          <input type="checkbox" id="featured" checked={form.featured}
            onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
          <label htmlFor="featured" className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>Destacado en portada</label>
        </div>
        <div className="flex gap-3">
          <button
            onClick={save} disabled={loading || !form.title}
            className="px-6 py-2 rounded-sm font-mono-data text-xs tracking-wider disabled:opacity-40"
            style={{ background: 'var(--imi-accentOrange)', color: '#000' }}
          >
            {loading ? 'Guardando...' : editing ? 'Actualizar' : 'Publicar'}
          </button>
          {editing && (
            <button onClick={reset} className="px-4 py-2 font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>
              Cancelar
            </button>
          )}
          {status && <span className="font-mono-data text-xs self-center" style={{ color: 'var(--imi-securityTeal)' }}>{status}</span>}
        </div>
      </div>

      {/* Lista */}
      {items.length === 0 ? (
        <p className="font-mono-data text-xs text-center py-12" style={{ color: 'var(--imi-textMuted)' }}>
          Sin proyectos aún — agrega el primero arriba.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="border rounded-sm overflow-hidden" style={{ borderColor: 'var(--imi-gridBorder)', background: 'var(--imi-cardBg)' }}>
              {item.imageUrl && (
                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})`, backgroundColor: 'var(--imi-bgAbsolute)' }} />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-authority text-lg tracking-wide" style={{ color: 'var(--imi-textPrimary)' }}>{item.title}</h3>
                  {item.featured && (
                    <span className="font-mono-data text-[9px] px-1.5 py-0.5 rounded shrink-0" style={{ background: 'var(--imi-accentOrange)', color: '#000' }}>★</span>
                  )}
                </div>
                <p className="font-mono-data text-[10px] mb-3" style={{ color: 'var(--imi-textMuted)' }}>{item.client} · {item.category} · {item.year}</p>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)} className="flex-1 py-1.5 border rounded-sm font-mono-data text-[10px] tracking-wider"
                    style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}>
                    Editar
                  </button>
                  <button onClick={() => del(item.id)} className="py-1.5 px-3 border rounded-sm font-mono-data text-[10px]"
                    style={{ borderColor: '#ef444440', color: '#ef4444' }}>
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
