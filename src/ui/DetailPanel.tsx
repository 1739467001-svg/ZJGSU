import { motion } from 'framer-motion'
import { ArrowLeft, Check, Lock, User, MapPin, Users, Plus } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ROOM_BY_ID } from '../data/rooms'
import { TIME_SLOTS, slotLabel } from '../data/slots'
import { bookingAt, STATUS_COLOR, cn } from '../lib/utils'
import { EquipmentChips } from './EquipmentChips'

export default function DetailPanel() {
  const selectedRoomId = useStore((s) => s.selectedRoomId)
  const bookings = useStore((s) => s.bookings)
  const slotIndex = useStore((s) => s.slotIndex)
  const user = useStore((s) => s.currentUser)
  const setSlot = useStore((s) => s.setSlot)
  const book = useStore((s) => s.book)
  const cancel = useStore((s) => s.cancel)
  const back = useStore((s) => s.back)

  if (!selectedRoomId) return null
  const room = ROOM_BY_ID[selectedRoomId]

  return (
    <motion.aside
      initial={{ x: 360, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 360, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="glass-strong pointer-events-auto absolute right-4 top-[84px] bottom-[112px] z-20 flex w-[340px] flex-col rounded-xl"
    >
      {/* header */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <button
          onClick={back}
          className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={14} /> 总览
        </button>
        <div className="ml-1 leading-tight">
          <div className="text-base font-extrabold">{room.name}</div>
          <div className="text-[11px] text-white/45">数字孪生 · 实时占用</div>
        </div>
      </div>

      {/* meta */}
      <div className="space-y-2.5 border-b border-white/10 px-4 py-3 text-[12px] text-white/60">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="flex items-center gap-1"><MapPin size={13} className="text-zsblue-light" /> {room.floor} 楼</span>
          <span className="flex items-center gap-1"><Users size={13} className="text-zsblue-light" /> 可容纳 {room.capacity} 人</span>
          <span className="flex items-center gap-1"><User size={13} className="text-zsblue-light" /> 管理员 {room.manager}</span>
        </div>
        <EquipmentChips items={room.equipment} />
      </div>

      {/* slot list */}
      <div className="flex items-center justify-between px-4 pb-1 pt-3">
        <span className="text-sm font-semibold">全天时段</span>
        <span className="text-[11px] text-white/40">点击时段在 3D 中预览</span>
      </div>
      <div className="scroll-thin flex-1 space-y-1 overflow-y-auto px-3 pb-3">
        {TIME_SLOTS.map((_, i) => {
          const b = bookingAt(bookings, room.id, i)
          const status = b ? (b.name === user ? 'mine' : 'busy') : 'free'
          const accent = STATUS_COLOR[status]
          const current = i === slotIndex
          return (
            <div
              key={i}
              onClick={() => setSlot(i)}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition',
                current
                  ? 'border-white/25 bg-white/[0.06]'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.045]',
              )}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: accent, boxShadow: `0 0 7px ${accent}` }}
              />
              <span className="stat-num w-[92px] shrink-0 text-[12px] text-white/80">
                {slotLabel(i)}
              </span>
              <span className="flex-1 truncate text-[12px]" style={{ color: accent }}>
                {status === 'free' ? '空闲' : status === 'mine' ? '我的预约' : b?.name}
              </span>

              {status === 'free' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    book(room.id, i)
                    setSlot(i)
                  }}
                  className="flex items-center gap-1 rounded-md bg-free/15 px-2 py-1 text-[11px] font-semibold text-free ring-1 ring-free/30 transition hover:bg-free/25"
                >
                  <Plus size={12} /> 预约
                </button>
              )}
              {status === 'mine' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (b) cancel(b.id)
                  }}
                  className="flex items-center gap-1 rounded-md bg-mine/15 px-2 py-1 text-[11px] font-semibold text-mine ring-1 ring-mine/30 transition hover:bg-mine/25"
                >
                  <Check size={12} /> 取消
                </button>
              )}
              {status === 'busy' && (
                <span className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-[11px] text-white/35">
                  <Lock size={12} /> 已占
                </span>
              )}
            </div>
          )
        })}
      </div>
    </motion.aside>
  )
}
