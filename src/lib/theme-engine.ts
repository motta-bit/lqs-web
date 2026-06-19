import type { SeasonalTheme } from '@/types'

export function getActiveThemeByDate(): SeasonalTheme {
  const month = new Date().getMonth() + 1 // 1–12
  if (month === 10 || month === 11) return 'halloween'
  if (month === 12 || month === 1)  return 'winter'
  return 'default'
}

export function applyThemeToDOM(theme: SeasonalTheme): void {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
}

export const THEME_LABELS: Record<SeasonalTheme, { es: string; en: string }> = {
  default:   { es: 'Por defecto', en: 'Default'   },
  halloween: { es: 'Halloween',   en: 'Halloween'  },
  winter:    { es: 'Invierno',    en: 'Winter'     },
}

export const THEME_VARIABLES: Record<SeasonalTheme, Record<string, string>> = {
  default: {
    '--theme-bg':        '#000000',
    '--theme-accent':    '#FF4600',
    '--theme-secondary': '#008080',
  },
  halloween: {
    '--theme-bg':        '#0B0500',
    '--theme-accent':    '#FF5A00',
    '--theme-secondary': '#8A2BE2',
  },
  winter: {
    '--theme-bg':        '#050B14',
    '--theme-accent':    '#00E5FF',
    '--theme-secondary': '#00FF88',
  },
}

export const THEME_COLORS: Record<SeasonalTheme, { bg: string; accent: string; secondary: string }> = {
  default:   { bg: '#000000', accent: '#FF4600', secondary: '#008080' },
  halloween: { bg: '#0B0500', accent: '#FF5A00', secondary: '#8A2BE2' },
  winter:    { bg: '#050B14', accent: '#00E5FF', secondary: '#00FF88' },
}
