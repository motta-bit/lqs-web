'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter }           from 'next/navigation'
import Link                    from 'next/link'
import { DuckSVG }             from '@/components/ui/DuckIllustration'
import type { ProyectoCliente, Etapa } from '@/app/api/cliente/proyectos/route'

const ESTADO_CONFIG = {
  cotizacion:   { label: 'En cotización',   color: '#FFD700', bg: 'rgba(255,215,0,0.1)'  },
  en_progreso:  { label: 'En progreso',      color: '#00CC59', bg: 'rgba(0,204,89,0.1)'   },
  revision:     { label: 'En revisión',      color: '#0080FF', bg: 'rgba(0,128,255,0.1)'  },
  completado:   { label: 'Completado',       color: '#00FFAA', bg: 'rgba(0,255,170,0.1)'  },
  pausado:      { label: 'Pausado',          color: '#888',    bg: 'rgba(136,136,136,0.1)' },
}

function EtapaItem({ etapa, color }: { etapa: Etapa; color: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center mt-0.5"
        style={{
          background: etapa.estado === 'listo' ? color : etapa.estado === 'activo' ? `rgba(${hexToRgb(color)},0.15)` : '#111',
          border: `1px solid ${etapa.estado === 'pendiente' ? '#222' : color}`,
          borderRadius: '50%',
        }}>
        {etapa.estado === 'listo'  && <span style={{ color: '#000', fontSize: 12 }}>✓</span>}
        {etapa.estado === 'activo' && <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />}
        {etapa.estado === 'pendiente' && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#2a2a2a' }} />}
      </div>
      <div className="flex-1 pb-6 border-b border-[#111] last:border-0">
        <p className="font-mono-data text-sm"
          style={{ color: etapa.estado === 'pendiente' ? '#444' : etapa.estado === 'activo' ? '#fff' : color }}>
          {etapa.nombre}
        </p>
        {etapa.fecha && (
          <p className="font-mono-data text-xs mt-0.5" style={{ color: '#2a2a2a' }}>{etapa.fecha}</p>
        )}
      </div>
    </div>
  )
}

function hexToRgb(hex: string) {
  if (!hex.startsWith('#')) return '255,255,255'
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `${r},${g},${b}`
}

function ProyectoCard({ p }: { p: ProyectoCliente }) {
  const cfg = ESTADO_CONFIG[p.estado]
  const completedEtapas = p.etapas.filter(e => e.estado === 'listo').length

  return (
    <div className="border" style={{ background: '#080808', borderColor: '#1a1a1a' }}>
      {/* Header */}
      <div className="px-7 py-6 border-b" style={{ borderColor: '#111' }}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h3 className="font-authority text-2xl tracking-wider" style={{ color: '#fff' }}>
              {p.nombre}
            </h3>
            <p className="font-mono-data text-xs tracking-widest uppercase mt-1" style={{ color: '#444' }}>
              {p.servicio}
            </p>
          </div>
          <span className="font-mono-data text-xs tracking-widest uppercase px-3 py-1.5 flex-shrink-0"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid rgba(${hexToRgb(cfg.color)},0.25)` }}>
            {cfg.label}
          </span>
        </div>
        <p className="font-readability text-sm" style={{ color: '#666' }}>{p.descripcion}</p>
      </div>

      {/* Progress bar */}
      <div className="px-7 py-5 border-b" style={{ borderColor: '#111' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono-data text-xs tracking-widest uppercase" style={{ color: '#444' }}>
            Progreso
          </span>
          <span className="font-mono-data text-sm" style={{ color: cfg.color }}>{p.progreso}%</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: '#111' }}>
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${p.progreso}%`, background: cfg.color }} />
        </div>
        <div className="flex justify-between mt-3">
          <div>
            <p className="font-mono-data text-[10px] uppercase tracking-widest" style={{ color: '#2a2a2a' }}>Inicio</p>
            <p className="font-mono-data text-xs mt-0.5" style={{ color: '#555' }}>{p.inicio}</p>
          </div>
          <div className="text-right">
            <p className="font-mono-data text-[10px] uppercase tracking-widest" style={{ color: '#2a2a2a' }}>Entrega est.</p>
            <p className="font-mono-data text-xs mt-0.5" style={{ color: '#555' }}>{p.entregaEstimada}</p>
          </div>
        </div>
      </div>

      {/* Etapas */}
      {p.etapas.length > 0 && (
        <div className="px-7 py-5 border-b" style={{ borderColor: '#111' }}>
          <p className="font-mono-data text-xs tracking-widest uppercase mb-4"
            style={{ color: '#333' }}>
            Etapas · {completedEtapas}/{p.etapas.length} completadas
          </p>
          <div>
            {p.etapas.map(etapa => (
              <EtapaItem key={etapa.id} etapa={etapa} color={cfg.color} />
            ))}
          </div>
        </div>
      )}

      {/* Notas */}
      {p.notas && (
        <div className="px-7 py-5 border-b" style={{ borderColor: '#111' }}>
          <p className="font-mono-data text-xs tracking-widest uppercase mb-3" style={{ color: '#333' }}>
            Notas del equipo
          </p>
          <p className="font-readability text-sm leading-relaxed" style={{ color: '#666' }}>{p.notas}</p>
        </div>
      )}

      {/* Footer */}
      <div className="px-7 py-5 flex flex-wrap gap-3">
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573247680413'}?text=Hola%2C%20tengo%20una%20consulta%20sobre%20mi%20proyecto%20${encodeURIComponent(p.nombre)}`}
          target="_blank" rel="noopener"
          className="font-mono-data text-xs tracking-widest uppercase px-5 py-2.5 transition-all"
          style={{ background: 'rgba(0,204,89,0.1)', color: '#00CC59', border: '1px solid rgba(0,204,89,0.2)' }}>
          💬 Consultar al equipo
        </a>
      </div>
    </div>
  )
}

