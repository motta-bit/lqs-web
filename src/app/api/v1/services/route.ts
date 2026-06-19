import { NextResponse } from 'next/server'

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma')
      const services = await (prisma as any).service.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } })
      return NextResponse.json({ success: true, services })
    }
    return NextResponse.json({ success: true, services: [] })
  } catch {
    return NextResponse.json({ success: false, error: 'Error obteniendo servicios' }, { status: 500 })
  }
}
