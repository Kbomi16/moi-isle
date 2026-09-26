import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { Group } from 'three'
import { DUMMY_SPEED, VILLAGERS } from '../world/constants.ts'
import type { Pose, Villager } from '../world/constants.ts'
import { stepDummy } from '../world/dummy.ts'
import { groundHeight } from '../world/island.ts'
import { lookById, lookUrl } from '../world/looks.ts'
import { ActorMarkup } from './ActorMarkup.tsx'
import { LookModel } from './LookModel.tsx'

type VillagersProps = {
  /** App이 들고 있는 주민 pose 맵. ProximitySensor 등과 같은 ref를 공유한다. */
  poses: RefObject<Record<string, Pose>>
  /** 가까이 있을 때만 이름표를 보여 줄 주민 id 목록 */
  namedIds: string[]
  bubbles: Record<string, string | null>
}

/** constants.VILLAGERS 한 명당 Actor 하나 */
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

type VillagerActorProps = {
  villager: Villager
  poses: RefObject<Record<string, Pose>>
  showName: boolean
  bubble: string | null
}

/** waypoints 순환 패트rol + Kenney GLB(walk/idle) */
function VillagerActor({
  villager,
  poses,
  showName,
  bubble,
}: VillagerActorProps) {
  const [moving, setMoving] = useState(false)

  const group = useRef<Group>(null)
  /** 스폰은 waypoints[0], 첫 목표는 [1] (spawn.ts와 맞춤) */
  const waypointIndex = useRef(1)
  /** moving이 바뀔 때만 setState — 매 프레임 리렌더 방지 */
  const movingRef = useRef(false)
  const modelUrl = lookUrl(lookById(villager.lookId).file)

  useFrame((_, delta) => {
    const current = poses.current[villager.id]
    if (!current) {
      return
    }

    const prevX = current.x
    const prevZ = current.z
    const next = stepDummy(
      current,
      waypointIndex.current,
      villager.waypoints,
      // 탭 전환 등으로 delta가 커져도 한 번에 많이 안 튀게
      Math.min(delta, 0.05),
      DUMMY_SPEED,
    )
    waypointIndex.current = next.waypointIndex
    current.x = next.position.x
    current.z = next.position.z
    current.yaw = next.yaw

    const isMoving = Math.hypot(current.x - prevX, current.z - prevZ) > 0.0005
    if (isMoving !== movingRef.current) {
      movingRef.current = isMoving
      setMoving(isMoving)
    }

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
      <LookModel moving={moving} url={modelUrl} />
      <ActorMarkup name={villager.name} showName={showName} bubble={bubble} />
    </group>
  )
}
