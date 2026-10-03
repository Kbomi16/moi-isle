import { describe, expect, it } from 'bun:test'
import {
  addRoomItem,
  clampRoomPosition,
  DEFAULT_ROOM_ITEMS,
  parseRoomLayout,
  readRoomLayout,
  removeRoomItem,
  rotateRoomItem,
  updateRoomItem,
  writeRoomLayout,
} from './roomLayout.ts'

describe('clampRoomPosition', () => {
  it('방 경계 안으로 맞춘다', () => {
    expect(clampRoomPosition(10, -10)).toEqual({ x: 2.85, z: -2.35 })
  })
})

describe('parseRoomLayout', () => {
  it('깨진 JSON은 빈 배열이다', () => {
    expect(parseRoomLayout('nope')).toEqual([])
  })

  it('형식이 맞는 항목만 남긴다', () => {
    const raw = JSON.stringify([
      { id: '1', model: 'bed', position: [0, 0, 0], rotationY: 0 },
      { id: '2', model: 'unknown', position: [0, 0, 0], rotationY: 0 },
    ])
    expect(parseRoomLayout(raw).map((item) => item.id)).toEqual(['1'])
  })
})

describe('room layout mutations', () => {
  it('가구를 추가·이동·회전·삭제한다', () => {
    let items = DEFAULT_ROOM_ITEMS.slice(0, 1)
    items = addRoomItem(items, 'chair')
    const added = items.at(-1)
    expect(added?.model).toBe('chair')
    expect(addRoomItem(items, 'chair')).toEqual(items)

    if (!added) {
      throw new Error('missing item')
    }

    items = updateRoomItem(items, added.id, {
      position: [1, 0, 1],
    })
    expect(items.find((entry) => entry.id === added.id)?.position[0]).toBe(1)

    items = rotateRoomItem(items, added.id, Math.PI / 2)
    expect(items.find((entry) => entry.id === added.id)?.rotationY).toBeCloseTo(
      Math.PI / 2,
    )

    items = removeRoomItem(items, added.id)
    expect(items.some((entry) => entry.id === added.id)).toBe(false)
  })
})

describe('readRoomLayout', () => {
  it('저장 후 다시 읽는다', () => {
    const storage = new Map<string, string>()
    const original = globalThis.localStorage
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value)
        },
      },
    })

    try {
      writeRoomLayout([DEFAULT_ROOM_ITEMS[0]])
      expect(readRoomLayout()).toHaveLength(1)
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: original,
      })
    }
  })
})
