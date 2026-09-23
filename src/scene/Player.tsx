import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { Group } from 'three'
import { WALK_SPEED } from '../world/constants.ts'
import { stepWalk } from '../world/movement.ts'
import { groundHeight } from '../world/island.ts'
import type { Pose } from '../world/constants.ts'
import { ActorMarkup } from './ActorMarkup.tsx'
import { LookModel } from './LookModel.tsx'

type PlayerProps = {
  pose: RefObject<Pose>
  cameraYaw: RefObject<number>
  chatFocused: RefObject<boolean>
  name: string
  lookUrl: string
  bubble: string | null
}

export function Player({
  pose,
  cameraYaw,
  chatFocused,
  name,
  lookUrl,
  bubble,
}: PlayerProps) {
  const group = useRef<Group>(null)
  const movingRef = useRef(false)
  const [moving, setMoving] = useState(false)
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
        current.yaw,
      )
      current.x = next.position.x
      current.z = next.position.z
      current.yaw = next.yaw
      if (next.moving !== movingRef.current) {
        movingRef.current = next.moving
        setMoving(next.moving)
      }
    }

    if (!node) {
      return
    }
    node.position.set(current.x, groundHeight(current.x, current.z), current.z)
    node.rotation.y = current.yaw
  })

  const start = pose.current

  return (
    <group
      ref={group}
      position={[
        start?.x ?? 0,
        groundHeight(start?.x ?? 0, start?.z ?? 0),
        start?.z ?? 0,
      ]}
      rotation={[0, start?.yaw ?? 0, 0]}
    >
      <LookModel moving={moving} url={lookUrl} />
      <ActorMarkup name={name} showName={false} bubble={bubble} />
    </group>
  )
}
