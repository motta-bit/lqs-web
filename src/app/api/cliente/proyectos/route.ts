import { NextRequest, NextResponse } from 'next/server'
import { getServerSession }         from 'next-auth'
import { authOptions }              from '@/lib/auth'

export interface Etapa {
  id: string
  nombre: string
  estado: 'pendiente' | 'activo' | 'listo'
  fecha?: string
}

export interface ProyectoCliente {
  id: string
  clienteId: string
  clienteEmail: string
  nombre: string
  descripcion: string
  servicio: string
  estado: 'cotizacion' | 'en_progreso' | 'revision' | 'completado' | 'pausado'
  progreso: number
  inicio: string
  entregaEstimada: string
  etapas: Etapa[]
  notas?: string
  archivoUrls?: string[]
}

async function getProyectos(clienteEmail: string): Promise<ProyectoCliente[]> {
  try {
    const { get } = await import('@vercel/edge-config')
    const todos = (await get<ProyectoCliente[]>('proyectos_web')) ?? []
    return todos.filter(p => p.clienteEmail === clienteEmail)
  } catch { return [] }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const role = (session.user as any).role
  if (role !== 'CLIENT') {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  }

  const proyectos = await getProyectos(session.user.email)
  return NextResponse.json(proyectos)
}
