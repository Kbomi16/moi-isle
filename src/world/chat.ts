import { MAX_CHAT } from './constants.ts'
import { isWithinRange } from './proximity.ts'
import type { Vec2 } from './constants.ts'

export type Listener = {
  id: string
  position: Vec2
}

export const normalizeChat = (raw: string): string | null => {
  const text = raw.trim().replace(/\s+/g, ' ')
  if (text.length === 0) {
    return null
  }

  return text.slice(0, MAX_CHAT)
}

export const listenerIdsInRange = (
  speaker: Vec2,
  listeners: Listener[],
  range: number,
): string[] =>
  listeners
    .filter((listener) => isWithinRange(speaker, listener.position, range))
    .map((listener) => listener.id)
