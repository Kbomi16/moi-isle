import { describe, expect, test } from 'bun:test'
import { isWalkable } from './island.ts'
import { stepWalk, walkVector } from './movement.ts'

describe('walkVector', () => {
  test('카메라 yaw 0에서 전진은 -Z다', () => {
    const dir = walkVector(
      { forward: true, back: false, left: false, right: false },
      0,
    )
    expect(dir.x).toBeCloseTo(0)
    expect(dir.z).toBeCloseTo(-1)
  })

  test('카메라 yaw 0에서 우향은 +X다', () => {
    const dir = walkVector(
      { forward: false, back: false, left: false, right: true },
      0,
    )
    expect(dir.x).toBeCloseTo(1)
    expect(dir.z).toBeCloseTo(0)
  })

  test('대각선은 길이가 1이다', () => {
    const dir = walkVector(
      { forward: true, back: false, left: false, right: true },
      0,
    )
    expect(Math.hypot(dir.x, dir.z)).toBeCloseTo(1)
  })

  test('입력이 없으면 멈춘다', () => {
    expect(
      walkVector({ forward: false, back: false, left: false, right: false }, 0),
    ).toEqual({ x: 0, z: 0 })
  })
})

describe('stepWalk', () => {
  test('입력이 없으면 위치와 yaw를 유지한다', () => {
    const result = stepWalk(
      { x: 1, z: 2 },
      { forward: false, back: false, left: false, right: false },
      0,
      1,
      2,
      0.4,
    )
    expect(result.position).toEqual({ x: 1, z: 2 })
    expect(result.yaw).toBe(0.4)
    expect(result.moving).toBe(false)
  })

  test('전진하면 속도만큼 -Z로 움직인다', () => {
    const result = stepWalk(
      { x: 0, z: 0 },
      { forward: true, back: false, left: false, right: false },
      0,
      1,
      2,
      0,
    )
    expect(result.position.x).toBeCloseTo(0)
    expect(result.position.z).toBeCloseTo(-2)
    expect(result.moving).toBe(true)
  })

  test('섬 밖으로 나가지 않는다', () => {
    const result = stepWalk(
      { x: 80, z: 0 },
      { forward: false, back: false, left: false, right: true },
      0,
      1,
      4,
      0,
    )
    expect(isWalkable(result.position)).toBe(true)
  })
})
