import { Grid, Html, Edges } from '@react-three/drei'
import RoomBlock from './RoomBlock'
import { ROOMS, FLOORS, floorY } from '../data/rooms'

const MARGIN = 1.6

function floorBounds(floor: number) {
  const rs = ROOMS.filter((r) => r.floor === floor)
  const minX = Math.min(...rs.map((r) => r.pos.x - r.size.w / 2)) - MARGIN
  const maxX = Math.max(...rs.map((r) => r.pos.x + r.size.w / 2)) + MARGIN
  const minZ = Math.min(...rs.map((r) => r.pos.z - r.size.d / 2)) - MARGIN
  const maxZ = Math.max(...rs.map((r) => r.pos.z + r.size.d / 2)) + MARGIN
  return {
    w: maxX - minX,
    d: maxZ - minZ,
    cx: (minX + maxX) / 2,
    cz: (minZ + maxZ) / 2,
    minX,
  }
}

export default function Building() {
  const allBounds = FLOORS.map(floorBounds)
  const unionMinX = Math.min(...allBounds.map((b) => b.cx - b.w / 2))
  const unionMaxX = Math.max(...allBounds.map((b) => b.cx + b.w / 2))
  const unionMinZ = Math.min(...allBounds.map((b) => b.cz - b.d / 2))
  const unionMaxZ = Math.max(...allBounds.map((b) => b.cz + b.d / 2))
  const topY = floorY(FLOORS[FLOORS.length - 1])

  const pillars: [number, number][] = [
    [unionMinX, unionMinZ],
    [unionMaxX, unionMinZ],
    [unionMinX, unionMaxZ],
    [unionMaxX, unionMaxZ],
  ]

  return (
    <group>
      {/* campus ground grid */}
      <Grid
        position={[0, -0.06, 0]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#16233d"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#274a73"
        fadeDistance={70}
        fadeStrength={1.4}
        infiniteGrid
      />

      {/* corner pillars to read as one building */}
      {pillars.map(([x, z], i) => (
        <mesh key={i} position={[x, topY / 2, z]}>
          <boxGeometry args={[0.18, topY + 3, 0.18]} />
          <meshStandardMaterial
            color="#1b2a44"
            transparent
            opacity={0.5}
            emissive="#1e3a5f"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* floor plates + labels */}
      {FLOORS.map((floor, i) => {
        const b = allBounds[i]
        const y = floorY(floor)
        return (
          <group key={floor}>
            <mesh position={[b.cx, y - 0.1, b.cz]} receiveShadow>
              <boxGeometry args={[b.w, 0.2, b.d]} />
              <meshStandardMaterial
                color="#0a1322"
                metalness={0.4}
                roughness={0.5}
                transparent
                opacity={0.92}
              />
              <Edges threshold={15} color="#2a4a73" />
            </mesh>
            <Html
              position={[b.minX - 0.2, y + 1.2, b.cz]}
              center
              distanceFactor={20}
              occlude={false}
              style={{ pointerEvents: 'none' }}
            >
              <div className="rounded-md bg-ink-900/70 px-2 py-1 font-mono text-sm font-bold text-shrimp backdrop-blur">
                {floor}F
              </div>
            </Html>
          </group>
        )
      })}

      {/* rooms */}
      {ROOMS.map((room) => (
        <RoomBlock key={room.id} room={room} />
      ))}
    </group>
  )
}
