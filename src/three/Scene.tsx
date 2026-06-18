import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store/useStore'
import { ROOM_BY_ID } from '../data/rooms'
import Building from './Building'
import RoomInterior from './RoomInterior'
import CameraRig from './CameraRig'
import Effects from './Effects'

function World() {
  const view = useStore((s) => s.view)
  const selectedRoomId = useStore((s) => s.selectedRoomId)
  const room = selectedRoomId ? ROOM_BY_ID[selectedRoomId] : null

  return view === 'room' && room ? <RoomInterior room={room} /> : <Building />
}

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ position: [17, 15, 30], fov: 42, near: 0.1, far: 200 }}
    >
      <color attach="background" args={['#05070d']} />
      <fog attach="fog" args={['#05070d', 28, 80]} />

      {/* lighting */}
      <ambientLight intensity={0.5} />
      <hemisphereLight args={['#bcd8ff', '#0a0f1a', 0.55]} />
      <directionalLight
        position={[14, 20, 12]}
        intensity={1.15}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={70}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <pointLight position={[-9, 7, 7]} intensity={45} distance={45} decay={1.6} color="#ff6b3d" />
      <pointLight position={[11, 9, -6]} intensity={45} distance={45} decay={1.6} color="#38bdf8" />

      <Suspense fallback={null}>
        <World />
      </Suspense>

      <CameraRig />
      <Effects />
    </Canvas>
  )
}
