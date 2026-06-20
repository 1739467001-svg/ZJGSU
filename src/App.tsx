import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MousePointerClick, RotateCw } from 'lucide-react'
import Scene from './three/Scene'
import TopBar from './ui/TopBar'
import Sidebar from './ui/Sidebar'
import DetailPanel from './ui/DetailPanel'
import TimeScrubber from './ui/TimeScrubber'
import PlayTicker from './ui/PlayTicker'
import Loading from './ui/Loading'
import { useStore } from './store/useStore'

/** Brief dark pulse that masks the overview ↔ room scene swap. */
function ViewFlash() {
  const view = useStore((s) => s.view)
  const sel = useStore((s) => s.selectedRoomId)
  const [flash, setFlash] = useState(false)
  const key = `${view}:${sel ?? ''}`

  useEffect(() => {
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 380)
    return () => clearTimeout(t)
  }, [key])

  return (
    <AnimatePresence>
      {flash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.19 }}
          className="pointer-events-none absolute inset-0 z-40 bg-ink-900"
        />
      )}
    </AnimatePresence>
  )
}

function Hint() {
  const view = useStore((s) => s.view)
  if (view !== 'overview') return null
  return (
    <div className="pointer-events-none absolute bottom-6 right-5 z-20 hidden flex-col gap-1 text-right text-[11px] text-white/40 lg:flex">
      <span className="flex items-center justify-end gap-1.5">
        <RotateCw size={13} /> 拖拽旋转 · 滚轮缩放
      </span>
      <span className="flex items-center justify-end gap-1.5">
        <MousePointerClick size={13} /> 点击房间进入三维现实模拟
      </span>
    </div>
  )
}

export default function App() {
  const view = useStore((s) => s.view)
  const back = useStore((s) => s.back)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && useStore.getState().view === 'room') back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [back])

  return (
    <div className="app-bg relative h-screen w-screen overflow-hidden text-white">
      <div className="absolute inset-0">
        <Scene />
      </div>

      <ViewFlash />
      <TopBar />
      <Sidebar />
      <AnimatePresence>{view === 'room' && <DetailPanel />}</AnimatePresence>
      <TimeScrubber />
      <Hint />
      <PlayTicker />
      <Loading />
    </div>
  )
}
