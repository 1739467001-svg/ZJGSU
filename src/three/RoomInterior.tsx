import { useMemo } from 'react'
import { Html, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'
import type { Room } from '../types'
import { useStore } from '../store/useStore'
import { bookingAt, statusOf, STATUS_COLOR } from '../lib/utils'
import { slotLabel } from '../data/slots'
import {
  ACUnit,
  Chair,
  ConferenceTable,
  DoorPanel,
  ProjectorBeam,
  WallPanel,
} from './Furniture'

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

const STATUS_LABEL: Record<string, string> = {
  free: '空闲 · 可预约',
  busy: '已占用',
  mine: '我的预约',
}

export default function RoomInterior({ room }: { room: Room }) {
  const bookings = useStore((s) => s.bookings)
  const slotIndex = useStore((s) => s.slotIndex)
  const user = useStore((s) => s.currentUser)

  const status = statusOf(bookings, room.id, slotIndex, user)
  const booking = bookingAt(bookings, room.id, slotIndex)
  const accent = STATUS_COLOR[status]

  const w = room.size.w
  const d = room.size.d
  const h = 3.3

  // chair ring around the conference table
  const { chairs, occCount } = useMemo(() => {
    const tableW = clamp(w * 0.6, 2, 6.4)
    const tableD = clamp(d * 0.4, 1.1, 2.0)
    const zRow = tableD / 2 + 0.62
    const perSide = clamp(Math.round(tableW / 0.95), 2, 7)
    const startX = -((perSide - 1) / 2) * 0.95
    const list: { pos: [number, number, number]; rot: number }[] = []
    for (let i = 0; i < perSide; i++) {
      const x = startX + i * 0.95
      list.push({ pos: [x, 0, zRow], rot: Math.PI })
      list.push({ pos: [x, 0, -zRow], rot: 0 })
    }
    const seats = list.length
    const occ =
      status === 'free' ? 0 : status === 'mine' ? Math.ceil(seats * 0.5) : seats
    return { chairs: list, occCount: occ }
  }, [w, d, status])

  const tableW = clamp(w * 0.6, 2, 6.4)
  const tableD = clamp(d * 0.4, 1.1, 2.0)

  const hasProjector = room.equipment.includes('projector')
  const hasWhiteboard = room.equipment.includes('whiteboard')
  const hasTV = room.equipment.includes('tv')
  const hasAC = room.equipment.includes('ac')

  const screenLit = status !== 'free'

  return (
    <group>
      {/* ---------------------------------------------------------- floor -- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <MeshReflectorMaterial
          resolution={512}
          mirror={0.45}
          blur={[300, 60]}
          mixBlur={6}
          mixStrength={1.2}
          roughness={0.85}
          depthScale={0.4}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color="#0a0e18"
          metalness={0.55}
        />
      </mesh>

      {/* holographic stage ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[Math.min(w, d) * 0.46, Math.min(w, d) * 0.48, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* ---------------------------------------------------------- shell -- */}
      {/* ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#0b1018" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, h / 2, -d / 2]} receiveShadow>
        <boxGeometry args={[w, h, 0.12]} />
        <meshStandardMaterial color="#111a2b" roughness={0.9} />
      </mesh>
      {/* left wall */}
      <mesh position={[-w / 2, h / 2, 0]} receiveShadow>
        <boxGeometry args={[0.12, h, d]} />
        <meshStandardMaterial color="#0f1726" roughness={0.9} />
      </mesh>
      {/* right wall */}
      <mesh position={[w / 2, h / 2, 0]} receiveShadow>
        <boxGeometry args={[0.12, h, d]} />
        <meshStandardMaterial color="#0f1726" roughness={0.9} />
      </mesh>
      {/* baseboard accent line along back wall */}
      <mesh position={[0, 0.06, -d / 2 + 0.07]}>
        <boxGeometry args={[w, 0.04, 0.04]} />
        <meshBasicMaterial color={accent} />
      </mesh>

      {/* ceiling light panels */}
      {[-d * 0.22, d * 0.22].map((z, i) => (
        <mesh key={i} position={[0, h - 0.06, z]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w * 0.5, 0.6]} />
          <meshBasicMaterial color="#dbeafe" transparent opacity={0.85} />
        </mesh>
      ))}

      {/* ---------------------------------------------- windows (left wall) -- */}
      {[-d * 0.26, 0, d * 0.26].map((z, i) => (
        <group key={i} position={[-w / 2 + 0.07, 1.7, z]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[d * 0.18, 1.7]} />
            <meshBasicMaterial color="#0e2742" transparent opacity={0.9} />
          </mesh>
          {/* skyline glow */}
          <mesh position={[0, -0.3, 0.01]}>
            <planeGeometry args={[d * 0.18, 0.5]} />
            <meshBasicMaterial color="#1e5a8c" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* --------------------------------------------------- wall fixtures -- */}
      {/* main display on back wall */}
      {hasProjector ? (
        <>
          <WallPanel
            position={[0, 1.7, -d / 2 + 0.08]}
            width={Math.min(w * 0.42, 3.2)}
            height={1.7}
            color={screenLit ? '#0a1a2e' : '#0b1120'}
            emissive={screenLit ? accent : '#0a1428'}
            emissiveIntensity={screenLit ? 0.6 : 0.15}
          />
          <ProjectorBeam position={[0, h - 0.25, 0.25]} color={accent} />
        </>
      ) : hasTV ? (
        <WallPanel
          position={[0, 1.7, -d / 2 + 0.08]}
          width={Math.min(w * 0.4, 2.6)}
          height={1.5}
          color="#05080f"
          emissive={screenLit ? accent : '#0a1428'}
          emissiveIntensity={screenLit ? 0.5 : 0.12}
        />
      ) : (
        <WallPanel
          position={[0, 1.7, -d / 2 + 0.08]}
          width={Math.min(w * 0.42, 3.0)}
          height={1.6}
          color="#f4f7fb"
        />
      )}

      {/* secondary whiteboard on right wall (if display was projector/tv) */}
      {hasWhiteboard && (hasProjector || hasTV) && (
        <WallPanel
          position={[w / 2 - 0.08, 1.6, -0.4]}
          rotation={[0, -Math.PI / 2, 0]}
          width={Math.min(d * 0.4, 2.0)}
          height={1.3}
          color="#eef2f8"
        />
      )}

      {/* AC high on left wall */}
      {hasAC && <ACUnit position={[-w / 2 + 0.2, h - 0.5, -d * 0.1]} rotation={[0, Math.PI / 2, 0]} />}

      {/* door on right wall, front */}
      <DoorPanel position={[w / 2 - 0.08, 1.1, d / 2 - 1.3]} rotation={[0, -Math.PI / 2, 0]} />

      {/* ------------------------------------------------ table + chairs -- */}
      <ConferenceTable w={tableW} d={tableD} accent={accent} />
      {chairs.map((c, i) => (
        <Chair key={i} position={c.pos} rotation={c.rot} occupied={i < occCount} seed={i * 7 + 3} />
      ))}

      {/* ------------------------------------------------------ labels ---- */}
      <Html position={[0, h - 0.45, -d / 2 + 0.35]} center distanceFactor={11} occlude={false} style={{ pointerEvents: 'none' }}>
        <div className="whitespace-nowrap rounded-lg bg-ink-900/80 px-3 py-1.5 text-center backdrop-blur">
          <div className="text-base font-bold text-white">{room.name}</div>
          <div className="text-[11px] tracking-wide text-white/55">
            {room.floor}F · 可容纳 {room.capacity} 人 · 管理员 {room.manager}
          </div>
        </div>
      </Html>

      <Html position={[0, 2.45, 0.2]} center distanceFactor={9} occlude={false} style={{ pointerEvents: 'none' }}>
        <div
          className="animate-pulse-glow whitespace-nowrap rounded-xl border px-4 py-2 text-center backdrop-blur-md"
          style={{
            borderColor: accent,
            background: 'rgba(5,7,13,0.72)',
            boxShadow: `0 0 26px ${accent}66`,
          }}
        >
          <div className="text-lg font-extrabold" style={{ color: accent }}>
            {STATUS_LABEL[status]}
          </div>
          <div className="mt-0.5 text-[12px] text-white/70">
            {slotLabel(slotIndex)}
            {booking ? ` · 预约人 ${booking.name}` : ' · 当前空闲'}
          </div>
        </div>
      </Html>
    </group>
  )
}
