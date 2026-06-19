'use client'

import { useThemeStore } from '@/store/themeStore'
import { THEME_LABELS } from '@/lib/theme-engine'
import clsx from 'clsx'

const THEME_EMOJI: Record<string, string> = {
  default:   '⚡',
  halloween: '🎃',
  winter:    '❄️',
}

interface SeasonalBadgeProps {
  lang?:      'es' | 'en'
  className?: string
  showDot?:   boolean
}

export default function SeasonalBadge({
  lang      = 'es',
  className,
  showDot   = true,
}: SeasonalBadgeProps) {
  const { activeTheme } = useThemeStore()
  const emoji = THEME_EMOJI[activeTheme]
  const label = THEME_LABELS[activeTheme][lang]

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1',
        'border border-[--theme-secondary]/30 bg-[--theme-secondary]/5',
        'font-data-mono text-xs tracking-widest uppercase',
        className
      )}
      style={{ color: 'var(--theme-secondary)' }}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: 'var(--theme-secondary)' }}
        />
      )}
      <span>{emoji}</span>
      <span>{label}</span>
    </div>
  )
}
