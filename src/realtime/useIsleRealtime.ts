import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { io, type Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { createChatLineId, type ChatLine } from '../world/chatLog.ts'
import { BUBBLE_MS } from '../world/constants.ts'
import type { Pose } from '../world/constants.ts'
import type { LookId } from '../world/looks.ts'
import type { RoleId } from '../world/roles.ts'
import {
  withoutSelf,
  type ExitNotice,
  type InitializeAck,
  type IslePlayer,
  type TextEvent,
} from '../world/realtime.ts'

type Bubble = {
  text: string
  until: number
}

type UseIsleRealtimeArgs = {
  enabled: boolean
  nickname: string | null
  lookId: LookId | null
  roleId: RoleId | null
  pose: RefObject<Pose>
  onRemoteText: (line: ChatLine) => void
}

export const useIsleRealtime = ({
  enabled,
  nickname,
  lookId,
  roleId,
  pose,
  onRemoteText,
}: UseIsleRealtimeArgs) => {
  const socketRef = useRef<Socket | null>(null)
  const selfId = useRef<string | null>(null)
  const onRemoteTextRef = useRef(onRemoteText)
  onRemoteTextRef.current = onRemoteText
  const [remotes, setRemotes] = useState<IslePlayer[]>([])
  const [bubbles, setBubbles] = useState<Record<string, Bubble>>({})

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now()
      setBubbles((current) => {
        let changed = false
        const next: Record<string, Bubble> = {}
        for (const [id, bubble] of Object.entries(current)) {
          if (bubble.until > now) {
            next[id] = bubble
          } else {
            changed = true
          }
        }
        return changed ? next : current
      })
    }, 250)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!enabled || !nickname || !lookId || !roleId) {
      return
    }

    const socket = io({ transports: ['websocket', 'polling'] })
    socketRef.current = socket

    socket.on('connect', () => {
      selfId.current = socket.id ?? null
      const current = pose.current
      if (!current) {
        return
      }
      socket.emit('initialize', {
        nickname,
        lookId,
        roleId,
        pose: { x: current.x, z: current.z, yaw: current.yaw },
      })
    })

    socket.on('initialize', (ack: InitializeAck) => {
      selfId.current = ack.selfId
      setRemotes(withoutSelf(ack.players, ack.selfId))
    })

    socket.on('players', (players: IslePlayer[]) => {
      const id = selfId.current
      setRemotes(id ? withoutSelf(players, id) : players)
    })

    socket.on('enter', (player: IslePlayer) => {
      if (player.id === selfId.current) {
        return
      }
      toast(`${player.nickname} 님이 들어왔어요`)
    })

    socket.on('exit', (notice: ExitNotice) => {
      toast(`${notice.nickname} 님이 나갔어요`)
    })

    socket.on('newText', (event: TextEvent) => {
      if (event.id === selfId.current) {
        return
      }
      setBubbles((current) => ({
        ...current,
        [event.id]: { text: event.text, until: event.at + BUBBLE_MS },
      }))
      onRemoteTextRef.current({
        id: createChatLineId(),
        speaker: event.nickname,
        text: event.text,
        at: event.at,
      })
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      selfId.current = null
    }
  }, [enabled, lookId, nickname, pose, roleId])

  const sendMove = useCallback((next: Pose) => {
    socketRef.current?.emit('move', { pose: next })
  }, [])

  const sendText = useCallback((text: string) => {
    socketRef.current?.emit('newText', { text })
  }, [])

  return { remotes, bubbles, sendMove, sendText }
}
