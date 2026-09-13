import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { RefObject } from 'react'
import { CHAT_RANGE, NAME_RANGE, VILLAGERS } from '../world/constants.ts'
import { isWithinRange } from '../world/proximity.ts'
import { nearestListenerId } from '../world/chat.ts'
import type { Pose } from '../world/constants.ts'

export type ProximityState = {
  namedIds: string[]
  chatId: string | null
}

type ProximitySensorProps = {
  enabled: boolean
  player: RefObject<Pose>
  npcs: RefObject<Record<string, Pose>>
  onProximity: (state: ProximityState) => void
}

const sameState = (left: ProximityState, right: ProximityState): boolean =>
  left.chatId === right.chatId &&
  left.namedIds.length === right.namedIds.length &&
  left.namedIds.every((id, index) => id === right.namedIds[index])

export function ProximitySensor({
  enabled,
  player,
  npcs,
  onProximity,
}: ProximitySensorProps) {
  const last = useRef<ProximityState>({ namedIds: [], chatId: null })

  useFrame(() => {
    const playerPose = player.current
    const npcPoses = npcs.current
    const next: ProximityState =
      enabled && playerPose
        ? {
            namedIds: VILLAGERS.filter((villager) => {
              const pose = npcPoses[villager.id]
              return pose ? isWithinRange(playerPose, pose, NAME_RANGE) : false
            }).map((villager) => villager.id),
            chatId: nearestListenerId(
              playerPose,
              VILLAGERS.flatMap((villager) => {
                const pose = npcPoses[villager.id]
                return pose ? [{ id: villager.id, position: pose }] : []
              }),
              CHAT_RANGE,
            ),
          }
        : { namedIds: [], chatId: null }

    if (sameState(next, last.current)) {
      return
    }

    last.current = next
    onProximity(next)
  })

  return null
}
