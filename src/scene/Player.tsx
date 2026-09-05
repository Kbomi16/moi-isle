import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useRef } from 'react'
import type { RefObject } from 'react'
import type { Group } from 'three'
import {
  COLORS,
  GROUND_Y,
  ISLAND_WALK_RADIUS,
  WALK_SPEED,
} from '../world/constants.ts'
import { stepWalk } from '../world/movement.ts'
import type { Pose } from '../world/constants.ts'
import { CharacterBody } from './CharacterBody.tsx'
import { ActorMarkup } from './ActorMarkup.tsx'

type PlayerProps = {
  pose: RefObject<Pose>
  cameraYaw: RefObject<number>
  chatFocused: RefObject<boolean>
  name: string
  bubble: string | null
}

export function Player({
  pose,
  cameraYaw,
  chatFocused,
  name,
  bubble,
}: PlayerProps) {
  const group = useRef<Group>(null)
  const [, getKeys] = useKeyboardControls()

  useFrame((_, delta) => {
    const current = pose.current
    const node = group.current
    if (!current) {
      return
    }

    if (!chatFocused.current) {
      const keys = getKeys()
      const next = stepWalk(
        current,
        {
          forward: Boolean(keys['forward']),
          back: Boolean(keys['back']),
          left: Boolean(keys['left']),
          right: Boolean(keys['right']),
        },
        cameraYaw.current ?? 0,
        Math.min(delta, 0.05),
        WALK_SPEED,
        ISLAND_WALK_RADIUS,
        current.yaw,
      )
      current.x = next.position.x
      current.z = next.position.z
      current.yaw = next.yaw
    }

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
      <CharacterBody color={COLORS.player} />
      <ActorMarkup name={name} showName={false} bubble={bubble} />
    </group>
  )
}
