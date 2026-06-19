import { NextResponse } from 'next/server'

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma')
      const projects = await (prisma as any).portfolioProject.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } })
      return NextResponse.json({ success: true, projects })
    }
    return NextResponse.json({ success: true, projects: [] })
  } catch {
    return NextResponse.json({ success: false, error: 'Error obteniendo portfolio' }, { status: 500 })
  }
}
