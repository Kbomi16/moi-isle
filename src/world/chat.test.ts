import { describe, expect, test } from 'bun:test'
import { listenerIdsInRange, normalizeChat } from './chat.ts'

describe('normalizeChat', () => {
  test('빈 말은 거절한다', () => {
    expect(normalizeChat('   ')).toBeNull()
  })

  test('40자를 넘으면 자른다', () => {
    const text = '가'.repeat(45)
    expect(normalizeChat(text)).toBe('가'.repeat(40))
  })

  test('연속 공백을 한 칸으로 줄인다', () => {
    expect(normalizeChat('안녕   모이')).toBe('안녕 모이')
  })
})

describe('listenerIdsInRange', () => {
  test('가까운 청취자만 남긴다', () => {
    const heard = listenerIdsInRange(
      { x: 0, z: 0 },
      [
        { id: 'near', position: { x: 2, z: 0 } },
        { id: 'far', position: { x: 10, z: 0 } },
      ],
      3.2,
    )
    expect(heard).toEqual(['near'])
  })
})
