import { describe, expect, test } from 'bun:test'
import type { GuestbookEntry } from '../src/world/guestbook.ts'
import type { RoomItem } from '../src/world/roomLayout.ts'
import type { PlacedStack } from '../src/world/roomStacks.ts'
import {
  appendRoomGuestbook,
  dropRoom,
  ensureRoom,
  replaceRoomLayout,
  seedRoomGuestbook,
} from './rooms.ts'

const bed: RoomItem = {
  id: 'bed-1',
  model: 'bed',
  position: [0, 0, 0],
  rotationY: 0,
}

const reactStack: PlacedStack = {
  id: 'stack-1',
  stackId: 'react',
  position: [0, 1.8, -2.44],
  rotationY: 0,
}

const note = (id: string): GuestbookEntry => ({
  id,
  author: '보미',
  text: '안녕',
  at: 1,
})

describe('room book', () => {
  test('가구를 바꿔도 방명록은 남긴다', () => {
    let book = ensureRoom(new Map(), 'owner')
    book = seedRoomGuestbook(book, 'owner', [note('keep')])
    book = replaceRoomLayout(book, 'owner', [bed], [reactStack])
    expect(book.get('owner')?.items).toEqual([bed])
    expect(book.get('owner')?.stacks).toEqual([reactStack])
    expect(book.get('owner')?.guestbook.map((entry) => entry.id)).toEqual(['keep'])
  })

  test('없는 방의 가구 변경은 무시한다', () => {
    const book = new Map()
    expect(replaceRoomLayout(book, 'missing', [bed], [])).toBe(book)
  })

  test('비어 있으면 심고, 이미 있으면 없는 글만 합친다', () => {
    let book = ensureRoom(new Map(), 'owner')
    book = seedRoomGuestbook(book, 'owner', [note('first')])
    book = seedRoomGuestbook(book, 'owner', [{ ...note('later'), at: 2 }])
    book = seedRoomGuestbook(book, 'owner', [note('first')])
    expect(book.get('owner')?.guestbook.map((entry) => entry.id)).toEqual([
      'later',
      'first',
    ])
  })

  test('방문자의 글은 앞에 붙고, 없는 방이면 거절한다', () => {
    let book = ensureRoom(new Map(), 'owner')
    book = seedRoomGuestbook(book, 'owner', [note('old')])
    const next = appendRoomGuestbook(book, 'owner', note('new'))
    expect(next?.get('owner')?.guestbook.map((entry) => entry.id)).toEqual([
      'new',
      'old',
    ])
    expect(appendRoomGuestbook(book, 'missing', note('nope'))).toBeNull()
  })

  test('퇴장하면 그 방을 지운다', () => {
    const book = dropRoom(ensureRoom(new Map(), 'owner'), 'owner')
    expect(book.has('owner')).toBe(false)
  })
})
