'use client'

import { useEffect, useState } from 'react'

export function Preloader() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const visited = localStorage.getItem('lqs-visited')
    if (visited) return

    setVisible(true)

    const steps = [20, 45, 70, 90, 100]
    let i = 0
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setVisible(false)
          localStorage.setItem('lqs-visited', '1')
        }, 400)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--imi-bgAbsolute)' }}
    >
      <div className="font-authority text-4xl tracking-[0.3em] text-white mb-8">
        LQS
      </div>

      <div className="w-48 h-px bg-white/10 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-[--theme-accent] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className="font-data-mono text-xs mt-4 tracking-[0.2em]"
        style={{ color: 'var(--imi-textMuted)' }}
      >
        {progress}%
      </div>
    </div>
  )
}

export default Preloader
