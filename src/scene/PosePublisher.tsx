import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { RefObject } from 'react'
import type { Pose } from '../world/constants.ts'

type PosePublisherProps = {
  pose: RefObject<Pose>
  enabled: boolean
  onMove: (pose: Pose) => void
}

const INTERVAL_MS = 100

/** 걷기 pose를 너무 자주 보내지 않도록 간격을 둔다 */
export function PosePublisher({ pose, enabled, onMove }: PosePublisherProps) {
  const lastSent = useRef(0)

  useFrame(() => {
    if (!enabled) {
      return
    }
    const now = performance.now()
    if (now - lastSent.current < INTERVAL_MS) {
      return
    }
    const current = pose.current
    if (!current) {
      return
    }
    lastSent.current = now
    onMove({ x: current.x, z: current.z, yaw: current.yaw })
  })

  return null
}
