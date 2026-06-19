'use client'

import { useState }        from 'react'
import { useScrollReveal } from '@/hooks/useScrollAnimation'
import { CTAButton }       from '@/components/ui/CTAButton'
import { WhatsAppButton }  from '@/components/ui/WhatsAppButton'

const FAQS = [
  {
    q: '¿Cuánto tarda un proyecto?',
    a: 'Depende del alcance. Branding: 2-4 semanas. Web: 4-8 semanas. Video: 1-3 semanas. El cotizador te muestra el estimado según tu urgencia.',
  },
  {
    q: '¿Trabajan con clientes fuera de Colombia?',
    a: 'Sí. Trabajamos con clientes en toda Latinoamérica, Estados Unidos y España. Todo el proceso puede ser 100% remoto.',
  },
  {
    q: '¿Cómo es el proceso de pago?',
    a: '50% al inicio del proyecto y 50% contra entrega. Para proyectos grandes acordamos hitos de pago.',
  },
  {
    q: '¿Hacen eventos completos?',
    a: 'Sí. Logística, escenografía, sonido, iluminación y cobertura audiovisual. Cada evento se cotiza de forma personalizada.',
  },
]

export function ContactBlock() {
  const [openFaq,      setOpenFaq]     = useState<number | null>(null)
  const [formData,     setFormData]    = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setSubmitting]  = useState(false)
  const [submitted,    setSubmitted]   = useState(false)
  const sectionRef = useScrollReveal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name, email: formData.email,
          message: formData.message, clientType: 'contact_form', currency: 'COP',
        }),
      })
      const data = await res.json()
      if (data.success) setSubmitted(true)
      else alert('Error al enviar. Intenta de nuevo.')
    } catch {
      alert('Error de conexión.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="contacto"
      className="py-36 px-6"
      style={{ background: 'var(--imi-bgAbsolute)' }}
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16" data-reveal>
          <p className="font-mono-data text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--imi-accentOrange)' }}>
            ◆ Hablemos
          </p>
          <h2 className="font-authority text-5xl md:text-7xl leading-none" style={{ color: 'var(--imi-textPrimary)' }}>
            ¿LISTO PARA<br />
            <span style={{ color: 'var(--imi-accentOrange)' }}>CREAR?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* FAQs + contacto directo */}
          <div data-reveal>
            <h3 className="font-authority text-2xl tracking-wider mb-8" style={{ color: 'var(--imi-textMuted)' }}>
              PREGUNTAS FRECUENTES
            </h3>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="border rounded-sm overflow-hidden" style={{ borderColor: 'var(--imi-gridBorder)' }}>
                  <button
                    className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors"
                    style={{
                      background: openFaq === i ? 'rgba(255,70,0,0.05)' : 'var(--imi-cardBg)',
                      color:      'var(--imi-textPrimary)',
                    }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-readability text-sm pr-4">{faq.q}</span>
                    <span
                      className="font-mono-data text-lg flex-shrink-0 transition-transform duration-300"
                      style={{ color: 'var(--imi-accentOrange)', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4" style={{ background: 'rgba(255,70,0,0.03)' }}>
                      <p className="font-readability text-sm leading-relaxed" style={{ color: 'var(--imi-textMuted)' }}>
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-4">
              <WhatsAppButton
                message="¡Hola LQS! Quiero hablar sobre un proyecto."
                floating={false}
                className="w-full"
                style={{
                  display:     'flex',
                  alignItems:  'center',
                  gap:         '1rem',
                  padding:     '1rem',
                  border:      '1px solid var(--imi-securityTeal)',
                  background:  'var(--imi-cardBg)',
                  color:       'var(--imi-textPrimary)',
                  borderRadius: '2px',
                  transition:  'transform 0.2s',
                }}
              >
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-authority tracking-wider text-sm" style={{ color: 'var(--imi-securityTeal)' }}>
                    WHATSAPP DIRECTO
                  </p>
                  <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>
                    +57 324 768 0413
                  </p>
                </div>
              </WhatsAppButton>

              <a
                href="mailto:loqueseaproductionsp1@gmail.com"
                className="flex items-center gap-4 p-4 border rounded-sm transition-all hover:scale-[1.02]"
                style={{ borderColor: 'var(--imi-gridBorder)', background: 'var(--imi-cardBg)', color: 'var(--imi-textPrimary)' }}
              >
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="font-authority tracking-wider text-sm" style={{ color: 'var(--imi-accentOrange)' }}>
                    CORREO
                  </p>
                  <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>
                    loqueseaproductionsp1@gmail.com
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Formulario */}
          <div data-reveal>
            <h3 className="font-authority text-2xl tracking-wider mb-8" style={{ color: 'var(--imi-textMuted)' }}>
              CUÉNTANOS TU PROYECTO
            </h3>

            {submitted ? (
              <div
                className="p-8 rounded-sm border text-center"
                style={{ borderColor: 'var(--imi-securityTeal)', background: 'rgba(0,128,128,0.05)' }}
              >
                <p className="font-authority text-4xl mb-4" style={{ color: 'var(--imi-securityTeal)' }}>
                  ¡RECIBIDO!
                </p>
                <p className="font-readability text-sm" style={{ color: 'var(--imi-textMuted)' }}>
                  Te contactaremos en menos de 24 horas. 🦆
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: 'name',  label: 'Nombre', type: 'text',  placeholder: 'Tu nombre o empresa', autoComplete: 'name'  },
                  { id: 'email', label: 'Correo', type: 'email', placeholder: 'tu@correo.com',        autoComplete: 'email' },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="font-mono-data text-xs tracking-widest uppercase mb-2 block"
                      style={{ color: 'var(--imi-textMuted)' }}
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={e => setFormData(p => ({ ...p, [field.id]: e.target.value }))}
                      required
                      autoComplete={field.autoComplete}
                      className="w-full px-4 py-3 rounded-sm border bg-transparent font-readability text-sm outline-none transition-colors focus:border-[var(--imi-accentOrange)]"
                      style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }}
                    />
                  </div>
                ))}

                <div>
                  <label htmlFor="message" className="font-mono-data text-xs tracking-widest uppercase mb-2 block" style={{ color: 'var(--imi-textMuted)' }}>
                    Tu proyecto
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Cuéntanos qué necesitas. Sin filtros."
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-sm border bg-transparent font-readability text-sm outline-none transition-colors focus:border-[var(--imi-accentOrange)] resize-none"
                    style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textPrimary)' }}
                  />
                </div>

                <CTAButton type="submit" size="lg" isLoading={isSubmitting} className="w-full">
                  Enviar mensaje
                </CTAButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
