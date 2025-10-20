import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

interface GiftOpen3DProps {
  color?: string
  onOpened?: () => void
}

function GiftModel({ onOpened, color = '#ec4899' }: { onOpened?: () => void; color?: string }) {
  const lidRef = useRef<any>(null)
  const prizeRef = useRef<any>(null)
  const timeRef = useRef(0)
  const openedRef = useRef(false)

  useFrame((_state, delta) => {
    timeRef.current += delta
    // Animate lid opening (first 1.2s)
    if (lidRef.current && timeRef.current < 1.2) {
      const t = Math.min(1, timeRef.current / 1.2)
      lidRef.current.rotation.z = -Math.PI * 0.98 * t
    }
    // Animate prize flying (start after 0.8s)
    if (prizeRef.current) {
      const t = Math.max(0, timeRef.current - 0.8)
      const y = Math.min(1.5, t * 1.2)
      prizeRef.current.position.y = 0.2 + y
      prizeRef.current.rotation.y += delta * 1.5
      prizeRef.current.material.opacity = Math.min(1, 0.4 + t)
    }
    if (!openedRef.current && timeRef.current > 2.0) {
      openedRef.current = true
      onOpened && onOpened()
    }
  })

  return (
    <group>
      {/* Base */}
      <mesh position={[0, -0.55, 0]} receiveShadow>
        <boxGeometry args={[2.5, 0.1, 2.5]} />
        <meshStandardMaterial color="#e9d5ff" />
      </mesh>

      {/* Box body */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <boxGeometry args={[1, 0.6, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Lid */}
      <group position={[0.5, 0.25, 0]} ref={lidRef}>
        <mesh position={[-0.5, 0, 0]} castShadow>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      {/* Holo beam */}
      <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0, 0.9, 2, 20, 1, true]} />
        <meshStandardMaterial color="#a78bfa" transparent opacity={0.25} />
      </mesh>

      {/* Prize placeholder (user can replace with texture/GLTF later) */}
      <mesh ref={prizeRef} position={[0, 0.2, 0]} castShadow>
        <icosahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

export default function GiftOpen3D({ onOpened, color }: GiftOpen3DProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [1.8, 1.6, 2.2], fov: 45 }}
      style={{ width: '100%', height: 320 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={0.9} castShadow />
      <GiftModel onOpened={onOpened} color={color} />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.3} />
    </Canvas>
  )
}
