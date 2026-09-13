import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { RefObject } from 'react'
import type { Group } from 'three'
import { DUMMY_SPEED, VILLAGERS } from '../world/constants.ts'
import type { Pose, Villager } from '../world/constants.ts'
import { stepDummy } from '../world/dummy.ts'
import { groundHeight } from '../world/island.ts'
import { ActorMarkup } from './ActorMarkup.tsx'
import { CharacterBody } from './CharacterBody.tsx'

type VillagerActorProps = {
  villager: Villager
  poses: RefObject<Record<string, Pose>>
  showName: boolean
  bubble: string | null
}

function VillagerActor({
  villager,
  poses,
  showName,
  bubble,
}: VillagerActorProps) {
  const group = useRef<Group>(null)
  const waypointIndex = useRef(1)

  useFrame((_, delta) => {
    const current = poses.current[villager.id]
    if (!current) {
      return
    }

    const next = stepDummy(
      current,
      waypointIndex.current,
      villager.waypoints,
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
    node.position.set(current.x, groundHeight(current.x, current.z), current.z)
    node.rotation.y = current.yaw
  })

  const start = poses.current[villager.id]

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
      <CharacterBody look={villager.look} />
      <ActorMarkup name={villager.name} showName={showName} bubble={bubble} />
    </group>
  )
}

type VillagersProps = {
  poses: RefObject<Record<string, Pose>>
  namedIds: string[]
  bubbles: Record<string, string | null>
}

export function Villagers({ poses, namedIds, bubbles }: VillagersProps) {
  return (
    <group>
      {VILLAGERS.map((villager) => (
        <VillagerActor
          key={villager.id}
          bubble={bubbles[villager.id] ?? null}
          poses={poses}
          showName={namedIds.includes(villager.id)}
          villager={villager}
        />
      ))}
    </group>
  )
}
