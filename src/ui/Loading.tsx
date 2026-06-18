import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Loading() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 z-50 grid place-items-center bg-ink-900"
        >
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              className="text-6xl"
            >
              🦐
            </motion.div>
            <div className="mt-5 text-lg font-extrabold tracking-tight">
              会议室预约虾 <span className="text-gradient">· 数字孪生</span>
            </div>
            <div className="mt-1 text-[12px] text-white/40">
              正在构建三维现实模拟…
            </div>
            <div className="mt-4 h-1 w-40 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                className="h-full w-1/2 rounded-full bg-shrimp"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
