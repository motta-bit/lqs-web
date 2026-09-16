'use client'

/**
 * AyuntamientoFlow — nivel 4: el cotizador de 6 pasos como conversación
 * guiada (informe §E), no como formulario.
 *
 * REUSA la máquina de estados existente (useQuoterStore: step/totalSteps=6,
 * clientType, selectedServices, urgencyDays, currency, contactData) y el
 * motor de precios (calculateQuote). Lo nuevo es la piel de conversación y
 * la recomendación de plan sobre el modelo comercial D-11.
 *
 * Regla 2: el precio aparece por primera y única vez en el paso 5.
 * Flujo: quién → distritos → servicios → urgencia → resultado → contacto,
 * y al enviar, la "propuesta navegable" (misma metáfora de ciudad).
 */

import { useState } from 'react'
import { useQuoterStore } from '@/store/quoterStore'
import { calculateQuote, formatCurrency } from '@/lib/quote-engine'
import { DISTRICTS, ACCENT_HEX, ACCENT_TEXT_HEX, CITY_COPY } from '../districts'
import { servicesForDistrict, suggestPlan } from './catalog'
import { useSound } from '../sound/useSound'

const STEP_LABELS = [
  '¿Quién eres?',
  '¿Qué te llama?',
  'Elige lo que necesitas',
  '¿Para cuándo?',
  'Tu estimado',
  'Cerremos esto',
]

const WHO_OPTIONS = [
  { value: 'brand', label: 'Una marca / negocio', hint: 'Empresa, PYME o emprendimiento' },
  { value: 'creator', label: 'Una persona / creador', hint: 'Marca personal, canal, proyecto propio' },
  { value: 'event', label: 'Un evento / lanzamiento', hint: 'Algo que va a pasar y debe verse bien' },
] as const

const URGENCY_OPTIONS = [
  { days: 5, label: 'Ya mismo', hint: '≤5 días · recargo 50%' },
  { days: 10, label: 'Pronto', hint: '≤10 días · recargo 25%' },
  { days: 15, label: 'Normal', hint: '≤15 días · tarifa plena' },
  { days: 30, label: 'Con calma', hint: '30 días · 5% de descuento' },
] as const

