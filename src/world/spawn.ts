import { PLAYER_SPAWN, VILLAGERS } from './constants.ts'
import type { Pose } from './constants.ts'

export const initialPlayerPose = (): Pose => ({
  x: PLAYER_SPAWN.x,
  z: PLAYER_SPAWN.z,
  yaw: 0,
})

export const initialNpcPoses = (): Record<string, Pose> =>
  Object.fromEntries(
    VILLAGERS.map((villager) => [
      villager.id,
      {
        x: villager.waypoints[0]?.x ?? 0,
        z: villager.waypoints[0]?.z ?? 0,
        yaw: 0,
      },
    ]),
  )
