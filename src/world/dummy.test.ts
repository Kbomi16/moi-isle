import { describe, expect, test } from 'bun:test'
import { stepDummy } from './dummy.ts'

describe('stepDummy', () => {
  const waypoints = [
    { x: 0, z: 0 },
    { x: 10, z: 0 },
  ]

  test('목표를 향해 속도만큼 걷는다', () => {
    const result = stepDummy({ x: 0, z: 0 }, 1, waypoints, 1, 2)
    expect(result.position.x).toBeCloseTo(2)
    expect(result.position.z).toBeCloseTo(0)
    expect(result.waypointIndex).toBe(1)
  })

  test('도착하면 다음 웨이포인트로 넘긴다', () => {
    const result = stepDummy({ x: 9.95, z: 0 }, 1, waypoints, 1, 2)
    expect(result.position).toEqual({ x: 10, z: 0 })
    expect(result.waypointIndex).toBe(0)
  })
})
