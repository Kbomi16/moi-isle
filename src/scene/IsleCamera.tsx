import { useFrame } from '@react-three/fiber'
import type { RefObject } from 'react'
import { CAMERA_DISTANCE, CAMERA_HEIGHT } from '../world/constants.ts'
import type { Pose } from '../world/constants.ts'
import { groundHeight } from '../world/island.ts'

type IsleCameraProps = {
  follow: boolean
  target: RefObject<Pose>
  cameraYaw: RefObject<number>
}

export function IsleCamera({ follow, target, cameraYaw }: IsleCameraProps) {
  useFrame(({ camera }) => {
    const yaw = cameraYaw.current ?? 0
    const pose = target.current
    if (follow && pose) {
      const gy = groundHeight(pose.x, pose.z)
      camera.position.set(
        pose.x + Math.sin(yaw) * CAMERA_DISTANCE,
        gy + CAMERA_HEIGHT,
        pose.z + Math.cos(yaw) * CAMERA_DISTANCE,
      )
      camera.lookAt(pose.x, gy + 1.1, pose.z)
      return
    }

    const distance = 30
    camera.position.set(Math.sin(yaw) * distance, 15, Math.cos(yaw) * distance)
    camera.lookAt(2, 0.6, 0)
  })

  return null
}
