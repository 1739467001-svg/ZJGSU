import { ChevronRight, Users } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ROOMS, FLOORS } from '../data/rooms'
import { cn, dayBooked, statusOf, STATUS_COLOR } from '../lib/utils'
import { TIME_SLOTS } from '../data/slots'
import { EquipmentChips } from './EquipmentChips'

const STATUS_TEXT: Record<string, string> = { free: '空闲', busy: '占用', mine: '我的' }

export default function Sidebar() {
  const bookings = useStore((s) => s.bookings)
  const slotIndex = useStore((s) => s.slotIndex)
  const user = useStore((s) => s.currentUser)
  const hoveredRoomId = useStore((s) => s.hoveredRoomId)
  const selectedRoomId = useStore((s) => s.selectedRoomId)
  const view = useStore((s) => s.view)
  const selectRoom = useStore((s) => s.selectRoom)
  const setHovered = useStore((s) => s.setHovered)

  return (
    <aside className="pointer-events-auto absolute left-4 top-[84px] bottom-[112px] z-20 flex w-[270px] flex-col">
      <div className="glass flex items-center justify-between rounded-t-xl px-3.5 py-2.5">
        <span className="text-sm font-semibold">会议室总览</span>
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/50">
          {ROOMS.length} 间
        </span>
      </div>

      <div className="scroll-thin glass -mt-px flex-1 overflow-y-auto rounded-b-xl px-2.5 py-2">
        {FLOORS.map((floor) => (
          <div key={floor} className="mb-2">
            <div className="px-1.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/35">
              {floor} 楼
            </div>
            {ROOMS.filter((r) => r.floor === floor).map((room) => {
              const status = statusOf(bookings, room.id, slotIndex, user)
              const accent = STATUS_COLOR[status]
              const active =
                (selectedRoomId === room.id && view === 'room') ||
                hoveredRoomId === room.id
              return (
                <button
                  key={room.id}
                  onClick={() => selectRoom(room.id)}
                  onMouseEnter={() => setHovered(room.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    'group mb-1.5 w-full rounded-lg border px-3 py-2 text-left transition',
                    active
                      ? 'border-white/20 bg-white/[0.07]'
                      : 'border-transparent bg-white/[0.02] hover:bg-white/[0.05]',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                      />
                      <span className="text-sm font-bold">{room.name}</span>
                    </div>
                    <span
                      className="rounded px-1.5 py-px text-[10px] font-semibold"
                      style={{ color: accent, background: `${accent}1f` }}
                    >
                      {STATUS_TEXT[status]}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-white/45">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {room.capacity}人
                    </span>
                    <span>全天 {dayBooked(bookings, room.id)}/{TIME_SLOTS.length}</span>
                    <span className="ml-auto flex items-center gap-0.5 text-white/30 group-hover:text-zsblue-light">
                      进入 <ChevronRight size={12} />
                    </span>
                  </div>
                  <div className="mt-2">
                    <EquipmentChips items={room.equipment} size={11} />
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </aside>
  )
}
