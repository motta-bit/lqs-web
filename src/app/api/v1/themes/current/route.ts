import { NextResponse }         from 'next/server'
import { getActiveThemeByDate } from '@/lib/theme-engine'

export async function GET() {
  try {
    let theme = getActiveThemeByDate()
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma')
      const active = await (prisma as any).seasonalTheme?.findFirst({ where: { isActive: true } })
      if (active) theme = active.slug as any
    }
    return NextResponse.json({ success: true, theme })
  } catch {
    return NextResponse.json({ success: true, theme: getActiveThemeByDate() })
  }
}
