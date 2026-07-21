'use client'

/**
 * Grey-box of the city — Phase 0 previs (Igloo method, report Phase 0).
 *
 * Primitives only. No art, no textures, no lighting design. The point is to
 * lock the spatial layout, the camera framing and the performance envelope
 * before anyone models a building.
 *
 * Contains NO text by design (brief rule 3) — every label lives in the DOM
 * layer above the canvas.
 */

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import { DISTRICTS, ACCENT_HEX } from '../districts'

const GROUND_SIZE = 40

function DistrictBlock({
  position,
  massing,
  accent,
}: {
  position: readonly [number, number]
  massing: { footprint: number; height: number }
  accent: string
}) {
  const ref = useRef<Mesh>(null)
  const [x, z] = position

  return (
    <mesh ref={ref} position={[x, massing.height / 2, z]} castShadow={false}>
      <boxGeometry args={[massing.footprint, massing.height, massing.footprint]} />
      {/* Unlit on purpose: grey-box should not flatter the layout. */}
      <meshBasicMaterial color={accent} wireframe />
    </mesh>
  )
}

/** The Ayuntamiento — level 4, where the quoter lives. Sits at the origin. */
function CityHall() {
  return (
    <mesh position={[0, 1.5, 0]}>
      <cylinderGeometry args={[2.4, 2.8, 3, 8]} />
      <meshBasicMaterial color="#FFFFFF" wireframe />
    </mesh>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[GROUND_SIZE, GROUND_SIZE, 20, 20]} />
      <meshBasicMaterial color="#1A1A1A" wireframe />
    </mesh>
  )
}

/**
 * Slow orbital drift (Igloo's "camera derives between scenes"). Gated on
 * `ambient`: in any mode where ambient loops are disallowed this never mounts
 * the frame loop at all.
 */
function DriftingCity({ ambient }: { ambient: boolean }) {
  const ref = useRef<Group>(null)

  useFrame((_state, delta) => {
    if (!ambient || !ref.current) return
    ref.current.rotation.y += delta * 0.04
  })

  return (
    <group ref={ref}>
      <Ground />
      <CityHall />
      {DISTRICTS.map((district) => (
        <DistrictBlock
          key={district.slug}
          position={district.position}
          massing={district.massing}
          accent={ACCENT_HEX[district.accent]}
        />
      ))}
    </group>
  )
}

export function CityGreybox({ ambient = true }: { ambient?: boolean }) {
  return (
    <Canvas
      // Overhead three-quarter view: the "aerial view of a stylised city" the
      // report specifies for the landing moment.
      camera={{ position: [0, 26, 30], fov: 42 }}
      // DPR is capped: on a 3x phone an uncapped canvas is an instant CWV fail.
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0 }}
      // The canvas is decorative; all meaning is in the DOM layer above it.
      aria-hidden="true"
    >
      <DriftingCity ambient={ambient} />
    </Canvas>
  )
}

export default CityGreybox
