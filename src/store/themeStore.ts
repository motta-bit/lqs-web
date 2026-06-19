import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SeasonalTheme } from '@/types'
import { getActiveThemeByDate } from '@/lib/theme-engine'

interface ThemeStore {
  activeTheme:  SeasonalTheme
  setTheme:     (theme: SeasonalTheme) => void
  resetToAuto:  () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      activeTheme:  'default',
      setTheme:     (activeTheme) => set({ activeTheme }),
      resetToAuto:  () => set({ activeTheme: getActiveThemeByDate() }),
    }),
    { name: 'lqs-theme' }
  )
)
