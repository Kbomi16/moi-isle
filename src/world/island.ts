import {
  BEACH_WIDTH,
  COLORS,
  GRASS_BASE_Y,
  ISLAND_BLOBS,
  ISLAND_HILLS,
  ISLAND_PATH,
  ISLAND_PATH_BRANCH,
  PATH_HALF,
  SAND_INNER,
  SAND_OUTER,
  SAND_SHELF_Y,
  VILLAGE_PLAZA,
  WALK_INSET,
  WATER_Y,
} from './constants.ts'
import type { Ellipse, Vec2 } from './constants.ts'

const INTERIOR = { x: 0, z: 0.4 }

export const ellipseSignedDistance = (
  x: number,
  z: number,
  blob: Ellipse,
): number => {
  const nx = (x - blob.cx) / blob.rx
  const nz = (z - blob.cz) / blob.rz
  const d = Math.hypot(nx, nz)
  if (d === 0) {
    return -Math.min(blob.rx, blob.rz)
  }

  return (d - 1) * Math.min(blob.rx, blob.rz)
}

export const islandSignedDistance = (x: number, z: number): number => {
  let distance = Number.POSITIVE_INFINITY
  for (const blob of ISLAND_BLOBS) {
    distance = Math.min(distance, ellipseSignedDistance(x, z, blob))
  }
  return distance
}

export const isWalkable = (position: Vec2): boolean =>
  islandSignedDistance(position.x, position.z) <= WALK_INSET

export const isOnIsland = (position: Vec2): boolean =>
  islandSignedDistance(position.x, position.z) <= SAND_OUTER

const segmentDistance = (point: Vec2, start: Vec2, end: Vec2): number => {
  const abx = end.x - start.x
  const abz = end.z - start.z
  const length2 = abx * abx + abz * abz
  if (length2 === 0) {
    return Math.hypot(point.x - start.x, point.z - start.z)
  }

  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * abx + (point.z - start.z) * abz) / length2,
    ),
  )
  return Math.hypot(point.x - (start.x + abx * t), point.z - (start.z + abz * t))
}

const polylineDistance = (point: Vec2, points: readonly Vec2[]): number => {
  let min = Number.POSITIVE_INFINITY
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index]
    const end = points[index + 1]
    if (!start || !end) {
      continue
    }
    min = Math.min(min, segmentDistance(point, start, end))
  }
  return min
}

export const pathDistance = (x: number, z: number): number => {
  const point = { x, z }
  const plaza = Math.max(
    0,
    Math.hypot(x - VILLAGE_PLAZA.x, z - VILLAGE_PLAZA.z) - VILLAGE_PLAZA.radius,
  )
  return Math.min(
    polylineDistance(point, ISLAND_PATH),
    polylineDistance(point, ISLAND_PATH_BRANCH),
    plaza,
  )
}

export const hillHeight = (x: number, z: number): number => {
  let height = 0
  for (const hill of ISLAND_HILLS) {
    const normalized = Math.hypot(x - hill.cx, z - hill.cz) / hill.radius
    if (normalized >= 1) {
      continue
    }
    height += (1 - normalized * normalized) * hill.peak
  }
  return height
}

export const groundHeight = (x: number, z: number): number => {
  const sdf = islandSignedDistance(x, z)
  if (sdf > SAND_OUTER + BEACH_WIDTH) {
    return WATER_Y
  }

  if (sdf > SAND_OUTER) {
    const beachT = (sdf - SAND_OUTER) / BEACH_WIDTH
    return SAND_SHELF_Y * (1 - beachT) + WATER_Y * beachT
  }

  const sandSpan = SAND_OUTER - SAND_INNER
  const sandT = Math.min(1, Math.max(0, (sdf - SAND_INNER) / sandSpan))
  const base = sdf > SAND_INNER ? GRASS_BASE_Y - sandT * (GRASS_BASE_Y - SAND_SHELF_Y) : GRASS_BASE_Y
  let y = base + (sdf <= SAND_INNER ? hillHeight(x, z) : 0)

  const alongPath = pathDistance(x, z)
  const pathBlend = 1 - Math.min(1, alongPath / (PATH_HALF + 0.45))
  if (pathBlend > 0 && sdf <= SAND_INNER) {
    y = y * (1 - pathBlend * 0.88) + GRASS_BASE_Y * pathBlend * 0.88
  }

  return y
}

export const terrainColor = (x: number, z: number): string => {
  if (pathDistance(x, z) <= PATH_HALF) {
    return COLORS.path
  }
  if (islandSignedDistance(x, z) > SAND_INNER) {
    return COLORS.sand
  }
  return COLORS.grass
}

const pullTowardInterior = (position: Vec2): Vec2 => {
  let low = 0
  let high = 1
  for (let step = 0; step < 18; step += 1) {
    const mid = (low + high) / 2
    const next = {
      x: position.x + (INTERIOR.x - position.x) * mid,
      z: position.z + (INTERIOR.z - position.z) * mid,
    }
    if (isWalkable(next)) {
      high = mid
    } else {
      low = mid
    }
  }

  return {
    x: position.x + (INTERIOR.x - position.x) * high,
    z: position.z + (INTERIOR.z - position.z) * high,
  }
}

export const clampToIsland = (position: Vec2): Vec2 => {
  if (isWalkable(position)) {
    return position
  }

  let x = position.x
  let z = position.z
  const sample = 0.2

  for (let step = 0; step < 16; step += 1) {
    const current = { x, z }
    if (isWalkable(current)) {
      return current
    }

    const distance = islandSignedDistance(x, z)
    const gx =
      islandSignedDistance(x + sample, z) - islandSignedDistance(x - sample, z)
    const gz =
      islandSignedDistance(x, z + sample) - islandSignedDistance(x, z - sample)
    const length = Math.hypot(gx, gz)
    if (length < 1e-5) {
      return pullTowardInterior(current)
    }

    const stride = Math.max(0.28, (distance - WALK_INSET) * 0.55)
    x -= (gx / length) * stride
    z -= (gz / length) * stride
  }

  return pullTowardInterior({ x, z })
}
