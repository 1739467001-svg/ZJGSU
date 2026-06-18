import type { Booking } from '../types'
import { generateBookings } from './mock'

/**
 * Data-source seam for the digital twin.
 *
 * Phase 1 — 现实模拟 (current): a deterministic mock that mirrors the live
 * 6 rooms × 10 slots, so the 3D scene is fully interactive with zero backend.
 *
 * Phase 2 — 孪生 (next): replace `getInitialBookings()` with `fetchLiveBookings()`
 * below. It calls the existing Flask **v2 API** (X-API-Key auth) and maps real
 * reservation rows into `Booking[]`. Nothing in the 3D layer changes — the scene
 * already renders whatever the store holds, so the twin "lights up" automatically.
 */
export function getInitialBookings(): Booking[] {
  return generateBookings()
}

/* ----------------------------------------------------------------------------
 * Future live link (kept as a reference for the v2 API integration):
 *
 * const API_BASE = import.meta.env.VITE_API_BASE ?? ''
 * const API_KEY = import.meta.env.VITE_API_KEY ?? ''
 *
 * export async function fetchLiveBookings(date: string): Promise<Booking[]> {
 *   const res = await fetch(`${API_BASE}/api/v2/reservations?date=${date}`, {
 *     headers: { 'X-API-Key': API_KEY },
 *   })
 *   if (!res.ok) throw new Error(`v2 API responded ${res.status}`)
 *   const rows = await res.json()
 *   // map { id, room, slotIndex, userName } -> Booking
 *   return rows.map((r: any, i: number) => ({
 *     id: r.id ?? i,
 *     roomId: String(r.room),
 *     slot: r.slotIndex,
 *     name: r.userName,
 *   }))
 * }
 * ------------------------------------------------------------------------- */
