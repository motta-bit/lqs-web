import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { calculateQuote }            from '@/lib/quote-engine'

const QuoteSchema = z.object({
  services:    z.array(z.object({ id: z.string(), name: z.string(), basePrice: z.number(), category: z.string().optional() })),
  urgencyDays: z.number().min(1).max(90).default(15),
  clientType:  z.string().default('brand'),
  currency:    z.enum(['COP', 'USD']).default('COP'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = QuoteSchema.parse(body)
    const services = data.services.map((s) => ({
      id: s.id, slug: s.id, name: s.name, nameEn: s.name,
      category: (s.category || 'MEDIA') as string,
      basePrice: s.basePrice, unitType: 'unidad',
      description: '', descriptionEn: '',
      isActive: true, order: 0, createdAt: new Date(),
    }))
    const result = calculateQuote({ services, urgencyDays: data.urgencyDays, clientType: data.clientType, currency: data.currency })
    return NextResponse.json({ success: true, quote: result })
  } catch {
    return NextResponse.json({ success: false, error: 'Error calculando cotización' }, { status: 500 })
  }
}
