import { put }          from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { ecGet, ecSet } from '@/lib/edge-store'
import type { ArchivoItem } from '@/lib/edge-store'

export async function POST(req: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN no configurado' }, { status: 503 })

  try {
    const form  = await req.formData()
    const file  = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Sin archivo' }, { status: 400 })

    const mime = file.type
    const tipo: ArchivoItem['tipo'] =
      mime.startsWith('image/') ? 'image' :
      mime === 'application/pdf' ? 'pdf'  : 'otro'

    const blob = await put(`lqs/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    const item: ArchivoItem = {
      id:          `arch-${Date.now()}`,
      nombre:      file.name,
      url:         blob.url,
      tipo,
      mime,
      tamaño:      file.size,
      seccion:     (form.get('seccion') as string) || 'general',
      orden:       0,
      titulo:      (form.get('titulo') as string) || file.name.replace(/\.[^.]+$/, ''),
      descripcion: (form.get('descripcion') as string) || '',
      subidoEn:    new Date().toISOString(),
    }

    const existing = await ecGet<ArchivoItem[]>('archivos', [])
    await ecSet('archivos', [item, ...existing])

    return NextResponse.json(item)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
