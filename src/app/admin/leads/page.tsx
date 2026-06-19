'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Lead } from '@/lib/edge-store'

const STATUS_CONFIG = {
  NEW:           { label: 'Nuevo',             color: 'var(--imi-accentOrange)'   },
  REVIEWING:     { label: 'En revisión',        color: 'var(--imi-innovationBlue)' },
  PROPOSAL_SENT: { label: 'Propuesta enviada',  color: 'var(--imi-securityTeal)'   },
  CLOSED_WON:    { label: 'Cerrado ✓',          color: '#22c55e'                   },
  CLOSED_LOST:   { label: 'Cerrado ✗',          color: '#ef4444'                   },
}

const fmt = (n: number) =>
  n ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n) : 'Sin estimado'

export default function AdminLeadsPage() {
  const [leads,    setLeads]    = useState<Lead[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [note,     setNote]     = useState('')
  const [loading,  setLoading]  = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/leads')
    const data = await res.json()
    setLeads(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (lead: Lead, status: Lead['status']) => {
    await fetch('/api/admin/leads', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, status }),
    })
    setLeads(p => p.map(l => l.id === lead.id ? { ...l, status } : l))
  }

  const saveNote = async (lead: Lead) => {
    await fetch('/api/admin/leads', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, notes: note }),
    })
    setLeads(p => p.map(l => l.id === lead.id ? { ...l, notes: note } : l))
    setSelected(null); setNote('')
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-authority text-4xl tracking-wider" style={{ color: 'var(--imi-textPrimary)' }}>LEADS</h1>
        <button onClick={load} className="font-mono-data text-xs px-3 py-1.5 border rounded-sm"
          style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}>↻ Actualizar</button>
      </div>
      <p className="font-mono-data text-xs mb-8" style={{ color: 'var(--imi-textMuted)' }}>
        {leads.length} solicitudes · {leads.filter(l=>l.status==='NEW').length} nuevas
      </p>

      {loading ? (
        <p className="font-mono-data text-xs text-center py-12" style={{ color: 'var(--imi-textMuted)' }}>Cargando...</p>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 border rounded-sm" style={{ borderColor: 'var(--imi-gridBorder)' }}>
          <p className="font-authority text-3xl tracking-wider mb-2" style={{ color: 'var(--imi-textMuted)' }}>Sin leads aún</p>
          <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>
            Cuando alguien use el cotizador, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map(lead => {
            const sc = STATUS_CONFIG[lead.status]
            return (
              <div key={lead.id} className="border rounded-sm p-6" style={{ borderColor: 'var(--imi-gridBorder)', background: 'var(--imi-cardBg)' }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono-data text-xs px-2 py-0.5 rounded" style={{ background: `${sc.color}20`, color: sc.color }}>{sc.label}</span>
                      <span className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>{lead.id}</span>
                      <span className="font-mono-data text-[10px]" style={{ color: 'var(--imi-textMuted)' }}>
                        {new Date(lead.createdAt).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                    <h3 className="font-authority text-xl tracking-wider mb-1" style={{ color: 'var(--imi-textPrimary)' }}>{lead.name}</h3>
                    <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>
                      {lead.email}{lead.whatsapp ? ` · +${lead.whatsapp}` : ''} · {lead.clientType} · {fmt(lead.totalEstimate)}
                    </p>
                    {lead.services?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {lead.services.map(s => (
                          <span key={s} className="font-mono-data text-[9px] px-1.5 py-0.5 border rounded"
                            style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}>{s}</span>
                        ))}
                      </div>
                    )}
                    {lead.notes && (
                      <p className="font-readability text-xs mt-2 italic" style={{ color: 'var(--imi-textMuted)' }}>📝 {lead.notes}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {(Object.keys(STATUS_CONFIG) as Lead['status'][]).map(s => (
                      <button key={s} onClick={() => updateStatus(lead, s)}
                        className="font-mono-data text-[10px] px-2 py-1 border rounded transition-all"
                        style={{
                          borderColor: lead.status === s ? STATUS_CONFIG[s].color : 'var(--imi-gridBorder)',
                          color:       lead.status === s ? STATUS_CONFIG[s].color : 'var(--imi-textMuted)',
                          background:  lead.status === s ? `${STATUS_CONFIG[s].color}15` : 'transparent',
                        }}>
                        {STATUS_CONFIG[s].label}
                      </button>
                    ))}
                    <button onClick={() => { setSelected(lead.id); setNote(lead.notes) }}
                      className="font-mono-data text-[10px] px-2 py-1 border rounded"
                      style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}>
                      + Nota
                    </button>
                  </div>
                </div>
                {selected === lead.id && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--imi-gridBorder)' }}>
                    <textarea rows={3} value={note} onChange={e => setNote(e.target.value)}
                      placeholder="Nota interna..."
                      className="w-full px-3 py-2 rounded-sm border bg-transparent font-readability text-sm outline-none mb-2"
                      style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }} />
                    <div className="flex gap-2">
                      <button onClick={() => saveNote(lead)} className="px-4 py-1.5 rounded-sm font-mono-data text-xs"
                        style={{ background: 'var(--imi-accentOrange)', color: '#000' }}>Guardar</button>
                      <button onClick={() => setSelected(null)} className="px-4 py-1.5 font-mono-data text-xs"
                        style={{ color: 'var(--imi-textMuted)' }}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
