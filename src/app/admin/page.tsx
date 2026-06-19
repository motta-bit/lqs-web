import Link from 'next/link'

const ACTIONS = [
  { label: 'Ver leads',        href: '/admin/leads'     },
  { label: 'Agregar servicio', href: '/admin/servicios' },
  { label: 'Nuevo proyecto',   href: '/admin/portfolio' },
  { label: 'Cambiar tema',     href: '/admin/temas'     },
]

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="font-authority text-4xl tracking-wider mb-2" style={{ color: 'var(--imi-textPrimary)' }}>DASHBOARD</h1>
      <p className="font-mono-data text-xs mb-8" style={{ color: 'var(--imi-textMuted)' }}>Panel de control — LQS Platform</p>
      <div className="p-6 border rounded-sm" style={{ borderColor: 'var(--imi-gridBorder)', background: 'var(--imi-cardBg)' }}>
        <h2 className="font-authority text-2xl tracking-wider mb-4" style={{ color: 'var(--imi-textPrimary)' }}>ACCIONES RÁPIDAS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="px-4 py-3 border rounded-sm font-mono-data text-xs tracking-wider text-center transition-all hover:border-[var(--imi-accentOrange)] hover:text-[var(--imi-accentOrange)]"
              style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
