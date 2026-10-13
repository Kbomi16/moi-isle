import type { IslePlayer } from '../src/world/realtime.ts'
import type { Pose } from '../src/world/constants.ts'

export type PlayerBook = Map<string, IslePlayer>

export const upsertPlayer = (
  book: PlayerBook,
  player: IslePlayer,
): PlayerBook => {
  const next = new Map(book)
  next.set(player.id, player)
  return next
}

export const movePlayer = (
  book: PlayerBook,
  id: string,
  pose: Pose,
): PlayerBook => {
  const current = book.get(id)
  if (!current) {
    return book
  }
  const next = new Map(book)
  next.set(id, { ...current, pose })
  return next
}

export const dropPlayer = (book: PlayerBook, id: string): PlayerBook => {
  if (!book.has(id)) {
    return book
  }
  const next = new Map(book)
  next.delete(id)
  return next
}

export const listPlayers = (book: PlayerBook): IslePlayer[] =>
  [...book.values()]
