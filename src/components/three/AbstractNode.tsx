'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function OrbitingSatellite({ radius, speed, size, color }: {
  radius: number
  speed:  number
  size:   number
  color:  string
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.7) * radius * 0.5,
      Math.sin(t) * radius,
    )
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

export function AbstractNode() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { mouse } = useThree()
  const targetRotation = useRef({ x: 0, y: 0 })

  const satellites = useMemo(() => [
    { radius: 2.2, speed: 0.4, size: 0.08, color: '#FF4600' },
    { radius: 2.8, speed: 0.25, size: 0.06, color: '#008080' },
    { radius: 1.8, speed: 0.6,  size: 0.05, color: '#0055FF' },
  ], [])

  useFrame(() => {
    if (!meshRef.current) return
    targetRotation.current.x = mouse.y * 0.5
    targetRotation.current.y = mouse.x * 0.5

    meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.05
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.05 + 0.002
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshBasicMaterial color="#FF4600" wireframe />
      </mesh>

      {satellites.map((s, i) => (
        <OrbitingSatellite key={i} {...s} />
      ))}
    </group>
  )
}

export default AbstractNode
