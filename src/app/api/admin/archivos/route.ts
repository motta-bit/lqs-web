import { del }          from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { ecGet, ecSet } from '@/lib/edge-store'
import type { ArchivoItem } from '@/lib/edge-store'

export async function GET() {
  const items = await ecGet<ArchivoItem[]>('archivos', [])
  return NextResponse.json(items)
}

export async function PUT(req: NextRequest) {
  const item: ArchivoItem = await req.json()
  const existing = await ecGet<ArchivoItem[]>('archivos', [])
  const updated  = existing.map(a => a.id === item.id ? item : a)
  await ecSet('archivos', updated)
  return NextResponse.json(item)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const existing = await ecGet<ArchivoItem[]>('archivos', [])
  const target   = existing.find(a => a.id === id)
  if (target) {
    try { await del(target.url) } catch {}
  }
  await ecSet('archivos', existing.filter(a => a.id !== id))

  // También eliminar de secciones
  const secciones = await ecGet<Record<string, any>>('secciones', {})
  for (const k of Object.keys(secciones)) {
    if (Array.isArray(secciones[k]?.archivos))
      secciones[k].archivos = secciones[k].archivos.filter((fid: string) => fid !== id)
  }
  await ecSet('secciones', secciones)

  return NextResponse.json({ ok: true })
}
