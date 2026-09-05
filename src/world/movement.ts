import { clampToIsland } from './island.ts'
import type { Vec2 } from './constants.ts'

export type WalkInput = {
  forward: boolean
  back: boolean
  left: boolean
  right: boolean
}

export const walkVector = (input: WalkInput, cameraYaw: number): Vec2 => {
  const lookX = -Math.sin(cameraYaw)
  const lookZ = -Math.cos(cameraYaw)
  const rightX = Math.cos(cameraYaw)
  const rightZ = -Math.sin(cameraYaw)

  let x = 0
  let z = 0
  if (input.forward) {
    x += lookX
    z += lookZ
  }
  if (input.back) {
    x -= lookX
    z -= lookZ
  }
  if (input.right) {
    x += rightX
    z += rightZ
  }
  if (input.left) {
    x -= rightX
    z -= rightZ
  }

  const length = Math.hypot(x, z)
  if (length === 0) {
    return { x: 0, z: 0 }
  }

  return { x: x / length, z: z / length }
}

export const stepWalk = (
  position: Vec2,
  input: WalkInput,
  cameraYaw: number,
  dt: number,
  speed: number,
  radius: number,
  yaw: number,
): { position: Vec2; yaw: number; moving: boolean } => {
  const direction = walkVector(input, cameraYaw)
  const moving = direction.x !== 0 || direction.z !== 0
  if (!moving) {
    return { position, yaw, moving: false }
  }

  return {
    position: clampToIsland(
      {
        x: position.x + direction.x * speed * dt,
        z: position.z + direction.z * speed * dt,
      },
      radius,
    ),
    yaw: Math.atan2(direction.x, direction.z),
    moving: true,
  }
}
