import { useEffect } from 'react'
import { useStore } from '../store/useStore'

/** Auto-advances the time scrubber while "playing", so the building
 *  visibly fills and empties across the day. */
export default function PlayTicker() {
  const playing = useStore((s) => s.playing)
  const stepSlot = useStore((s) => s.stepSlot)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => stepSlot(1), 1400)
    return () => clearInterval(id)
  }, [playing, stepSlot])

  return null
}