function EmptyState() {
  const WA_URL = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573247680413'}?text=Hola%2C%20acabo%20de%20registrarme%20y%20quiero%20empezar%20un%20proyecto`
  return (
    <div className="border text-center py-20 px-8" style={{ background: '#080808', borderColor: '#1a1a1a' }}>
      <div className="flex justify-center mb-6">
        <DuckSVG pose="sleeping" direction="right" size={100} />
      </div>
      <h3 className="font-authority text-3xl tracking-wider mb-3" style={{ color: '#fff' }}>
        Aún sin proyectos
      </h3>
      <p className="font-readability text-base mb-8 max-w-sm mx-auto" style={{ color: '#555' }}>
        Cuando un proyecto LQS esté asociado a tu cuenta, aparecerá aquí con su estado y detalles.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <a href={WA_URL} target="_blank" rel="noopener"
          className="px-7 py-3.5 font-mono-data text-sm tracking-widest uppercase"
          style={{ background: '#FF4600', color: '#000' }}>
          Empezar un proyecto →
        </a>
        <Link href="/planes"
          className="px-7 py-3.5 border font-mono-data text-sm tracking-widest uppercase transition-all hover:text-white"
          style={{ borderColor: '#222', color: '#555' }}>
          Ver planes
        </Link>
      </div>
    </div>
  )
}

export default function MiProyectoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [proyectos, setProyectos] = useState<ProyectoCliente[]>([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
      return
    }
    if (status === 'authenticated') {
      const role = (session.user as any)?.role
      if (role === 'ADMIN') { router.replace('/admin'); return }
      fetch('/api/cliente/proyectos')
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setProyectos(data) })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [status, session, router])

  if (status === 'loading' || loading) {
    return (
      <main className="section-compact min-h-screen flex items-center justify-center" style={{ background: '#000' }}>
        <div className="flex flex-col items-center gap-4">
          <DuckSVG pose="walking" direction="right" size={60} isMoving frame={Date.now()} />
          <p className="font-mono-data text-xs tracking-widest uppercase" style={{ color: '#333' }}>Cargando...</p>
        </div>
      </main>
    )
  }

  if (status === 'unauthenticated') return null

  return (
    <main className="section-compact min-h-screen px-6 py-24" style={{ background: '#000' }}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.08] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-mono-data text-xs tracking-widest uppercase mb-3" style={{ color: '#FF4600' }}>
              ◆ Portal de clientes
            </p>
            <h1 className="font-authority text-[clamp(2.5rem,7vw,5rem)] leading-none" style={{ color: '#fff' }}>
              MIS<br />PROYECTOS.
            </h1>
            <p className="font-readability text-sm mt-3" style={{ color: '#555' }}>
              Bienvenido, <span style={{ color: '#fff' }}>{session?.user?.name}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="font-mono-data text-xs tracking-widest uppercase px-4 py-2 border transition-all hover:text-white"
              style={{ borderColor: '#1a1a1a', color: '#444' }}>
              ← Sitio
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="font-mono-data text-xs tracking-widest uppercase px-4 py-2 transition-all hover:text-red-400"
              style={{ color: '#333', border: '1px solid #111' }}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Projects or empty state */}
        <div className="space-y-6">
          {proyectos.length === 0 ? (
            <EmptyState />
          ) : (
            proyectos.map(p => <ProyectoCard key={p.id} p={p} />)
          )}
        </div>

        {/* Footer note */}
        <p className="font-mono-data text-xs mt-10 text-center" style={{ color: '#1a1a1a' }}>
          LQS Studio · {session?.user?.email}
        </p>
      </div>
    </main>
  )
}
