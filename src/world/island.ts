import type { Vec2 } from './constants.ts'

export const clampToIsland = (position: Vec2, radius: number): Vec2 => {
  const distance = Math.hypot(position.x, position.z)
  if (distance <= radius || distance === 0) {
    return position
  }

  const scale = radius / distance
  return { x: position.x * scale, z: position.z * scale }
}
