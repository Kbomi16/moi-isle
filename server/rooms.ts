import {
  appendGuestbookEntry,
  MAX_GUESTBOOK_ENTRIES,
  type GuestbookEntry,
} from '../src/world/guestbook.ts'
import type { RoomItem } from '../src/world/roomLayout.ts'
import type { PlacedStack } from '../src/world/roomStacks.ts'

export type RoomState = {
  items: RoomItem[]
  stacks: PlacedStack[]
  guestbook: GuestbookEntry[]
}

export type RoomBook = Map<string, RoomState>

export const emptyRoomState = (): RoomState => ({
  items: [],
  stacks: [],
  guestbook: [],
})

export const ensureRoom = (book: RoomBook, id: string): RoomBook => {
  if (book.has(id)) {
    return book
  }

  const next = new Map(book)
  next.set(id, emptyRoomState())
  return next
}

/** 주인 가구·스택만 덮어쓴다. 방명록은 그대로 둔다. */
export const replaceRoomLayout = (
  book: RoomBook,
  id: string,
  items: RoomItem[],
  stacks: PlacedStack[],
): RoomBook => {
  const current = book.get(id)
  if (!current) {
    return book
  }

  const next = new Map(book)
  next.set(id, { ...current, items, stacks })
  return next
}

const mergeGuestbook = (
  current: GuestbookEntry[],
  incoming: GuestbookEntry[],
): GuestbookEntry[] => {
  const byId = new Map<string, GuestbookEntry>()
  for (const entry of [...current, ...incoming]) {
    byId.set(entry.id, entry)
  }

  return [...byId.values()]
    .sort((left, right) => right.at - left.at)
    .slice(0, MAX_GUESTBOOK_ENTRIES)
}

/** 이 브라우저에 있던 글을 합친다. 이미 있는 id는 바꾸지 않는다. */
export const seedRoomGuestbook = (
  book: RoomBook,
  id: string,
  entries: GuestbookEntry[],
): RoomBook => {
  const current = book.get(id)
  if (!current || entries.length === 0) {
    return book
  }

  const guestbook = mergeGuestbook(current.guestbook, entries)
  if (
    guestbook.length === current.guestbook.length &&
    guestbook.every((entry, index) => entry.id === current.guestbook[index]?.id)
  ) {
    return book
  }

  const next = new Map(book)
  next.set(id, { ...current, guestbook })
  return next
}

export const appendRoomGuestbook = (
  book: RoomBook,
  id: string,
  entry: GuestbookEntry,
): RoomBook | null => {
  const current = book.get(id)
  if (!current) {
    return null
  }

  const next = new Map(book)
  next.set(id, {
    ...current,
    guestbook: appendGuestbookEntry(current.guestbook, entry),
  })
  return next
}

export const dropRoom = (book: RoomBook, id: string): RoomBook => {
  if (!book.has(id)) {
    return book
  }

  const next = new Map(book)
  next.delete(id)
  return next
}

export const listRooms = (
  book: RoomBook,
): Array<{ id: string } & RoomState> =>
  [...book.entries()].map(([id, room]) => ({ id, ...room }))
