import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { RefObject } from 'react'
import { CHAT_RANGE, NAME_RANGE } from '../world/constants.ts'
import { isWithinRange } from '../world/proximity.ts'
import type { Pose } from '../world/constants.ts'

export type ProximityState = {
  name: boolean
  chat: boolean
}

type ProximitySensorProps = {
  enabled: boolean
  player: RefObject<Pose>
  dummy: RefObject<Pose>
  onProximity: (state: ProximityState) => void
}

export function ProximitySensor({
  enabled,
  player,
  dummy,
  onProximity,
}: ProximitySensorProps) {
  const last = useRef<ProximityState>({ name: false, chat: false })

  useFrame(() => {
    const playerPose = player.current
    const dummyPose = dummy.current
    const next: ProximityState =
      enabled && playerPose && dummyPose
        ? {
            name: isWithinRange(playerPose, dummyPose, NAME_RANGE),
            chat: isWithinRange(playerPose, dummyPose, CHAT_RANGE),
          }
        : { name: false, chat: false }

    if (next.name === last.current.name && next.chat === last.current.chat) {
      return
    }

    last.current = next
    onProximity(next)
  })

  return null
}
