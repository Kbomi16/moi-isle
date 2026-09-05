import type { Vec2 } from './constants.ts'

const ARRIVE_DISTANCE = 0.15

export const stepDummy = (
  position: Vec2,
  waypointIndex: number,
  waypoints: Vec2[],
  dt: number,
  speed: number,
): { position: Vec2; waypointIndex: number; yaw: number } => {
  const target = waypoints[waypointIndex]
  if (!target) {
    return { position, waypointIndex, yaw: 0 }
  }

  const dx = target.x - position.x
  const dz = target.z - position.z
  const distance = Math.hypot(dx, dz)
  const yaw = Math.atan2(dx, dz)

  if (distance <= ARRIVE_DISTANCE) {
    return {
      position: { x: target.x, z: target.z },
      waypointIndex: (waypointIndex + 1) % waypoints.length,
      yaw,
    }
  }

  return {
    position: {
      x: position.x + (dx / distance) * speed * dt,
      z: position.z + (dz / distance) * speed * dt,
    },
    waypointIndex,
    yaw,
  }
}
