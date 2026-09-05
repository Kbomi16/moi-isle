import type { Vec2 } from './constants.ts'

export const distanceXZ = (a: Vec2, b: Vec2): number =>
  Math.hypot(a.x - b.x, a.z - b.z)

export const isWithinRange = (a: Vec2, b: Vec2, range: number): boolean =>
  distanceXZ(a, b) <= range
