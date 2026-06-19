import { NextResponse } from 'next/server'
import { ecGet, ecSet, type PortfolioItem } from '@/lib/edge-store'
import { randomUUID } from 'crypto'

export async function GET() {
  const items = await ecGet<PortfolioItem[]>('portfolio', [])
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const body  = await req.json()
  const items = await ecGet<PortfolioItem[]>('portfolio', [])
  const item: PortfolioItem = { ...body, id: randomUUID() }
  const result = await ecSet('portfolio', [...items, item])
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json(item, { status: 201 })
}

export async function PUT(req: Request) {
  const body  = await req.json() as PortfolioItem
  const items = await ecGet<PortfolioItem[]>('portfolio', [])
  const updated = items.map((i) => (i.id === body.id ? body : i))
  const result  = await ecSet('portfolio', updated)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json(body)
}

export async function DELETE(req: Request) {
  const { id }  = await req.json()
  const items   = await ecGet<PortfolioItem[]>('portfolio', [])
  const filtered = items.filter((i) => i.id !== id)
  const result   = await ecSet('portfolio', filtered)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json({ ok: true })
}
