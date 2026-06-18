import {
  Presentation,
  PenLine,
  Snowflake,
  Volume2,
  Video,
  Tv,
  Wifi,
  type LucideIcon,
} from 'lucide-react'
import type { EquipmentKey } from '../types'
import { EQUIPMENT_LABEL } from '../data/rooms'

const ICONS: Record<EquipmentKey, LucideIcon> = {
  projector: Presentation,
  whiteboard: PenLine,
  ac: Snowflake,
  sound: Volume2,
  videoConf: Video,
  tv: Tv,
  wifi: Wifi,
}

export function EquipmentChips({
  items,
  size = 12,
}: {
  items: EquipmentKey[]
  size?: number
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((k) => {
        const Icon = ICONS[k]
        return (
          <span
            key={k}
            className="chip bg-white/5 text-white/70 ring-1 ring-white/10"
          >
            <Icon size={size} className="text-shrimp" />
            {EQUIPMENT_LABEL[k]}
          </span>
        )
      })}
    </div>
  )
}
