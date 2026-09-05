import { DUMMY_WAYPOINTS, PLAYER_SPAWN } from './constants.ts'
import type { Pose } from './constants.ts'

export const initialPlayerPose = (): Pose => ({
  x: PLAYER_SPAWN.x,
  z: PLAYER_SPAWN.z,
  yaw: 0,
})

export const initialDummyPose = (): Pose => ({
  x: DUMMY_WAYPOINTS[0]?.x ?? 0,
  z: DUMMY_WAYPOINTS[0]?.z ?? 0,
  yaw: 0,
})
