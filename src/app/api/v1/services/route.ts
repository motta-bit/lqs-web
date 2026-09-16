import { NextResponse } from 'next/server'

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma')
      // Ordena por distrito y luego por antigüedad. El campo `order` no existe
      // en el modelo Service — ordenar por él lanzaba en runtime con la BD
      // conectada.
      const services = await (prisma as any).service.findMany({
        where: { isActive: true },
        orderBy: [{ district: 'asc' }, { createdAt: 'asc' }],
      })
      return NextResponse.json({ success: true, services })
    }
    return NextResponse.json({ success: true, services: [] })
  } catch {
    return NextResponse.json({ success: false, error: 'Error obteniendo servicios' }, { status: 500 })
  }
}
