'use client'

/**
 * useCapability — the single switch behind decision D-04.
 *
 * One hook resolves `full | lite | static`. The three modes share copy, routes
 * and the DOM layer; only presentation differs. This is what keeps Concept 2
 * from becoming a second product.
 *
 * Resolution order (first match wins):
 *   1. prefers-reduced-motion: reduce   → static
 *   2. coarse pointer / narrow viewport → lite
 *   3. no usable WebGL2                 → lite
 *   4. otherwise                        → full
 */

import { useSyncExternalStore } from 'react'
import type { CapabilityMode } from './rules'
import { PROFILES } from './rules'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const LITE_VIEWPORT_QUERY = '(max-width: 1023px), (pointer: coarse)'

/**
 * Media query bound to a stable subscribe/snapshot pair.
 *
 * The identities must be created once per query, not once per render:
 * `useSyncExternalStore` tears down and re-adds the listener whenever
 * `subscribe` changes identity, so inline closures turn a passive media query
 * into per-render listener churn.
 */
type QueryStore = {
  subscribe: (onChange: () => void) => () => void
  getSnapshot: () => boolean
}

const queryStores = new Map<string, QueryStore>()

function getQueryStore(query: string): QueryStore {
  let store = queryStores.get(query)
  if (store) return store

  store = {
    subscribe: (onChange: () => void) => {
      if (typeof window === 'undefined') return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    getSnapshot: () => window.matchMedia(query).matches,
  }

  queryStores.set(query, store)
  return store
}

/**
 * Server always reports `false`. Combined with the deferred canvas mount below,
 * this means the server renders the DOM copy layer and nothing else — which is
 * exactly the LCP and SEO behaviour rule 3 of the brief demands.
 */
const serverSnapshot = () => false

function useMediaQuery(query: string): boolean {
  const store = getQueryStore(query)
  return useSyncExternalStore(store.subscribe, store.getSnapshot, serverSnapshot)
}

/** Live `prefers-reduced-motion`. Reacts if the user changes it mid-session. */
export function useReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY)
}

function useLiteViewport(): boolean {
  return useMediaQuery(LITE_VIEWPORT_QUERY)
}

/**
 * WebGL2 probe. Runs at most once per document and throws the context away
 * immediately — a leaked probe context costs a real GPU slot on mobile.
 */
let webGL2Result: boolean | undefined

function detectWebGL2(): boolean {
  if (webGL2Result !== undefined) return webGL2Result

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) {
      webGL2Result = false
    } else {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      webGL2Result = true
    }
  } catch {
    webGL2Result = false
  }

  return webGL2Result
}

/**
 * Client-readiness as an external store rather than `setState` in an effect.
 *
 * React drives `useSyncExternalStore` with the server snapshot during
 * hydration and the client snapshot immediately after, which is exactly the
 * transition we need — and it gets there without an effect that re-renders the
 * tree a second time on every mount.
 */
const clientStore = {
  subscribe: () => () => {},
  getSnapshot: () => true,
  getServerSnapshot: () => false,
}

function useIsClient(): boolean {
  return useSyncExternalStore(
    clientStore.subscribe,
    clientStore.getSnapshot,
    clientStore.getServerSnapshot,
  )
}

export interface Capability {
  mode: CapabilityMode
  profile: (typeof PROFILES)[CapabilityMode]
  /**
   * False during SSR and the first client paint. Guard canvas mounting on this:
   * mounting 3D before the mode is known is how you ship a layout shift.
   */
  resolved: boolean
  prefersReducedMotion: boolean
}

export function useCapability(): Capability {
  const prefersReducedMotion = useReducedMotion()
  const isLiteViewport = useLiteViewport()
  const resolved = useIsClient()
  const hasWebGL2 = resolved && detectWebGL2()

  let mode: CapabilityMode
  if (prefersReducedMotion) mode = 'static'
  else if (isLiteViewport || !hasWebGL2) mode = 'lite'
  else mode = 'full'

  // Before resolution, claim the most conservative mode. Upgrading to `full`
  // after paint is cheap; downgrading from it means tearing down a live canvas.
  const effective: CapabilityMode = resolved ? mode : 'static'

  return {
    mode: effective,
    profile: PROFILES[effective],
    resolved,
    prefersReducedMotion,
  }
}
