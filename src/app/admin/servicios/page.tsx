'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ServiceItem } from '@/lib/edge-store'

const CATS = ['Branding', 'Web', 'Video', 'Fotografía', 'Redes', 'Eventos', 'Marketing']
const EMPTY: Omit<ServiceItem, 'id' | 'currency' | 'active'> = { name: '', description: '', category: 'Branding', price: 0 }

const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

export default function AdminServiciosPage() {
  const [items,   setItems]   = useState<ServiceItem[]>([])
  const [form,    setForm]    = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [status,  setStatus]  = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/servicios')
    setItems(await res.json())
  }, [])

  useEffect(() => { load() }, [load])

  const msg = (m: string) => { setStatus(m); setTimeout(() => setStatus(''), 3000) }
  const reset = () => { setEditing(null); setForm(EMPTY) }

  const startEdit = (item: ServiceItem) => {
    setEditing(item.id)
    setForm({ name: item.name, description: item.description, category: item.category, price: item.price })
  }

  const save = async () => {
    setLoading(true)
    const [method, body] = editing
      ? ['PUT', JSON.stringify({ ...form, id: editing, currency: 'COP', active: true })]
      : ['POST', JSON.stringify(form)]
    const res = await fetch('/api/admin/servicios', { method, headers: { 'Content-Type': 'application/json' }, body })
    if (res.ok) { msg(editing ? '✓ Servicio actualizado' : '✓ Servicio creado'); reset(); load() }
    else msg('✕ Error al guardar')
    setLoading(false)
  }

  const toggleActive = async (item: ServiceItem) => {
    await fetch('/api/admin/servicios', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, active: !item.active }),
    })
    load()
  }

  const del = async (id: string) => {
    if (!confirm('¿Eliminar este servicio?')) return
    await fetch('/api/admin/servicios', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    msg('✓ Eliminado'); load()
  }

  return (
    <div className="p-8">
      <h1 className="font-authority text-4xl tracking-wider mb-1" style={{ color: 'var(--imi-textPrimary)' }}>SERVICIOS</h1>
      <p className="font-mono-data text-xs mb-8" style={{ color: 'var(--imi-textMuted)' }}>{items.filter(i=>i.active).length} activos · {items.length} total</p>

      {/* Formulario */}
      <div className="border rounded-sm p-6 mb-8" style={{ borderColor: 'var(--imi-accentOrange)', background: 'var(--imi-cardBg)' }}>
        <h2 className="font-authority text-xl tracking-wider mb-5" style={{ color: 'var(--imi-textPrimary)' }}>
          {editing ? '✎ Editar servicio' : '+ Nuevo servicio'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {(['name', 'description'] as const).map(k => (
            <div key={k}>
              <label className="font-mono-data text-[10px] tracking-widest uppercase block mb-1" style={{ color: 'var(--imi-textMuted)' }}>
                {k === 'name' ? 'Nombre del servicio' : 'Descripción corta'}
              </label>
              <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                className="w-full px-3 py-2 rounded-sm border bg-transparent font-readability text-sm outline-none"
                style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }} />
            </div>
          ))}
          <div>
            <label className="font-mono-data text-[10px] tracking-widest uppercase block mb-1" style={{ color: 'var(--imi-textMuted)' }}>Categoría</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-2 rounded-sm border bg-transparent font-readability text-sm outline-none"
              style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }}>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono-data text-[10px] tracking-widest uppercase block mb-1" style={{ color: 'var(--imi-textMuted)' }}>Precio base (COP)</label>
            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))}
              className="w-full px-3 py-2 rounded-sm border bg-transparent font-readability text-sm outline-none"
              style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }} />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={save} disabled={loading || !form.name}
            className="px-6 py-2 rounded-sm font-mono-data text-xs tracking-wider disabled:opacity-40"
            style={{ background: 'var(--imi-accentOrange)', color: '#000' }}>
            {loading ? 'Guardando...' : editing ? 'Actualizar' : 'Crear servicio'}
          </button>
          {editing && <button onClick={reset} className="px-4 py-2 font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>Cancelar</button>}
          {status && <span className="font-mono-data text-xs self-center" style={{ color: 'var(--imi-securityTeal)' }}>{status}</span>}
        </div>
      </div>

      {/* Lista */}
      {items.length === 0 ? (
        <p className="font-mono-data text-xs text-center py-12" style={{ color: 'var(--imi-textMuted)' }}>Sin servicios aún — agrega el primero arriba.</p>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="border rounded-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              style={{ borderColor: item.active ? 'var(--imi-gridBorder)' : '#333', background: 'var(--imi-cardBg)', opacity: item.active ? 1 : 0.5 }}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-authority text-xl tracking-wide" style={{ color: 'var(--imi-textPrimary)' }}>{item.name}</h3>
                  <span className="font-mono-data text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}>{item.category}</span>
                </div>
                <p className="font-readability text-sm mb-1" style={{ color: 'var(--imi-textMuted)' }}>{item.description}</p>
                <p className="font-mono-data text-xs" style={{ color: 'var(--imi-accentOrange)' }}>{fmt(item.price)}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => toggleActive(item)}
                  className="px-3 py-1.5 border rounded-sm font-mono-data text-[10px]"
                  style={{ borderColor: item.active ? 'var(--imi-securityTeal)' : 'var(--imi-gridBorder)', color: item.active ? 'var(--imi-securityTeal)' : 'var(--imi-textMuted)' }}>
                  {item.active ? 'Activo' : 'Inactivo'}
                </button>
                <button onClick={() => startEdit(item)} className="px-3 py-1.5 border rounded-sm font-mono-data text-[10px]"
                  style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}>Editar</button>
                <button onClick={() => del(item.id)} className="px-3 py-1.5 border rounded-sm font-mono-data text-[10px]"
                  style={{ borderColor: '#ef444440', color: '#ef4444' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
