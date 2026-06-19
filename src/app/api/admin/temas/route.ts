import { NextResponse } from 'next/server'
import { ecGet, ecSet } from '@/lib/edge-store'

export async function GET() {
  const theme = await ecGet<string>('theme', 'default')
  return NextResponse.json({ theme })
}

export async function POST(req: Request) {
  const { theme } = await req.json()
  const result    = await ecSet('theme', theme)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json({ theme })
}
