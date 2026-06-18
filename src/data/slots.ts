import type { TimeSlot } from '../types'

/** Reservation time slots, matching the live heat-map (08:00 – 21:00). */
export const TIME_SLOTS: TimeSlot[] = [
  { start: '08:00', end: '09:00' },
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:30' },
  { start: '11:30', end: '13:30' },
  { start: '13:30', end: '15:00' },
  { start: '15:00', end: '16:15' },
  { start: '16:15', end: '18:00' },
  { start: '18:00', end: '19:00' },
  { start: '19:00', end: '20:00' },
  { start: '20:00', end: '21:00' },
]

export const slotLabel = (i: number): string => {
  const s = TIME_SLOTS[i]
  return s ? `${s.start}–${s.end}` : '—'
}

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Index of the slot containing the given Date (clamped to the day's range). */
export function slotIndexForDate(d: Date): number {
  const mins = d.getHours() * 60 + d.getMinutes()
  for (let i = 0; i < TIME_SLOTS.length; i++) {
    if (mins < toMinutes(TIME_SLOTS[i].end)) return i
  }
  return TIME_SLOTS.length - 1
}
