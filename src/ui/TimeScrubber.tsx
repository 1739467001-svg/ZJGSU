import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { useStore } from '../store/useStore'
import { TIME_SLOTS, slotLabel } from '../data/slots'
import { roomsBusyAt } from '../lib/utils'
import { ROOMS } from '../data/rooms'

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1 text-[11px] text-white/55">
      <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 7px ${color}` }} />
      {label}
    </span>
  )
}

export default function TimeScrubber() {
  const slotIndex = useStore((s) => s.slotIndex)
  const setSlot = useStore((s) => s.setSlot)
  const stepSlot = useStore((s) => s.stepSlot)
  const playing = useStore((s) => s.playing)
  const togglePlay = useStore((s) => s.togglePlay)
  const bookings = useStore((s) => s.bookings)

  const busy = roomsBusyAt(bookings, slotIndex)

  return (
    <div className="pointer-events-auto absolute bottom-5 left-1/2 z-20 w-[min(640px,calc(100vw-32px))] -translate-x-1/2">
      <div className="glass-strong rounded-2xl px-4 py-3">
        {/* top row */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-white/40">时间轴</span>
            <span className="stat-num text-base font-bold text-zsblue-light">{slotLabel(slotIndex)}</span>
          </div>
          <div className="flex items-center gap-3">
            <LegendDot color="#22d39a" label="空闲" />
            <LegendDot color="#ff5d7a" label="已占用" />
            <LegendDot color="#22d3ee" label="我的" />
          </div>
        </div>

        {/* controls + slider */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => stepSlot(-1)}
              className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/70 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              <SkipBack size={15} />
            </button>
            <button
              onClick={togglePlay}
              className="grid h-9 w-9 place-items-center rounded-lg bg-zsblue text-white shadow-glow-blue transition hover:brightness-110"
            >
              {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <button
              onClick={() => stepSlot(1)}
              className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/70 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              <SkipForward size={15} />
            </button>
          </div>

          <div className="flex-1">
            <input
              type="range"
              className="scrubber w-full"
              min={0}
              max={TIME_SLOTS.length - 1}
              step={1}
              value={slotIndex}
              onChange={(e) => setSlot(Number(e.target.value))}
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-white/35">
              <span>{TIME_SLOTS[0].start}</span>
              <span>{TIME_SLOTS[TIME_SLOTS.length - 1].end}</span>
            </div>
          </div>

          <div className="w-[78px] shrink-0 text-right leading-tight">
            <div className="stat-num text-lg font-bold text-busy">
              {busy}
              <span className="text-xs text-white/40">/{ROOMS.length}</span>
            </div>
            <div className="text-[10px] text-white/40">间占用</div>
          </div>
        </div>
      </div>
    </div>
  )
}
