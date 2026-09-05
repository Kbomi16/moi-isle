import { describe, expect, test } from 'bun:test'
import { ISLAND_WALK_RADIUS } from './constants.ts'
import { clampToIsland } from './island.ts'

describe('clampToIsland', () => {
  test('섬 안 좌표는 그대로 둔다', () => {
    expect(clampToIsland({ x: 3, z: -2 }, ISLAND_WALK_RADIUS)).toEqual({
      x: 3,
      z: -2,
    })
  })

  test('섬 밖 좌표는 가장자리로 끌어온다', () => {
    const clamped = clampToIsland({ x: 100, z: 0 }, ISLAND_WALK_RADIUS)
    expect(clamped.z).toBeCloseTo(0)
    expect(clamped.x).toBeCloseTo(ISLAND_WALK_RADIUS)
    expect(Math.hypot(clamped.x, clamped.z)).toBeCloseTo(ISLAND_WALK_RADIUS)
  })
})
