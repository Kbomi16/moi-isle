import { describe, expect, test } from 'bun:test'
import {
  clampToIsland,
  groundHeight,
  islandSignedDistance,
  isOnIsland,
  isWalkable,
  pathDistance,
} from './island.ts'
import {
  HOUSES,
  PLAYER_SPAWN,
  SAND_INNER,
  VILLAGE_PLAZA,
  WATER_Y,
} from './constants.ts'

describe('island', () => {
  test('마을 광장과 스폰은 걸을 수 있다', () => {
    expect(isWalkable({ x: VILLAGE_PLAZA.x, z: VILLAGE_PLAZA.z })).toBe(true)
    expect(isWalkable({ x: PLAYER_SPAWN.x, z: PLAYER_SPAWN.z })).toBe(true)
  })

  test('먼 바다는 걸을 수 없다', () => {
    expect(isWalkable({ x: 80, z: 0 })).toBe(false)
    expect(isOnIsland({ x: 22, z: 0 })).toBe(false)
  })

  test('섬 안 좌표는 그대로 둔다', () => {
    expect(clampToIsland({ x: 0, z: 0 })).toEqual({ x: 0, z: 0 })
  })

  test('섬 밖 좌표는 걸을 수 있는 가장자리로 끌어온다', () => {
    const clamped = clampToIsland({ x: 80, z: 0 })
    expect(isWalkable(clamped)).toBe(true)
    expect(clamped.x).toBeLessThan(20)
  })

  test('언덕이 광장보다 높다', () => {
    expect(groundHeight(-7.4, 1.6)).toBeGreaterThan(
      groundHeight(VILLAGE_PLAZA.x, VILLAGE_PLAZA.z),
    )
  })

  test('길 위는 길 밖보다 가깝다', () => {
    expect(pathDistance(0.4, 2.4)).toBeLessThan(0.3)
    expect(pathDistance(18, 18)).toBeGreaterThan(4)
  })

  test('집은 풀밭 위에 있고 물보다 충분히 높다', () => {
    for (const house of HOUSES) {
      expect(islandSignedDistance(house.x, house.z)).toBeLessThan(SAND_INNER)
      expect(groundHeight(house.x, house.z)).toBeGreaterThan(WATER_Y + 2)
    }
  })

  test('섬 가운데는 물 위로 두껍게 올라온다', () => {
    expect(groundHeight(0, 0) - WATER_Y).toBeGreaterThan(2.2)
  })
})
