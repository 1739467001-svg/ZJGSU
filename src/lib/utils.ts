import clsx, { type ClassValue } from 'clsx'
import type { Booking, RoomStatus } from '../types'
import { ROOMS } from '../data/rooms'
import { TIME_SLOTS } from '../data/slots'

export const cn = (...inputs: ClassValue[]) => clsx(inputs)

/** Status palette shared by 3D materials and DOM UI. */
export const STATUS_COLOR: Record<RoomStatus, string> = {
  free: '#22d39a',
  busy: '#ff4d6d',
  mine: '#38bdf8',
}

export function bookingAt(
  bookings: Booking[],
  roomId: string,
  slot: number,
): Booking | undefined {
  return bookings.find((b) => b.roomId === roomId && b.slot === slot)
}

export function statusOf(
  bookings: Booking[],
  roomId: string,
  slot: number,
  user: string,
): RoomStatus {
  const b = bookingAt(bookings, roomId, slot)
  if (!b) return 'free'
  return b.name === user ? 'mine' : 'busy'
}

/** How many of the day's slots a room has booked. */
export function dayBooked(bookings: Booking[], roomId: string): number {
  return bookings.filter((b) => b.roomId === roomId).length
}

/** Count of rooms occupied at a given slot. */
export function roomsBusyAt(bookings: Booking[], slot: number): number {
  return ROOMS.reduce(
    (n, r) => n + (bookingAt(bookings, r.id, slot) ? 1 : 0),
    0,
  )
}

/** Whole-day utilisation across every room × slot (0..1). */
export function utilization(bookings: Booking[]): number {
  const total = ROOMS.length * TIME_SLOTS.length
  return total ? bookings.length / total : 0
}

export const pct = (x: number) => `${Math.round(x * 100)}%`
