'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { getActiveThemeByDate, applyThemeToDOM } from '@/lib/theme-engine'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { activeTheme, setTheme } = useThemeStore()

  useEffect(() => {
    const detected = getActiveThemeByDate()
    setTheme(detected)
  }, [setTheme])

  useEffect(() => {
    applyThemeToDOM(activeTheme)
  }, [activeTheme])

  return <>{children}</>
}
