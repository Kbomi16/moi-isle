import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { Group } from 'three'
import { NAME_RANGE } from '../world/constants.ts'
import type { Pose } from '../world/constants.ts'
import { groundHeight } from '../world/island.ts'
import { lookById, lookUrl } from '../world/looks.ts'
import type { IslePlayer } from '../world/realtime.ts'
import { ActorMarkup } from './ActorMarkup.tsx'
import { LookModel } from './LookModel.tsx'

type RemotePlayersProps = {
  players: IslePlayer[]
  bubbles: Record<string, string | null>
  localPose: RefObject<Pose>
}

export function RemotePlayers({
  players,
  bubbles,
  localPose,
}: RemotePlayersProps) {
  return (
    <group>
      {players.map((player) => (
        <RemoteActor
          key={player.id}
          bubble={bubbles[player.id] ?? null}
          localPose={localPose}
          player={player}
        />
      ))}
    </group>
  )
}

type RemoteActorProps = {
  player: IslePlayer
  bubble: string | null
  localPose: RefObject<Pose>
}

function RemoteActor({ player, bubble, localPose }: RemoteActorProps) {
  const group = useRef<Group>(null)
  const latest = useRef(player)
  latest.current = player
  const [showName, setShowName] = useState(false)
  const showNameRef = useRef(false)
  const modelUrl = lookUrl(lookById(player.lookId).file)

  useFrame(() => {
    const current = latest.current
    const node = group.current
    if (!node) {
      return
    }
    node.position.set(
      current.pose.x,
      groundHeight(current.pose.x, current.pose.z),
      current.pose.z,
    )
    node.rotation.y = current.pose.yaw

    const local = localPose.current
    const near = local
      ? Math.hypot(local.x - current.pose.x, local.z - current.pose.z) <=
        NAME_RANGE
      : false
    if (near !== showNameRef.current) {
      showNameRef.current = near
      setShowName(near)
    }
  })

  const start = player.pose

  return (
    <group
      ref={group}
      position={[
        start.x,
        groundHeight(start.x, start.z),
        start.z,
      ]}
      rotation={[0, start.yaw, 0]}
    >
      <LookModel moving={false} url={modelUrl} />
      <ActorMarkup bubble={bubble} name={player.nickname} showName={showName} />
    </group>
  )
}
