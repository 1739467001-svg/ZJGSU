import { create } from 'zustand'
import type { Booking, ViewMode } from '../types'
import { TIME_SLOTS } from '../data/slots'
import { CURRENT_USER } from '../data/mock'
import { getInitialBookings } from '../data/source'
import { bookingAt } from '../lib/utils'

interface State {
  view: ViewMode
  selectedRoomId: string | null
  hoveredRoomId: string | null
  /** index into TIME_SLOTS currently being visualised ("now" on the scrubber) */
  slotIndex: number
  playing: boolean
  bookings: Booking[]
  currentUser: string
  selectedDate: string

  selectRoom: (id: string) => void
  back: () => void
  setHovered: (id: string | null) => void
  setSlot: (i: number) => void
  stepSlot: (dir: number) => void
  togglePlay: () => void
  book: (roomId: string, slot: number) => void
  cancel: (bookingId: number) => void
}

let nextId = 9900

export const useStore = create<State>((set, get) => ({
  view: 'overview',
  selectedRoomId: null,
  hoveredRoomId: null,
  slotIndex: 4, // 13:30–15:00, matching the live dashboard snapshot
  playing: false,
  bookings: getInitialBookings(),
  currentUser: CURRENT_USER,
  selectedDate: '2026-06-18',

  selectRoom: (id) => set({ selectedRoomId: id, view: 'room', hoveredRoomId: null }),
  back: () => set({ view: 'overview', hoveredRoomId: null }),
  setHovered: (id) => set({ hoveredRoomId: id }),

  setSlot: (i) =>
    set({ slotIndex: Math.max(0, Math.min(TIME_SLOTS.length - 1, i)) }),

  stepSlot: (dir) =>
    set((s) => ({
      slotIndex:
        (s.slotIndex + dir + TIME_SLOTS.length) % TIME_SLOTS.length,
    })),

  togglePlay: () => set((s) => ({ playing: !s.playing })),

  book: (roomId, slot) => {
    const { bookings, currentUser } = get()
    if (bookingAt(bookings, roomId, slot)) return // slot taken
    set({
      bookings: [
        ...bookings,
        { id: nextId++, roomId, slot, name: currentUser },
      ],
    })
  },

  cancel: (bookingId) =>
    set((s) => ({ bookings: s.bookings.filter((b) => b.id !== bookingId) })),
}))
