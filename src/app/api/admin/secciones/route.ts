import { NextRequest, NextResponse } from 'next/server'
import { ecGet, ecSet }             from '@/lib/edge-store'
import type { SectionesMap }        from '@/lib/edge-store'

const DEFAULTS: SectionesMap = {
  muestras_empresas: { visible: true,  titulo: 'Nuestro trabajo', subtitulo: 'Casos reales para empresas',       archivos: [] },
  portafolio_media:  { visible: true,  titulo: 'Portafolio',      subtitulo: 'Proyectos destacados',             archivos: [] },
  hero_media:        { visible: false, titulo: 'Hero',            subtitulo: 'Imagen o video de fondo del hero', archivos: [] },
}

export async function GET() {
  const saved = await ecGet<SectionesMap>('secciones', {})
  return NextResponse.json({ ...DEFAULTS, ...saved })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const current = await ecGet<SectionesMap>('secciones', {})
  const next    = { ...current, ...body }
  await ecSet('secciones', next)
  return NextResponse.json(next)
}
