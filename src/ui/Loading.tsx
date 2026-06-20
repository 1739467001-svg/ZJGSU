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
            <motion.img
              src={`${import.meta.env.BASE_URL}zjgsu-emblem.svg`}
              alt="浙江工商大学"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="h-20 w-20 drop-shadow-[0_0_22px_rgba(31,111,224,0.6)]"
            />
            <div className="mt-5 text-lg font-extrabold tracking-tight">
              <span className="mr-1">🦐</span>会议室预约虾 <span className="text-gradient">· 数字孪生</span>
            </div>
            <div className="mt-1 text-[12px] text-white/55">
              浙江工商大学 · 信电人工智能学院
            </div>
            <div className="mt-0.5 text-[11px] tracking-[0.3em] text-zsblue-light">
              诚 毅 勤 朴
            </div>
            <div className="mt-4 text-[12px] text-white/40">正在构建三维现实模拟…</div>
            <div className="mt-3 h-1 w-44 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                className="h-full w-1/2 rounded-full bg-zsblue"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
