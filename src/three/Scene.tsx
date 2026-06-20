import { Suspense, useMemo } from 'react'
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

/** 工商蓝 vertical-gradient sky as the actual 3D background (survives the
 *  postprocessing pass, unlike a transparent canvas). */
function GradientSky() {
  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 4
    c.height = 256
    const ctx = c.getContext('2d')!
    const g = ctx.createLinearGradient(0, 0, 0, 256)
    g.addColorStop(0, '#0d3061')
    g.addColorStop(0.5, '#0a2142')
    g.addColorStop(1, '#06142a')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 4, 256)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  return <primitive attach="background" object={texture} />
}

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ position: [17, 15, 30], fov: 42, near: 0.1, far: 200 }}
    >
      <GradientSky />
      <fog attach="fog" args={['#0a2142', 32, 86]} />

      {/* lighting — brighter & bluer so the scene reads less black */}
      <ambientLight intensity={0.65} />
      <hemisphereLight args={['#cfe2ff', '#0a2342', 0.7]} />
      <directionalLight
        position={[14, 20, 12]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={70}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <pointLight position={[-9, 7, 7]} intensity={42} distance={45} decay={1.6} color="#ff6b3d" />
      <pointLight position={[11, 9, -6]} intensity={55} distance={48} decay={1.5} color="#1f6fe0" />

      <Suspense fallback={null}>
        <World />
      </Suspense>

      <CameraRig />
      <Effects />
    </Canvas>
  )
}
