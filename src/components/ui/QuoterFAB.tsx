'use client'

import { useEffect, useState } from 'react'
import { useQuoterStore } from '@/store/quoterStore'

export function QuoterFAB() {
  const { openPanel, isOpen } = useQuoterStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (isOpen) return null

  return (
    <button
      onClick={openPanel}
      aria-label="Abrir cotizador"
      className="fixed z-50 transition-all duration-300"
      style={{
        left: 0,
        top: '50%',
        transform: `translateY(-50%) translateX(${visible ? '0' : '-100%'})`,
        background: 'var(--imi-accentOrange)',
        color: '#000',
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        padding: '1rem 0.6rem',
        borderRadius: '0 6px 6px 0',
        fontFamily: 'var(--font-bebas), sans-serif',
        fontSize: '0.85rem',
        letterSpacing: '0.2em',
        boxShadow: '4px 0 20px rgba(255,70,0,0.4)',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
      }}
    >
      ◆ COTIZAR
    </button>
  )
}

export default QuoterFAB
