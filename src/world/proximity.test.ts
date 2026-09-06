import { describe, expect, test } from 'bun:test'
import { distanceXZ, isWithinRange } from './proximity.ts'

describe('proximity', () => {
  test('같은 자리의 거리는 0이다', () => {
    expect(distanceXZ({ x: 1, z: 2 }, { x: 1, z: 2 })).toBe(0)
  })

  test('범위 안팎을 가른다', () => {
    expect(isWithinRange({ x: 0, z: 0 }, { x: 3, z: 0 }, 3.2)).toBe(true)
    expect(isWithinRange({ x: 0, z: 0 }, { x: 4, z: 0 }, 3.2)).toBe(false)
  })
})
