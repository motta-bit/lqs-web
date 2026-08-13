'use client'

/**
 * Motor de sonido de la ciudad — cues sintetizados con Web Audio.
 *
 * Fase 2 sin assets de audio: los cues son tonos cortos generados en el
 * momento (branding sonoro provisional). Cuando lleguen los sonidos reales,
 * se reemplaza `play()` por reproducción de buffers; la superficie pública
 * (los nombres de cue) no cambia.
 *
 * Regla 6: el AudioContext se crea de forma perezosa, solo tras un gesto del
 * usuario (activar el toggle). Nunca antes. Un context creado sin gesto queda
 * "suspended" por política del navegador de todos modos — aquí ni se crea.
 */

export type SoundCue = 'hover' | 'enter' | 'curtain' | 'cta' | 'toggle'

interface CueSpec {
  freq: number
  duration: number
  type: OscillatorType
  gain: number
}

// Paleta sonora: notas cortas, discretas, coherentes entre sí (misma familia).
const CUES: Record<SoundCue, CueSpec> = {
  hover:   { freq: 880,  duration: 0.05, type: 'sine',     gain: 0.03 },
  enter:   { freq: 523,  duration: 0.12, type: 'triangle', gain: 0.05 },
  curtain: { freq: 392,  duration: 0.18, type: 'sine',     gain: 0.05 },
  cta:     { freq: 659,  duration: 0.15, type: 'triangle', gain: 0.06 },
  toggle:  { freq: 440,  duration: 0.10, type: 'sine',     gain: 0.05 },
}

let ctx: AudioContext | null = null

/** Crea o reanuda el contexto. Debe llamarse desde un gesto del usuario. */
export function primeAudio(): void {
  if (typeof window === 'undefined') return
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
}

/**
 * Reproduce un cue. No-op si el audio no fue "primed" (o sea, si el usuario
 * nunca activó el sonido). El caller debe además chequear el store, pero esto
 * es una segunda barrera: sin contexto, no hay sonido.
 */
export function play(cue: SoundCue): void {
  if (!ctx || ctx.state !== 'running') return

  const spec = CUES[cue]
  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const amp = ctx.createGain()

  osc.type = spec.type
  osc.frequency.value = spec.freq

  // Envolvente corta para que no "clickee" al cortar.
  amp.gain.setValueAtTime(0, now)
  amp.gain.linearRampToValueAtTime(spec.gain, now + 0.005)
  amp.gain.exponentialRampToValueAtTime(0.0001, now + spec.duration)

  osc.connect(amp).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + spec.duration + 0.02)
}

/** Silencia y descarta el contexto (al desactivar el sonido). */
export function teardownAudio(): void {
  if (ctx) {
    void ctx.close()
    ctx = null
  }
}
