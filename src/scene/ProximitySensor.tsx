import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { RefObject } from 'react'
import { NAME_RANGE } from '../world/constants.ts'
import { isWithinRange } from '../world/proximity.ts'
import type { Pose } from '../world/constants.ts'

export type ProximityState = {
  name: boolean
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
  const last = useRef<ProximityState>({ name: false })

  useFrame(() => {
    const playerPose = player.current
    const dummyPose = dummy.current
    const next: ProximityState = {
      name: Boolean(
        enabled &&
          playerPose &&
          dummyPose &&
          isWithinRange(playerPose, dummyPose, NAME_RANGE),
      ),
    }

    if (next.name === last.current.name) {
      return
    }

    last.current = next
    onProximity(next)
  })

  return null
}
