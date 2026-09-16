import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Whispers — mensajes de visitantes (informe §A, Bruno Simon).
 *
 * GET: solo los aprobados, los 30 más recientes. El límite de 30 es del
 *      informe: suficiente para sentirse habitado, poco para no ser ruido.
 * POST: crea SIEMPRE sin aprobar (isApproved=false). La moderación es
 *      manual desde el admin; nada llega a pantalla sin pasar por ahí.
 *
 * Sin BD configurada devuelve vacío/acepta en silencio: la ciudad no debe
 * romperse por una feature social opcional.
 */

const WhisperSchema = z.object({
  // Corto a propósito: un susurro, no un comentario.
  text: z.string().trim().min(2).max(140),
})

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json({ success: true, whispers: [] })
    const { prisma } = await import('@/lib/prisma')
    const whispers = await prisma.whisper.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: { id: true, text: true },
    })
    return NextResponse.json({ success: true, whispers })
  } catch {
    return NextResponse.json({ success: true, whispers: [] })
  }
}

export async function POST(req: NextRequest) {
  // Validación y persistencia por separado: un fallo de BD no es un 400.
  // (Con un solo try/catch, la BD caída se reportaba como "susurro inválido".)
  let text: string
  try {
    ;({ text } = WhisperSchema.parse(await req.json()))
  } catch {
    return NextResponse.json({ success: false, error: 'Susurro inválido' }, { status: 400 })
  }

  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma')
      await prisma.whisper.create({ data: { text } })
    }
    // 202: recibido, pendiente de moderación. No se publica nada aún.
    return NextResponse.json({ success: true, pending: true }, { status: 202 })
  } catch {
    return NextResponse.json({ success: false, error: 'No se pudo guardar' }, { status: 503 })
  }
}
