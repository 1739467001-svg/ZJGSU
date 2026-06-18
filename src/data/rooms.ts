import type { Room } from '../types'

/**
 * The six real meeting rooms of the ZJGSU College of Information & AI.
 * Capacities / equipment for 513 (20人) and 534 (30人) match the live
 * system screenshots; the rest are plausible mock values pending the v2 API.
 */
export const ROOMS: Room[] = [
  // ---- 3F ----
  {
    id: '317',
    name: '信电楼317',
    floor: 3,
    capacity: 12,
    manager: '王丽华',
    equipment: ['projector', 'whiteboard', 'ac', 'wifi'],
    size: { w: 6.2, d: 5.0 },
    pos: { x: -8.5, z: 0 },
  },
  {
    id: '318',
    name: '信电楼318',
    floor: 3,
    capacity: 10,
    manager: '王丽华',
    equipment: ['whiteboard', 'ac', 'tv', 'wifi'],
    size: { w: 5.6, d: 5.0 },
    pos: { x: 0, z: 0 },
  },
  {
    id: '330',
    name: '信电楼330',
    floor: 3,
    capacity: 8,
    manager: '王丽华',
    equipment: ['projector', 'whiteboard', 'ac'],
    size: { w: 5.0, d: 4.6 },
    pos: { x: 8, z: 0 },
  },
  // ---- 5F ----
  {
    id: '513',
    name: '信电楼513',
    floor: 5,
    capacity: 20,
    manager: '马秀丽',
    equipment: ['projector', 'whiteboard', 'ac', 'sound', 'videoConf'],
    size: { w: 8.2, d: 6.0 },
    pos: { x: -9.5, z: 0 },
  },
  {
    id: '529',
    name: '信电楼529',
    floor: 5,
    capacity: 16,
    manager: '马秀丽',
    equipment: ['projector', 'whiteboard', 'ac', 'tv'],
    size: { w: 7.0, d: 5.6 },
    pos: { x: 0.5, z: 0 },
  },
  {
    id: '534',
    name: '信电楼534',
    floor: 5,
    capacity: 30,
    manager: '马秀丽',
    equipment: ['projector', 'whiteboard', 'ac', 'videoConf', 'sound'],
    size: { w: 10.0, d: 7.0 },
    pos: { x: 11, z: 0 },
  },
]

export const ROOM_BY_ID: Record<string, Room> = Object.fromEntries(
  ROOMS.map((r) => [r.id, r]),
)

/** Distinct floors, high → low, used to stack floor plates in the overview. */
export const FLOORS = [...new Set(ROOMS.map((r) => r.floor))].sort((a, b) => a - b)

/** Vertical gap between stacked floor plates in the overview (metres). */
export const FLOOR_GAP = 7

/** World-space Y of a floor plate in the overview. */
export function floorY(floor: number): number {
  return FLOORS.indexOf(floor) * FLOOR_GAP
}

export const EQUIPMENT_LABEL: Record<string, string> = {
  projector: '投影仪',
  whiteboard: '白板',
  ac: '空调',
  sound: '音响',
  videoConf: '视频会议',
  tv: '电视',
  wifi: 'WiFi',
}
