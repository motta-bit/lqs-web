'use client'

import { useState } from 'react'

const STATUS_CONFIG = {
  NEW:           { label: 'Nuevo',             color: 'var(--imi-accentOrange)'   },
  REVIEWING:     { label: 'En revisión',        color: 'var(--imi-innovationBlue)' },
  PROPOSAL_SENT: { label: 'Propuesta enviada',  color: 'var(--imi-securityTeal)'   },
  CLOSED_WON:    { label: 'Cerrado ✓',          color: '#22c55e'                   },
  CLOSED_LOST:   { label: 'Cerrado ✗',          color: '#ef4444'                   },
}

type LeadStatus = keyof typeof STATUS_CONFIG

interface DemoLead {
  id: string; name: string; email: string; clientType: string
  status: LeadStatus; totalEstimate: number; currency: string; notes: string
}

const DEMO_LEADS: DemoLead[] = [
  { id: 'LQS-DEMO-001', name: 'Carlos Ramírez',   email: 'carlos@empresa.co',  clientType: 'brand',   status: 'NEW',           totalEstimate: 3500000, currency: 'COP', notes: '' },
  { id: 'LQS-DEMO-002', name: 'Ana Gómez',        email: 'ana@personal.co',    clientType: 'creator', status: 'REVIEWING',     totalEstimate: 1200000, currency: 'COP', notes: '' },
  { id: 'LQS-DEMO-003', name: 'Evento Tech 2024', email: 'info@eventotech.co', clientType: 'event',   status: 'PROPOSAL_SENT', totalEstimate: 0,       currency: 'COP', notes: 'Evento 300 personas' },
]

export default function AdminLeadsPage() {
  const [leads,    setLeads]    = useState<DemoLead[]>(DEMO_LEADS)
  const [selected, setSelected] = useState<string | null>(null)
  const [note,     setNote]     = useState('')

  const fmt = (n: number) =>
    n ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n) : 'Sin estimado'

  const updateStatus = (id: string, status: keyof typeof STATUS_CONFIG) =>
    setLeads((p) => p.map((l) => (l.id === id ? { ...l, status } : l)))

  const saveNote = (id: string) => {
    setLeads((p) => p.map((l) => (l.id === id ? { ...l, notes: note } : l)))
    setSelected(null)
    setNote('')
  }

  return (
    <div className="p-8">
      <h1 className="font-authority text-4xl tracking-wider mb-2" style={{ color: 'var(--imi-textPrimary)' }}>LEADS</h1>
      <p className="font-mono-data text-xs mb-8" style={{ color: 'var(--imi-textMuted)' }}>{leads.length} solicitudes recibidas</p>
      <div className="space-y-3">
        {leads.map((lead) => {
          const sc = STATUS_CONFIG[lead.status]
          return (
            <div key={lead.id} className="border rounded-sm p-6" style={{ borderColor: 'var(--imi-gridBorder)', background: 'var(--imi-cardBg)' }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono-data text-xs px-2 py-0.5 rounded" style={{ background: `${sc.color}20`, color: sc.color }}>{sc.label}</span>
                    <span className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>{lead.id}</span>
                  </div>
                  <h3 className="font-authority text-xl tracking-wider mb-1" style={{ color: 'var(--imi-textPrimary)' }}>{lead.name}</h3>
                  <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>
                    {lead.email} · {lead.clientType} · {fmt(lead.totalEstimate)}
                  </p>
                  {lead.notes && (
                    <p className="font-readability text-xs mt-2 italic" style={{ color: 'var(--imi-textMuted)' }}>📝 {lead.notes}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STATUS_CONFIG) as Array<keyof typeof STATUS_CONFIG>).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(lead.id, s)}
                      className="font-mono-data text-[10px] px-2 py-1 border rounded transition-all"
                      style={{
                        borderColor: lead.status === s ? STATUS_CONFIG[s].color : 'var(--imi-gridBorder)',
                        color:       lead.status === s ? STATUS_CONFIG[s].color : 'var(--imi-textMuted)',
                        background:  lead.status === s ? `${STATUS_CONFIG[s].color}15` : 'transparent',
                      }}
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                  <button
                    onClick={() => { setSelected(lead.id); setNote(lead.notes) }}
                    className="font-mono-data text-[10px] px-2 py-1 border rounded"
                    style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}
                  >
                    + Nota
                  </button>
                </div>
              </div>
              {selected === lead.id && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--imi-gridBorder)' }}>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nota interna..."
                    className="w-full px-3 py-2 rounded-sm border bg-transparent font-readability text-sm outline-none mb-2"
                    style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveNote(lead.id)}
                      className="px-4 py-1.5 rounded-sm font-mono-data text-xs"
                      style={{ background: 'var(--imi-accentOrange)', color: '#000' }}
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setSelected(null)}
                      className="px-4 py-1.5 font-mono-data text-xs"
                      style={{ color: 'var(--imi-textMuted)' }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
