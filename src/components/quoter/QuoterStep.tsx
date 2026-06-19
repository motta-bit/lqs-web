'use client'

import { useEffect }       from 'react'
import { useQuoterStore }  from '@/store/quoterStore'
import type { QuoterService } from '@/store/quoterStore'
import { calculateQuote, formatCurrency } from '@/lib/quote-engine'
import { CTAButton }       from '@/components/ui/CTAButton'

const CLIENT_OPTIONS = [
  { value: 'brand',   label: 'Marca / Empresa',   icon: '🏢', desc: 'Empresas y negocios'           },
  { value: 'creator', label: 'Creador / Persona',  icon: '🎨', desc: 'Marca personal y creadores'    },
  { value: 'event',   label: 'Proyecto / Evento',  icon: '🎬', desc: 'Lanzamientos y eventos únicos' },
]

const SERVICES_BY_CLIENT: Record<string, Array<{ id: string; name: string; price: number; unit: string; icon: string }>> = {
  brand: [
    { id: 's1', name: 'Branding e Identidad',    price: 3500000, unit: 'proyecto', icon: '🎨' },
    { id: 's2', name: 'Desarrollo Web Next.js',  price: 4500000, unit: 'proyecto', icon: '💻' },
    { id: 's3', name: 'Video Corporativo',        price: 4500000, unit: 'pieza',   icon: '🎥' },
    { id: 's4', name: 'Fotografía de Producto',  price: 800000,  unit: 'sesión',  icon: '📸' },
    { id: 's5', name: 'Pauta Digital (1 mes)',   price: 1200000, unit: 'mes',     icon: '📊' },
    { id: 's6', name: 'Auditoría de Marca',      price: 600000,  unit: 'análisis',icon: '🔍' },
  ],
  creator: [
    { id: 's7',  name: 'Pack de Reels x10',      price: 1500000, unit: 'pack',    icon: '📱' },
    { id: 's8',  name: 'Fotografía Personal',    price: 800000,  unit: 'sesión',  icon: '📸' },
    { id: 's9',  name: 'Marca Personal Completa',price: 2500000, unit: 'proyecto',icon: '⭐' },
    { id: 's10', name: 'Copywriting para Bio',   price: 450000,  unit: 'pieza',   icon: '✍️' },
    { id: 's11', name: 'Plantillas Redes x15',   price: 600000,  unit: 'pack',    icon: '🖼️' },
  ],
  event: [
    { id: 's12', name: 'Cobertura Fotográfica',  price: 1200000, unit: 'evento',  icon: '📸' },
    { id: 's13', name: 'Video Highlight',        price: 2500000, unit: 'pieza',   icon: '🎬' },
    { id: 's14', name: 'Reels del Evento x5',   price: 1000000, unit: 'pack',    icon: '📱' },
    { id: 's15', name: 'Diseño de Papelería',    price: 800000,  unit: 'proyecto',icon: '📋' },
    { id: 's16', name: 'Streaming en Vivo',      price: 3000000, unit: 'evento',  icon: '📡' },
  ],
}

const URGENCY_OPTIONS = [
  { days: 5,  label: 'Urgente',  sub: '5 días hábiles',  mult: '+50%' },
  { days: 10, label: 'Rápido',   sub: '10 días hábiles', mult: '+25%' },
  { days: 15, label: 'Normal',   sub: '15 días hábiles', mult: 'Base' },
  { days: 30, label: 'Flexible', sub: '30 días hábiles', mult: '-5%'  },
]

