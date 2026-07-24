'use client'

/**
 * Whispers en el hub — DOM real (regla 3), discretos por diseño.
 *
 * Rota los susurros aprobados de a uno, abajo a la izquierda; un botón
 * despliega el input para dejar el propio (siempre queda pendiente de
 * moderación, y así se le dice al autor). En modo `static` no hay rotación:
 * se muestra uno fijo.
 *
 * Si la API devuelve vacío (sin BD, sin aprobados), el componente no
 * renderiza nada: el hub no depende de esta capa social.
 */

import { useEffect, useRef, useState } from 'react'
import { useCapability } from '@/motion/useCapability'

interface Whisper {
  id: string
  text: string
}

const ROTATE_MS = 6000

export function Whispers() {
  const { profile } = useCapability()
  const [whispers, setWhispers] = useState<Whisper[]>([])
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/v1/whispers')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.whispers?.length) setWhispers(data.whispers)
      })
      .catch(() => {}) // capa opcional: el hub vive sin susurros
    return () => {
      cancelled = true
    }
  }, [])

  // Rotación solo si el modo permite loops ambientales.
  useEffect(() => {
    if (!profile.ambientLoops || whispers.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % whispers.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [profile.ambientLoops, whispers.length])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = inputRef.current?.value.trim()
    if (!text) return
    try {
      await fetch('/api/v1/whispers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
    } catch {
      // El agradecimiento aplica igual: quedó en cola o se perdió en silencio;
      // no hay estado de error que valga la pena en una capa de deleite.
    }
    setSent(true)
    setOpen(false)
  }

  const current = whispers[index]

  return (
    <div className="pointer-events-auto fixed bottom-5 left-5 z-[996] max-w-xs">
      {current && (
        <p
          key={current.id}
          className="mb-2 font-data-mono text-[11px] leading-relaxed text-white/50"
          style={{ animation: 'fade-in 0.6s ease both' }}
        >
          “{current.text}”
        </p>
      )}

      {sent ? (
        <p role="status" className="font-data-mono text-[11px] text-white/40">
          Cuac. Tu susurro quedó en revisión.
        </p>
      ) : open ? (
        <form onSubmit={submit} className="flex items-center gap-2">
          <label htmlFor="whisper-input" className="sr-only">
            Deja un susurro
          </label>
          <input
            id="whisper-input"
            ref={inputRef}
            maxLength={140}
            autoFocus
            placeholder="Susurra algo…"
            className="w-48 rounded-sm border border-white/15 bg-black/60 px-2 py-1 font-data-mono text-[11px] text-white placeholder-white/30 outline-none backdrop-blur focus:border-white/40"
          />
          <button
            type="submit"
            className="font-data-mono text-[11px] uppercase tracking-wide text-white/60 hover:text-white"
          >
            Enviar
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-data-mono text-[11px] uppercase tracking-[0.15em] text-white/40 underline-offset-4 hover:text-white/80 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: 'var(--lqs-orange)' }}
        >
          Deja un susurro
        </button>
      )}
    </div>
  )
}

export default Whispers
