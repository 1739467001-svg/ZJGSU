import { useEffect, useRef, type ElementRef } from 'react'
import { CameraControls } from '@react-three/drei'
import { useStore } from '../store/useStore'
import { ROOM_BY_ID } from '../data/rooms'

export default function CameraRig() {
  const controls = useRef<ElementRef<typeof CameraControls>>(null)
  const view = useStore((s) => s.view)
  const selectedRoomId = useStore((s) => s.selectedRoomId)

  useEffect(() => {
    const c = controls.current
    if (!c) return

    if (view === 'overview') {
      c.setLookAt(17, 15, 30, 1, 4.5, 0, true)
      return
    }

    const room = selectedRoomId ? ROOM_BY_ID[selectedRoomId] : null
    if (room) {
      const dist = Math.max(room.size.w, room.size.d)
      c.setLookAt(
        dist * 0.33,
        3.1,
        room.size.d / 2 + dist * 0.72 + 2,
        0,
        1.4,
        -0.2,
        true,
      )
    }
  }, [view, selectedRoomId])

  return (
    <CameraControls
      ref={controls}
      makeDefault
      minDistance={2.2}
      maxDistance={64}
      maxPolarAngle={Math.PI * 0.52}
      smoothTime={0.55}
    />
  )
}
