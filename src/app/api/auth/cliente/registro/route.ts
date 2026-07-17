import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import type { ClienteUser } from '@/lib/auth'

const EDGE_CONFIG_ID  = process.env.EDGE_CONFIG?.split('/').pop() ?? process.env.EDGE_CONFIG_ID ?? 'ecfg_byouald8tvzfpwjhclkcpcoafgkz'
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN ?? ''

async function readClientes(): Promise<ClienteUser[]> {
  try {
    const { get } = await import('@vercel/edge-config')
    return (await get<ClienteUser[]>('clientes_web')) ?? []
  } catch { return [] }
}

async function writeClientes(clientes: ClienteUser[]) {
  const url = `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${VERCEL_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ operation: 'upsert', key: 'clientes_web', value: clientes }] }),
  })
  if (!res.ok) throw new Error(`Edge Config write failed: ${res.status}`)
}

export async function POST(req: NextRequest) {
  try {
    const { email, nombre, empresa, password } = await req.json() as {
      email: string; nombre: string; empresa?: string; password: string
    }

    if (!email || !nombre || !password) {
      return NextResponse.json({ error: 'Campos requeridos: email, nombre, password' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 })
    }

    const clientes = await readClientes()
    if (clientes.some(c => c.email === email)) {
      return NextResponse.json({ error: 'Este correo ya está registrado' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const newCliente: ClienteUser = {
      id:           `cli_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      email:        email.toLowerCase().trim(),
      nombre:       nombre.trim(),
      empresa:      empresa?.trim(),
      passwordHash,
      createdAt:    new Date().toISOString(),
      active:       true,
    }

    await writeClientes([...clientes, newCliente])

    return NextResponse.json({ ok: true, message: 'Cuenta creada exitosamente' })
  } catch (err: unknown) {
    console.error('Registro error:', err)
    const msg = err instanceof Error ? err.message : 'Error al crear cuenta'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
