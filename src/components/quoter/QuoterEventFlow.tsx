'use client'

import { useState }       from 'react'
import { useQuoterStore } from '@/store/quoterStore'
import { CTAButton }      from '@/components/ui/CTAButton'

const EVENT_TYPES = [
  { value: 'corporativo', label: 'Corporativo',      icon: '🏢' },
  { value: 'lanzamiento', label: 'Lanzamiento',      icon: '🚀' },
  { value: 'social',      label: 'Social / Fiesta',  icon: '🎉' },
  { value: 'academico',   label: 'Académico',        icon: '🎓' },
  { value: 'cultural',    label: 'Cultural / Arte',  icon: '🎨' },
]

const EVENT_SVCS = [
  { id: 'ev1', label: 'Fotografía del evento',      icon: '📸' },
  { id: 'ev2', label: 'Video highlight',            icon: '🎬' },
  { id: 'ev3', label: 'Reels en vivo',              icon: '📱' },
  { id: 'ev4', label: 'Streaming',                  icon: '📡' },
  { id: 'ev5', label: 'Diseño de papelería',        icon: '📋' },
  { id: 'ev6', label: 'Logística y ambientación',   icon: '🎪' },
]

export function QuoterEventFlow() {
  const { closePanel } = useQuoterStore()
  const [eStep,     setEStep]     = useState(1)
  const [eType,     setEType]     = useState('')
  const [attendees, setAttendees] = useState('')
  const [eDate,     setEDate]     = useState('')
  const [eCity,     setECity]     = useState('')
  const [selSvcs,   setSelSvcs]   = useState<string[]>([])
  const [eName,     setEName]     = useState('')
  const [eEmail,    setEEmail]    = useState('')
  const [done,      setDone]      = useState(false)

  const toggle = (id: string) =>
    setSelSvcs((p) => (p.includes(id) ? p.filter((s) => s !== id) : [...p, id]))

  if (done) return (
    <div className="p-8 text-center flex flex-col items-center gap-6">
      <div className="text-6xl">🦆</div>
      <h3 className="font-authority text-3xl tracking-wider" style={{ color: 'var(--imi-accentOrange)' }}>¡SOLICITUD ENVIADA!</h3>
      <p className="font-readability text-sm" style={{ color: 'var(--imi-textMuted)' }}>
        Revisaremos los detalles de tu evento y te contactaremos en menos de 24 horas.
      </p>
      <CTAButton onClick={() => { closePanel(); setDone(false) }}>Cerrar</CTAButton>
    </div>
  )

  return (
    <div className="p-6">
      {eStep === 1 && (
        <>
          <h3 className="font-authority text-3xl tracking-wider mb-4" style={{ color: 'var(--imi-textPrimary)' }}>¿QUÉ TIPO DE EVENTO?</h3>
          <div className="space-y-2 mb-6">
            {EVENT_TYPES.map((et) => (
              <button
                key={et.value}
                onClick={() => setEType(et.value)}
                className="w-full flex items-center gap-3 p-4 border rounded-sm transition-all"
                style={{
                  borderColor: eType === et.value ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)',
                  background:  eType === et.value ? 'rgba(255,70,0,0.08)' : 'var(--imi-cardBg)',
                }}
              >
                <span className="text-2xl">{et.icon}</span>
                <span className="font-authority text-lg tracking-wider" style={{ color: 'var(--imi-textPrimary)' }}>{et.label}</span>
                {eType === et.value && <span className="ml-auto" style={{ color: 'var(--imi-accentOrange)' }}>✓</span>}
              </button>
            ))}
          </div>
          <CTAButton className="w-full" disabled={!eType} onClick={() => setEStep(2)}>Continuar →</CTAButton>
        </>
      )}

      {eStep === 2 && (
        <>
          <h3 className="font-authority text-3xl tracking-wider mb-4" style={{ color: 'var(--imi-textPrimary)' }}>DETALLES</h3>
          <div className="space-y-4 mb-6">
            {[
              { id: 'att', label: 'N° de asistentes', value: attendees, set: setAttendees, type: 'number', ph: '150'              },
              { id: 'dt',  label: 'Fecha del evento',  value: eDate,    set: setEDate,     type: 'date',   ph: ''                 },
              { id: 'ct',  label: 'Ciudad / Lugar',    value: eCity,    set: setECity,     type: 'text',   ph: 'Medellín, Colombia'},
            ].map((f) => (
              <div key={f.id}>
                <label
                  htmlFor={`ev-${f.id}`}
                  className="font-mono-data text-xs tracking-widest uppercase mb-1 block"
                  style={{ color: 'var(--imi-textMuted)' }}
                >
                  {f.label}
                </label>
                <input
                  id={`ev-${f.id}`}
                  type={f.type}
                  placeholder={f.ph}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm border bg-transparent font-readability text-sm outline-none"
                  style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <CTAButton variant="ghost" onClick={() => setEStep(1)} className="flex-1">← Atrás</CTAButton>
            <CTAButton className="flex-1" disabled={!attendees || !eDate || !eCity} onClick={() => setEStep(3)}>Continuar →</CTAButton>
          </div>
        </>
      )}

      {eStep === 3 && (
        <>
          <h3 className="font-authority text-3xl tracking-wider mb-4" style={{ color: 'var(--imi-textPrimary)' }}>¿QUÉ NECESITAS?</h3>
          <div className="space-y-2 mb-6">
            {EVENT_SVCS.map((svc) => {
              const isSel = selSvcs.includes(svc.id)
              return (
                <button
                  key={svc.id}
                  onClick={() => toggle(svc.id)}
                  className="w-full flex items-center gap-3 p-3 border rounded-sm transition-all"
                  style={{
                    borderColor: isSel ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)',
                    background:  isSel ? 'rgba(255,70,0,0.08)' : 'var(--imi-cardBg)',
                  }}
                >
                  <span>{svc.icon}</span>
                  <span className="flex-1 text-left font-readability text-sm" style={{ color: 'var(--imi-textPrimary)' }}>{svc.label}</span>
                  <span
                    className="w-5 h-5 rounded border flex items-center justify-center text-xs"
                    style={{
                      borderColor: isSel ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)',
                      background:  isSel ? 'var(--imi-accentOrange)' : 'transparent',
                      color: '#000',
                    }}
                  >
                    {isSel ? '✓' : ''}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="flex gap-3">
            <CTAButton variant="ghost" onClick={() => setEStep(2)} className="flex-1">← Atrás</CTAButton>
            <CTAButton className="flex-1" disabled={selSvcs.length === 0} onClick={() => setEStep(4)}>Continuar →</CTAButton>
          </div>
        </>
      )}

      {eStep === 4 && (
        <>
          <h3 className="font-authority text-3xl tracking-wider mb-2" style={{ color: 'var(--imi-textPrimary)' }}>¿CÓMO TE CONTACTAMOS?</h3>
          <div
            className="p-4 rounded-sm border mb-4"
            style={{ borderColor: 'var(--imi-securityTeal)', background: 'rgba(0,128,128,0.05)' }}
          >
            <p className="font-readability text-sm" style={{ color: 'var(--imi-securityTeal)' }}>
              ℹ️ Los eventos tienen cotización personalizada. Te enviamos propuesta en menos de 24h.
            </p>
          </div>
          <div className="space-y-4 mb-6">
            {[
              { id: 'nm', label: 'Tu nombre', value: eName,  set: setEName,  type: 'text',  autoComplete: 'name'  },
              { id: 'em', label: 'Tu correo', value: eEmail, set: setEEmail, type: 'email', autoComplete: 'email' },
            ].map((f) => (
              <div key={f.id}>
                <label
                  htmlFor={`evc-${f.id}`}
                  className="font-mono-data text-xs tracking-widest uppercase mb-1 block"
                  style={{ color: 'var(--imi-textMuted)' }}
                >
                  {f.label}
                </label>
                <input
                  id={`evc-${f.id}`}
                  type={f.type}
                  value={f.value}
                  autoComplete={f.autoComplete}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm border bg-transparent font-readability text-sm outline-none"
                  style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }}
                />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <CTAButton
              size="lg"
              className="w-full"
              disabled={!eName || !eEmail}
              onClick={() => setDone(true)}
            >
              Enviar solicitud de evento
            </CTAButton>
            <button
              onClick={() => setEStep(3)}
              className="w-full font-mono-data text-xs py-2"
              style={{ color: 'var(--imi-textMuted)' }}
            >
              ← Atrás
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default QuoterEventFlow
