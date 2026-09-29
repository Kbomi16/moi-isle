export type GuestbookEntry = {
  id: string
  author: string
  text: string
  at: number
}

export const MAX_GUESTBOOK_ENTRIES = 40
export const MAX_GUESTBOOK_TEXT = 80

const STORAGE_KEY = 'moi-isle:guestbook'

export const normalizeGuestbookText = (raw: string): string | null => {
  const text = raw.trim().replace(/\s+/g, ' ')
  if (text.length === 0) {
    return null
  }

  return text.slice(0, MAX_GUESTBOOK_TEXT)
}

export const createGuestbookId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

/** 최신 글이 앞에 오고, 상한을 넘기면 오래된 글을 버린다 */
export const appendGuestbookEntry = (
  entries: GuestbookEntry[],
  entry: GuestbookEntry,
  max = MAX_GUESTBOOK_ENTRIES,
): GuestbookEntry[] => [entry, ...entries].slice(0, max)

const isEntry = (value: unknown): value is GuestbookEntry => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'author' in value &&
    typeof value.author === 'string' &&
    'text' in value &&
    typeof value.text === 'string' &&
    'at' in value &&
    typeof value.at === 'number'
  )
}

export const parseGuestbook = (raw: string): GuestbookEntry[] => {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isEntry).slice(0, MAX_GUESTBOOK_ENTRIES)
  } catch {
    return []
  }
}

export const readGuestbook = (): GuestbookEntry[] => {
  if (typeof localStorage === 'undefined') {
    return []
  }

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  return parseGuestbook(raw)
}

export const writeGuestbook = (entries: GuestbookEntry[]): void => {
  if (typeof localStorage === 'undefined') {
    return
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries.slice(0, MAX_GUESTBOOK_ENTRIES)),
  )
}
