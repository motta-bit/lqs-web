'use client'

import { useState, useEffect } from 'react'
import { CTAButton }               from '@/components/ui/CTAButton'
import { THEME_LABELS, THEME_VARIABLES } from '@/lib/theme-engine'
import type { SeasonalTheme }          from '@/types'

const THEMES: SeasonalTheme[] = ['default', 'halloween', 'winter']

export default function AdminTemasPage() {
  const [active,  setActive]  = useState<SeasonalTheme>('default')
  const [preview, setPreview] = useState<SeasonalTheme>('default')
  const [saving,  setSaving]  = useState(false)
  const [status,  setStatus]  = useState('')

  useEffect(() => {
    fetch('/api/admin/temas').then(r => r.json()).then(d => {
      setActive(d.theme ?? 'default')
      setPreview(d.theme ?? 'default')
      document.documentElement.setAttribute('data-theme', d.theme ?? 'default')
    })
  }, [])

  const applyPreview = (t: SeasonalTheme) => {
    setPreview(t)
    document.documentElement.setAttribute('data-theme', t)
  }

  const activateTheme = async (t: SeasonalTheme) => {
    setSaving(true)
    const res = await fetch('/api/admin/temas', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: t }),
    })
    if (res.ok) {
      setActive(t)
      setStatus(`✓ Tema "${THEME_LABELS[t].es}" activado en el sitio`)
      setTimeout(() => setStatus(''), 3000)
    } else {
      setStatus('✕ Error al guardar')
    }
    setSaving(false)
  }

  return (
    <div className="p-8">
      <h1 className="font-authority text-4xl tracking-wider mb-1" style={{ color: 'var(--imi-textPrimary)' }}>TEMAS ESTACIONALES</h1>
      <p className="font-mono-data text-xs mb-8" style={{ color: 'var(--imi-textMuted)' }}>
        Tema activo en el sitio: <span style={{ color: 'var(--imi-accentOrange)' }}>{THEME_LABELS[active]?.es}</span>
      </p>

      {status && (
        <div className="mb-6 px-4 py-3 border rounded-sm font-mono-data text-xs"
          style={{ borderColor: 'var(--imi-securityTeal)', color: 'var(--imi-securityTeal)', background: 'rgba(0,200,150,0.05)' }}>
          {status}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {THEMES.map(theme => {
          const vars     = THEME_VARIABLES[theme]
          const isActive = active === theme
          return (
            <div key={theme} className="border rounded-sm overflow-hidden" style={{
              borderColor: isActive ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)',
              boxShadow:   isActive ? '0 0 20px rgba(255,70,0,0.2)' : 'none',
            }}>
              <div className="h-32 p-4 flex flex-col justify-between" style={{ background: vars['--theme-bg'] }}>
                <div className="flex gap-1.5">
                  {(['--theme-accent', '--theme-secondary'] as const).map(v => (
                    <div key={v} className="w-4 h-4 rounded-full" style={{ background: vars[v] }} />
                  ))}
                </div>
                <p className="font-authority text-2xl tracking-wider" style={{ color: '#ffffff' }}>LQS.</p>
              </div>
              <div className="p-5" style={{ background: 'var(--imi-cardBg)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-authority text-xl tracking-wider" style={{ color: 'var(--imi-textPrimary)' }}>
                    {THEME_LABELS[theme].es}
                  </h3>
                  {isActive && (
                    <span className="font-mono-data text-[10px] px-2 py-0.5 rounded" style={{ background: 'var(--imi-accentOrange)', color: '#000' }}>ACTIVO</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => applyPreview(theme)}
                    className="flex-1 py-2 border rounded-sm font-mono-data text-xs transition-all"
                    style={{
                      borderColor: preview === theme ? 'var(--imi-securityTeal)' : 'var(--imi-gridBorder)',
                      color:       preview === theme ? 'var(--imi-securityTeal)' : 'var(--imi-textMuted)',
                    }}>
                    Previsualizar
                  </button>
                  <CTAButton size="sm" variant={isActive ? 'secondary' : 'primary'}
                    onClick={() => activateTheme(theme)} isLoading={saving} className="flex-1">
                    {isActive ? 'Activo' : 'Activar'}
                  </CTAButton>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
