import { useEffect, useState, type ReactNode } from 'react'
import { Activity, CalendarDays, Layers, Zap } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ROOMS } from '../data/rooms'
import { roomsBusyAt, utilization, pct } from '../lib/utils'

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode
  label: string
  value: string
  accent?: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-1.5 ring-1 ring-white/10">
      <span className="text-white/40">{icon}</span>
      <div className="leading-tight">
        <div className="stat-num text-sm" style={accent ? { color: accent } : undefined}>
          {value}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-white/40">{label}</div>
      </div>
    </div>
  )
}

export default function TopBar() {
  const bookings = useStore((s) => s.bookings)
  const slotIndex = useStore((s) => s.slotIndex)
  const date = useStore((s) => s.selectedDate)
  const [clock, setClock] = useState('')

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const busy = roomsBusyAt(bookings, slotIndex)

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-4 py-3">
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-shrimp/15 text-2xl ring-1 ring-shrimp/40">
          🦐
        </div>
        <div className="leading-tight">
          <h1 className="text-[17px] font-extrabold tracking-tight">
            会议室预约虾 <span className="text-gradient">· 数字孪生</span>
          </h1>
          <p className="text-[11px] text-white/45">
            浙江工商大学 · 信电人工智能学院 — 三维现实模拟 Reality-Twin
          </p>
        </div>
      </div>

      <div className="pointer-events-auto hidden items-center gap-2 md:flex">
        <Stat
          icon={<CalendarDays size={16} />}
          label="今日预约"
          value={`${bookings.length} 条`}
          accent="#22d39a"
        />
        <Stat
          icon={<Activity size={16} />}
          label="当前占用"
          value={`${busy}/${ROOMS.length}`}
          accent="#ff4d6d"
        />
        <Stat
          icon={<Layers size={16} />}
          label="整体利用率"
          value={pct(utilization(bookings))}
          accent="#38bdf8"
        />
        <Stat icon={<Zap size={16} />} label="历史数据" value="1022 条" />
        <div className="ml-1 rounded-lg bg-ink-900/70 px-3 py-1.5 text-right ring-1 ring-white/10">
          <div className="stat-num text-base text-shrimp">{clock}</div>
          <div className="text-[10px] text-white/40">{date}</div>
        </div>
      </div>
    </header>
  )
}
