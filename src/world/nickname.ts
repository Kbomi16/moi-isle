import { MAX_NICKNAME } from './constants.ts'

export const normalizeNickname = (raw: string): string | null => {
  const name = raw.trim().replace(/\s+/g, ' ')
  if (name.length === 0) {
    return null
  }

  return name.slice(0, MAX_NICKNAME)
}
