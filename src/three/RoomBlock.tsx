import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Room } from '../types'
import { useStore } from '../store/useStore'
import { dayBooked, statusOf, STATUS_COLOR } from '../lib/utils'
import { TIME_SLOTS } from '../data/slots'
import { floorY } from '../data/rooms'

const BLOCK_H = 2.6

export default function RoomBlock({ room }: { room: Room }) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  const bookings = useStore((s) => s.bookings)
  const slotIndex = useStore((s) => s.slotIndex)
  const user = useStore((s) => s.currentUser)
  const selectRoom = useStore((s) => s.selectRoom)
  const setHoveredId = useStore((s) => s.setHovered)
  const selectedRoomId = useStore((s) => s.selectedRoomId)

  const status = statusOf(bookings, room.id, slotIndex, user)
  const accent = STATUS_COLOR[status]
  const booked = dayBooked(bookings, room.id)
  const isSelected = selectedRoomId === room.id

  const baseY = floorY(room.floor)

  useFrame(() => {
    if (!group.current) return
    const target = hovered ? 1.04 : 1
    group.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15)
  })

  const slotStatuses = TIME_SLOTS.map((_, i) => statusOf(bookings, room.id, i, user))

  return (
    <group
      ref={group}
      position={[room.pos.x, baseY, room.pos.z]}
      onClick={(e) => {
        e.stopPropagation()
        selectRoom(room.id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        setHoveredId(room.id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        setHoveredId(null)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* glass volume */}
      <mesh position={[0, BLOCK_H / 2, 0]} castShadow>
        <boxGeometry args={[room.size.w, BLOCK_H, room.size.d]} />
        <meshStandardMaterial
          color={accent}
          transparent
          opacity={hovered || isSelected ? 0.34 : 0.2}
          emissive={accent}
          emissiveIntensity={hovered || isSelected ? 0.7 : 0.35}
          roughness={0.25}
          metalness={0.2}
        />
        <Edges threshold={15} color={accent} />
      </mesh>

      {/* footprint glow on the plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[room.size.w, room.size.d]} />
        <meshBasicMaterial color={accent} transparent opacity={0.14} />
      </mesh>

      {/* floating HUD card */}
      <Html
        position={[0, BLOCK_H + 1.15, 0]}
        center
        distanceFactor={18}
        occlude={false}
        style={{ pointerEvents: 'none' }}
        zIndexRange={[20, 0]}
      >
        <div
          className="w-[150px] rounded-lg border px-2.5 py-1.5 backdrop-blur-md transition"
          style={{
            borderColor: hovered || isSelected ? accent : 'rgba(255,255,255,0.14)',
            background: 'rgba(5,7,13,0.78)',
            boxShadow: hovered || isSelected ? `0 0 20px ${accent}66` : 'none',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">{room.id}</span>
            <span
              className="rounded px-1.5 py-px text-[10px] font-semibold"
              style={{ color: accent, background: `${accent}22` }}
            >
              {status === 'free' ? '空闲' : status === 'mine' ? '我的' : '占用'}
            </span>
          </div>
          <div className="mb-1 text-[10px] text-white/50">
            {room.floor}F · {room.capacity}人 · 全天 {booked}/{TIME_SLOTS.length}
          </div>
          {/* day mini heat-bar */}
          <div className="flex gap-px">
            {slotStatuses.map((st, i) => (
              <div
                key={i}
                className="h-2 flex-1 rounded-[1px]"
                style={{
                  background: st === 'free' ? 'rgba(255,255,255,0.12)' : STATUS_COLOR[st],
                  outline: i === slotIndex ? '1px solid #fff' : 'none',
                  outlineOffset: i === slotIndex ? '0px' : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </Html>
    </group>
  )
}
