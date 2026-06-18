import type { Booking } from '../types'
import { ROOMS } from './rooms'
import { TIME_SLOTS } from './slots'

/** The signed-in teacher (matches the live system screenshots). */
export const CURRENT_USER = '平力俊'

/** Reserver name pool drawn from the live heat-map + a few extras. */
export const NAMES = [
  '黎美杉',
  '吴静文',
  '高明',
  '李霞',
  '刘巍',
  '章宦成',
  '华惊宇',
  '钱赛赛',
  '陈俊烨',
  '诸葛斌',
  '蒋献',
  '周明远',
  '林知夏',
  '张恒',
]

/** Deterministic PRNG so the demo looks identical on every reload. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Build a believable day of reservations: busier mid-morning and
 * mid-afternoon, lighter at lunch and night, with the current user
 * holding a few slots so "我的预约" is populated.
 */
export function generateBookings(seed = 20260618): Booking[] {
  const rand = mulberry32(seed)
  const bookings: Booking[] = []
  let id = 8800

  // Bias per slot — peaks around 09:00–11:00 and 13:30–16:00.
  const slotBias = [0.55, 0.7, 0.62, 0.18, 0.66, 0.6, 0.45, 0.3, 0.25, 0.2]

  for (const room of ROOMS) {
    for (let s = 0; s < TIME_SLOTS.length; s++) {
      if (rand() < slotBias[s] * 0.78) {
        bookings.push({
          id: id++,
          roomId: room.id,
          slot: s,
          name: NAMES[Math.floor(rand() * NAMES.length)],
        })
      }
    }
  }

  // Guarantee the current user owns a handful of varied slots.
  const mine: Array<[string, number]> = [
    ['529', 4],
    ['529', 5],
    ['513', 1],
    ['317', 7],
  ]
  for (const [roomId, slot] of mine) {
    const existing = bookings.find((b) => b.roomId === roomId && b.slot === slot)
    if (existing) existing.name = CURRENT_USER
    else bookings.push({ id: id++, roomId, slot, name: CURRENT_USER })
  }

  return bookings
}
