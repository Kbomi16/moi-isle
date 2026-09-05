import { describe, expect, test } from 'bun:test'
import { DUMMY_WAYPOINTS, PLAYER_SPAWN } from './constants.ts'
import { initialDummyPose, initialPlayerPose } from './spawn.ts'

describe('spawn', () => {
  test('플레이어는 스폰 좌표에서 시작한다', () => {
    expect(initialPlayerPose()).toEqual({
      x: PLAYER_SPAWN.x,
      z: PLAYER_SPAWN.z,
      yaw: 0,
    })
  })

  test('더미는 첫 웨이포인트에서 시작한다', () => {
    expect(initialDummyPose()).toEqual({
      x: DUMMY_WAYPOINTS[0]?.x,
      z: DUMMY_WAYPOINTS[0]?.z,
      yaw: 0,
    })
  })
})
