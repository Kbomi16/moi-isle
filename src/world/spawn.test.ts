import { describe, expect, test } from 'bun:test'
import { PLAYER_SPAWN, VILLAGERS } from './constants.ts'
import { initialNpcPoses, initialPlayerPose } from './spawn.ts'

describe('spawn', () => {
  test('플레이어는 스폰 좌표에서 시작한다', () => {
    expect(initialPlayerPose()).toEqual({
      x: PLAYER_SPAWN.x,
      z: PLAYER_SPAWN.z,
      yaw: 0,
    })
  })

  test('주민은 첫 웨이포인트에서 시작한다', () => {
    const poses = initialNpcPoses()
    const first = VILLAGERS[0]
    if (!first) {
      throw new Error('주민이 없다')
    }
    expect(poses[first.id]).toEqual({
      x: first.waypoints[0]?.x,
      z: first.waypoints[0]?.z,
      yaw: 0,
    })
    expect(Object.keys(poses)).toHaveLength(VILLAGERS.length)
  })
})
