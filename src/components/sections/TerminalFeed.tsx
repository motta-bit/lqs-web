'use client'

import { useEffect, useState } from 'react'
import { useScrollReveal } from '@/hooks/useScrollAnimation'

const FEED_ITEMS = [
  { type: 'lead',    msg: 'Nuevo lead recibido — Branding corporativo',          location: 'Medellín, CO',   time: 'hace 2 min'  },
  { type: 'project', msg: 'Proyecto completado — Vita Nova Colombia',             location: 'Bogotá, CO',     time: 'hace 15 min' },
  { type: 'service', msg: 'Sesión iniciada — Producción audiovisual',             location: 'Remoto',         time: 'hace 23 min' },
  { type: 'alert',   msg: 'Entrega aprobada — Identidad visual Paz Space',        location: 'Medellín, CO',   time: 'hace 1 hr'   },
  { type: 'lead',    msg: 'Cotización solicitada — Desarrollo web Next.js',       location: 'Cali, CO',       time: 'hace 1 hr'   },
  { type: 'project', msg: 'Fase 2 iniciada — Casa RAÍZ branding',                location: 'Medellín, CO',   time: 'hace 2 hr'   },
  { type: 'service', msg: 'Reels entregados — 8 piezas para cliente',             location: 'Remoto',         time: 'hace 3 hr'   },
  { type: 'alert',   msg: 'Evento coordinado exitosamente — 200 asistentes',      location: 'Medellín, CO',   time: 'hace 5 hr'   },
  { type: 'lead',    msg: 'Nuevo cliente — Startup fintech requiere identidad',   location: 'Bogotá, CO',     time: 'hace 6 hr'   },
  { type: 'project', msg: 'Landing page lanzada — Paz Space studio',              location: 'Medellín, CO',   time: 'hace 8 hr'   },
]

const TYPE_CONFIG = {
  lead:    { color: 'var(--imi-accentOrange)',   icon: '◆', label: 'LEAD'     },
  project: { color: 'var(--imi-securityTeal)',   icon: '●', label: 'PROYECTO' },
  service: { color: 'var(--imi-innovationBlue)', icon: '■', label: 'SERVICIO' },
  alert:   { color: '#FFD700',                   icon: '▲', label: 'ENTREGA'  },
}

export function TerminalFeed() {
  const [visibleItems, setVisibleItems] = useState(FEED_ITEMS.slice(0, 4))
  const [tick,         setTick]         = useState(0)
  const sectionRef = useScrollReveal()

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
      setVisibleItems(prev => {
        const nextIdx = (FEED_ITEMS.indexOf(prev[prev.length - 1]) + 1) % FEED_ITEMS.length
        return [...prev.slice(1), FEED_ITEMS[nextIdx]]
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-36 px-6 relative overflow-hidden"
      style={{ background: 'var(--imi-bgAbsolute)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Texto */}
          <div data-reveal>
            <p className="font-mono-data text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--imi-accentOrange)' }}>
              ◆ Actividad en tiempo real
            </p>
            <h2 className="font-authority text-5xl md:text-7xl leading-none mb-6" style={{ color: 'var(--imi-textPrimary)' }}>
              SIEMPRE<br />
              <span style={{ color: 'var(--imi-securityTeal)' }}>EN MOVIMIENTO.</span>
            </h2>
            <p className="font-readability text-base leading-relaxed max-w-md" style={{ color: 'var(--imi-textMuted)' }}>
              Proyectos en curso, entregas completadas, clientes nuevos.
              Así se ve un equipo que hace lo que sea.
            </p>
          </div>

          {/* Terminal */}
          <div data-reveal>
            <div className="rounded-sm border overflow-hidden" style={{ borderColor: 'var(--imi-gridBorder)', background: 'var(--imi-cardBg)' }}>

              {/* Header terminal */}
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--imi-gridBorder)' }}>
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 opacity-60" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-60" />
                  <span className="w-3 h-3 rounded-full bg-green-500 opacity-60" />
                </div>
                <span className="font-mono-data text-xs ml-2" style={{ color: 'var(--imi-textMuted)' }}>
                  lqs-activity.log
                </span>
                <span className="ml-auto font-mono-data text-xs animate-terminal-blink" style={{ color: 'var(--imi-securityTeal)' }}>
                  ●
                </span>
              </div>

              {/* Items */}
              <div className="p-4 space-y-3 min-h-[280px]">
                {visibleItems.map((item, i) => {
                  const config = TYPE_CONFIG[item.type as keyof typeof TYPE_CONFIG]
                  return (
                    <div
                      key={`${tick}-${i}`}
                      className="flex items-start gap-3 p-3 rounded border transition-all duration-500"
                      style={{
                        borderColor: 'var(--imi-gridBorder)',
                        background:  i === visibleItems.length - 1 ? 'rgba(255,70,0,0.05)' : 'transparent',
                        animation:   i === visibleItems.length - 1 ? 'fadeIn 0.5s ease-out' : 'none',
                      }}
                    >
                      <span className="font-mono-data text-sm mt-0.5 flex-shrink-0" style={{ color: config.color }}>
                        {config.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="font-mono-data text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded"
                            style={{ color: config.color, background: `${config.color}15` }}
                          >
                            {config.label}
                          </span>
                          <span className="font-mono-data text-[10px]" style={{ color: 'var(--imi-textMuted)' }}>
                            {item.time}
                          </span>
                        </div>
                        <p className="font-readability text-sm truncate" style={{ color: 'var(--imi-textPrimary)' }}>
                          {item.msg}
                        </p>
                        <p className="font-mono-data text-[10px] mt-1" style={{ color: 'var(--imi-textMuted)' }}>
                          📍 {item.location}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
