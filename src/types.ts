// Shared domain types for the meeting-room digital twin.

export type EquipmentKey =
  | 'projector'
  | 'whiteboard'
  | 'ac'
  | 'sound'
  | 'videoConf'
  | 'tv'
  | 'wifi'

export interface Room {
  /** Short id used everywhere, e.g. "513" */
  id: string
  /** Display name, e.g. "信电楼513" */
  name: string
  /** Building floor (3 or 5) */
  floor: number
  /** Seating capacity (人) */
  capacity: number
  /** Room manager (管理员) */
  manager: string
  equipment: EquipmentKey[]
  /** Footprint in metres, used by both overview and interior */
  size: { w: number; d: number }
  /** Position on the floor plate (overview layout) */
  pos: { x: number; z: number }
}

export interface TimeSlot {
  start: string // "08:00"
  end: string // "09:00"
}

export interface Booking {
  id: number
  roomId: string
  /** index into TIME_SLOTS */
  slot: number
  /** reserver name */
  name: string
}

export type RoomStatus = 'free' | 'busy' | 'mine'

export type ViewMode = 'overview' | 'room'