export function QuoterStep() {
  const {
    step, clientType, selectedServices, urgencyDays, currency,
    setClientType, toggleService, setUrgency, setCurrency,
    nextStep, prevStep, setQuoteResult, quoteResult, contactData, setContactData,
  } = useQuoterStore()

  useEffect(() => {
    if (selectedServices.length > 0) {
      const result = calculateQuote({
        services: selectedServices,
        urgencyDays,
        clientType: clientType || 'brand',
        currency,
      })
      setQuoteResult(result)
    }
  }, [selectedServices, urgencyDays, currency])

  const availableServices = SERVICES_BY_CLIENT[clientType || 'brand'] || []

  if (step === 1) return (
    <div className="p-6 space-y-3">
      <div className="mb-4">
        <h3 className="font-authority text-3xl tracking-wider mb-1" style={{ color: 'var(--imi-textPrimary)' }}>¿QUIÉN ERES?</h3>
        <p className="font-readability text-sm" style={{ color: 'var(--imi-textMuted)' }}>Selecciona tu perfil para ver servicios relevantes.</p>
      </div>
      {CLIENT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => {
            if (opt.value === 'event') {
              setClientType(opt.value, true)
            } else {
              setClientType(opt.value)
            }
            nextStep()
          }}
          className="w-full text-left p-4 border rounded-sm transition-all hover:scale-[1.01]"
          style={{
            borderColor: clientType === opt.value ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)',
            background:  clientType === opt.value ? 'rgba(255,70,0,0.05)' : 'var(--imi-cardBg)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{opt.icon}</span>
            <div>
              <p className="font-authority text-lg tracking-wider" style={{ color: 'var(--imi-textPrimary)' }}>{opt.label}</p>
              <p className="font-readability text-xs" style={{ color: 'var(--imi-textMuted)' }}>{opt.desc}</p>
            </div>
            <span className="ml-auto" style={{ color: 'var(--imi-accentOrange)' }}>→</span>
          </div>
        </button>
      ))}
    </div>
  )

  if (step === 2) return (
    <div className="p-6">
      <h3 className="font-authority text-3xl tracking-wider mb-1" style={{ color: 'var(--imi-textPrimary)' }}>¿QUÉ NECESITAS?</h3>
      <p className="font-readability text-sm mb-4" style={{ color: 'var(--imi-textMuted)' }}>Selecciona uno o más servicios.</p>
      <div className="space-y-2 mb-6">
        {availableServices.map((svc) => {
          const isSel = selectedServices.some((s) => s.id === svc.id)
          const svcObj: QuoterService = {
            id: svc.id, slug: svc.id, name: svc.name, nameEn: svc.name,
            category: 'MEDIA', basePrice: svc.price, unitType: svc.unit,
            description: svc.name, descriptionEn: svc.name,
            isActive: true, order: 0, createdAt: new Date(),
          }
          return (
            <button
              key={svc.id}
              onClick={() => toggleService(svcObj)}
              className="w-full flex items-center gap-3 p-3 border rounded-sm transition-all"
              style={{
                borderColor: isSel ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)',
                background:  isSel ? 'rgba(255,70,0,0.08)' : 'var(--imi-cardBg)',
              }}
            >
              <span>{svc.icon}</span>
              <span className="flex-1 text-left font-readability text-sm" style={{ color: 'var(--imi-textPrimary)' }}>{svc.name}</span>
              <span className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(svc.price)}
              </span>
              <span
                className="w-5 h-5 rounded border flex items-center justify-center text-xs flex-shrink-0"
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
        <CTAButton variant="ghost" onClick={prevStep} className="flex-1">← Atrás</CTAButton>
        <CTAButton onClick={nextStep} disabled={selectedServices.length === 0} className="flex-1">Continuar →</CTAButton>
      </div>
    </div>
  )

  if (step === 3) return (
    <div className="p-6">
      <h3 className="font-authority text-3xl tracking-wider mb-1" style={{ color: 'var(--imi-textPrimary)' }}>¿CUÁNDO?</h3>
      <p className="font-readability text-sm mb-4" style={{ color: 'var(--imi-textMuted)' }}>El plazo afecta el precio.</p>
      <div className="space-y-2 mb-6">
        {URGENCY_OPTIONS.map((opt) => (
          <button
            key={opt.days}
            onClick={() => setUrgency(opt.days)}
            className="w-full flex items-center justify-between p-4 border rounded-sm transition-all"
            style={{
              borderColor: urgencyDays === opt.days ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)',
              background:  urgencyDays === opt.days ? 'rgba(255,70,0,0.08)' : 'var(--imi-cardBg)',
            }}
          >
            <div>
              <p className="font-authority text-lg tracking-wider" style={{ color: 'var(--imi-textPrimary)' }}>{opt.label}</p>
              <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>{opt.sub}</p>
            </div>
            <span
              className="font-mono-data text-sm px-2 py-1 rounded"
              style={{
                color:      opt.days <= 10 ? 'var(--imi-accentOrange)' : 'var(--imi-securityTeal)',
                background: opt.days <= 10 ? 'rgba(255,70,0,0.1)' : 'rgba(0,128,128,0.1)',
              }}
            >
              {opt.mult}
            </span>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <CTAButton variant="ghost" onClick={prevStep} className="flex-1">← Atrás</CTAButton>
        <CTAButton onClick={nextStep} className="flex-1">Ver estimado →</CTAButton>
      </div>
    </div>
  )

  if (step === 4) return (
    <div className="p-6">
      <h3 className="font-authority text-3xl tracking-wider mb-4" style={{ color: 'var(--imi-textPrimary)' }}>¿EN QUÉ MONEDA?</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {(['COP', 'USD'] as const).map((cur) => (
          <button
            key={cur}
            onClick={() => setCurrency(cur)}
            className="p-6 border rounded-sm text-center transition-all"
            style={{
              borderColor: currency === cur ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)',
              background:  currency === cur ? 'rgba(255,70,0,0.08)' : 'var(--imi-cardBg)',
            }}
          >
            <p className="font-authority text-2xl mb-1" style={{ color: 'var(--imi-textPrimary)' }}>{cur}</p>
            <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>
              {cur === 'COP' ? 'Pesos colombianos' : 'Dólares'}
            </p>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <CTAButton variant="ghost" onClick={prevStep} className="flex-1">← Atrás</CTAButton>
        <CTAButton onClick={nextStep} className="flex-1">Ver total →</CTAButton>
      </div>
    </div>
  )

  if (step === 5) return (
    <div className="p-6">
      <h3 className="font-authority text-3xl tracking-wider mb-1" style={{ color: 'var(--imi-textPrimary)' }}>TU ESTIMADO</h3>
      <p className="font-readability text-sm mb-4" style={{ color: 'var(--imi-textMuted)' }}>Precio orientativo. El valor final se confirma en propuesta.</p>
      {quoteResult && (
        <>
          <div
            className="p-6 rounded-sm border mb-4 text-center"
            style={{ borderColor: 'var(--imi-accentOrange)', background: 'rgba(255,70,0,0.05)', boxShadow: '0 0 20px rgba(255,70,0,0.1)' }}
          >
            <p className="font-mono-data text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--imi-textMuted)' }}>Total estimado</p>
            <p className="font-authority text-5xl tracking-wider" style={{ color: 'var(--imi-accentOrange)' }}>
              {formatCurrency(quoteResult.total, currency)}
            </p>
            {quoteResult.discount > 0 && (
              <p className="font-mono-data text-sm mt-2" style={{ color: 'var(--imi-securityTeal)' }}>
                ✓ Descuento de {Math.round(quoteResult.discount * 100)}% aplicado
              </p>
            )}
            <p className="font-mono-data text-xs mt-1" style={{ color: 'var(--imi-textMuted)' }}>Plazo: {urgencyDays} días hábiles</p>
          </div>
          <div className="rounded-sm border mb-4" style={{ borderColor: 'var(--imi-gridBorder)' }}>
            {quoteResult.breakdown.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 border-b last:border-b-0"
                style={{ borderColor: 'var(--imi-gridBorder)' }}
              >
                <span className="font-readability text-sm" style={{ color: 'var(--imi-textPrimary)' }}>{item.serviceName}</span>
                <span className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>
                  {formatCurrency(currency === 'USD' ? Math.round(item.subtotal / 4000) : item.subtotal, currency)}
                </span>
              </div>
            ))}
          </div>
          {quoteResult.suggestedPackage && (
            <div
              className="p-4 rounded-sm border mb-4"
              style={{ borderColor: 'var(--imi-securityTeal)', background: 'rgba(0,128,128,0.05)' }}
            >
              <p className="font-readability text-sm" style={{ color: 'var(--imi-securityTeal)' }}>
                💡 ¿Sabías que estos servicios forman el <strong>{quoteResult.suggestedPackage.name}</strong> con {Math.round(quoteResult.suggestedPackage.discount * 100)}% de descuento?
              </p>
            </div>
          )}
        </>
      )}
      <div className="flex gap-3">
        <CTAButton variant="ghost" onClick={prevStep} className="flex-1">← Atrás</CTAButton>
        <CTAButton onClick={nextStep} className="flex-1">Quiero esto →</CTAButton>
      </div>
    </div>
  )

  if (step === 6) return (
    <div className="p-6">
      <h3 className="font-authority text-3xl tracking-wider mb-1" style={{ color: 'var(--imi-textPrimary)' }}>HABLEMOS</h3>
      <p className="font-readability text-sm mb-4" style={{ color: 'var(--imi-textMuted)' }}>Opcional — para recibir propuesta formal por correo.</p>
      <div className="space-y-4 mb-6">
        {[
          { id: 'name',  label: 'Nombre', type: 'text',  placeholder: 'Tu nombre o empresa', autoComplete: 'name'  },
          { id: 'email', label: 'Correo', type: 'email', placeholder: 'tu@correo.com',        autoComplete: 'email' },
        ].map((field) => (
          <div key={field.id}>
            <label
              htmlFor={`q-${field.id}`}
              className="font-mono-data text-xs tracking-widest uppercase mb-1 block"
              style={{ color: 'var(--imi-textMuted)' }}
            >
              {field.label}
            </label>
            <input
              id={`q-${field.id}`}
              type={field.type}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              value={(contactData as Record<string, string> | null)?.[field.id] || ''}
              onChange={(e) =>
                setContactData({
                  name:  field.id === 'name'  ? e.target.value : (contactData?.name  || ''),
                  email: field.id === 'email' ? e.target.value : (contactData?.email || ''),
                })
              }
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
          onClick={async () => {
            try {
              await fetch('/api/v1/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: contactData?.name,
                  email: contactData?.email,
                  clientType: clientType || 'brand',
                  services: selectedServices.map((s) => ({ id: s.id, name: s.name, price: s.basePrice, quantity: 1 })),
                  totalEstimate: quoteResult?.totalCOP,
                  urgencyDays,
                  currency,
                }),
              })
            } catch {}
            alert('✅ ¡Propuesta enviada! Te contactaremos en menos de 24 horas.')
            useQuoterStore.getState().closePanel()
            useQuoterStore.getState().reset()
          }}
        >
          Enviar propuesta
        </CTAButton>
        <a
          href={`https://wa.me/573247680413?text=${encodeURIComponent(
            `Hola LQS! Acabo de cotizar.\nServicios: ${selectedServices.map((s) => s.name).join(', ')}\nPlazo: ${urgencyDays} días\nEstimado: ${quoteResult ? formatCurrency(quoteResult.total, currency) : 'por calcular'}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 border rounded-sm font-authority tracking-widest text-sm"
          style={{ borderColor: 'var(--imi-securityTeal)', color: 'var(--imi-securityTeal)' }}
        >
          💬 Enviar por WhatsApp
        </a>
        <button
          onClick={prevStep}
          className="w-full font-mono-data text-xs py-2"
          style={{ color: 'var(--imi-textMuted)' }}
        >
          ← Volver
        </button>
      </div>
    </div>
  )

  return null
}

export default QuoterStep
