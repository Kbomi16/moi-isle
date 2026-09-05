import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { RefObject } from 'react'
import type { Group } from 'three'
import {
  COLORS,
  DUMMY_NAME,
  DUMMY_SPEED,
  DUMMY_WAYPOINTS,
  GROUND_Y,
} from '../world/constants.ts'
import { stepDummy } from '../world/dummy.ts'
import type { Pose } from '../world/constants.ts'
import { CharacterBody } from './CharacterBody.tsx'
import { ActorMarkup } from './ActorMarkup.tsx'

type DummyVisitorProps = {
  pose: RefObject<Pose>
  showName: boolean
  bubble: string | null
}

export function DummyVisitor({ pose, showName, bubble }: DummyVisitorProps) {
  const group = useRef<Group>(null)
  const waypointIndex = useRef(1)

  useFrame((_, delta) => {
    const current = pose.current
    if (!current) {
      return
    }

    const next = stepDummy(
      current,
      waypointIndex.current,
      DUMMY_WAYPOINTS,
      Math.min(delta, 0.05),
      DUMMY_SPEED,
    )
    waypointIndex.current = next.waypointIndex
    current.x = next.position.x
    current.z = next.position.z
    current.yaw = next.yaw

    const node = group.current
    if (!node) {
      return
    }
    node.position.set(current.x, GROUND_Y, current.z)
    node.rotation.y = current.yaw
  })

  const start = pose.current

  return (
    <group
      ref={group}
      position={[start?.x ?? 0, GROUND_Y, start?.z ?? 0]}
      rotation={[0, start?.yaw ?? 0, 0]}
    >
      <CharacterBody color={COLORS.dummy} />
      <ActorMarkup name={DUMMY_NAME} showName={showName} bubble={bubble} />
    </group>
  )
}
