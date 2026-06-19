import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const LeadSchema = z.object({
  name:          z.string().optional(),
  email:         z.string().email().optional(),
  phone:         z.string().optional(),
  clientType:    z.string(),
  message:       z.string().optional(),
  services:      z.array(z.object({ id: z.string(), name: z.string(), price: z.number(), quantity: z.number().default(1) })).optional(),
  totalEstimate: z.number().optional(),
  urgencyDays:   z.number().optional(),
  currency:      z.enum(['COP', 'USD']).default('COP'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = LeadSchema.parse(body)
    const leadId = `LQS-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    const response = NextResponse.json({ success: true, leadId, message: 'Solicitud recibida.' }, { status: 200 })

    processLeadAsync(leadId, data).catch((err) => console.error('Lead async error:', err))

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Datos inválidos', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}

async function processLeadAsync(leadId: string, data: any) {
  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma')
      await (prisma as any).lead.create({
        data: {
          id: leadId, name: data.name, email: data.email, phone: data.phone,
          clientType: data.clientType, message: data.message,
          totalEstimate: data.totalEstimate, currency: data.currency, status: 'new' as any,
        },
      })
    }
    if (data.email && process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from:    'LQS — Lo Que Sea <noreply@lqs.studio>',
        to:      data.email,
        subject: `LQS — Recibimos tu solicitud ${leadId}`,
        html: `
          <div style="background:#000;color:#fff;font-family:sans-serif;padding:40px 20px;max-width:600px;margin:0 auto;">
            <h1 style="font-size:48px;letter-spacing:4px;color:#FF4600;margin-bottom:4px;">LQS.</h1>
            <p style="color:#A0A0A0;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:32px;">Lo Que Sea — Agencia Creativa</p>
            <h2>¡Hola ${data.name || 'ahí'}! 👋</h2>
            <p style="color:#A0A0A0;line-height:1.6;">Recibimos tu solicitud. Te contactaremos en menos de 24 horas.</p>
            <div style="margin:24px 0;padding:16px;border:1px solid #008080;border-radius:4px;background:rgba(0,128,128,0.05);">
              <p style="color:#008080;margin:0;">💬 ¿Necesitas respuesta inmediata? <a href="https://wa.me/573247680413" style="color:#008080;font-weight:bold;">+57 324 768 0413</a></p>
            </div>
            <p style="color:#444;font-size:11px;margin-top:32px;">Ref: ${leadId}</p>
          </div>`,
      })
    }
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from:    'LQS Sistema <noreply@lqs.studio>',
        to:      process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'loqueseaproductionsp1@gmail.com',
        subject: `🦆 Nuevo lead — ${leadId} — ${data.clientType}`,
        html: `<div style="background:#000;color:#fff;font-family:monospace;padding:20px;"><h2 style="color:#FF4600;">NUEVO LEAD — ${leadId}</h2><pre style="background:#0A0A0A;padding:16px;border:1px solid #262626;overflow:auto;">${JSON.stringify(data, null, 2)}</pre></div>`,
      })
    }
    console.log(`Lead ${leadId} procesado`)
  } catch (error) {
    console.error(`Error procesando lead ${leadId}:`, error)
  }
}
