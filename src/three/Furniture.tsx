import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

type Vec3 = [number, number, number]

/* ----------------------------------------------------------------- person -- */

const SKIN = ['#e9b48b', '#d99a6c', '#f0c19a', '#caa07a']
const SHIRT = ['#3b82f6', '#22d39a', '#f5b942', '#ef6f6c', '#a78bfa', '#38bdf8']

export function Person({ seed = 0 }: { seed?: number }) {
  const skin = SKIN[seed % SKIN.length]
  const shirt = SHIRT[seed % SHIRT.length]
  return (
    <group>
      {/* torso */}
      <mesh position={[0, 1.0, -0.04]} castShadow>
        <capsuleGeometry args={[0.16, 0.34, 4, 12]} />
        <meshStandardMaterial color={shirt} roughness={0.7} />
      </mesh>
      {/* thighs */}
      <mesh position={[0, 0.62, 0.14]} rotation={[Math.PI / 2.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.26, 4, 10]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.36, 0]} castShadow>
        <sphereGeometry args={[0.135, 18, 18]} />
        <meshStandardMaterial color={skin} roughness={0.6} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ chair -- */

export function Chair({
  position,
  rotation = 0,
  occupied = false,
  seed = 0,
}: {
  position: Vec3
  rotation?: number
  occupied?: boolean
  seed?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RoundedBox args={[0.5, 0.1, 0.5]} radius={0.04} smoothness={3} position={[0, 0.48, 0]} castShadow>
        <meshStandardMaterial color="#2b3a5e" roughness={0.6} metalness={0.1} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.55, 0.08]} radius={0.04} smoothness={3} position={[0, 0.78, -0.22]} castShadow>
        <meshStandardMaterial color="#2b3a5e" roughness={0.6} metalness={0.1} />
      </RoundedBox>
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.42, 12]} />
        <meshStandardMaterial color="#0c111c" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.04, 18]} />
        <meshStandardMaterial color="#0c111c" metalness={0.7} roughness={0.3} />
      </mesh>
      {occupied && <Person seed={seed} />}
    </group>
  )
}

/* ------------------------------------------------------- conference table -- */

export function ConferenceTable({ w, d, accent }: { w: number; d: number; accent: string }) {
  return (
    <group>
      <RoundedBox args={[w, 0.09, d]} radius={0.05} smoothness={3} position={[0, 0.74, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#0e1726" metalness={0.5} roughness={0.18} />
      </RoundedBox>
      {/* glowing inlay running down the centre of the table */}
      <mesh position={[0, 0.792, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w - 0.5, d - 0.5]} />
        <meshBasicMaterial color={accent} transparent opacity={0.18} />
      </mesh>
      <mesh position={[0, 0.793, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.min(w, d) * 0.12, Math.min(w, d) * 0.16, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0.6} />
      </mesh>
      {/* pedestals */}
      {[-w * 0.28, w * 0.28].map((x, i) => (
        <mesh key={i} position={[x, 0.37, 0]} castShadow>
          <boxGeometry args={[0.5, 0.7, d * 0.5]} />
          <meshStandardMaterial color="#0a0f1a" metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

/* ------------------------------------------------------- wall-mounted bits -- */

/** A framed flat panel — reused for projector screen, whiteboard and TV. */
export function WallPanel({
  position,
  rotation = [0, 0, 0],
  width,
  height,
  color = '#e8edf5',
  emissive = '#000000',
  emissiveIntensity = 0,
  frame = '#0b1120',
}: {
  position: Vec3
  rotation?: Vec3
  width: number
  height: number
  color?: string
  emissive?: string
  emissiveIntensity?: number
  frame?: string
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[width + 0.12, height + 0.12, 0.06]} />
        <meshStandardMaterial color={frame} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
    </group>
  )
}

export function ACUnit({ position, rotation = [0, 0, 0] }: { position: Vec3; rotation?: Vec3 }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[1.5, 0.4, 0.32]} radius={0.06} smoothness={3}>
        <meshStandardMaterial color="#f4f7fb" roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, -0.12, 0.16]}>
        <boxGeometry args={[1.3, 0.06, 0.02]} />
        <meshStandardMaterial color="#9fb3c8" />
      </mesh>
    </group>
  )
}

export function DoorPanel({ position, rotation = [0, 0, 0] }: { position: Vec3; rotation?: Vec3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[1.1, 2.2, 0.08]} />
        <meshStandardMaterial color="#1a2336" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0.4, 0, 0.06]}>
        <boxGeometry args={[0.06, 0.3, 0.06]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* light strip above the door */}
      <mesh position={[0, 1.18, 0]}>
        <boxGeometry args={[1.1, 0.05, 0.05]} />
        <meshBasicMaterial color="#1f6fe0" />
      </mesh>
    </group>
  )
}

export function CeilingLight({ position, width, depth }: { position: Vec3; width: number; depth: number }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial color="#cfe8ff" transparent opacity={0.9} />
    </mesh>
  )
}

/** Soft projector beam from the ceiling down to the screen. */
export function ProjectorBeam({ position, color }: { position: Vec3; color: string }) {
  const geo = useMemo(() => {
    const g = new THREE.ConeGeometry(0.9, 3.2, 24, 1, true)
    g.translate(0, -1.6, 0)
    return g
  }, [])
  return (
    <group position={position} rotation={[Math.PI / 2.6, 0, 0]}>
      {/* projector body */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.35, 0.18, 0.5]} />
        <meshStandardMaterial color="#0b1120" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh geometry={geo}>
        <meshBasicMaterial color={color} transparent opacity={0.07} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}
