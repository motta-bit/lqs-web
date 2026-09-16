/**
 * Motion rules — how the city reacts, per capability mode.
 *
 * Companion to `tokens.ts`. Tokens say *how fast and with what curve*;
 * rules say *what is allowed to move at all* in each of the three modes.
 *
 * Rule 5 of the brief: reduced-motion and the mobile fallback ship in the same
 * PR as the feature. Encoding them as data — instead of scattering `if`
 * statements — is what makes that enforceable.
 */

import { DUR, EASE, STAGGER, type EaseName } from './tokens'

export type CapabilityMode = 'full' | 'lite' | 'static'

export interface MotionProfile {
  /** Global multiplier on every duration. 0 = snap to end state. */
  durationScale: number
  /** Parallax and scroll-linked movement. */
  parallax: boolean
  /** Camera travel through the 3D city. */
  cameraTravel: boolean
  /** clip-path curtains and zoom-morphs between levels. */
  levelTransitions: boolean
  /** Duck cursor inertia physics. */
  cursorPhysics: boolean
  /** Continuous idle loops (float, pulse, shimmer, wing flap). */
  ambientLoops: boolean
  /** Stagger between siblings. */
  stagger: number
  /** The 3D canvas itself. */
  canvas3D: boolean
}

export const PROFILES: Record<CapabilityMode, MotionProfile> = {
  /** Desktop, healthy GPU, no motion preference. The full city. */
  full: {
    durationScale: 1,
    parallax: true,
    cameraTravel: true,
    levelTransitions: true,
    cursorPhysics: true,
    ambientLoops: true,
    stagger: STAGGER.base,
    canvas3D: true,
  },

  /**
   * Mobile / weak GPU. Concept 2 from the report: cinematic scroll chapters.
   * Same copy, same routes, no 3D world. Transitions survive because they cost
   * nothing; the camera and the canvas do not.
   */
  lite: {
    durationScale: 0.8,
    parallax: false,
    cameraTravel: false,
    levelTransitions: true,
    cursorPhysics: false,
    ambientLoops: false,
    stagger: STAGGER.tight,
    canvas3D: false,
  },

  /**
   * prefers-reduced-motion: reduce.
   * Nothing moves except opacity. Not "less motion" — no motion. Users who set
   * this flag include people for whom vestibular motion is a health issue.
   */
  static: {
    durationScale: 0,
    parallax: false,
    cameraTravel: false,
    levelTransitions: false,
    cursorPhysics: false,
    ambientLoops: false,
    stagger: 0,
    canvas3D: false,
  },
}

/**
 * Resolve a duration for a mode. In `static` this returns 0, which GSAP and CSS
 * both treat as "jump to the end state" — the correct reduced-motion behaviour,
 * since the user still needs to see the result, just not the journey.
 */
export function duration(mode: CapabilityMode, token: keyof typeof DUR): number {
  return DUR[token] * PROFILES[mode].durationScale
}

/**
 * Resolve an ease for a mode. In `static` the curve is irrelevant (duration is
 * 0) but returning a linear tuple keeps call sites free of null checks.
 */
export function ease(mode: CapabilityMode, name: EaseName): readonly number[] {
  return mode === 'static' ? [0, 0, 1, 1] : EASE[name]
}

/** Whether a given behaviour is permitted in this mode. */
export function allows(mode: CapabilityMode, feature: keyof MotionProfile): boolean {
  return Boolean(PROFILES[mode][feature])
}
