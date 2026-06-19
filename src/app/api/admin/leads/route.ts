import { NextResponse } from 'next/server'
import { ecGet, ecSet, type Lead } from '@/lib/edge-store'
import { randomUUID } from 'crypto'

export async function GET() {
  const leads = await ecGet<Lead[]>('leads', [])
  return NextResponse.json(leads)
}

export async function POST(req: Request) {
  const body  = await req.json()
  const leads = await ecGet<Lead[]>('leads', [])
  const lead: Lead = {
    ...body,
    id:        `LQS-${Date.now()}`,
    status:    'NEW',
    notes:     '',
    createdAt: new Date().toISOString(),
  }
  const result = await ecSet('leads', [lead, ...leads])
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json(lead, { status: 201 })
}

export async function PUT(req: Request) {
  const body  = await req.json() as Lead
  const leads = await ecGet<Lead[]>('leads', [])
  const updated = leads.map((l) => (l.id === body.id ? body : l))
  const result  = await ecSet('leads', updated)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json(body)
}
