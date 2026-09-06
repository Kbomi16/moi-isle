import { useFrame } from '@react-three/fiber'
import type { RefObject } from 'react'
import {
  CAMERA_DISTANCE,
  CAMERA_HEIGHT,
  GROUND_Y,
} from '../world/constants.ts'
import type { Pose } from '../world/constants.ts'

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
      camera.position.set(
        pose.x + Math.sin(yaw) * CAMERA_DISTANCE,
        CAMERA_HEIGHT,
        pose.z + Math.cos(yaw) * CAMERA_DISTANCE,
      )
      camera.lookAt(pose.x, GROUND_Y + 1.15, pose.z)
      return
    }

    const distance = 26
    camera.position.set(Math.sin(yaw) * distance, 13, Math.cos(yaw) * distance)
    camera.lookAt(0, 0.3, 0)
  })

  return null
}
