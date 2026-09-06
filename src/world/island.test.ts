import { describe, expect, test } from 'bun:test'
import {
  clampToIsland,
  groundHeight,
  isWalkable,
  pathDistance,
} from './island.ts'
import { VILLAGE_PLAZA } from './constants.ts'

describe('island', () => {
  test('마을 광장은 걸을 수 있다', () => {
    expect(isWalkable({ x: VILLAGE_PLAZA.x, z: VILLAGE_PLAZA.z })).toBe(true)
    expect(isWalkable({ x: 1.6, z: 6.5 })).toBe(true)
  })

  test('먼 바다는 걸을 수 없다', () => {
    expect(isWalkable({ x: 80, z: 0 })).toBe(false)
  })

  test('섬 안 좌표는 그대로 둔다', () => {
    expect(clampToIsland({ x: 2, z: 0 })).toEqual({ x: 2, z: 0 })
  })

  test('섬 밖 좌표는 걸을 수 있는 가장자리로 끌어온다', () => {
    const clamped = clampToIsland({ x: 80, z: 0 })
    expect(isWalkable(clamped)).toBe(true)
    expect(clamped.x).toBeLessThan(30)
  })

  test('언덕이 광장보다 높다', () => {
    expect(groundHeight(-10, 2.5)).toBeGreaterThan(groundHeight(2.2, -1.4))
  })

  test('길 위는 길 밖보다 가깝다', () => {
    expect(pathDistance(1.6, 4.2)).toBeLessThan(0.2)
    expect(pathDistance(12, 12)).toBeGreaterThan(4)
  })
})
