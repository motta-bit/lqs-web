'use client'

import Link            from 'next/link'
import { signOut }     from 'next-auth/react'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin',           label: 'Dashboard', icon: '◆'  },
  { href: '/admin/leads',     label: 'Leads',     icon: '📥' },
  { href: '/admin/servicios', label: 'Servicios', icon: '📦' },
  { href: '/admin/portfolio', label: 'Portfolio', icon: '🖼️' },
  { href: '/admin/archivos',  label: 'Archivos',  icon: '📂' },
  { href: '/admin/cotizador', label: 'Cotizador', icon: '🧮' },
  { href: '/admin/temas',     label: 'Temas',     icon: '🎨' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  if (pathname === '/admin/login') return null
  return (
    <aside
      className="w-56 min-h-screen flex flex-col border-r flex-shrink-0"
      style={{ borderColor: 'var(--imi-gridBorder)', background: 'var(--imi-cardBg)' }}
    >
      <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--imi-gridBorder)' }}>
        <Link href="/admin">
          <span className="font-authority text-xl tracking-widest" style={{ color: 'var(--imi-textPrimary)' }}>
            LQS<span style={{ color: 'var(--imi-accentOrange)' }}>.</span>
          </span>
          <p className="font-mono-data text-[10px] tracking-widest uppercase mt-0.5" style={{ color: 'var(--imi-textMuted)' }}>
            Admin Panel
          </p>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm font-mono-data text-xs tracking-wider transition-all"
            style={{
              background: pathname === item.href ? 'var(--imi-accentOrange)' : 'transparent',
              color:      pathname === item.href ? '#000' : 'var(--imi-textMuted)',
            }}
          >
            <span>{item.icon}</span>{item.label}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--imi-gridBorder)' }}>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 font-mono-data text-xs"
          style={{ color: 'var(--imi-textMuted)' }}
        >
          ← Ver sitio
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2 font-mono-data text-xs hover:text-red-400 transition-colors"
          style={{ color: 'var(--imi-textMuted)' }}
        >
          ✕ Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
