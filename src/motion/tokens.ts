/**
 * Motion tokens — LQS "La Ciudad del Pato"
 *
 * Defined BEFORE any visual design (Zentry method, report section A).
 * These are the only curves and durations allowed in the redesign. If a value
 * is not here, it does not go in the product.
 *
 * The scale is deliberately small. Five curves and six durations cover every
 * interaction in the city; more than that and the motion stops reading as one
 * system.
 */

/** Cubic-beziers. Named by intent, not by shape. */
export const EASE = {
  /** Default for anything entering the viewport. Decisive, no bounce. */
  enter: [0.16, 1, 0.3, 1],
  /** Anything leaving. Faster out than in — exits should not be admired. */
  exit: [0.4, 0, 1, 1],
  /** Camera moves and level transitions. Slow in, slow out, cinematic. */
  camera: [0.65, 0, 0.35, 1],
  /** Cursor magnetism and hover feedback. Near-linear, reacts instantly. */
  react: [0.33, 1, 0.68, 1],
  /** Curtain wipes / clip-path between hub and district. */
  curtain: [0.76, 0, 0.24, 1],
} as const

export type EaseName = keyof typeof EASE

/** Durations in seconds (GSAP native unit). */
export const DUR = {
  /** Cursor, hover, micro-feedback. Below this, motion reads as a glitch. */
  instant: 0.12,
  /** Standard UI reaction: label reveal, button state. */
  quick: 0.28,
  /** Element entering: card, building label, copy line. */
  base: 0.5,
  /** Curtain between hub and district. Masks the sub-world load. */
  curtain: 0.9,
  /** Camera travel hub → district, zoom-morph into a case. */
  camera: 1.4,
  /** Preloader assembly. The only duration allowed above 1.5s. */
  epic: 2.2,
} as const

export type DurName = keyof typeof DUR

/**
 * Stagger between siblings. The city has 8 districts; at 0.06 the full set
 * reveals in under half a second, which keeps the hub under its LCP budget.
 */
export const STAGGER = {
  tight: 0.04,
  base: 0.06,
  loose: 0.12,
} as const

/**
 * Movement hierarchy (Locomotive reference, report section A).
 * Background moves slowest, foreground fastest, CTA barely moves. This is what
 * directs the eye without a single line of copy.
 */
export const PARALLAX = {
  background: 0.15,
  midground: 0.4,
  foreground: 0.8,
  cta: 0.05,
} as const

/** Distance in px for enter/exit translations. Kept small — CLS is budgeted. */
export const SHIFT = {
  subtle: 8,
  base: 24,
  strong: 48,
} as const

/** CSS-ready cubic-bezier string, for stylesheets and Web Animations API. */
export function cssEase(name: EaseName): string {
  return `cubic-bezier(${EASE[name].join(', ')})`
}

/**
 * Cubic-bezier as a progress function, for GSAP (which takes an ease function,
 * not a CSS string, without the CustomEase plugin).
 *
 * Newton-Raphson to invert x(t) for a given input, then evaluate y(t). Same
 * math the browser uses for CSS cubic-bezier, so the curve is identical across
 * CSS and GSAP — one motion system, two engines.
 */
export function gsapEase(name: EaseName): (progress: number) => number {
  const [x1, y1, x2, y2] = EASE[name]

  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx

  const solveT = (x: number) => {
    let t = x
    for (let i = 0; i < 8; i++) {
      const dx = sampleX(t) - x
      if (Math.abs(dx) < 1e-5) return t
      const d = slopeX(t)
      if (Math.abs(d) < 1e-6) break
      t -= dx / d
    }
    return t
  }

  return (progress: number) => {
    if (progress <= 0) return 0
    if (progress >= 1) return 1
    return sampleY(solveT(progress))
  }
}