export function AyuntamientoFlow() {
  const store = useQuoterStore()
  const cue = useSound()

  const [districts, setDistricts] = useState<string[]>([])
  const [contact, setContact] = useState({ name: '', email: '', phone: '' })
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [leadId, setLeadId] = useState<string | null>(null)

  const advance = () => {
    cue('cta')
    store.nextStep()
  }

  const toggleDistrict = (slug: string) => {
    cue('hover')
    setDistricts((prev) =>
      prev.includes(slug) ? prev.filter((d) => d !== slug) : [...prev, slug],
    )
  }

  const quote = calculateQuote({
    services: store.selectedServices,
    urgencyDays: store.urgencyDays,
    clientType: store.clientType ?? 'brand',
    currency: store.currency,
  })
  const suggestion = suggestPlan(
    store.selectedServices.map((s) => s.slug),
    store.clientType ?? 'brand',
  )

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contact.name.trim() || !contact.email.trim()) return
    setSubmitState('sending')
    try {
      const res = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          phone: contact.phone || undefined,
          clientType: store.clientType ?? 'brand',
          services: store.selectedServices.map((s) => ({
            id: s.slug,
            name: s.name,
            price: s.basePrice,
            quantity: 1,
          })),
          totalEstimate: quote.total,
          urgencyDays: store.urgencyDays,
          currency: store.currency,
          message: suggestion ? `Plan sugerido: ${suggestion.pkg.nameEs}` : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error()
      setLeadId(data.leadId ?? null)
      setSubmitState('done')
      cue('enter')
    } catch {
      setSubmitState('error')
    }
  }

  // ── Propuesta navegable: el cierre con la misma metáfora de ciudad ──────
  if (submitState === 'done') {
    return (
      <section aria-label="Tu propuesta" className="mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--lqs-orange)' }}>
          Propuesta {leadId ?? ''}
        </p>
        <h2 className="mt-3 font-display text-[clamp(1.75rem,5vw,3rem)] font-black uppercase leading-[0.95]">
          El pato ya está trabajando.
        </h2>
        <p className="mt-4 text-[color:var(--imi-textMuted)]">
          Te escribimos en menos de 24 horas. Esto fue lo que armamos juntos:
        </p>

        {/* Mini-ciudad: los distritos visitados, con sus servicios. */}
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {DISTRICTS.filter((d) => districts.includes(d.slug)).map((d) => (
            <li key={d.slug} className="rounded-sm border border-white/10 p-4">
              <p
                className="font-display text-lg font-black uppercase"
                style={{ color: ACCENT_TEXT_HEX[d.accent] }}
              >
                {d.name}
              </p>
              <ul className="mt-2 space-y-1 text-sm text-white/80">
                {store.selectedServices
                  .filter((s) => servicesForDistrict(d.slug).some((ds) => ds.slug === s.slug))
                  .map((s) => (
                    <li key={s.slug}>{s.name}</li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="mt-8 border-t border-white/10 pt-6 text-sm text-[color:var(--imi-textMuted)]">
          Estimado: <strong className="text-white">{formatCurrency(quote.total, store.currency)}</strong>
          {suggestion && (
            <>
              {' '}· con el plan <strong className="text-white">{suggestion.pkg.nameEs}</strong> puede
              quedar mejor — te lo contamos por correo.
            </>
          )}
        </p>

        <p className="mt-6">
          <a
            href="https://wa.me/573247680413"
            className="underline underline-offset-4"
            style={{ color: ACCENT_TEXT_HEX.teal }}
          >
            ¿Afán? Escríbenos directo por WhatsApp.
          </a>
        </p>
      </section>
    )
  }

  return (
    <section aria-label="Cotizador" className="mx-auto max-w-2xl">
      {/* Progreso */}
      <p className="font-data-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--imi-textMuted)]">
        Paso {store.step} de {store.totalSteps} — {STEP_LABELS[store.step - 1]}
      </p>

      {/* ── Paso 1: quién ── */}
      {store.step === 1 && (
        <div className="mt-6 grid gap-3">
          {WHO_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                store.setClientType(opt.value, opt.value === 'event')
                advance()
              }}
              className="rounded-sm border border-white/15 p-4 text-left transition-colors hover:border-white/40 focus-visible:outline focus-visible:outline-2"
              style={{ outlineColor: 'var(--lqs-orange)' }}
            >
              <span className="font-display text-lg font-black uppercase">{opt.label}</span>
              <span className="mt-1 block text-sm text-[color:var(--imi-textMuted)]">{opt.hint}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Paso 2: distritos ── */}
      {store.step === 2 && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DISTRICTS.map((d) => {
              const active = districts.includes(d.slug)
              return (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => toggleDistrict(d.slug)}
                  aria-pressed={active}
                  className="rounded-sm border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2"
                  style={{
                    borderColor: active ? ACCENT_HEX[d.accent] : 'rgba(255,255,255,0.15)',
                    outlineColor: ACCENT_HEX[d.accent],
                  }}
                >
                  <span
                    className="font-display text-base font-black uppercase"
                    style={{ color: active ? ACCENT_TEXT_HEX[d.accent] : '#fff' }}
                  >
                    {d.name}
                  </span>
                  <span className="mt-1 block text-[11px] leading-tight text-[color:var(--imi-textMuted)]">
                    {d.domain}
                  </span>
                </button>
              )
            })}
          </div>
          <StepNav
            onBack={store.prevStep}
            onNext={advance}
            nextDisabled={districts.length === 0}
          />
        </>
      )}

      {/* ── Paso 3: servicios (matriz diagnóstica) ── */}
      {store.step === 3 && (
        <>
          <div className="mt-6 space-y-6">
            {DISTRICTS.filter((d) => districts.includes(d.slug)).map((d) => (
              <fieldset key={d.slug}>
                <legend
                  className="font-display text-sm font-black uppercase tracking-wide"
                  style={{ color: ACCENT_TEXT_HEX[d.accent] }}
                >
                  {d.name}
                </legend>
                <div className="mt-2 grid gap-2">
                  {servicesForDistrict(d.slug).map((s) => {
                    const active = store.selectedServices.some((sv) => sv.slug === s.slug)
                    return (
                      <button
                        key={s.slug}
                        type="button"
                        onClick={() => {
                          cue('hover')
                          store.toggleService(s)
                        }}
                        aria-pressed={active}
                        className="rounded-sm border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2"
                        style={{
                          borderColor: active ? ACCENT_HEX[d.accent] : 'rgba(255,255,255,0.12)',
                          outlineColor: ACCENT_HEX[d.accent],
                        }}
                      >
                        <span className="text-sm font-semibold">{s.name}</span>
                        {/* Regla 2: descripción sí, precio NO. El precio vive en el paso 5. */}
                        <span className="mt-0.5 block text-xs text-[color:var(--imi-textMuted)]">
                          {s.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          <StepNav
            onBack={store.prevStep}
            onNext={advance}
            nextDisabled={store.selectedServices.length === 0}
          />
        </>
      )}

      {/* ── Paso 4: urgencia ── */}
      {store.step === 4 && (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {URGENCY_OPTIONS.map((opt) => {
              const active = store.urgencyDays === opt.days
              return (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => {
                    store.setUrgency(opt.days)
                    advance()
                  }}
                  aria-pressed={active}
                  className="rounded-sm border p-4 text-left transition-colors hover:border-white/40 focus-visible:outline focus-visible:outline-2"
                  style={{
                    borderColor: active ? 'var(--lqs-orange)' : 'rgba(255,255,255,0.15)',
                    outlineColor: 'var(--lqs-orange)',
                  }}
                >
                  <span className="font-display text-lg font-black uppercase">{opt.label}</span>
                  <span className="mt-1 block text-sm text-[color:var(--imi-textMuted)]">{opt.hint}</span>
                </button>
              )
            })}
          </div>
          <StepNav onBack={store.prevStep} />
        </>
      )}

      {/* ── Paso 5: resultado — el precio, por primera y única vez ── */}
      {store.step === 5 && (
        <>
          <div className="mt-6 rounded-sm border border-white/15 p-5">
            <ul className="space-y-2 text-sm">
              {quote.breakdown.map((item) => (
                <li key={item.serviceName} className="flex justify-between gap-4">
                  <span className="text-white/80">{item.serviceName}</span>
                  <span className="font-data-mono text-white/60">
                    {formatCurrency(item.subtotal, 'COP')}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--imi-textMuted)]">
                Estimado total
              </span>
              <span className="font-display text-2xl font-black" style={{ color: 'var(--lqs-orange)' }}>
                {formatCurrency(quote.total, store.currency)}
              </span>
            </p>
            <button
              type="button"
              onClick={() => store.setCurrency(store.currency === 'COP' ? 'USD' : 'COP')}
              className="mt-2 font-data-mono text-[11px] uppercase tracking-wide text-white/60 underline-offset-4 hover:text-white/80 hover:underline"
            >
              Ver en {store.currency === 'COP' ? 'USD' : 'COP'}
            </button>
          </div>

          {suggestion && (
            <aside
              className="mt-4 rounded-sm border p-5"
              style={{ borderColor: ACCENT_HEX.teal }}
            >
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: ACCENT_TEXT_HEX.teal }}>
                El pato sugiere
              </p>
              <p className="mt-2 font-display text-xl font-black uppercase">
                {suggestion.pkg.nameEs}
                <span className="ml-2 font-data-mono text-sm font-normal text-white/70">
                  {formatCurrency(suggestion.price, 'COP')}
                  {suggestion.monthly ? '/mes' : ''}
                </span>
              </p>
              <p className="mt-1 text-sm text-[color:var(--imi-textMuted)]">
                {suggestion.pkg.descriptionEs}
              </p>
              <ul className="mt-3 grid gap-1 text-xs text-white/70 sm:grid-cols-2">
                {suggestion.pkg.perksEs.map((perk) => (
                  <li key={perk}>· {perk}</li>
                ))}
              </ul>
            </aside>
          )}

          <StepNav onBack={store.prevStep} onNext={advance} nextLabel="Me interesa" />
        </>
      )}

      {/* ── Paso 6: contacto → lead ── */}
      {store.step === 6 && (
        <form onSubmit={submitLead} className="mt-6 grid max-w-md gap-4">
          <p className="text-sm text-[color:var(--imi-textMuted)]">{CITY_COPY.leadClose}</p>
          {[
            { id: 'name', label: 'Nombre', type: 'text', required: true, auto: 'name' },
            { id: 'email', label: 'Correo', type: 'email', required: true, auto: 'email' },
            { id: 'phone', label: 'WhatsApp (opcional)', type: 'tel', required: false, auto: 'tel' },
          ].map((f) => (
            <label key={f.id} className="grid gap-1 text-xs uppercase tracking-[0.15em] text-[color:var(--imi-textMuted)]">
              {f.label}
              <input
                type={f.type}
                required={f.required}
                autoComplete={f.auto}
                value={contact[f.id as keyof typeof contact]}
                onChange={(e) => setContact((c) => ({ ...c, [f.id]: e.target.value }))}
                className="rounded-sm border border-white/15 bg-black px-3 py-2 text-base normal-case tracking-normal text-white outline-none focus:border-white/50"
              />
            </label>
          ))}
          {submitState === 'error' && (
            <p role="alert" className="text-sm" style={{ color: 'var(--lqs-orange)' }}>
              Algo falló. Intenta de nuevo o escríbenos por WhatsApp.
            </p>
          )}
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              onClick={store.prevStep}
              className="text-xs uppercase tracking-[0.15em] text-white/50 hover:text-white"
            >
              ← Atrás
            </button>
            <button
              type="submit"
              disabled={submitState === 'sending'}
              className="rounded-sm px-5 py-2.5 font-display text-sm font-black uppercase tracking-wide text-black transition-opacity disabled:opacity-50"
              style={{ background: 'var(--lqs-orange)' }}
            >
              {submitState === 'sending' ? 'Enviando…' : 'Armar mi propuesta'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

function StepNav({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = 'Siguiente',
}: {
  onBack: () => void
  onNext?: () => void
  nextDisabled?: boolean
  nextLabel?: string
}) {
  return (
    <div className="mt-8 flex items-center gap-4">
      <button
        type="button"
        onClick={onBack}
        className="text-xs uppercase tracking-[0.15em] text-white/50 hover:text-white"
      >
        ← Atrás
      </button>
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="rounded-sm px-5 py-2.5 font-display text-sm font-black uppercase tracking-wide text-black transition-opacity disabled:opacity-40"
          style={{ background: 'var(--lqs-orange)' }}
        >
          {nextLabel}
        </button>
      )}
    </div>
  )
}

export default AyuntamientoFlow
