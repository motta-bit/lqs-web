'use client'

import { useState }                          from 'react'
import { CTAButton }                         from '@/components/ui/CTAButton'
import { THEME_LABELS, THEME_VARIABLES }     from '@/lib/theme-engine'
import type { SeasonalTheme }                from '@/types'

const THEMES: SeasonalTheme[] = ['default', 'halloween', 'winter']

export default function AdminTemasPage() {
  const [previewTheme, setPreviewTheme] = useState<SeasonalTheme>('default')
  const [activeTheme,  setActiveTheme]  = useState<SeasonalTheme>('default')

  const applyPreview = (theme: SeasonalTheme) => {
    setPreviewTheme(theme)
    document.documentElement.setAttribute('data-theme', theme)
  }

  const activateTheme = (theme: SeasonalTheme) => {
    setActiveTheme(theme)
    document.documentElement.setAttribute('data-theme', theme)
    alert(`Tema "${THEME_LABELS[theme].es}" activado`)
  }

  return (
    <div className="p-8">
      <h1 className="font-authority text-4xl tracking-wider mb-2" style={{ color: 'var(--imi-textPrimary)' }}>TEMAS ESTACIONALES</h1>
      <p className="font-mono-data text-xs mb-8" style={{ color: 'var(--imi-textMuted)' }}>Previsualiza y activa temas en tiempo real.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {THEMES.map((theme) => {
          const vars     = THEME_VARIABLES[theme]
          const isActive = activeTheme === theme
          return (
            <div
              key={theme}
              className="border rounded-sm overflow-hidden"
              style={{
                borderColor: isActive ? 'var(--imi-accentOrange)' : 'var(--imi-gridBorder)',
                boxShadow:   isActive ? '0 0 20px rgba(255,70,0,0.2)' : 'none',
              }}
            >
              <div className="h-32 p-4 flex flex-col justify-between" style={{ background: vars['--theme-bg'] }}>
                <div className="flex gap-1.5">
                  {(['--theme-accent', '--theme-secondary'] as const).map((v) => (
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
                    <span className="font-mono-data text-[10px] px-2 py-0.5 rounded" style={{ background: 'var(--imi-accentOrange)', color: '#000' }}>
                      ACTIVO
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => applyPreview(theme)}
                    className="flex-1 py-2 border rounded-sm font-mono-data text-xs transition-all"
                    style={{
                      borderColor: previewTheme === theme ? 'var(--imi-securityTeal)' : 'var(--imi-gridBorder)',
                      color:       previewTheme === theme ? 'var(--imi-securityTeal)' : 'var(--imi-textMuted)',
                    }}
                  >
                    Previsualizar
                  </button>
                  <CTAButton
                    size="sm"
                    variant={isActive ? 'secondary' : 'primary'}
                    onClick={() => activateTheme(theme)}
                    className="flex-1"
                  >
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
