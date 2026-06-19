'use client'

import { useEffect }       from 'react'
import { useQuoterStore }  from '@/store/quoterStore'
import { useIsMobile }     from '@/hooks/useMediaQuery'
import { QuoterStep }      from './QuoterStep'
import { QuoterEventFlow } from './QuoterEventFlow'

export function QuoterPanel() {
  const { isOpen, isEvent, step, totalSteps, closePanel } = useQuoterStore()
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) closePanel() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, closePanel])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" onClick={closePanel} />
      <div
        className={`fixed z-[70] flex flex-col ${
          isMobile
            ? 'bottom-0 left-0 right-0 max-h-[92vh] rounded-t-2xl animate-slide-in-bottom'
            : 'top-0 right-0 h-full w-full max-w-lg animate-slide-in-right'
        }`}
        style={{
          background: 'var(--imi-bgAbsolute)',
          borderLeft: isMobile ? 'none' : '1px solid var(--imi-gridBorder)',
          borderTop:  isMobile ? '1px solid var(--imi-gridBorder)' : 'none',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--imi-gridBorder)' }}
        >
          {isMobile && (
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
              style={{ background: 'var(--imi-gridBorder)' }}
            />
          )}
          <div className="mt-2 md:mt-0">
            <h2 className="font-authority text-2xl tracking-wider" style={{ color: 'var(--imi-textPrimary)' }}>
              COTIZADOR <span style={{ color: 'var(--imi-accentOrange)' }}>LQS</span>
            </h2>
            {!isEvent && (
              <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>
                Paso {step} de {totalSteps}
              </p>
            )}
          </div>
          <button
            onClick={closePanel}
            className="w-8 h-8 flex items-center justify-center border rounded-sm ml-4"
            style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}
          >
            ✕
          </button>
        </div>

        {!isEvent && (
          <div className="h-0.5 flex-shrink-0" style={{ background: 'var(--imi-gridBorder)' }}>
            <div
              className="h-full transition-all duration-500"
              style={{
                width:     `${(step / totalSteps) * 100}%`,
                background: 'var(--imi-accentOrange)',
                boxShadow:  '0 0 8px var(--imi-accentOrange)',
              }}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {isEvent ? <QuoterEventFlow /> : <QuoterStep />}
        </div>
      </div>
    </>
  )
}

export default QuoterPanel
